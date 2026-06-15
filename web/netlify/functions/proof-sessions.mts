import type { Config } from "@netlify/functions";
import { adminAuthorized, badRequest, cleanEmail, cleanText, cleanUrl, id, json, parseJson, proofSessionNonceAuthorized, publisherTokenAuthorized, readState, sha256Hex, writeState, type ProofSession } from "./_data.mjs";

function cleanSurface(value: unknown) {
  const surface = cleanText(value, "terminal").toLowerCase();
  if (["terminal", "claude_code", "ide", "browser_extension", "agent_ui"].includes(surface)) return surface;
  return "terminal";
}

function cleanSentiment(value: unknown): ProofSession["sentiment"] {
  const sentiment = cleanText(value, "neutral").toLowerCase();
  if (sentiment === "useful" || sentiment === "neutral" || sentiment === "annoying" || sentiment === "blocked") return sentiment;
  return "neutral";
}

function cleanInstallMinutes(value: unknown) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes)) return 0;
  return Math.max(0, Math.min(120, Math.round(minutes)));
}

function cleanReviewStatus(value: unknown): ProofSession["reviewStatus"] {
  const status = cleanText(value, "pending_review").toLowerCase();
  if (status === "approved" || status === "rejected") return status;
  return "pending_review";
}

export default async (req: Request) => {
  const state = await readState();
  const isAdmin = await adminAuthorized(req);

  if (req.method === "GET") {
    return json({
      ok: true,
      proofSessions: state.proofSessions.map((session) => ({
        id: session.id,
        createdAt: session.createdAt,
        publisherId: session.publisherId,
        surface: session.surface,
        tool: session.tool,
        sawSponsoredLine: session.sawSponsoredLine,
        installMinutes: session.installMinutes,
        sentiment: session.sentiment,
        reviewStatus: session.reviewStatus ?? "pending_review",
        proofNonceExpiresAt: session.proofNonceExpiresAt ?? null,
        hasEvidence: Boolean(session.evidenceUrl || session.evidenceHash),
        hasBlocker: Boolean(session.blocker)
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

  const publisherId = cleanText(body.publisherId);
  const publisherToken = cleanText(body.publisherToken) || cleanText(req.headers.get("x-publisher-token"));
  const publisher = state.publishers.find((item) => item.id === publisherId && item.status === "active");
  if (!publisher) return badRequest("Active publisherId is required");
  if (!(await publisherTokenAuthorized(publisher, publisherToken))) {
    return json({ ok: false, error: "Publisher token is required" }, { status: 401 });
  }
  const proofNonce = cleanText(body.proofSessionNonce);
  const proofNonceExpiresAt = cleanText(body.proofSessionExpiresAt);
  const proofNonceSignature = cleanText(body.proofSessionSignature);
  if (!(await proofSessionNonceAuthorized(publisher.id, publisherToken, proofNonce, proofNonceExpiresAt, proofNonceSignature))) {
    return json({ ok: false, error: "Valid proof-session nonce is required" }, { status: 401 });
  }

  const requestedReviewStatus = cleanReviewStatus(body.reviewStatus);
  const reviewStatus = isAdmin ? requestedReviewStatus : "pending_review";
  const evidenceUrl = cleanUrl(body.evidenceUrl);
  const evidenceHashInput = cleanText(body.evidenceHash);
  const evidenceHash = evidenceHashInput || (evidenceUrl ? await sha256Hex(evidenceUrl) : "");
  const sawSponsoredLine = body.sawSponsoredLine === true || body.sawSponsoredLine === "true" || body.sawSponsoredLine === "yes";
  const session: ProofSession = {
    id: id("proof"),
    createdAt: new Date().toISOString(),
    publisherId: publisher.id,
    proofNonceHash: await sha256Hex(proofNonce),
    proofNonceExpiresAt,
    email,
    name: cleanText(body.name),
    surface: cleanSurface(body.surface),
    tool: cleanText(body.tool, "Claude Code"),
    sawSponsoredLine,
    installMinutes: cleanInstallMinutes(body.installMinutes),
    sentiment: cleanSentiment(body.sentiment),
    blocker: cleanText(body.blocker),
    note: cleanText(body.note),
    evidenceUrl,
    evidenceHash,
    reviewStatus,
    reviewedAt: reviewStatus === "pending_review" ? undefined : new Date().toISOString()
  };

  if (!session.note && !session.blocker) return badRequest("A note or blocker is required");
  if (session.reviewStatus === "approved" && !session.sawSponsoredLine) return badRequest("Approved proof sessions must include a sponsored-line observation");

  state.proofSessions.unshift(session);
  await writeState(state);

  return json({
    ok: true,
    proofSession: {
      id: session.id,
      createdAt: session.createdAt,
      surface: session.surface,
      tool: session.tool,
      sawSponsoredLine: session.sawSponsoredLine,
      installMinutes: session.installMinutes,
      sentiment: session.sentiment,
      reviewStatus: session.reviewStatus,
      hasEvidence: Boolean(session.evidenceUrl || session.evidenceHash)
    }
  }, { status: 201 });
};

export const config: Config = {
  path: "/api/proof-sessions"
};
