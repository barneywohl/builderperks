import type { Config } from "@netlify/functions";
import { badRequest, cleanText, id, json, readState, writeState, type Click } from "./_data.mjs";

export default async (req: Request) => {
  if (req.method !== "GET") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(req.url);
  const placementId = cleanText(url.searchParams.get("placementId"));
  const source = cleanText(url.searchParams.get("source"), "web");
  if (!placementId) return badRequest("Placement is required");

  const state = await readState();
  const placement = state.placements.find((item) => item.id === placementId && item.status === "approved");
  if (!placement) return badRequest("Placement is not available");

  const click: Click = {
    id: id("clk"),
    createdAt: new Date().toISOString(),
    placementId,
    source,
    destination: placement.url
  };

  state.clicks.unshift(click);
  await writeState(state);

  return Response.redirect(placement.url, 302);
};

export const config: Config = {
  path: "/api/track"
};
