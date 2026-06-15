import type { Config } from "@netlify/functions";
import { badRequest, cleanText, createProofSessionNonce, json, parseJson, publisherTokenAuthorized, readState } from "./_data.mjs";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const body = await parseJson(req);
  if (!body) return badRequest("Invalid JSON body");

  const publisherId = cleanText(body.publisherId);
  const publisherToken = cleanText(body.publisherToken) || cleanText(req.headers.get("x-publisher-token"));
  if (!publisherId) return badRequest("publisherId is required");

  const state = await readState();
  const publisher = state.publishers.find((item) => item.id === publisherId && item.status === "active");
  if (!publisher) return badRequest("Active publisherId is required");
  if (!(await publisherTokenAuthorized(publisher, publisherToken))) {
    return json({ ok: false, error: "Publisher token is required" }, { status: 401 });
  }

  const proofSession = await createProofSessionNonce(publisher.id, publisherToken);
  return json({
    ok: true,
    proofSession,
    note: "Use this short-lived signed nonce with the next proof-session submission. It does not replace reviewStatus; non-admin proof still lands as pending_review."
  }, { status: 201 });
};

export const config: Config = {
  path: "/api/proof-session-nonces"
};
