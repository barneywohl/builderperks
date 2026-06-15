import type { Config } from "@netlify/functions";
import { badRequest, cleanEmail, cleanText, id, json, parseJson, readState, writeState, type Feedback } from "./_data.mjs";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const body = await parseJson(req);
  if (!body) return badRequest("Invalid JSON body");

  const role = body.role === "advertiser" ? "advertiser" : "builder";
  const rating = Math.max(1, Math.min(5, Number(body.rating || 5)));
  const feedback: Feedback = {
    id: id("fb"),
    createdAt: new Date().toISOString(),
    role,
    rating,
    email: cleanEmail(body.email),
    message: cleanText(body.message)
  };

  if (!feedback.email) return badRequest("Valid email is required");
  if (!feedback.message) return badRequest("Message is required");

  const state = await readState();
  state.feedback.unshift(feedback);
  await writeState(state);

  return json({ ok: true, feedback }, { status: 201 });
};

export const config: Config = {
  path: "/api/feedback"
};
