import { getDeployStore, getStore } from "@netlify/blobs";

declare const process: { env: Record<string, string | undefined> };

export type PlacementStatus = "pending" | "approved" | "rejected";

export type Placement = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: PlacementStatus;
  company: string;
  contactName: string;
  email: string;
  headline: string;
  body: string;
  cta: string;
  url: string;
  audience: string;
  packageId: "starter" | "launch" | "takeover";
  budgetUsd: number;
  targetTools: string[];
  paymentStatus: "invoice_requested" | "checkout_ready" | "paid";
  demandSource?: "builderperks_seed" | "direct_advertiser" | "approved_partner";
  demandPartner?: string;
  checkoutSessionId?: string;
};

export type Claim = {
  id: string;
  createdAt: string;
  placementId: string;
  email: string;
  note: string;
  source: string;
};

export type Feedback = {
  id: string;
  createdAt: string;
  role: "builder" | "advertiser";
  rating: number;
  email: string;
  message: string;
};

export type RelevanceAction = "need_this" | "not_relevant" | "hide_category";

export type RelevanceEvent = {
  id: string;
  createdAt: string;
  placementId: string;
  action: RelevanceAction;
  matchReason: string;
  category: string;
  categoryHint: string;
  source: string;
};

export type BuilderSignup = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  tool: string;
  audience: string;
  note: string;
};

export type ProofSession = {
  id: string;
  createdAt: string;
  publisherId: string;
  proofNonceHash: string;
  proofNonceExpiresAt: string;
  email: string;
  name: string;
  surface: string;
  tool: string;
  sawSponsoredLine: boolean;
  installMinutes: number;
  sentiment: "useful" | "neutral" | "annoying" | "blocked";
  blocker: string;
  note: string;
  evidenceUrl: string;
  evidenceHash: string;
  reviewStatus: "pending_review" | "approved" | "rejected";
  reviewedAt?: string;
};

export type Publisher = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  surface: string;
  payoutHandle: string;
  status: "pending" | "active";
  tokenHash?: string;
  tokenPrefix?: string;
  allowedCategories?: string[];
  blockedCategories?: string[];
};

export type Click = {
  id: string;
  createdAt: string;
  placementId: string;
  source: string;
  destination: string;
};

export type Impression = {
  id: string;
  createdAt: string;
  placementId: string;
  publisherId: string;
  surface: string;
  context: string;
  keywords: string[];
  estimatedPublisherEarningsUsd: number;
};

type State = {
  placements: Placement[];
  claims: Claim[];
  feedback: Feedback[];
  relevanceEvents: RelevanceEvent[];
  clicks: Click[];
  builders: BuilderSignup[];
  proofSessions: ProofSession[];
  publishers: Publisher[];
  impressions: Impression[];
};

const initialState: State = {
  placements: [
    {
      id: "seed-railway",
      createdAt: "2026-06-12T04:00:00.000Z",
      updatedAt: "2026-06-12T04:00:00.000Z",
      status: "approved",
      company: "Railway",
      contactName: "Seed",
      email: "ads@example.com",
      headline: "$5 in credits for AI builders shipping tonight",
      body: "Deploy your next side project without touching infra. Built for people who already live inside AI tools.",
      cta: "Claim credits",
      url: "https://railway.app/",
      audience: "AI app builders",
      packageId: "starter",
      budgetUsd: 250,
      targetTools: ["Claude", "ChatGPT", "Cursor"],
      paymentStatus: "paid",
      demandSource: "builderperks_seed"
    },
    {
      id: "seed-neon",
      createdAt: "2026-06-12T04:00:00.000Z",
      updatedAt: "2026-06-12T04:00:00.000Z",
      status: "approved",
      company: "Neon",
      contactName: "Seed",
      email: "ads@example.com",
      headline: "Serverless Postgres for agents and prototypes",
      body: "Spin up a real database before your generation finishes. Free tier, branches, instant connection strings.",
      cta: "Start a database",
      url: "https://neon.tech/",
      audience: "Prototype builders",
      packageId: "starter",
      budgetUsd: 250,
      targetTools: ["Claude", "ChatGPT", "v0"],
      paymentStatus: "paid",
      demandSource: "builderperks_seed"
    }
  ],
  claims: [],
  feedback: [],
  relevanceEvents: [],
  clicks: [],
  builders: [],
  proofSessions: [],
  publishers: [],
  impressions: []
};

