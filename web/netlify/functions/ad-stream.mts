import type { Config } from "@netlify/functions";
import { badRequest, cleanText, id, json, publisherTokenAuthorized, readState, siteUrl, writeState, type Impression, type Placement, type Publisher } from "./_data.mjs";
import { configuredProviderNames, pendingProviderNames } from "./_providers.mjs";
import { approvedPartnerFeedPlacements } from "./_partner_feeds.mjs";

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
  cybersecurity: {
    label: "Cybersecurity and compliance tooling",
    valueTier: "premium",
    estimatedPublisherEarningsUsd: 0.07,
    defaultEligible: true,
    providerLane: "developer_network",
    note: "High-intent B2B category for security, compliance, and enterprise software workflows."
  },
  data: {
    label: "Data infrastructure and BI",
    valueTier: "premium",
    estimatedPublisherEarningsUsd: 0.05,
    defaultEligible: true,
    providerLane: "developer_network",
    note: "Strong fit for analytics, warehouse, ETL, and reporting build moments."
  },
  productivity: {
    label: "Productivity and collaboration",
    valueTier: "standard",
    estimatedPublisherEarningsUsd: 0.03,
    defaultEligible: true,
    providerLane: "direct",
    note: "Mainstream SaaS category with broad workflow relevance."
  },
  design: {
    label: "Design and creative tools",
    valueTier: "standard",
    estimatedPublisherEarningsUsd: 0.03,
    defaultEligible: true,
    providerLane: "developer_network",
    note: "Relevant for frontend, product, and content creation workflows."
  },
  marketing: {
    label: "Marketing and growth software",
    valueTier: "standard",
    estimatedPublisherEarningsUsd: 0.04,
    defaultEligible: true,
    providerLane: "direct",
    note: "Mainstream B2B SaaS category; keep copy practical and non-intrusive."
  },
  ecommerce: {
    label: "Ecommerce and retail",
    valueTier: "standard",
    estimatedPublisherEarningsUsd: 0.04,
    defaultEligible: true,
    providerLane: "direct",
    note: "Mainstream commerce category suitable for relevant builder, store, and checkout workflows."
  },
  education: {
    label: "Education and learning",
    valueTier: "standard",
    estimatedPublisherEarningsUsd: 0.03,
    defaultEligible: true,
    providerLane: "direct",
    note: "Mainstream learning category for courses, bootcamps, and technical education."
  },
  jobs: {
    label: "Jobs and recruiting",
    valueTier: "premium",
    estimatedPublisherEarningsUsd: 0.05,
    defaultEligible: true,
    providerLane: "direct",
    note: "Higher-value recruiting category; use only when role/job relevance is clear."
  },
  travel: {
    label: "Travel and hospitality",
    valueTier: "standard",
    estimatedPublisherEarningsUsd: 0.03,
    defaultEligible: true,
    providerLane: "direct",
    note: "Mainstream category for travel-app, logistics, and hospitality workflows."
  },
  real_estate: {
    label: "Real estate and housing",
    valueTier: "regulated",
    estimatedPublisherEarningsUsd: 0.07,
    defaultEligible: false,
    providerLane: "regulated_partner",
    note: "Higher-value category that requires explicit opt-in and fair-housing/policy review."
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
    label: "Gambling and iGaming offers",
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
  },
  dating: {
    label: "Dating and relationship offers",
    valueTier: "restricted",
    estimatedPublisherEarningsUsd: 0.09,
    defaultEligible: false,
    providerLane: "restricted_partner",
    note: "Restricted/high-sensitivity inventory. Requires explicit opt-in, disclosure, and partner review."
  },
  sweepstakes: {
    label: "Sweepstakes and lead-gen offers",
    valueTier: "restricted",
    estimatedPublisherEarningsUsd: 0.08,
    defaultEligible: false,
    providerLane: "restricted_partner",
    note: "Performance CPA category. Requires explicit opt-in, disclosure, and quality controls."
  },
  crypto: {
    label: "Crypto and web3 offers",
    valueTier: "restricted",
    estimatedPublisherEarningsUsd: 0.09,
    defaultEligible: false,
    providerLane: "restricted_partner",
    note: "Crypto/Web3 inventory is restricted. Never default in developer workflows; requires explicit opt-in, disclosure, and partner review."
  },
  gaming: {
    label: "Gaming and game development",
    valueTier: "standard",
    estimatedPublisherEarningsUsd: 0.04,
    defaultEligible: true,
    providerLane: "direct",
    note: "Mainstream game-development and software category; keep separate from gambling/iGaming."
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
  const configuredPartnerIntegrations = configuredProviderNames().filter((partner) => !approvedPartnerIntegrations.includes(partner));
  return {
    activeSource,
    activeSourceLabel: placement.demandSource === "approved_partner" && placement.demandPartner
      ? `Approved partner: ${placement.demandPartner}`
      : "BuilderPerks seed/direct approved placements",
    approvedPartnerIntegrations,
    configuredPartnerIntegrations,
    pendingPartnerIntegrations: pendingProviderNames().filter((partner) => !approvedPartnerIntegrations.includes(partner)),
    note: "Cold-start ads come from BuilderPerks seed or manually approved direct placements until an external demand partner approves terminal/IDE inventory. Configured partners remain inactive demand unless a placement is explicitly approved as approved_partner."
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
  cybersecurity: ["security", "cybersecurity", "soc2", "compliance", "vulnerability", "pentest", "sso", "audit"],
  data: ["warehouse", "etl", "pipeline", "bigquery", "snowflake", "airflow", "bi", "dashboard"],
  productivity: ["docs", "notion", "slack", "calendar", "email", "collaboration", "workflow"],
  design: ["design", "figma", "prototype", "creative", "ux", "ui", "asset"],
  marketing: ["marketing", "crm", "seo", "growth", "newsletter", "campaign", "sales"],
  ecommerce: ["ecommerce", "shopify", "checkout", "retail", "commerce", "store", "payments"],
  education: ["education", "course", "learning", "training", "bootcamp", "tutorial"],
  jobs: ["jobs", "recruiting", "hiring", "talent", "candidate", "career"],
  travel: ["travel", "hotel", "flight", "booking", "hospitality", "logistics"],
  real_estate: ["realestate", "real-estate", "housing", "mortgage", "rental", "property"],
  finance: ["finance", "insurance", "credit", "banking", "tax", "accounting"],
  legal: ["legal", "law", "lawyer", "contract", "compliance"],
  health: ["health", "medical", "pharma", "wellness"],
  gambling: ["gambling", "casino", "betting", "poker", "wager"],
  adult: ["adult", "xxx", "explicit"],
  dating: ["dating", "hookup", "relationship", "singles"],
  sweepstakes: ["sweepstakes", "giveaway", "prize", "survey", "cpa"],
  crypto: ["crypto", "web3", "blockchain", "bitcoin", "ethereum", "defi", "wallet"],
  gaming: ["gaming", "game", "unity", "unreal", "gamedev", "esports"]
};

function redactSensitiveKeywordSource(value: string) {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, " ")
    .replace(/\b(?:sk|pk|rk|ghp|gho|github_pat|xox[baprs]|glpat|hf)_[A-Za-z0-9_-]{12,}\b/g, " ")
    .replace(/\b(?:sk|pk|rk)-[A-Za-z0-9_-]{12,}\b/g, " ")
    .replace(/\b(?:api[_-]?key|token|secret|password|authorization|bearer)\b\s*[:=]\s*[^\s,;]+/gi, " ")
    .replace(/(?:\/Users|\/home|\/Volumes|[A-Z]:\\)[^\s,;]+/g, " ");
}

