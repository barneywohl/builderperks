import type { Config } from "@netlify/functions";
import { badRequest, cleanEmail, cleanText, id, json, parseJson, readState, writeState, type Claim } from "./_data.mjs";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const body = await parseJson(req);
  if (!body) return badRequest("Invalid JSON body");

  const claim: Claim = {
    id: id("claim"),
    createdAt: new Date().toISOString(),
    placementId: cleanText(body.placementId),
    email: cleanEmail(body.email),
    note: cleanText(body.note),
    source: cleanText(body.source, "web")
  };

  if (!claim.placementId || !claim.email) return badRequest("Placement and valid email are required");

  const state = await readState();
  const placement = state.placements.find((item) => item.id === claim.placementId && item.status === "approved");
  if (!placement) return badRequest("Placement is not available");

  state.claims.unshift(claim);
  await writeState(state);

  return json({ ok: true, claim }, { status: 201 });
};

export const config: Config = {
  path: "/api/claims"
};
