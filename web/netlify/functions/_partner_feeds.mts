import { cleanText, cleanUrl, env, type Placement } from "./_data.mjs";
import { providerStatuses, type ProviderStatus } from "./_providers.mjs";

type PartnerFeedItem = {
  id?: unknown;
  company?: unknown;
  advertiser?: unknown;
  title?: unknown;
  headline?: unknown;
  body?: unknown;
  description?: unknown;
  cta?: unknown;
  url?: unknown;
  clickUrl?: unknown;
  audience?: unknown;
  targetTools?: unknown;
  categories?: unknown;
};

export type PartnerFeedSource = {
  providerKey: string;
  providerName: string;
  url: string;
  kind: "json_feed" | "smartlink";
};

type PartnerFeedResult = {
  source: PartnerFeedSource;
  placements: Placement[];
  error?: string;
};

const FEED_URL_ENV = "BUILDERPERKS_APPROVED_PARTNER_FEED_URLS";

function splitFeedUrls(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 8);
}

function providerFeedUrl(provider: ProviderStatus) {
  const urlEnvName = provider.requiredEnv.find((name) => name.endsWith("_URL"));
  return urlEnvName ? cleanUrl(env(urlEnvName)) : "";
}

export function approvedPartnerFeedSources(): PartnerFeedSource[] {
  const configuredProviders = providerStatuses().filter((provider) => provider.canServeNow);
  const providerFeeds = configuredProviders
    .map((provider) => ({
      providerKey: provider.key,
      providerName: provider.name,
      url: providerFeedUrl(provider),
      kind: provider.key === "adsterra" ? "smartlink" as const : "json_feed" as const
    }))
    .filter((source) => source.url);

  const genericFeeds = splitFeedUrls(env(FEED_URL_ENV)).map((url, index) => ({
    providerKey: `approved_partner_feed_${index + 1}`,
    providerName: `Approved partner feed ${index + 1}`,
    url: cleanUrl(url),
    kind: "json_feed" as const
  })).filter((source) => source.url);

  const seen = new Set<string>();
  return [...providerFeeds, ...genericFeeds].filter((source) => {
    if (seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  }).slice(0, 12);
}

function listFromPayload(payload: unknown): PartnerFeedItem[] {
  if (Array.isArray(payload)) return payload as PartnerFeedItem[];
  if (!payload || typeof payload !== "object") return [];
  const object = payload as Record<string, unknown>;
  for (const key of ["placements", "ads", "offers", "items", "data", "results"]) {
    if (Array.isArray(object[key])) return object[key] as PartnerFeedItem[];
  }
  return [];
}

function cleanList(value: unknown, fallback: string[]) {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : fallback;
  return raw.map((item) => cleanText(item)).filter(Boolean).slice(0, 8);
}

function stablePartnerPlacementId(source: PartnerFeedSource, item: PartnerFeedItem, index: number) {
  const raw = cleanText(item.id) || cleanText(item.url) || cleanText(item.clickUrl) || String(index + 1);
  const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || String(index + 1);
  return `partner-${source.providerKey}-${slug}`;
}

function placementFromItem(source: PartnerFeedSource, item: PartnerFeedItem, index: number): Placement | null {
  const url = cleanUrl(item.url) || cleanUrl(item.clickUrl);
  const headline = cleanText(item.headline ?? item.title);
  const body = cleanText(item.body ?? item.description);
  const company = cleanText(item.company ?? item.advertiser ?? source.providerName);
  if (!url || !headline || !body || !company) return null;

  return {
    id: stablePartnerPlacementId(source, item, index),
    createdAt: "2026-06-15T00:00:00.000Z",
    updatedAt: "2026-06-15T00:00:00.000Z",
    status: "approved",
    company,
    contactName: source.providerName,
    email: "partner-feed@builderperks.local",
    headline,
    body,
    cta: cleanText(item.cta, "Learn more"),
    url,
    audience: cleanText(item.audience, "AI builders"),
    packageId: "starter",
    budgetUsd: 0,
    targetTools: cleanList(item.targetTools ?? item.categories, ["Claude", "ChatGPT", "Cursor"]),
    paymentStatus: "paid",
    demandSource: "approved_partner",
    demandPartner: source.providerName
  };
}

function placementFromSmartLink(source: PartnerFeedSource): Placement | null {
  const url = cleanUrl(source.url);
  if (!url) return null;
  return {
    id: `partner-${source.providerKey}-smartlink`,
    createdAt: "2026-06-15T00:00:00.000Z",
    updatedAt: "2026-06-15T00:00:00.000Z",
    status: "approved",
    company: source.providerName,
    contactName: source.providerName,
    email: "partner-feed@builderperks.local",
    headline: "Relevant sponsored offer for builders",
    body: "Open a disclosed sponsored offer matched by the approved partner network.",
    cta: "Open sponsored offer",
    url,
    audience: "AI builders and developer-tool users",
    packageId: "starter",
    budgetUsd: 0,
    targetTools: ["Claude", "ChatGPT", "Cursor"],
    paymentStatus: "paid",
    demandSource: "approved_partner",
    demandPartner: source.providerName
  };
}

export async function approvedPartnerFeedPlacements(): Promise<PartnerFeedResult[]> {
  const sources = approvedPartnerFeedSources();
  return Promise.all(sources.map(async (source) => {
    if (source.kind === "smartlink") {
      const placement = placementFromSmartLink(source);
      return { source, placements: placement ? [placement] : [] };
    }
    try {
      const response = await fetch(source.url, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(2000)
      });
      if (!response.ok) return { source, placements: [], error: `HTTP ${response.status}` };
      const payload = await response.json();
      const placements = listFromPayload(payload)
        .map((item, index) => placementFromItem(source, item, index))
        .filter((placement): placement is Placement => Boolean(placement))
        .slice(0, 25);
      return { source, placements };
    } catch (error) {
      return { source, placements: [], error: error instanceof Error ? error.message : "Feed fetch failed" };
    }
  }));
}

export const approvedPartnerFeedUrlEnvName = FEED_URL_ENV;
