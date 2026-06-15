import type { Config } from "@netlify/functions";
import { badRequest, cleanText, id, json, readState, writeState, type Click } from "./_data.mjs";
import { approvedPartnerFeedPlacements } from "./_partner_feeds.mjs";

export default async (req: Request) => {
  if (req.method !== "GET") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(req.url);
  const placementId = cleanText(url.searchParams.get("placementId"));
  const source = cleanText(url.searchParams.get("source"), "web");
  if (!placementId) return badRequest("Placement is required");

  const state = await readState();
  const placement = state.placements.find((item) => item.id === placementId && item.status === "approved")
    ?? (await approvedPartnerFeedPlacements()).flatMap((result) => result.placements).find((item) => item.id === placementId);
  if (!placement) return badRequest("Placement is not available");

  const destination = new URL(placement.url);
  destination.searchParams.set("placementId", placementId);
  destination.searchParams.set("source", source);

  const click: Click = {
    id: id("clk"),
    createdAt: new Date().toISOString(),
    placementId,
    source,
    destination: destination.toString()
  };

  state.clicks.unshift(click);
  await writeState(state);

  return Response.redirect(destination.toString(), 302);
};

export const config: Config = {
  path: "/api/track"
};
