import type { Config } from "@netlify/functions";
import { env, json, readState, writeState } from "./_data.mjs";

function hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function signatureParts(header: string) {
  return Object.fromEntries(header.split(",").map((part) => {
    const [key, value] = part.split("=");
    return [key, value];
  }));
}

async function validSignature(payload: string, header: string, secret: string) {
  const parts = signatureParts(header);
  if (!parts.t || !parts.v1) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${parts.t}.${payload}`));
  return hex(digest) === parts.v1;
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const secret = env("STRIPE_WEBHOOK_SECRET");
  if (!secret) return json({ ok: false, error: "Webhook secret not configured" }, { status: 501 });

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";
  if (!(await validSignature(payload, signature, secret))) {
    return json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(payload);
  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;
    const placementId = session?.metadata?.placementId || session?.client_reference_id;
    if (placementId) {
      const state = await readState();
      const placement = state.placements.find((item) => item.id === placementId);
      if (placement) {
        placement.paymentStatus = "paid";
        placement.updatedAt = new Date().toISOString();
        await writeState(state);
      }
    }
  }

  return json({ ok: true });
};

export const config: Config = {
  path: "/api/stripe-webhook"
};
