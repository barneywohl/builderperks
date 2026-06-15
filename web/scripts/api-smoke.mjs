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

const invalidPlacementEmail = await request("/api/placements", {
  method: "POST",
  body: JSON.stringify({
    company: "BuilderPerks Invalid Email",
    contactName: "Smoke",
    email: "invalid-at-example",
    url: "https://example.com/invalid-email",
    headline: "Invalid email should fail",
    body: "The advertiser setup form should reject malformed addresses",
    cta: "Do not save",
    audience: "AI builders",
    packageId: "starter",
    targetTools: ["Claude"]
  })
});
assert.equal(invalidPlacementEmail.response.status, 400);
assert.equal(invalidPlacementEmail.data.ok, false);

const unauthorizedPending = await request("/api/placements?includePending=1");
assert.equal(unauthorizedPending.response.status, 401);
assert.equal(unauthorizedPending.data.ok, false);

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

const cryptoCreated = await request("/api/placements", {
  method: "POST",
  body: JSON.stringify({
    company: "BuilderPerks Crypto Pilot",
    contactName: "Smoke",
    email: `crypto-smoke+${smokeRunId}@example.com`,
    url: "https://example.com/builderperks-crypto-smoke",
    headline: "Crypto wallet API for web3 agent workflows",
    body: "Blockchain, bitcoin, ethereum, and defi wallet tooling for crypto builder workflows",
    cta: "Review crypto pilot",
    audience: "Crypto app builders",
    packageId: "starter",
    targetTools: ["Claude", "Cursor"]
  })
});
assert.equal(cryptoCreated.response.status, 201);
const cryptoPlacementId = cryptoCreated.data.placement.id;

const fakeApprovedPartner = await request("/api/admin", {
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
assert.equal(fakeApprovedPartner.response.status, 400);
assert.equal(fakeApprovedPartner.data.ok, false);
assert.match(fakeApprovedPartner.data.error, /configured credentials\/feed/);

const approved = await request("/api/admin", {
  method: "POST",
  headers: { "x-admin-key": adminKey },
  body: JSON.stringify({
    placementId,
    status: "approved",
    paymentStatus: "paid",
    demandSource: "direct_advertiser"
  })
});
assert.equal(approved.response.status, 200);
assert.equal(approved.data.ok, true);
assert.equal(approved.data.placement.status, "approved");
assert.equal(approved.data.placement.paymentStatus, "paid");
assert.equal(approved.data.placement.demandSource, "direct_advertiser");

const financeApproved = await request("/api/admin", {
  method: "POST",
  headers: { "x-admin-key": adminKey },
  body: JSON.stringify({ placementId: financePlacementId, status: "approved", paymentStatus: "paid" })
});
assert.equal(financeApproved.response.status, 200);
assert.equal(financeApproved.data.ok, true);
assert.equal(financeApproved.data.placement.status, "approved");

const cryptoApproved = await request("/api/admin", {
  method: "POST",
  headers: { "x-admin-key": adminKey },
  body: JSON.stringify({ placementId: cryptoPlacementId, status: "approved", paymentStatus: "paid" })
});
assert.equal(cryptoApproved.response.status, 200);
assert.equal(cryptoApproved.data.ok, true);
assert.equal(cryptoApproved.data.placement.status, "approved");

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

const invalidClaimEmail = await request("/api/claims", {
  method: "POST",
  body: JSON.stringify({
    placementId,
    email: "bad-claim-email",
    note: "api smoke",
    source: "api-smoke"
  })
});
assert.equal(invalidClaimEmail.response.status, 400);
assert.equal(invalidClaimEmail.data.ok, false);

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
    payoutHandle: `publisher-smoke+${smokeRunId}@example.com`,
    allowedCategories: "finance,crypto"
  })
});
assert.equal(publisher.response.status, 201);
assert.equal(publisher.data.ok, true);
assert.equal(publisher.data.publisher.status, "active");
assert.ok(publisher.data.publisher.token.startsWith("bp_pub_"));
assert.equal(publisher.data.publisher.email, undefined);
assert.equal(publisher.data.publisher.payoutHandle, undefined);

