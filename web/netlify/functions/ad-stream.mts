import type { Config } from "@netlify/functions";
import { badRequest, cleanText, id, json, readState, siteUrl, writeState, type Impression, type Placement } from "./_data.mjs";

const DEFAULT_PUBLISHER_EARNINGS_USD = 0.02;
type ValueMode = "passive" | "relevant" | "high_value";

const CATEGORY_PROFILES: Record<string, {
  label: string;
  valueTier: "standard" | "premium" | "regulated" | "restricted";
  estimatedPublisherEarningsUsd: number;
  defaultEligible: boolean;
  providerLane: "direct" | "developer_network" | "regulated_partner" | "restricted_partner";
  note: string;
}> = {
  hosting: {
    label: "Hosting and deployment",
    valueTier: "premium",
    estimatedPublisherEarningsUsd: 0.04,
    defaultEligible: true,
    providerLane: "developer_network",
    note: "Strong fit for developer workflows and external developer ad partners."
  },
  database: {
    label: "Database and storage",
    valueTier: "premium",
    estimatedPublisherEarningsUsd: 0.04,
    defaultEligible: true,
    providerLane: "developer_network",
    note: "Strong fit for build-moment targeting."
  },
  observability: {
    label: "Observability and monitoring",
    valueTier: "premium",
    estimatedPublisherEarningsUsd: 0.04,
    defaultEligible: true,
    providerLane: "developer_network",
    note: "High-intent developer category."
  },
  testing: {
    label: "Testing and QA",
    valueTier: "standard",
    estimatedPublisherEarningsUsd: 0.03,
    defaultEligible: true,
    providerLane: "developer_network",
    note: "Relevant to coding workflows with lower compliance burden."
  },
  ai: {
    label: "AI and model tools",
    valueTier: "premium",
    estimatedPublisherEarningsUsd: 0.05,
    defaultEligible: true,
    providerLane: "developer_network",
    note: "High-value category for AI-heavy publishers."
  },
  auth: {
    label: "Auth and identity",
    valueTier: "premium",
    estimatedPublisherEarningsUsd: 0.04,
    defaultEligible: true,
    providerLane: "developer_network",
    note: "Good fit for app-building moments."
  },
  analytics: {
    label: "Analytics and product data",
    valueTier: "standard",
    estimatedPublisherEarningsUsd: 0.03,
    defaultEligible: true,
    providerLane: "developer_network",
    note: "Good fit when the user is instrumenting a product."
  },
  finance: {
    label: "Finance and insurance",
    valueTier: "regulated",
    estimatedPublisherEarningsUsd: 0.08,
    defaultEligible: false,
    providerLane: "regulated_partner",
    note: "Higher ad value, but requires explicit publisher opt-in, advertiser approval, and policy checks."
  },
  legal: {
    label: "Legal services",
    valueTier: "regulated",
    estimatedPublisherEarningsUsd: 0.08,
    defaultEligible: false,
    providerLane: "regulated_partner",
    note: "Higher ad value, but requires explicit publisher opt-in and jurisdiction/compliance review."
  },
  health: {
    label: "Health and medical",
    valueTier: "regulated",
    estimatedPublisherEarningsUsd: 0.07,
    defaultEligible: false,
    providerLane: "regulated_partner",
    note: "Requires explicit opt-in and health advertising policy checks."
  },
  gambling: {
    label: "Gambling and gaming offers",
    valueTier: "restricted",
    estimatedPublisherEarningsUsd: 0.1,
    defaultEligible: false,
    providerLane: "restricted_partner",
    note: "Restricted inventory. Never default; only explicit opt-in with legal, geo, age, and partner approval gates."
  },
  adult: {
    label: "Adult content",
    valueTier: "restricted",
    estimatedPublisherEarningsUsd: 0.1,
    defaultEligible: false,
    providerLane: "restricted_partner",
    note: "Restricted inventory. Never default in developer workflows; requires explicit opt-in and separate compliance gates."
  }
};

function demandSourceForPlacement(placement: Placement) {
  return placement.demandSource ?? (placement.id.startsWith("seed-") ? "builderperks_seed" : "direct_advertiser");
}

