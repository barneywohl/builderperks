import type { Config } from "@netlify/functions";
import { badRequest, cleanText, id, json, parseJson, readState, writeState, type RelevanceAction, type RelevanceEvent } from "./_data.mjs";

function cleanAction(value: unknown): RelevanceAction | null {
  return value === "need_this" || value === "not_relevant" || value === "hide_category" ? value : null;
}

function cleanCategory(value: unknown, fallback = "general") {
  const cleaned = cleanText(value, fallback)
    .toLowerCase()
    .replace(/[^a-z0-9 _-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80);
  return cleaned || fallback;
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const body = await parseJson(req);
  if (!body) return badRequest("Invalid JSON body");

  const placementId = cleanText(body.placementId);
  const action = cleanAction(body.action);
  if (!placementId || !action) return badRequest("Placement and valid relevance action are required");

  const state = await readState();
  const placement = state.placements.find((item) => item.id === placementId);
  if (!placement || placement.status !== "approved") return badRequest("Approved placement not found");

  const event: RelevanceEvent = {
    id: id("rel"),
    createdAt: new Date().toISOString(),
    placementId,
    action,
    matchReason: cleanText(body.matchReason || body.reason, "unspecified match"),
    category: cleanCategory(body.category),
    categoryHint: cleanCategory(body.categoryHint || body.category),
    source: cleanText(body.source, "extension")
  };

  state.relevanceEvents.unshift(event);
  await writeState(state);

  return json({ ok: true, event }, { status: 201 });
};

export const config: Config = {
  path: "/api/relevance"
};
