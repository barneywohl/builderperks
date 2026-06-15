import type { Config } from "@netlify/functions";
import { badRequest, cleanEmail, cleanText, id, json, parseJson, readState, writeState, type BuilderSignup } from "./_data.mjs";

export default async (req: Request) => {
  const state = await readState();

  if (req.method === "GET") {
    return json({
      ok: true,
      builders: state.builders.map((builder) => ({
        id: builder.id,
        createdAt: builder.createdAt,
        tool: builder.tool,
        audience: builder.audience
      }))
    });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const body = await parseJson(req);
  if (!body) return badRequest("Invalid JSON body");

  const email = cleanEmail(body.email);
  if (!email) return badRequest("Valid email is required");

  const existing = state.builders.find((builder) => builder.email === email);
  if (existing) {
    return json({ ok: true, builder: existing, alreadyJoined: true });
  }

  const builder: BuilderSignup = {
    id: id("bld"),
    createdAt: new Date().toISOString(),
    email,
    name: cleanText(body.name),
    tool: cleanText(body.tool, "AI coding tools"),
    audience: cleanText(body.audience, "AI builders"),
    note: cleanText(body.note)
  };

  state.builders.unshift(builder);
  await writeState(state);

  return json({ ok: true, builder, alreadyJoined: false }, { status: 201 });
};

export const config: Config = {
  path: "/api/builders"
};