function parseKeywords(value: string) {
  return [...new Set(redactSensitiveKeywordSource(value)
    .toLowerCase()
    .split(/[^a-z0-9_+#.-]+/)
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
    .filter(([, terms]) => terms.some((term) => categoryTermMatches(haystack, term)))
    .map(([category]) => category)
    .sort((a, b) => Number(CATEGORY_PROFILES[a]?.defaultEligible !== false) - Number(CATEGORY_PROFILES[b]?.defaultEligible !== false))
    .slice(0, 4);
}

function categoryTermMatches(haystack: string, term: string) {
  if (/^[a-z0-9_+#.-]+$/.test(term)) {
    return new RegExp(`(^|[^a-z0-9_+#.-])${escapeRegExp(term)}([^a-z0-9_+#.-]|$)`).test(haystack);
  }
  return haystack.includes(term);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

function demandPriority(placement: Placement) {
  if (placement.demandSource === "approved_partner") return 100;
  if (placement.demandSource === "direct_advertiser") return 1;
  return 0;
}

function sponsoredLabelForPlacement(placement: Placement) {
  if (placement.demandSource === "approved_partner" && placement.demandPartner) {
    return `Sponsored via ${placement.demandPartner}`;
  }
  return "Sponsored";
}

function renderVariants(placement: Placement, clickUrl: string, categories: string[]) {
  const sponsoredLabel = sponsoredLabelForPlacement(placement);
  const statusLine = `${sponsoredLabel}: ${placement.company} - ${placement.headline} | ${clickUrl}`;
  return {
    statusLine,
    terminalLine: statusLine,
    markdown: `**${sponsoredLabel}: ${placement.company}** - ${placement.headline}\\n${clickUrl}`,
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

function impressionCapExceeded(impressions: Impression[], publisherId: string) {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const publisherImpressions = impressions.filter((item) => item.publisherId === publisherId);
  const lastHour = publisherImpressions.filter((item) => Date.parse(item.createdAt) >= hourAgo).length;
  const lastDay = publisherImpressions.filter((item) => Date.parse(item.createdAt) >= dayAgo).length;
  if (lastHour >= 120) return "publisher_hourly_cap";
  if (lastDay >= 1000) return "publisher_daily_cap";
  return "";
}

export default async (req: Request) => {
  if (req.method !== "GET") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(req.url);
  const publisherId = cleanText(url.searchParams.get("publisherId"));
  const publisherToken = cleanText(url.searchParams.get("publisherToken") ?? req.headers.get("x-publisher-token"));
  const surface = cleanText(url.searchParams.get("surface"), "terminal");
  const context = cleanText(url.searchParams.get("context"), "AI builder workflow");
  const keywords = parseKeywords(cleanText(url.searchParams.get("keywords"), ""));
  const blockedKeywords = parseKeywords(cleanText(url.searchParams.get("blockedKeywords") ?? url.searchParams.get("excludeKeywords"), ""));
  const requestedAllowedCategories = parseKeywords(cleanText(url.searchParams.get("allowedCategories") ?? url.searchParams.get("optInCategories"), ""));
  const blockedCategories = parseKeywords(cleanText(url.searchParams.get("blockedCategories") ?? url.searchParams.get("excludeCategories"), ""));
  const valueMode = parseValueMode(cleanText(url.searchParams.get("valueMode") ?? url.searchParams.get("attentionMode"), "passive"));
  const format = cleanText(url.searchParams.get("format"), "card");
  if (!publisherId) return badRequest("publisherId is required");

  const state = await readState();
  const publisher = state.publishers.find((item) => item.id === publisherId && item.status === "active");
  if (!publisher) return badRequest("Publisher is not active");
  if (!(await publisherTokenAuthorized(publisher, publisherToken))) return json({ ok: false, error: "Publisher token is required" }, { status: 401 });
  const publisherAllowedCategories = publisher.allowedCategories ?? [];
  const publisherBlockedCategories = publisher.blockedCategories ?? [];
  const allowedCategories = requestedAllowedCategories.filter((category) => publisherAllowedCategories.includes(category));
  const effectiveBlockedCategories = [...new Set([...publisherBlockedCategories, ...blockedCategories])];

  const capReason = impressionCapExceeded(state.impressions, publisherId);
  if (capReason) return json({
    ok: true,
    ad: null,
    reason: capReason,
    rateLimit: {
      note: "Publisher impression caps protect advertisers and keep raw counters from becoming payout-grade proof."
    }
  });

  const partnerFeedResults = await approvedPartnerFeedPlacements();
  const partnerPlacements = partnerFeedResults.flatMap((result) => result.placements);
  const activeApprovedPartners = new Set([
    ...configuredProviderNames(),
    ...partnerFeedResults.map((result) => result.source.providerName)
  ]);
  const approved = [
    ...state.placements.filter((placement) => placement.status === "approved"),
    ...partnerPlacements
  ];
  if (!approved.length) return json({ ok: true, ad: null, reason: "no_approved_placements" });

  const eligible = approved.filter((placement) => {
    if (placement.demandSource === "approved_partner" && !activeApprovedPartners.has(placement.demandPartner ?? "")) {
      return false;
    }
    const categories = categoryHints(placement, keywords);
    return !matchesBlockedPreference(placement, blockedKeywords)
      && !matchesBlockedCategory(categories, effectiveBlockedCategories)
      && matchesAllowedCategory(categories, allowedCategories);
  });
  if (!eligible.length) return json({
    ok: true,
    ad: null,
    reason: "no_approved_placements_after_preferences",
    partnerFeeds: partnerFeedResults.length
      ? partnerFeedResults.map((result) => ({
          providerKey: result.source.providerKey,
          providerName: result.source.providerName,
          fetched: !result.error,
          placementCount: result.placements.length,
          error: result.error,
          placementDiagnostics: result.placements.slice(0, 3).map((placement) => {
            const categories = categoryHints(placement, keywords);
            return {
              placementId: placement.id,
              demandPartner: placement.demandPartner,
              categories,
              blockedPreference: matchesBlockedPreference(placement, blockedKeywords),
              blockedCategory: matchesBlockedCategory(categories, effectiveBlockedCategories),
              allowedCategory: matchesAllowedCategory(categories, allowedCategories)
            };
          })
        }))
      : [],
    preferences: {
      keywords,
      blockedKeywords,
      requestedAllowedCategories,
      allowedCategories,
      blockedCategories: effectiveBlockedCategories,
      valueMode,
      note: "Your keywords, blockedKeywords, allowedCategories, or blockedCategories filtered out every approved placement. Restricted category opt-ins must be enabled on the publisher record."
    }
  });

  const placement = [...eligible].sort((a, b) => {
    const bCategories = categoryHints(b, keywords);
    const aCategories = categoryHints(a, keywords);
    return (scorePlacement(b, context, surface, keywords) + valueScore(bCategories, valueMode) + demandPriority(b))
      - (scorePlacement(a, context, surface, keywords) + valueScore(aCategories, valueMode) + demandPriority(a));
  })[0];
  const categories = categoryHints(placement, keywords);
  const estimatedPublisherEarningsUsd = publisherEarningsFor(categories, valueMode);
  const impression: Impression = {
    id: id("imp"),
    createdAt: new Date().toISOString(),
    placementId: placement.id,
    publisherId,
    surface,
    context: "[redacted: publisher context is used for matching but not stored]",
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
      partnerFeed: placement.demandSource === "approved_partner" && partnerPlacements.some((item) => item.id === placement.id)
        ? {
            fetched: true,
            errors: partnerFeedResults.filter((result) => result.error).map((result) => ({
              partner: result.source.providerName,
              error: result.error
            }))
          }
        : undefined,
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
      requestedAllowedCategories,
      allowedCategories,
      publisherAllowedCategories,
      blockedCategories: effectiveBlockedCategories,
      categories,
      note: "Send broad programming language, framework, project, and preference keywords only. Do not send personal data or full prompts."
    },
    preferences: {
      wanted: keywords,
      blocked: blockedKeywords,
      requestedAllowedCategories,
      allowedCategories,
      publisherAllowedCategories,
      blockedCategories: effectiveBlockedCategories,
      valueMode,
      note: "Publishers control ad fit with keywords, blockedKeywords, blockedCategories, and valueMode. Regulated or restricted category opt-ins are account-level preferences, not caller-controlled URL flags."
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