const storeName = "builderperks-state";

export function env(name: string) {
  return Netlify.env.get(name) || process.env[name] || "";
}

function isProduction() {
  return Netlify.context?.deploy?.context === "production";
}

function stateStore() {
  return isProduction()
    ? getStore({ name: storeName, consistency: "strong" })
    : getDeployStore({ name: storeName });
}

export async function readState(): Promise<State> {
  const stored = await stateStore().get("state", { type: "json" });
  return {
    ...initialState,
    ...(stored ?? {}),
    builders: (stored as Partial<State> | null)?.builders ?? [],
    proofSessions: (stored as Partial<State> | null)?.proofSessions ?? [],
    publishers: (stored as Partial<State> | null)?.publishers ?? [],
    impressions: (stored as Partial<State> | null)?.impressions ?? [],
    relevanceEvents: (stored as Partial<State> | null)?.relevanceEvents ?? []
  };
}

export async function writeState(state: State) {
  await stateStore().setJSON("state", state);
}

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {})
    }
  });
}

export function badRequest(message: string) {
  return json({ ok: false, error: message }, { status: 400 });
}

export function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
}

export function secretToken(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "")}${crypto.randomUUID().slice(0, 8)}`;
}

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256Hex(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function publisherTokenAuthorized(publisher: Publisher, token: string) {
  if (!publisher.tokenHash) return false;
  if (!token) return false;
  return await sha256Hex(token) === publisher.tokenHash;
}

function proofNoncePayload(publisherId: string, nonce: string, expiresAt: string) {
  return `${publisherId}.${nonce}.${expiresAt}`;
}

export async function createProofSessionNonce(publisherId: string, publisherToken: string, ttlSeconds = 600) {
  const nonce = secretToken("bp_proof");
  const expiresAt = new Date(Date.now() + Math.max(60, Math.min(1800, ttlSeconds)) * 1000).toISOString();
  const signature = await hmacSha256Hex(publisherToken, proofNoncePayload(publisherId, nonce, expiresAt));
  return { nonce, expiresAt, signature };
}

export async function proofSessionNonceAuthorized(
  publisherId: string,
  publisherToken: string,
  nonce: string,
  expiresAt: string,
  signature: string
) {
  if (!publisherId || !publisherToken || !nonce || !expiresAt || !signature) return false;
  if (!nonce.startsWith("bp_proof_")) return false;
  const expiresAtMs = Date.parse(expiresAt);
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) return false;
  const expected = await hmacSha256Hex(publisherToken, proofNoncePayload(publisherId, nonce, expiresAt));
  return signature === expected;
}

export async function parseJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function cleanText(value: unknown, fallback = "") {
  return String(value ?? fallback).trim().slice(0, 600);
}

export function parseKeywords(value: unknown) {
  return cleanText(value)
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
}

export function cleanEmail(value: unknown) {
  const email = cleanText(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

export function cleanUrl(value: unknown) {
  const raw = cleanText(value);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function siteUrl(req: Request) {
  const configured = env("URL") || env("DEPLOY_PRIME_URL");
  if (configured) return configured.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function adminAuthorized(req: Request) {
  const configured = env("BUILDERPERKS_ADMIN_KEY");
  const headerKey = req.headers.get("x-admin-key");
  const queryKey = new URL(req.url).searchParams.get("key");
  const provided = headerKey || (!isProduction() ? queryKey : null);
  if (!configured && !isProduction()) return provided === "demo-admin";
  if (configured) return provided === configured;
  return false;
}