function demandStatusForPlacement(placement: Placement) {
  const activeSource = demandSourceForPlacement(placement);
  const approvedPartnerIntegrations = placement.demandSource === "approved_partner" && placement.demandPartner
    ? [placement.demandPartner]
    : [];
  return {
    activeSource,
    activeSourceLabel: placement.demandSource === "approved_partner" && placement.demandPartner
      ? `Approved partner: ${placement.demandPartner}`
      : "BuilderPerks seed/direct approved placements",
    approvedPartnerIntegrations,
    pendingPartnerIntegrations: ["EthicalAds", "BuySellAds/Carbon", "AdButler", "Kevel"].filter((partner) => !approvedPartnerIntegrations.includes(partner)),
    note: "Cold-start ads come from BuilderPerks seed or manually approved direct placements until an external demand partner approves terminal/IDE inventory."
  };
}
const CATEGORY_TERMS: Record<string, string[]> = {
  hosting: ["deploy", "deployment", "hosting", "infra", "railway", "vercel", "render", "server"],
  database: ["postgres", "database", "db", "sql", "neon", "supabase", "prisma"],
  observability: ["logs", "observability", "monitoring", "tracing", "metrics", "helicone", "sentry"],
  testing: ["test", "testing", "qa", "playwright", "vitest", "jest"],
  ai: ["ai", "agent", "llm", "model", "prompt", "openai", "anthropic"],
  auth: ["auth", "login", "oauth", "clerk", "supabase"],
  analytics: ["analytics", "events", "tracking", "posthog"],
  finance: ["finance", "insurance", "credit", "banking", "tax", "accounting"],
  legal: ["legal", "law", "lawyer", "contract", "compliance"],
  health: ["health", "medical", "pharma", "wellness"],
  gambling: ["gambling", "casino", "betting", "poker", "wager"],
  adult: ["adult", "dating", "xxx", "explicit", "hookup"]
};

function parseKeywords(value: string) {
  return [...new Set(value
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1 && term.length <= 40))]
    .slice(0, 12);
}

function parseValueMode(value: string): ValueMode {
  return value === "high_value" || value === "relevant" ? value : "passive";
}

