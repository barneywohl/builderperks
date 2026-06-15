import type { Config } from "@netlify/functions";
import { adminAuthorized, badRequest, cleanText, json, parseJson, readState, writeState, type Placement } from "./_data.mjs";
import { approvedPartnerFeedSources } from "./_partner_feeds.mjs";
import { providerStatuses } from "./_providers.mjs";

function cleanDemandSource(value: unknown): Placement["demandSource"] | null {
  return value === "builderperks_seed" || value === "direct_advertiser" || value === "approved_partner"
    ? value
    : null;
}

function normalizePartnerName(value: string) {
  return value.trim().toLowerCase();
}

function approvedPartnerActive(partnerName: string) {
  const normalized = normalizePartnerName(partnerName);
  if (!normalized) return false;
  const activeProviderNames = providerStatuses()
    .filter((provider) => provider.canServeNow)
    .map((provider) => normalizePartnerName(provider.name));
  const activeFeedNames = approvedPartnerFeedSources()
    .map((source) => normalizePartnerName(source.providerName));
  return [...activeProviderNames, ...activeFeedNames].includes(normalized);
}

export default async (req: Request) => {
  if (!(await adminAuthorized(req))) return json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const state = await readState();

  if (req.method === "GET") {
    const placements = state.placements.map((placement) => ({
      ...placement,
      clickCount: state.clicks.filter((click) => click.placementId === placement.id).length,
      claimCount: state.claims.filter((claim) => claim.placementId === placement.id).length,
      relevance: {
        total: state.relevanceEvents.filter((event) => event.placementId === placement.id).length,
        needThis: state.relevanceEvents.filter((event) => event.placementId === placement.id && event.action === "need_this").length,
        notRelevant: state.relevanceEvents.filter((event) => event.placementId === placement.id && event.action === "not_relevant").length,
        hideCategory: state.relevanceEvents.filter((event) => event.placementId === placement.id && event.action === "hide_category").length
      }
    }));
    return json({ ok: true, ...state, placements });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const body = await parseJson(req);
  if (!body) return badRequest("Invalid JSON body");

  const placementId = cleanText(body.placementId);
  const status = body.status === "approved" || body.status === "rejected" ? body.status : null;
  if (!placementId || !status) return badRequest("Placement and valid status are required");

  const placement = state.placements.find((item) => item.id === placementId);
  if (!placement) return badRequest("Placement not found");

  const demandSource = cleanDemandSource(body.demandSource);
  const nextDemandSource = demandSource ?? placement.demandSource;
  const nextDemandPartner = body.demandPartner !== undefined
    ? cleanText(body.demandPartner) || undefined
    : placement.demandPartner;

  if (status === "approved" && nextDemandSource === "approved_partner") {
    if (!nextDemandPartner) return badRequest("Approved partner demand requires demandPartner");
    if (!approvedPartnerActive(nextDemandPartner)) {
      return badRequest("Approved partner demand requires configured credentials/feed and explicit provider approval before serving");
    }
  }

  placement.status = status;
  placement.updatedAt = new Date().toISOString();
  if (body.paymentStatus === "paid") placement.paymentStatus = "paid";
  if (demandSource) placement.demandSource = demandSource;
  if (body.demandPartner !== undefined) {
    placement.demandPartner = cleanText(body.demandPartner) || undefined;
  }
  await writeState(state);

  return json({ ok: true, placement });
};

export const config: Config = {
  path: "/api/admin"
};
