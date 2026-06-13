import type { Config } from "@netlify/functions";
import { badRequest, cleanText, id, json, readState, siteUrl, writeState, type Impression, type Placement } from "./_data.mjs";

const DEFAULT_PUBLISHER_EARNINGS_USD = 0.02;
const CATEGORY_TERMS: Record<string, string[]> = {
  hosting: ["deploy", "deployment", "hosting", "infra", "railway", "vercel", "render", "server"],
  database: ["postgres", "database", "db", "sql", "neon", "supabase", "prisma"],
  observability: ["logs", "observability", "monitoring", "tracing", "metrics", "helicone", "sentry"],
  testing: ["test", "testing", "qa", "playwright", "vitest", "jest"],
  ai: ["ai", "agent", "llm", "model", "prompt", "openai", "anthropic"],
  auth: ["auth", "login", "oauth", "clerk", "supabase"],
  analytics: ["analytics", "events", "tracking", "posthog"]
};

function parseKeywords(value: string) {
  return [...new Set(value
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1 && term.length <= 40))]
    .slice(0, 12);
}

function scorePlacement(placement: Placement, context: string, surface: string, keywords: string[]) {
  const haystack = `${placement.company} ${placement.headline} ${placement.body} ${placement.audience} ${placement.targetTools.join(" ")}`.toLowerCase();
  const terms = [...parseKeywords(`${context} ${surface}`), ...keywords];
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

function categoryHints(placement: Placement, keywords: string[]) {
  const haystack = `${placement.company} ${placement.headline} ${placement.body} ${placement.audience} ${placement.targetTools.join(" ")} ${keywords.join(" ")}`.toLowerCase();
  return Object.entries(CATEGORY_TERMS)
    .filter(([, terms]) => terms.some((term) => haystack.includes(term)))
    .map(([category]) => category)
    .slice(0, 4);
}

function statusLine(placement: Placement, clickUrl: string) {
  return `Sponsored: ${placement.company} - ${placement.headline} | ${clickUrl}`;
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
  const format = cleanText(url.searchParams.get("format"), "card");
  if (!publisherId) return badRequest("publisherId is required");

  const state = await readState();
  const publisher = state.publishers.find((item) => item.id === publisherId && item.status === "active");
  if (!publisher) return badRequest("Publisher is not active");

  const approved = state.placements.filter((placement) => placement.status === "approved");
  if (!approved.length) return json({ ok: true, ad: null, reason: "no_approved_placements" });

  const placement = [...approved].sort((a, b) => scorePlacement(b, context, surface, keywords) - scorePlacement(a, context, surface, keywords))[0];
  const impression: Impression = {
    id: id("imp"),
    createdAt: new Date().toISOString(),
    placementId: placement.id,
    publisherId,
    surface,
    context,
    keywords,
    estimatedPublisherEarningsUsd: DEFAULT_PUBLISHER_EARNINGS_USD
  };

  state.impressions.unshift(impression);
  await writeState(state);

  const origin = siteUrl(req);
  const source = `stream:${publisherId}:${surface}`.slice(0, 600);
  const clickUrl = `${origin}/api/track?placementId=${encodeURIComponent(placement.id)}&source=${encodeURIComponent(source)}`;
  const categories = categoryHints(placement, keywords);

  return json({
    ok: true,
    impression,
    revenueShare: {
      estimatedPublisherEarningsUsd: impression.estimatedPublisherEarningsUsd,
      payoutStatus: "estimated_unpaid",
      note: "No automatic payouts are made until advertiser revenue and payout rails are approved."
    },
    targeting: {
      keywords,
      categories,
      note: "Send broad programming language, framework, and project keywords only. Do not send personal data or full prompts."
    },
    render: {
      format,
      statusLine: statusLine(placement, clickUrl)
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
