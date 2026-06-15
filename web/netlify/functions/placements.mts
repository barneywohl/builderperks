import type { Config } from "@netlify/functions";
import { adminAuthorized, badRequest, cleanEmail, cleanText, cleanUrl, env, id, json, parseJson, readState, siteUrl, writeState, type Placement } from "./_data.mjs";

const packages = {
  starter: 250,
  launch: 750,
  takeover: 2000
} as const;

function checkoutUrlFor(packageId: keyof typeof packages) {
  const packageSpecific = env(`BUILDERPERKS_CHECKOUT_URL_${packageId.toUpperCase()}`);
  return packageSpecific || env("BUILDERPERKS_CHECKOUT_URL") || null;
}

async function createStripeCheckout(req: Request, placement: Placement) {
  const secret = env("STRIPE_SECRET_KEY");
  if (!secret) return { checkout: null, error: null };

  const origin = siteUrl(req);
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("customer_email", placement.email);
  params.set("client_reference_id", placement.id);
  params.set("success_url", `${origin}/?paid=1&placement=${encodeURIComponent(placement.id)}#advertiser`);
  params.set("cancel_url", `${origin}/?checkout_cancelled=1&placement=${encodeURIComponent(placement.id)}#advertiser`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(placement.budgetUsd * 100));
  params.set("line_items[0][price_data][product_data][name]", `BuilderPerks ${placement.packageId} placement`);
  params.set("line_items[0][price_data][product_data][description]", `${placement.company}: ${placement.headline}`.slice(0, 1000));
  params.set("metadata[placementId]", placement.id);
  params.set("metadata[packageId]", placement.packageId);
  params.set("metadata[company]", placement.company);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("stripe_checkout_failed", data);
    return { checkout: null, error: "Stripe checkout is unavailable. Placement saved for invoice follow-up." };
  }
  return { checkout: { id: data.id as string, url: data.url as string }, error: null };
}

export default async (req: Request) => {
  const state = await readState();

  if (req.method === "GET") {
    const url = new URL(req.url);
    const includePendingRequested = url.searchParams.get("includePending") === "1";
    const includePending = includePendingRequested && await adminAuthorized(req);
    if (includePendingRequested && !includePending) {
      return json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const placements = state.placements
      .filter((placement) => includePending || placement.status === "approved")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((placement) => ({
        ...placement,
        clickCount: state.clicks.filter((click) => click.placementId === placement.id).length,
        claimCount: state.claims.filter((claim) => claim.placementId === placement.id).length,
        relevance: {
          total: state.relevanceEvents.filter((event) => event.placementId === placement.id).length,
          needThis: state.relevanceEvents.filter((event) => event.placementId === placement.id && event.action === "need_this").length,
          notRelevant: state.relevanceEvents.filter((event) => event.placementId === placement.id && event.action === "not_relevant").length,
          hideCategory: state.relevanceEvents.filter((event) => event.placementId === placement.id && event.action === "hide_category").length
        }
      }));

    return json({ ok: true, placements });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const body = await parseJson(req);
  if (!body) return badRequest("Invalid JSON body");

  const packageId = String(body.packageId ?? "starter") as keyof typeof packages;
  if (!(packageId in packages)) return badRequest("Unknown package");
  const staticCheckoutUrl = checkoutUrlFor(packageId);

  const placement: Placement = {
    id: id("plc"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
    company: cleanText(body.company),
    contactName: cleanText(body.contactName),
    email: cleanEmail(body.email),
    headline: cleanText(body.headline),
    body: cleanText(body.body),
    cta: cleanText(body.cta, "Learn more"),
    url: cleanUrl(body.url),
    audience: cleanText(body.audience, "AI builders"),
    packageId,
    budgetUsd: packages[packageId],
    targetTools: Array.isArray(body.targetTools) ? body.targetTools.map((tool: unknown) => cleanText(tool)).filter(Boolean).slice(0, 5) : ["Claude", "ChatGPT"],
    paymentStatus: staticCheckoutUrl ? "checkout_ready" : "invoice_requested"
  };

  if (!placement.company || !placement.email || !placement.headline || !placement.body || !placement.url) {
    return badRequest("Company, valid email, headline, body, and URL are required");
  }

  const { checkout: stripeCheckout, error: checkoutError } = staticCheckoutUrl
    ? { checkout: null, error: null }
    : await createStripeCheckout(req, placement);
  if (stripeCheckout) {
    placement.checkoutSessionId = stripeCheckout.id;
    placement.paymentStatus = "checkout_ready";
  }

  state.placements.unshift(placement);
  await writeState(state);

  return json({
    ok: true,
    placement,
    checkoutUrl: stripeCheckout?.url || staticCheckoutUrl,
    nextStep: placement.paymentStatus === "checkout_ready" ? "checkout" : "invoice",
    checkoutError
  }, { status: 201 });
};

export const config: Config = {
  path: "/api/placements"
};
