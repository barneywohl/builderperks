import type { Config } from "@netlify/functions";
import { badRequest, cleanText, id, json, parseJson, readState, writeState, type Publisher } from "./_data.mjs";

export default async (req: Request) => {
  const state = await readState();

  if (req.method === "GET") {
    return json({
      ok: true,
      publishers: state.publishers.map((publisher) => ({
        id: publisher.id,
        createdAt: publisher.createdAt,
        name: publisher.name,
        surface: publisher.surface,
        status: publisher.status,
        impressions: state.impressions.filter((item) => item.publisherId === publisher.id).length,
        estimatedEarningsUsd: Number(
          state.impressions
            .filter((item) => item.publisherId === publisher.id)
            .reduce((sum, item) => sum + item.estimatedPublisherEarningsUsd, 0)
            .toFixed(2)
        )
      }))
    });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const body = await parseJson(req);
  if (!body) return badRequest("Invalid JSON body");

  const email = cleanText(body.email).toLowerCase();
  if (!email || !email.includes("@")) return badRequest("Valid email is required");

  const existing = state.publishers.find((publisher) => publisher.email === email);
  if (existing) return json({ ok: true, publisher: existing, alreadyJoined: true });

  const publisher: Publisher = {
    id: id("pub"),
    createdAt: new Date().toISOString(),
    email,
    name: cleanText(body.name, "Founding publisher"),
    surface: cleanText(body.surface, "terminal/IDE"),
    payoutHandle: cleanText(body.payoutHandle),
    status: "active"
  };

  state.publishers.unshift(publisher);
  await writeState(state);

  return json({ ok: true, publisher, alreadyJoined: false }, { status: 201 });
};

export const config: Config = {
  path: "/api/publishers"
};
