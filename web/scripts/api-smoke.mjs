import assert from "node:assert/strict";

const baseUrl = (process.env.BUILDERPERKS_BASE_URL || "http://localhost:8888").replace(/\/$/, "");
const adminKey = process.env.BUILDERPERKS_ADMIN_KEY || "demo-admin";
const mutateLive = process.env.BUILDERPERKS_MUTATE_LIVE === "1";
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(baseUrl);

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
    email: "smoke@example.com",
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

const approved = await request("/api/admin", {
  method: "POST",
  headers: { "x-admin-key": adminKey },
  body: JSON.stringify({ placementId, status: "approved", paymentStatus: "paid" })
});
assert.equal(approved.response.status, 200);
assert.equal(approved.data.ok, true);
assert.equal(approved.data.placement.status, "approved");
assert.equal(approved.data.placement.paymentStatus, "paid");

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
    email: "builder@example.com",
    note: "api smoke",
    source: "api-smoke"
  })
});
assert.equal(claimed.response.status, 201);
assert.equal(claimed.data.ok, true);

const placements = await request("/api/placements");
assert.equal(placements.response.status, 200);
const placement = placements.data.placements.find((item) => item.id === placementId);
assert.ok(placement);
assert.equal(placement.clickCount, 1);
assert.equal(placement.claimCount, 1);

const publisher = await request("/api/publishers", {
  method: "POST",
  body: JSON.stringify({
    name: "Smoke Terminal",
    email: "publisher-smoke@example.com",
    surface: "terminal",
    payoutHandle: "publisher-smoke@example.com"
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
assert.equal(streamed.data.revenueShare.payoutStatus, "estimated_unpaid");

console.log(`api smoke ok: ${placementId} approved, tracked, claimed, and reported`);
