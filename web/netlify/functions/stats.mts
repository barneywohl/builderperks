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

  return json({
    ok: true,
    stats: {
      approvedPlacements,
      pendingPlacements,
      clicks: state.clicks.filter((click) => approvedPlacementIds.has(click.placementId)).length,
      claims: state.claims.filter((claim) => approvedPlacementIds.has(claim.placementId)).length,
      feedback: state.feedback.length,
      builderFeedback: state.feedback.filter((item) => item.role === "builder").length,
      advertiserFeedback: state.feedback.filter((item) => item.role === "advertiser").length
    }
  });
};

export const config: Config = {
  path: "/api/stats"
};
