import type { Config } from "@netlify/functions";
import { adminAuthorized, badRequest, cleanText, json, parseJson, readState, writeState } from "./_data.mjs";

export default async (req: Request) => {
  if (!(await adminAuthorized(req))) return json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const state = await readState();

  if (req.method === "GET") {
    const placements = state.placements.map((placement) => ({
      ...placement,
      clickCount: state.clicks.filter((click) => click.placementId === placement.id).length,
      claimCount: state.claims.filter((claim) => claim.placementId === placement.id).length
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

  placement.status = status;
  placement.updatedAt = new Date().toISOString();
  if (body.paymentStatus === "paid") placement.paymentStatus = "paid";
  await writeState(state);

  return json({ ok: true, placement });
};

export const config: Config = {
  path: "/api/admin"
};