function scorePlacement(placement: Placement, context: string, surface: string, keywords: string[]) {
  const haystack = `${placement.company} ${placement.headline} ${placement.body} ${placement.audience} ${placement.targetTools.join(" ")}`.toLowerCase();
  const terms = [...parseKeywords(`${context} ${surface}`), ...keywords];
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

function matchesBlockedPreference(placement: Placement, blockedKeywords: string[]) {
  if (!blockedKeywords.length) return false;
  const haystack = `${placement.company} ${placement.headline} ${placement.body} ${placement.audience} ${placement.targetTools.join(" ")}`.toLowerCase();
  return blockedKeywords.some((term) => haystack.includes(term));
}

function categoryHints(placement: Placement, keywords: string[]) {
  const haystack = `${placement.company} ${placement.headline} ${placement.body} ${placement.audience} ${placement.targetTools.join(" ")} ${keywords.join(" ")}`.toLowerCase();
  return Object.entries(CATEGORY_TERMS)
    .filter(([, terms]) => terms.some((term) => haystack.includes(term)))
    .map(([category]) => category)
    .slice(0, 4);
}

function categoryProfiles(categories: string[]) {
  return categories.map((category) => ({
    category,
    ...CATEGORY_PROFILES[category]
  })).filter((profile) => profile.label);
}

function matchesBlockedCategory(categories: string[], blockedCategories: string[]) {
  return blockedCategories.length > 0 && categories.some((category) => blockedCategories.includes(category));
}

function matchesAllowedCategory(categories: string[], allowedCategories: string[]) {
  if (!allowedCategories.length) {
    return categories.every((category) => CATEGORY_PROFILES[category]?.defaultEligible !== false);
  }
  return categories.every((category) => CATEGORY_PROFILES[category]?.defaultEligible !== false || allowedCategories.includes(category));
}

function publisherEarningsFor(categories: string[], valueMode: ValueMode) {
  const base = Math.max(DEFAULT_PUBLISHER_EARNINGS_USD, ...categories.map((category) => CATEGORY_PROFILES[category]?.estimatedPublisherEarningsUsd ?? DEFAULT_PUBLISHER_EARNINGS_USD));
  if (valueMode === "high_value") return Number((base * 1.25).toFixed(2));
  if (valueMode === "relevant") return Number((base * 1.1).toFixed(2));
  return base;
}

function valueScore(categories: string[], valueMode: ValueMode) {
  if (valueMode === "passive") return 0;
  const multiplier = valueMode === "high_value" ? 10 : 4;
  return categories.reduce((score, category) => {
    const profile = CATEGORY_PROFILES[category];
    return score + (profile ? profile.estimatedPublisherEarningsUsd * multiplier : 0);
  }, 0);
}

function renderVariants(placement: Placement, clickUrl: string, categories: string[]) {
  const statusLine = `Sponsored: ${placement.company} - ${placement.headline} | ${clickUrl}`;
  return {
    statusLine,
    terminalLine: statusLine,
    markdown: `**Sponsored: ${placement.company}** - ${placement.headline}\\n${clickUrl}`,
    ideCard: {
      title: placement.headline,
      subtitle: placement.company,
      description: placement.body,
      actionLabel: placement.cta,
      actionUrl: clickUrl,
      disclosure: "Sponsored BuilderPerks offer",
      categories
    }
  };
}

export default async (req: Request) => {
  if (req.method !== "GET") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(req.url);
  const publisherId = cleanText(url.searchParams.get("publisherId"));
  const surface = cleanText(url.searchParams.get("surface"), "terminal");
  const context = cleanText(url.searchParams.get("context"), "AI builder workflow");
  const keywords = parseKeywords(cleanText(url.searchParams.get("keywords"), ""));
  const blockedKeywords = parseKeywords(cleanText(url.searchParams.get("blockedKeywords") ?? url.searchParams.get("excludeKeywords"), ""));
  const allowedCategories = parseKeywords(cleanText(url.searchParams.get("allowedCategories") ?? url.searchParams.get("optInCategories"), ""));
  const blockedCategories = parseKeywords(cleanText(url.searchParams.get("blockedCategories") ?? url.searchParams.get("excludeCategories"), ""));
  const valueMode = parseValueMode(cleanText(url.searchParams.get("valueMode") ?? url.searchParams.get("attentionMode"), "passive"));
  const format = cleanText(url.searchParams.get("format"), "card");
  if (!publisherId) return badRequest("publisherId is required");

  const state = await readState();
  const publisher = state.publishers.find((item) => item.id === publisherId && item.status === "active");
  if (!publisher) return badRequest("Publisher is not active");

  const approved = state.placements.filter((placement) => placement.status === "approved");
  if (!approved.length) return json({ ok: true, ad: null, reason: "no_approved_placements" });

  const eligible = approved.filter((placement) => {
    const categories = categoryHints(placement, keywords);
    return !matchesBlockedPreference(placement, blockedKeywords)
      && !matchesBlockedCategory(categories, blockedCategories)
      && matchesAllowedCategory(categories, allowedCategories);
  });
  if (!eligible.length) return json({
    ok: true,
    ad: null,
    reason: "no_approved_placements_after_preferences",
    preferences: {
      keywords,
      blockedKeywords,
      allowedCategories,
      blockedCategories,
      valueMode,
      note: "Your keywords, blockedKeywords, allowedCategories, or blockedCategories filtered out every approved placement. Relax preferences to receive an ad."
    }
  });

  const placement = [...eligible].sort((a, b) => {
    const bCategories = categoryHints(b, keywords);
    const aCategories = categoryHints(a, keywords);
    return (scorePlacement(b, context, surface, keywords) + valueScore(bCategories, valueMode))
      - (scorePlacement(a, context, surface, keywords) + valueScore(aCategories, valueMode));
  })[0];
  const categories = categoryHints(placement, keywords);
  const estimatedPublisherEarningsUsd = publisherEarningsFor(categories, valueMode);
  const impression: Impression = {
    id: id("imp"),
    createdAt: new Date().toISOString(),
    placementId: placement.id,
    publisherId,
    surface,
    context,
    keywords,
    estimatedPublisherEarningsUsd
  };

  state.impressions.unshift(impression);
  await writeState(state);

  const origin = siteUrl(req);
  const source = `stream:${publisherId}:${surface}`.slice(0, 600);
  const clickUrl = `${origin}/api/track?placementId=${encodeURIComponent(placement.id)}&source=${encodeURIComponent(source)}`;
  const profiles = categoryProfiles(categories);

  return json({
    ok: true,
    impression,
    revenueShare: {
      estimatedPublisherEarningsUsd: impression.estimatedPublisherEarningsUsd,
      payoutStatus: "estimated_unpaid",
      note: "Estimated publisher revenue can help offset tooling bills after advertiser revenue and payout rails are approved. It is not payment for watching or clicking ads."
    },
    demand: {
      source: demandSourceForPlacement(placement),
      partner: placement.demandPartner ?? null,
      ...demandStatusForPlacement(placement)
    },
    marketplace: {
      valueMode,
      categoryProfiles: profiles,
      providerLanes: [...new Set(profiles.map((profile) => profile.providerLane))],
      note: "Ad categories have different market values. BuilderPerks lets publishers choose higher-value discovery modes and explicit category opt-ins, while restricted or regulated categories stay gated until approved partner demand and compliance checks exist."
    },
    targeting: {
      keywords,
      blockedKeywords,
      allowedCategories,
      blockedCategories,
      categories,
      note: "Send broad programming language, framework, project, and preference keywords only. Do not send personal data or full prompts."
    },
    preferences: {
      wanted: keywords,
      blocked: blockedKeywords,
      allowedCategories,
      blockedCategories,
      valueMode,
      note: "Publishers control ad fit with keywords, blockedKeywords, allowedCategories, blockedCategories, and valueMode. This is preference targeting, not personal profiling."
    },
    render: {
      format,
      ...renderVariants(placement, clickUrl, categories)
    },
    ad: {
      placementId: placement.id,
      company: placement.company,
      headline: placement.headline,
      body: placement.body,
      cta: placement.cta,
      audience: placement.audience,
      targetTools: placement.targetTools,
      categories,
      clickUrl,
      disclosure: "Sponsored BuilderPerks offer"
    }
  });
};

export const config: Config = {
  path: "/api/ad-stream"
};
