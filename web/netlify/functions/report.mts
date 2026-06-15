import type { Config } from "@netlify/functions";
import { adminAuthorized, badRequest, cleanText, json, readState } from "./_data.mjs";

function countsByValue<T>(items: T[], valueFor: (item: T) => string) {
  return items.reduce<Record<string, number>>((counts, item) => {
    const value = valueFor(item) || "unknown";
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function topCounts(counts: Record<string, number>, limit = 5) {
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

export default async (req: Request) => {
  if (!(await adminAuthorized(req))) return json({ ok: false, error: "Unauthorized" }, { status: 401 });

  if (req.method !== "GET") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(req.url);
  const placementId = cleanText(url.searchParams.get("placementId"));
  if (!placementId) return badRequest("placementId is required");

  const state = await readState();
  const placement = state.placements.find((item) => item.id === placementId);
  if (!placement) return badRequest("Placement not found");

  const clicks = state.clicks.filter((click) => click.placementId === placementId);
  const claims = state.claims.filter((claim) => claim.placementId === placementId);
  const relevanceEvents = state.relevanceEvents.filter((event) => event.placementId === placementId);
  const impressions = state.impressions.filter((impression) => impression.placementId === placementId);
  const needThis = relevanceEvents.filter((event) => event.action === "need_this").length;
  const notRelevant = relevanceEvents.filter((event) => event.action === "not_relevant").length;
  const hideCategory = relevanceEvents.filter((event) => event.action === "hide_category").length;
  const estimatedPublisherEarningsUsd = impressions.reduce((total, impression) => total + impression.estimatedPublisherEarningsUsd, 0);
  const clickSources = topCounts(countsByValue(clicks, (click) => click.source));
  const relevanceCategories = topCounts(countsByValue(relevanceEvents, (event) => event.category));
  const publisherSurfaces = topCounts(countsByValue(impressions, (impression) => impression.surface));
  const keywordCounts = topCounts(countsByValue(
    impressions.flatMap((impression) => impression.keywords),
    (keyword) => keyword
  ));

  return json({
    ok: true,
    report: {
      placement: {
        id: placement.id,
        company: placement.company,
        headline: placement.headline,
        audience: placement.audience,
        status: placement.status,
        paymentStatus: placement.paymentStatus,
        demandSource: placement.demandSource ?? (placement.id.startsWith("seed-") ? "builderperks_seed" : "direct_advertiser"),
        demandPartner: placement.demandPartner ?? null,
        targetTools: placement.targetTools
      },
      metrics: {
        impressions: impressions.length,
        clicks: clicks.length,
        claims: claims.length,
        needThis,
        notRelevant,
        hideCategory,
        relevanceEvents: relevanceEvents.length,
        estimatedPublisherEarningsUsd: Number(estimatedPublisherEarningsUsd.toFixed(2))
      },
      breakdowns: {
        clickSources,
        relevanceCategories,
        publisherSurfaces,
        keywords: keywordCounts
      },
      pilotReadout: [
        `${placement.company}: ${placement.headline}`,
        `${impressions.length} matched impressions, ${clicks.length} clicks, ${claims.length} claims.`,
        `${needThis} Need this, ${notRelevant} Not relevant, ${hideCategory} Hide category signals.`
      ].join(" "),
      privacy: {
        contextStored: false,
        note: "BuilderPerks stores broad keywords, publisher surface, and redacted context markers for reporting. It does not store full prompts, private code, or cross-site profiles in this report."
      }
    }
  });
};

export const config: Config = {
  path: "/api/report"
};
