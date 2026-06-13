import assert from "node:assert/strict";

const baseUrl = (process.env.BUILDERPERKS_BASE_URL || "http://localhost:8888").replace(/\/$/, "");
const adminKey = process.env.BUILDERPERKS_ADMIN_KEY || "demo-admin";
const mutateLive = process.env.BUILDERPERKS_MUTATE_LIVE === "1";
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(baseUrl);
const smokeRunId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

if (!isLocal && !mutateLive) {
  throw new Error("Refusing to mutate non-local BuilderPerks API without BUILDERPERKS_MUTATE_LIVE=1");
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    redirect: options.redirect || "follow",
    ...options
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { response, data };
}

const created = await request("/api/placements", {
  method: "POST",
  body: JSON.stringify({
    company: "BuilderPerks Smoke <script>",
    contactName: "Smoke",
    email: `smoke+${smokeRunId}@example.com`,
    url: "https://example.com/builderperks-smoke",
    headline: "Smoke placement should be safe and trackable",
    body: "Local API smoke body",
    cta: "Open smoke",
    audience: "AI builders",
    packageId: "starter",
    targetTools: ["Claude", "ChatGPT"]
  })
});
assert.equal(created.response.status, 201);
assert.equal(created.data.ok, true);
assert.equal(created.data.placement.status, "pending");
assert.equal(created.data.placement.company.includes("<script>"), true);

const placementId = created.data.placement.id;

const financeCreated = await request("/api/placements", {
  method: "POST",
  body: JSON.stringify({
    company: "BuilderPerks Finance Pilot",
    contactName: "Smoke",
    email: `finance-smoke+${smokeRunId}@example.com`,
    url: "https://example.com/builderperks-finance-smoke",
    headline: "Finance API credits for tax and banking workflows",
    body: "Credit, banking, insurance, and accounting tools for regulated builder workflows",
    cta: "Review finance pilot",
    audience: "Finance app builders",
    packageId: "starter",
    targetTools: ["Claude", "Cursor"]
  })
});
assert.equal(financeCreated.response.status, 201);
const financePlacementId = financeCreated.data.placement.id;

const approved = await request("/api/admin", {
  method: "POST",
  headers: { "x-admin-key": adminKey },
  body: JSON.stringify({
    placementId,
    status: "approved",
    paymentStatus: "paid",
    demandSource: "approved_partner",
    demandPartner: "EthicalAds"
  })
});
assert.equal(approved.response.status, 200);
assert.equal(approved.data.ok, true);
assert.equal(approved.data.placement.status, "approved");
assert.equal(approved.data.placement.paymentStatus, "paid");
assert.equal(approved.data.placement.demandSource, "approved_partner");
assert.equal(approved.data.placement.demandPartner, "EthicalAds");

const financeApproved = await request("/api/admin", {
  method: "POST",
  headers: { "x-admin-key": adminKey },
  body: JSON.stringify({ placementId: financePlacementId, status: "approved", paymentStatus: "paid" })
});
assert.equal(financeApproved.response.status, 200);
assert.equal(financeApproved.data.ok, true);
assert.equal(financeApproved.data.placement.status, "approved");

const tracked = await fetch(`${baseUrl}/api/track?placementId=${encodeURIComponent(placementId)}&source=api-smoke`, {
  redirect: "manual"
});
assert.equal(tracked.status, 302);
const redirectUrl = new URL(tracked.headers.get("location"));
assert.equal(redirectUrl.origin + redirectUrl.pathname, "https://example.com/builderperks-smoke");
assert.equal(redirectUrl.searchParams.get("placementId"), placementId);
assert.equal(redirectUrl.searchParams.get("source"), "api-smoke");

const claimed = await request("/api/claims", {
  method: "POST",
  body: JSON.stringify({
    placementId,
    email: `builder+${smokeRunId}@example.com`,
    note: "api smoke",
    source: "api-smoke"
  })
});
assert.equal(claimed.response.status, 201);
assert.equal(claimed.data.ok, true);

const needThis = await request("/api/relevance", {
  method: "POST",
  body: JSON.stringify({
    placementId,
    action: "need_this",
    matchReason: "Matched locally to deployment work",
    category: "deployment",
    categoryHint: "deployment_work",
    source: "api-smoke"
  })
});
assert.equal(needThis.response.status, 201);
assert.equal(needThis.data.ok, true);
assert.equal(needThis.data.event.action, "need_this");
assert.equal(needThis.data.event.category, "deployment");
assert.equal(needThis.data.event.categoryHint, "deployment_work");

const notRelevant = await request("/api/relevance", {
  method: "POST",
  body: JSON.stringify({
    placementId,
    action: "not_relevant",
    matchReason: "Matched locally to deployment work",
    category: "deployment",
    categoryHint: "deployment_work",
    source: "api-smoke"
  })
});
assert.equal(notRelevant.response.status, 201);
assert.equal(notRelevant.data.ok, true);