const publisherList = await request("/api/publishers");
assert.equal(publisherList.response.status, 200);
assert.equal(publisherList.data.ok, true);
assert.equal(publisherList.data.publishers.some((item) => item.id === publisher.data.publisher.id), false);

const invalidPublisherEmail = await request("/api/publishers", {
  method: "POST",
  body: JSON.stringify({
    name: "Invalid Publisher",
    email: "bad-publisher-email",
    surface: "terminal",
    payoutHandle: "bad-publisher-email"
  })
});
assert.equal(invalidPublisherEmail.response.status, 400);
assert.equal(invalidPublisherEmail.data.ok, false);

const builder = await request("/api/builders", {
  method: "POST",
  body: JSON.stringify({
    name: "Smoke Builder",
    email: `builder-signup+${smokeRunId}@example.com`,
    tool: "Claude",
    audience: "AI builders",
    note: "api smoke"
  })
});
assert.equal(builder.response.status, 201);
assert.equal(builder.data.ok, true);

const invalidBuilderEmail = await request("/api/builders", {
  method: "POST",
  body: JSON.stringify({
    name: "Invalid Builder",
    email: "bad-builder-email",
    tool: "Claude",
    audience: "AI builders"
  })
});
assert.equal(invalidBuilderEmail.response.status, 400);
assert.equal(invalidBuilderEmail.data.ok, false);

const feedback = await request("/api/feedback", {
  method: "POST",
  body: JSON.stringify({
    role: "builder",
    rating: 5,
    email: `feedback+${smokeRunId}@example.com`,
    message: "api smoke feedback"
  })
});
assert.equal(feedback.response.status, 201);
assert.equal(feedback.data.ok, true);

const invalidFeedbackEmail = await request("/api/feedback", {
  method: "POST",
  body: JSON.stringify({
    role: "builder",
    rating: 5,
    email: "bad-feedback-email",
    message: "api smoke feedback"
  })
});
assert.equal(invalidFeedbackEmail.response.status, 400);
assert.equal(invalidFeedbackEmail.data.ok, false);

const unauthorizedProofNonce = await request("/api/proof-session-nonces", {
  method: "POST",
  body: JSON.stringify({
    publisherId: publisher.data.publisher.id
  })
});
assert.equal(unauthorizedProofNonce.response.status, 401);
assert.equal(unauthorizedProofNonce.data.ok, false);

const proofNonce = await request("/api/proof-session-nonces", {
  method: "POST",
  body: JSON.stringify({
    publisherId: publisher.data.publisher.id,
    publisherToken: publisher.data.publisher.token
  })
});
assert.equal(proofNonce.response.status, 201);
assert.equal(proofNonce.data.ok, true);
assert.ok(proofNonce.data.proofSession.nonce.startsWith("bp_proof_"));
assert.ok(proofNonce.data.proofSession.signature);

const unsignedProofSession = await request("/api/proof-sessions", {
  method: "POST",
  body: JSON.stringify({
    name: "Unsigned Proof Builder",
    email: `unsigned-proof+${smokeRunId}@example.com`,
    publisherId: publisher.data.publisher.id,
    publisherToken: publisher.data.publisher.token,
    surface: "claude_code",
    tool: "Claude Code",
    installMinutes: 3,
    sawSponsoredLine: true,
    sentiment: "useful",
    note: "This should fail without a signed proof nonce"
  })
});
assert.equal(unsignedProofSession.response.status, 401);
assert.equal(unsignedProofSession.data.ok, false);

const proofSession = await request("/api/proof-sessions", {
  method: "POST",
  body: JSON.stringify({
    name: "Smoke Proof Builder",
    email: `proof+${smokeRunId}@example.com`,
    publisherId: publisher.data.publisher.id,
    publisherToken: publisher.data.publisher.token,
    proofSessionNonce: proofNonce.data.proofSession.nonce,
    proofSessionExpiresAt: proofNonce.data.proofSession.expiresAt,
    proofSessionSignature: proofNonce.data.proofSession.signature,
    surface: "claude_code",
    tool: "Claude Code",
    installMinutes: 3,
    sawSponsoredLine: true,
    sentiment: "useful",
    reviewStatus: "approved",
    evidenceUrl: "https://example.com/builderperks-smoke-proof.png",
    note: "Saw one sponsored line in a local smoke workflow"
  }),
  headers: { "x-admin-key": adminKey }
});
assert.equal(proofSession.response.status, 201);
assert.equal(proofSession.data.ok, true);
assert.equal(proofSession.data.proofSession.sawSponsoredLine, true);
assert.equal(proofSession.data.proofSession.reviewStatus, "approved");

