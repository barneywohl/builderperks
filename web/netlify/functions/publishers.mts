import type { Config } from "@netlify/functions";
import { badRequest, cleanEmail, cleanText, id, json, parseKeywords, parseJson, readState, secretToken, sha256Hex, writeState, type Publisher } from "./_data.mjs";

function publicPublisher(publisher: Publisher, state: Awaited<ReturnType<typeof readState>>) {
  return {
    createdAt: publisher.createdAt,
    name: publisher.name,
    surface: publisher.surface,
    status: publisher.status,
    tokenRequired: true,
    categoryOptIns: publisher.allowedCategories ?? [],
    impressions: state.impressions.filter((item) => item.publisherId === publisher.id).length,
    estimatedEarningsUsd: Number(
      state.impressions
        .filter((item) => item.publisherId === publisher.id)
        .reduce((sum, item) => sum + item.estimatedPublisherEarningsUsd, 0)
        .toFixed(2)
    )
  };
}

function privatePublisher(publisher: Publisher) {
  return {
    id: publisher.id,
    createdAt: publisher.createdAt,
    name: publisher.name,
    surface: publisher.surface,
    status: publisher.status,
    tokenPrefix: publisher.tokenPrefix ?? null,
    allowedCategories: publisher.allowedCategories ?? [],
    blockedCategories: publisher.blockedCategories ?? []
  };
}

export default async (req: Request) => {
  const state = await readState();

  if (req.method === "GET") {
    return json({
      ok: true,
      publishers: state.publishers.map((publisher) => publicPublisher(publisher, state))
    });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const body = await parseJson(req);
  if (!body) return badRequest("Invalid JSON body");

  const email = cleanEmail(body.email);
  if (!email) return badRequest("Valid email is required");

  const existing = state.publishers.find((publisher) => publisher.email === email);
  if (existing) return json({ ok: true, publisher: privatePublisher(existing), alreadyJoined: true });

  const token = secretToken("bp_pub");

  const publisher: Publisher = {
    id: id("pub"),
    createdAt: new Date().toISOString(),
    email,
    name: cleanText(body.name, "Founding publisher"),
    surface: cleanText(body.surface, "terminal/IDE"),
    payoutHandle: cleanText(body.payoutHandle),
    status: "active",
    tokenHash: await sha256Hex(token),
    tokenPrefix: token.slice(0, 12),
    allowedCategories: parseKeywords(body.allowedCategories),
    blockedCategories: parseKeywords(body.blockedCategories)
  };

  state.publishers.unshift(publisher);
  await writeState(state);

  return json({
    ok: true,
    publisher: {
      ...privatePublisher(publisher),
      token,
      tokenNotice: "Save this publisher token locally. It is shown once and required by the installer/status-line helper for new publisher traffic."
    },
    alreadyJoined: false
  }, { status: 201 });
};

export const config: Config = {
  path: "/api/publishers"
};