const hideCategory = await request("/api/relevance", {
  method: "POST",
  body: JSON.stringify({
    placementId,
    action: "hide_category",
    matchReason: "Matched locally to deployment work",
    category: "deployment",
    categoryHint: "deployment_work",
    source: "api-smoke"
  })
});
assert.equal(hideCategory.response.status, 201);
assert.equal(hideCategory.data.ok, true);

const placements = await request("/api/placements");
assert.equal(placements.response.status, 200);
const placement = placements.data.placements.find((item) => item.id === placementId);
assert.ok(placement);
assert.equal(placement.clickCount, 1);
assert.equal(placement.claimCount, 1);
assert.equal(placement.relevance.needThis, 1);
assert.equal(placement.relevance.notRelevant, 1);
assert.equal(placement.relevance.hideCategory, 1);

const publisher = await request("/api/publishers", {
  method: "POST",
  body: JSON.stringify({
    name: "Smoke Terminal",
    email: `publisher-smoke+${smokeRunId}@example.com`,
    surface: "terminal",
    payoutHandle: `publisher-smoke+${smokeRunId}@example.com`
  })
});
assert.equal(publisher.response.status, 201);
assert.equal(publisher.data.ok, true);
assert.equal(publisher.data.publisher.status, "active");

const streamed = await request(`/api/ad-stream?publisherId=${encodeURIComponent(publisher.data.publisher.id)}&surface=terminal&context=deploying%20an%20AI%20app&keywords=typescript,react,postgres&format=statusline`);
assert.equal(streamed.response.status, 200);
assert.equal(streamed.data.ok, true);
assert.ok(streamed.data.ad);
assert.ok(streamed.data.ad.clickUrl.includes("/api/track"));
assert.deepEqual(streamed.data.targeting.keywords, ["typescript", "react", "postgres"]);
assert.ok(streamed.data.targeting.categories.includes("database"));
assert.equal(streamed.data.render.format, "statusline");
assert.match(streamed.data.render.statusLine, /^Sponsored:/);
assert.match(streamed.data.render.terminalLine, /^Sponsored:/);
assert.match(streamed.data.render.markdown, /^\*\*Sponsored:/);
assert.equal(streamed.data.render.ideCard.actionUrl, streamed.data.ad.clickUrl);
assert.equal(streamed.data.revenueShare.payoutStatus, "estimated_unpaid");
assert.equal(streamed.data.marketplace.valueMode, "passive");
assert.ok(streamed.data.marketplace.providerLanes.includes("developer_network"));
assert.equal(streamed.data.demand.activeSource, "approved_partner");
assert.ok(streamed.data.demand.approvedPartnerIntegrations.includes("EthicalAds"));

const financeDefault = await request(`/api/ad-stream?publisherId=${encodeURIComponent(publisher.data.publisher.id)}&surface=terminal&context=finance%20tax%20banking&keywords=finance,banking,credit&format=statusline`);
assert.equal(financeDefault.response.status, 200);
assert.equal(financeDefault.data.ok, true);
assert.notEqual(financeDefault.data.ad?.placementId, financePlacementId);

const financeOptIn = await request(`/api/ad-stream?publisherId=${encodeURIComponent(publisher.data.publisher.id)}&surface=terminal&context=finance%20tax%20banking&keywords=finance,banking,credit&allowedCategories=finance&valueMode=high_value&format=statusline`);
assert.equal(financeOptIn.response.status, 200);
assert.equal(financeOptIn.data.ok, true);
assert.equal(financeOptIn.data.ad.placementId, financePlacementId);
assert.equal(financeOptIn.data.marketplace.valueMode, "high_value");
assert.ok(financeOptIn.data.marketplace.providerLanes.includes("regulated_partner"));
assert.ok(financeOptIn.data.revenueShare.estimatedPublisherEarningsUsd > streamed.data.revenueShare.estimatedPublisherEarningsUsd);

const blockedDatabase = await request(`/api/ad-stream?publisherId=${encodeURIComponent(publisher.data.publisher.id)}&surface=terminal&context=postgres&keywords=postgres&blockedCategories=database&format=statusline`);
assert.equal(blockedDatabase.response.status, 200);
assert.equal(blockedDatabase.data.ok, true);
assert.notEqual(blockedDatabase.data.ad?.placementId, "seed-neon");

const stats = await request("/api/stats");
assert.equal(stats.response.status, 200);
assert.ok(stats.data.stats.relevanceEvents >= 3);
assert.ok(stats.data.stats.needThis >= 1);
assert.ok(stats.data.stats.notRelevant >= 1);
assert.ok(stats.data.stats.hideCategory >= 1);

const admin = await request("/api/admin", { headers: { "x-admin-key": adminKey } });
assert.equal(admin.response.status, 200);
const adminPlacement = admin.data.placements.find((item) => item.id === placementId);
assert.ok(adminPlacement);
assert.equal(adminPlacement.relevance.needThis, 1);
assert.equal(adminPlacement.relevance.notRelevant, 1);
assert.equal(adminPlacement.relevance.hideCategory, 1);

console.log(`api smoke ok: ${placementId} and ${financePlacementId} approved, tracked, relevance-scored, gated, opted in, and reported`);