const invalidProofSession = await request("/api/proof-sessions", {
  method: "POST",
  body: JSON.stringify({
    email: "bad-proof-email",
    note: "bad proof"
  })
});
assert.equal(invalidProofSession.response.status, 400);
assert.equal(invalidProofSession.data.ok, false);

const proofSessions = await request("/api/proof-sessions");
assert.equal(proofSessions.response.status, 200);
assert.equal(proofSessions.data.ok, true);
assert.ok(proofSessions.data.proofSessions.some((session) => session.id === proofSession.data.proofSession.id));
assert.equal(proofSessions.data.proofSessions.some((session) => session.email), false);

const tokenlessStream = await request(`/api/ad-stream?publisherId=${encodeURIComponent(publisher.data.publisher.id)}&surface=terminal&context=deploying%20an%20AI%20app&keywords=typescript,react,postgres&format=statusline`);
assert.equal(tokenlessStream.response.status, 401);
assert.equal(tokenlessStream.data.ok, false);

const streamBase = `/api/ad-stream?publisherId=${encodeURIComponent(publisher.data.publisher.id)}&publisherToken=${encodeURIComponent(publisher.data.publisher.token)}`;
const partnerFeedFixtureBlock = process.env.BUILDERPERKS_APPROVED_PARTNER_FEED_URLS ? "&blockedKeywords=partnerfeed" : "";
const streamed = await request(`${streamBase}&surface=terminal&context=deploying%20an%20AI%20app&keywords=typescript,react,postgres${partnerFeedFixtureBlock}&format=statusline`);
assert.equal(streamed.response.status, 200);
assert.equal(streamed.data.ok, true);
assert.ok(streamed.data.ad);
assert.equal(streamed.data.impression.context, "[redacted: publisher context is used for matching but not stored]");
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
assert.equal(streamed.data.demand.activeSource, "direct_advertiser");
assert.deepEqual(streamed.data.demand.approvedPartnerIntegrations, []);
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("Carbon Ads"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("Carbon for CLI, AI assistants, and IDE extensions"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("BuySellAds Publisher Solutions"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("BuySellAds Newsletter Network"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("AdButler"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("Kevel"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("PartnerStack SaaS affiliate marketplace"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("FlexOffers publisher API"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("Awin publisher APIs"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("AdsBind AI app monetization"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("Impact.com"));
assert.ok(streamed.data.demand.pendingPartnerIntegrations.includes("ExoClick"));

if (process.env.BUILDERPERKS_APPROVED_PARTNER_FEED_URLS) {
  const partnerStream = await request(`${streamBase}&surface=terminal&context=partnerfeedonly&keywords=partnerfeed&format=statusline`);
  assert.equal(partnerStream.response.status, 200);
  assert.equal(partnerStream.data.ok, true);
  assert.ok(partnerStream.data.ad);
  assert.equal(partnerStream.data.demand.source, "approved_partner");
  assert.equal(partnerStream.data.demand.activeSource, "approved_partner");
  assert.equal(partnerStream.data.demand.partner, "Approved partner feed 1");
  assert.deepEqual(partnerStream.data.demand.approvedPartnerIntegrations, ["Approved partner feed 1"]);
  assert.match(partnerStream.data.render.statusLine, /^Sponsored via Approved partner feed 1:/);
  assert.match(partnerStream.data.render.terminalLine, /^Sponsored via Approved partner feed 1:/);
  assert.equal(partnerStream.data.impression.context, "[redacted: publisher context is used for matching but not stored]");
}

const sanitizedKeywordStream = await request(`${streamBase}&surface=terminal&context=postgres&keywords=postgres,alice%40example.com,sk-test_builderperks_should_not_store_12345,/Users/alice/private-repo,api_key=secretvalue&blockedKeywords=smoke&format=statusline`);
assert.equal(sanitizedKeywordStream.response.status, 200);
assert.equal(sanitizedKeywordStream.data.ok, true);
assert.ok(sanitizedKeywordStream.data.ad);
assert.ok(sanitizedKeywordStream.data.targeting.keywords.includes("postgres"));
assert.ok(!sanitizedKeywordStream.data.targeting.keywords.some((keyword) => /alice|example|sk-test|private-repo|secretvalue|api_key|Users/.test(keyword)));

const providerStatus = await request("/api/provider-status");
assert.equal(providerStatus.response.status, 200);
assert.equal(providerStatus.data.ok, true);
assert.ok(providerStatus.data.providers.length >= 60);
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "carbon_cli" && provider.lane === "tool_native_network" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "partnerstack" && provider.lane === "affiliate_backfill" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "flexoffers" && provider.lane === "affiliate_backfill" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "awin" && provider.lane === "affiliate_backfill" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "adsbind" && provider.lane === "ai_native_network" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "impact" && provider.lane === "high_value_affiliate" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "coinzilla" && provider.lane === "crypto_web3_network" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "informatechtarget" && provider.lane === "b2b_intent_network" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "outbrain" && provider.lane === "premium_native_network" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "pubmatic" && provider.lane === "publisher_ssp" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "exoclick" && provider.lane === "adult_network" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "trafee" && provider.lane === "dating_affiliate" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "maxbounty" && provider.lane === "performance_cpa" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "propellerads" && provider.lane === "push_pop_network" && provider.canServeNow === false));
assert.ok(providerStatus.data.providers.some((provider) => provider.key === "xbet_partners" && provider.lane === "gambling_affiliate" && provider.canServeNow === false));
assert.match(providerStatus.data.summary.note, /approval/);
assert.equal(providerStatus.data.summary.providerActivationOwner, "Barney/operator");
if (process.env.BUILDERPERKS_APPROVED_PARTNER_FEED_URLS) {
  assert.equal(providerStatus.data.summary.thirdPartyCanServeNow, 1);
  assert.equal(providerStatus.data.summary.credentialsConfigured, 1);
  assert.equal(providerStatus.data.summary.providerApproved, 1);
  assert.deepEqual(providerStatus.data.summary.fastestBlockerPacket.missingCredentialEnv, []);
  assert.ok(providerStatus.data.summary.approvedPartnerFeeds.some((feed) => (
    feed.providerKey === "approved_partner_feed_1"
      && feed.providerName === "Approved partner feed 1"
      && feed.urlConfigured === true
  )));
} else {
  assert.equal(providerStatus.data.summary.fastestBlockerPacket.missingCredentialEnv[0], "BUILDERPERKS_APPROVED_PARTNER_FEED_URLS");
}
assert.match(providerStatus.data.summary.fastestBlockerPacket.nextAction, /BUILDERPERKS_APPROVED_PARTNER_FEED_URLS/);
assert.ok(providerStatus.data.summary.priorityActivationPackets.some((packet) => (
  packet.providerKey === "carbon_cli"
    && packet.missingCredentialEnv.includes("BUILDERPERKS_CARBON_CLI_SDK_KEY")
    && packet.missingApprovalEnv.includes("BUILDERPERKS_PROVIDER_APPROVED_CARBON_CLI")
    && packet.owner === "Barney/operator"
)));
assert.ok(providerStatus.data.activationPackets.some((packet) => (
  packet.providerKey === "ethicalads"
    && packet.missingCredentialEnv.includes("BUILDERPERKS_ETHICALADS_PUBLISHER_ID")
    && packet.missingApprovalEnv.includes("BUILDERPERKS_PROVIDER_APPROVED_ETHICALADS")
)));
assert.ok(providerStatus.data.activationPackets.some((packet) => (
  packet.providerKey === "xbet_partners"
    && packet.restrictedLaneDefault === "blocked_by_default"
)));

const financeDefault = await request(`${streamBase}&surface=terminal&context=finance%20tax%20banking&keywords=finance,banking,credit${partnerFeedFixtureBlock}&format=statusline`);
assert.equal(financeDefault.response.status, 200);
assert.equal(financeDefault.data.ok, true);
assert.notEqual(financeDefault.data.ad?.placementId, financePlacementId);

const financeOptIn = await request(`${streamBase}&surface=terminal&context=finance%20tax%20banking&keywords=finance,banking,credit${partnerFeedFixtureBlock}&allowedCategories=finance&valueMode=high_value&format=statusline`);
assert.equal(financeOptIn.response.status, 200);
assert.equal(financeOptIn.data.ok, true);
assert.equal(financeOptIn.data.ad.placementId, financePlacementId);
assert.equal(financeOptIn.data.marketplace.valueMode, "high_value");
assert.ok(financeOptIn.data.marketplace.providerLanes.includes("regulated_partner"));
assert.ok(financeOptIn.data.revenueShare.estimatedPublisherEarningsUsd > streamed.data.revenueShare.estimatedPublisherEarningsUsd);

const cryptoDefault = await request(`${streamBase}&surface=terminal&context=crypto%20web3%20wallet&keywords=crypto,web3,blockchain,wallet${partnerFeedFixtureBlock}&format=statusline`);
assert.equal(cryptoDefault.response.status, 200);
assert.equal(cryptoDefault.data.ok, true);
assert.notEqual(cryptoDefault.data.ad?.placementId, cryptoPlacementId);

const cryptoOptIn = await request(`${streamBase}&surface=terminal&context=crypto%20web3%20wallet&keywords=crypto,web3,blockchain,wallet${partnerFeedFixtureBlock}&allowedCategories=crypto&valueMode=high_value&format=statusline`);
assert.equal(cryptoOptIn.response.status, 200);
assert.equal(cryptoOptIn.data.ok, true);
assert.equal(cryptoOptIn.data.ad.placementId, cryptoPlacementId);
assert.ok(cryptoOptIn.data.marketplace.providerLanes.includes("restricted_partner"));

const blockedDatabase = await request(`${streamBase}&surface=terminal&context=postgres&keywords=postgres${partnerFeedFixtureBlock}&blockedCategories=database&format=statusline`);
assert.equal(blockedDatabase.response.status, 200);
assert.equal(blockedDatabase.data.ok, true);
assert.notEqual(blockedDatabase.data.ad?.placementId, "seed-neon");

const stats = await request("/api/stats");
assert.equal(stats.response.status, 200);
assert.ok(stats.data.stats.relevanceEvents >= 3);
assert.ok(stats.data.stats.proofSessions >= 1);
assert.ok(stats.data.stats.verifiedWorkflowSessions >= 1);
assert.ok(stats.data.stats.verified.workflowSessions >= 1);
assert.ok(stats.data.stats.raw.impressions >= 1);
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

const unauthorizedReport = await request(`/api/report?placementId=${encodeURIComponent(placementId)}`);
assert.equal(unauthorizedReport.response.status, 401);
assert.equal(unauthorizedReport.data.ok, false);

const missingReport = await request("/api/report", { headers: { "x-admin-key": adminKey } });
assert.equal(missingReport.response.status, 400);
assert.equal(missingReport.data.ok, false);

const report = await request(`/api/report?placementId=${encodeURIComponent(placementId)}`, {
  headers: { "x-admin-key": adminKey }
});
assert.equal(report.response.status, 200);
assert.equal(report.data.ok, true);
assert.equal(report.data.report.placement.id, placementId);
assert.equal(report.data.report.metrics.clicks, 1);
assert.equal(report.data.report.metrics.claims, 1);
assert.equal(report.data.report.metrics.needThis, 1);
assert.equal(report.data.report.metrics.notRelevant, 1);
assert.equal(report.data.report.metrics.hideCategory, 1);
assert.equal(report.data.report.metrics.impressions, 1);
assert.equal(report.data.report.privacy.contextStored, false);
assert.match(report.data.report.privacy.note, /does not store full prompts/);
assert.match(report.data.report.pilotReadout, /matched impressions/);
assert.ok(report.data.report.breakdowns.publisherSurfaces.some((item) => item.value === "terminal"));
assert.ok(report.data.report.breakdowns.keywords.some((item) => item.value === "postgres"));

console.log(`api smoke ok: ${placementId}, ${financePlacementId}, and ${cryptoPlacementId} approved, tracked, relevance-scored, gated, opted in, and report endpoint verified`);
