import type { Config } from "@netlify/functions";
import { json, readState } from "./_data.mjs";

export default async (req: Request) => {
  if (req.method !== "GET") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const state = await readState();
  const approvedPlacementIds = new Set(
    state.placements.filter((placement) => placement.status === "approved").map((placement) => placement.id)
  );
  const approvedPlacements = approvedPlacementIds.size;
  const pendingPlacements = state.placements.filter((placement) => placement.status === "pending").length;
  const relevanceEvents = state.relevanceEvents.filter((event) => approvedPlacementIds.has(event.placementId));
  const relevance = {
    total: relevanceEvents.length,
    needThis: relevanceEvents.filter((event) => event.action === "need_this").length,
    notRelevant: relevanceEvents.filter((event) => event.action === "not_relevant").length,
    hideCategory: relevanceEvents.filter((event) => event.action === "hide_category").length
  };

  return json({
    ok: true,
    stats: {
      approvedPlacements,
      pendingPlacements,
      clicks: state.clicks.filter((click) => approvedPlacementIds.has(click.placementId)).length,
      claims: state.claims.filter((claim) => approvedPlacementIds.has(claim.placementId)).length,
      relevance,
      relevanceEvents: relevance.total,
      needThis: relevance.needThis,
      notRelevant: relevance.notRelevant,
      hideCategory: relevance.hideCategory,
      feedback: state.feedback.length,
      builderFeedback: state.feedback.filter((item) => item.role === "builder").length,
      advertiserFeedback: state.feedback.filter((item) => item.role === "advertiser").length,
      builderSignups: state.builders.length,
      publishers: state.publishers.length,
      adImpressions: state.impressions.length,
      estimatedPublisherEarningsUsd: Number(
        state.impressions.reduce((sum, item) => sum + item.estimatedPublisherEarningsUsd, 0).toFixed(2)
      )
    }
  });
};

export const config: Config = {
  path: "/api/stats"
};
