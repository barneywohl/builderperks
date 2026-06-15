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
  const approvedProofSessions = state.proofSessions.filter((session) => session.reviewStatus === "approved");
  const verifiedProofSessions = approvedProofSessions.filter((session) => session.sawSponsoredLine);
  const pendingProofSessions = state.proofSessions.filter((session) => (session.reviewStatus ?? "pending_review") === "pending_review");
  const rejectedProofSessions = state.proofSessions.filter((session) => session.reviewStatus === "rejected");
  const blockedProofSessions = state.proofSessions.filter((session) => session.sentiment === "blocked" || Boolean(session.blocker));
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
      proofSessions: state.proofSessions.length,
      verifiedWorkflowSessions: verifiedProofSessions.length,
      reviewedProofSessions: approvedProofSessions.length,
      pendingProofSessions: pendingProofSessions.length,
      rejectedProofSessions: rejectedProofSessions.length,
      blockedProofSessions: blockedProofSessions.length,
      verified: {
        workflowSessions: verifiedProofSessions.length,
        proofSessions: approvedProofSessions.length,
        blockedSessions: blockedProofSessions.filter((session) => session.reviewStatus === "approved").length,
        note: "Verified metrics require approved proof-session review. Raw counters are directional only."
      },
      raw: {
        impressions: state.impressions.length,
        clicks: state.clicks.filter((click) => approvedPlacementIds.has(click.placementId)).length,
        claims: state.claims.filter((claim) => approvedPlacementIds.has(claim.placementId)).length,
        proofSessions: state.proofSessions.length,
        pendingProofSessions: pendingProofSessions.length
      },
      publishers: state.publishers.length,
      adImpressions: state.impressions.length,
      estimatedPublisherEarningsUsd: Number(
        state.impressions.reduce((sum, item) => sum + item.estimatedPublisherEarningsUsd, 0).toFixed(2)
      ),
      estimatedPublisherEarningsStatus: "estimated_unpaid",
      metricsNote: "Public stats separate raw directional activity from reviewed proof. Estimated earnings are unpaid until advertiser revenue, fraud review, and payout rails are approved."
    }
  });
};

export const config: Config = {
  path: "/api/stats"
};
