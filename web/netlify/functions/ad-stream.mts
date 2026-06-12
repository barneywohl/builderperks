import type { Config } from "@netlify/functions";
import { badRequest, cleanText, id, json, readState, siteUrl, writeState, type Impression, type Placement } from "./_data.mjs";

const DEFAULT_PUBLISHER_EARNINGS_USD = 0.02;

function scorePlacement(placement: Placement, context: string, surface: string) {
  const haystack = `${placement.company} ${placement.headline} ${placement.body} ${placement.audience} ${placement.targetTools.join(" ")}`.toLowerCase();
  const terms = `${context} ${surface}`.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 2);
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

export default async (req: Request) => {
  if (req.method !== "GET") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(req.url);
  const publisherId = cleanText(url.searchParams.get("publisherId"));
  const surface = cleanText(url.searchParams.get("surface"), "terminal");
  const context = cleanText(url.searchParams.get("context"), "AI builder workflow");
  if (!publisherId) return badRequest("publisherId is required");

  const state = await readState();
  const publisher = state.publishers.find((item) => item.id === publisherId && item.status === "active");
  if (!publisher) return badRequest("Publisher is not active");

  const approved = state.placements.filter((placement) => placement.status === "approved");
  if (!approved.length) return json({ ok: true, ad: null, reason: "no_approved_placements" });

  const placement = [...approved].sort((a, b) => scorePlacement(b, context, surface) - scorePlacement(a, context, surface))[0];
  const impression: Impression = {
    id: id("imp"),
    createdAt: new Date().toISOString(),
    placementId: placement.id,
    publisherId,
    surface,
    context,
    estimatedPublisherEarningsUsd: DEFAULT_PUBLISHER_EARNINGS_USD
  };

  state.impressions.unshift(impression);
  await writeState(state);

  const origin = siteUrl(req);
  const source = `stream:${publisherId}:${surface}`.slice(0, 600);
  const clickUrl = `${origin}/api/track?placementId=${encodeURIComponent(placement.id)}&source=${encodeURIComponent(source)}`;

  return json({
    ok: true,
    impression,
    revenueShare: {
      estimatedPublisherEarningsUsd: impression.estimatedPublisherEarningsUsd,
      payoutStatus: "estimated_unpaid",
      note: "No automatic payouts are made until advertiser revenue and payout rails are approved."
    },
    ad: {
      placementId: placement.id,
      company: placement.company,
      headline: placement.headline,
      body: placement.body,
      cta: placement.cta,
      audience: placement.audience,
      targetTools: placement.targetTools,
      clickUrl,
      disclosure: "Sponsored BuilderPerks offer"
    }
  });
};

export const config: Config = {
  path: "/api/ad-stream"
};
