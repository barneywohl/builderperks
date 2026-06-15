import type { Config } from "@netlify/functions";
import { json } from "./_data.mjs";
import { providerStatuses } from "./_providers.mjs";
import { approvedPartnerFeedSources, approvedPartnerFeedUrlEnvName } from "./_partner_feeds.mjs";

const PROVIDER_ACTIVATION_OWNER = "Barney/operator";

function providerActivationPackets(providers: ReturnType<typeof providerStatuses>) {
  return providers.map((provider) => {
    const missingCredentialEnv = provider.requiredEnv.filter((name) => !provider.configuredEnv.includes(name));
    const missingApprovalEnv = provider.providerApproved ? [] : [provider.approvalEnv];
    const isRestrictedLane = [
      "adult_network",
      "dating_affiliate",
      "gambling_affiliate",
      "crypto_web3_network",
      "performance_cpa",
      "push_pop_network"
    ].includes(provider.lane);

    return {
      providerKey: provider.key,
      providerName: provider.name,
      lane: provider.lane,
      canServeNow: provider.canServeNow,
      owner: PROVIDER_ACTIVATION_OWNER,
      missingCredentialEnv,
      missingApprovalEnv,
      accountOrApprovalStep: provider.providerApproved
        ? "Provider approval flag is configured; verify the provider credential/env values are present and valid."
        : `Get written approval from ${provider.name} for BuilderPerks terminal/IDE/native inventory before setting ${provider.approvalEnv}=1.`,
      nextAction: provider.canServeNow
        ? "Provider is configured and approved. Verify at least one approved_partner placement/feed item can render through /api/ad-stream."
        : `Configure ${missingCredentialEnv.length ? missingCredentialEnv.join(", ") : "provider credentials"} and ${missingApprovalEnv.join(", ") || provider.approvalEnv} only after provider approval.`,
      feedAction: provider.requiredEnv.some((name) => name.endsWith("_URL"))
        ? "If the provider supplied a JSON offer endpoint, set the URL env to a feed whose items include company/advertiser, headline/title, body/description, and url/clickUrl."
        : null,
      restrictedLaneDefault: isRestrictedLane ? "blocked_by_default" : "not_restricted",
      sourceUrl: provider.sourceUrl
    };
  });
}

export default async (req: Request) => {
  if (req.method !== "GET") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const providers = providerStatuses();
  const canServeNow = providers.filter((provider) => provider.canServeNow);
  const credentialsConfigured = providers.filter((provider) => provider.credentialsConfigured);
  const approved = providers.filter((provider) => provider.providerApproved);
  const missingCredentials = providers.filter((provider) => !provider.credentialsConfigured);
  const missingApproval = providers.filter((provider) => provider.credentialsConfigured && !provider.providerApproved);
  const approvedPartnerFeeds = approvedPartnerFeedSources();
  const activationPackets = providerActivationPackets(providers);
  const priorityActivationPackets = activationPackets.filter((packet) => [
    "ethicalads",
    "carbon_cli",
    "carbon_ads",
    "buysellads_publisher",
    "partnerstack",
    "adsbind",
    "adbutler",
    "kevel"
  ].includes(packet.providerKey));
  const byLane = providers.reduce<Record<string, {
    total: number;
    canServeNow: number;
    credentialsConfigured: number;
    providerApproved: number;
  }>>((acc, provider) => {
    acc[provider.lane] ??= { total: 0, canServeNow: 0, credentialsConfigured: 0, providerApproved: 0 };
    acc[provider.lane].total += 1;
    if (provider.canServeNow) acc[provider.lane].canServeNow += 1;
    if (provider.credentialsConfigured) acc[provider.lane].credentialsConfigured += 1;
    if (provider.providerApproved) acc[provider.lane].providerApproved += 1;
    return acc;
  }, {});

  return json({
    ok: true,
    providers,
    workingDemandSources: [
      {
        key: "builderperks_seed_direct",
        name: "BuilderPerks seed/direct approved placements",
        canServeNow: true,
        status: "serving",
        note: "This is the live cold-start demand source used by terminal/status-line streaming until third-party provider credentials and approvals are configured."
      }
    ],
    summary: {
      totalMappedProviders: providers.length,
      thirdPartyCanServeNow: canServeNow.length,
      credentialsConfigured: credentialsConfigured.length,
      providerApproved: approved.length,
      missingCredentials: missingCredentials.length,
      missingApproval: missingApproval.length,
      providerActivationOwner: PROVIDER_ACTIVATION_OWNER,
      fastestBlockerPacket: {
        lane: "approved_partner_json_feed",
        owner: PROVIDER_ACTIVATION_OWNER,
        missingCredentialEnv: approvedPartnerFeeds.length ? [] : [approvedPartnerFeedUrlEnvName],
        missingApprovalEnv: [],
        accountOrApprovalStep: "Obtain an approved third-party or partner-owned JSON offer feed for BuilderPerks terminal/IDE/native inventory.",
        nextAction: `Set ${approvedPartnerFeedUrlEnvName}=https://... to an approved JSON feed, then verify /api/provider-status lists it under summary.approvedPartnerFeeds and /api/ad-stream returns demand.source=approved_partner.`,
        feedItemRequiredFields: ["company or advertiser", "headline or title", "body or description", "url or clickUrl"],
        note: "This is the fastest compliant lane because it does not pretend a mapped ad network is live before credentials and inventory approval exist."
      },
      priorityActivationPackets,
      servingNow: [
        "BuilderPerks seed/direct approved placements",
        ...canServeNow.map((provider) => provider.name)
      ],
      configured: canServeNow.map((provider) => provider.name),
      pending: providers.filter((provider) => !provider.canServeNow).map((provider) => provider.name),
      byLane,
      nextActivationSteps: [
        "Add provider credentials as Netlify env vars listed in each provider.requiredEnv.",
        "Set the matching BUILDERPERKS_PROVIDER_APPROVED_<PROVIDER_KEY>=1 env only after the provider approves terminal/IDE/native inventory.",
        `For third-party JSON offer feeds, configure ${approvedPartnerFeedUrlEnvName} or a serve-ready provider URL env. Feed items must include company/advertiser, headline/title, body/description, and url/clickUrl.`,
        "Approve or create a placement with demandSource=approved_partner and demandPartner matching the provider before serving third-party demand.",
        "Keep restricted lanes such as adult, gambling, sweepstakes, dating, push/pop, and crypto opt-in only."
      ],
      approvedPartnerFeeds: approvedPartnerFeeds.map((source) => ({
        providerKey: source.providerKey,
        providerName: source.providerName,
        urlConfigured: true
      })),
      note: "Mapped means BuilderPerks knows how to track readiness. Working means credentialsConfigured plus provider approval, plus placement-level approved_partner demand before third-party ads are served."
    },
    activationPackets
  });
};

export const config: Config = {
  path: "/api/provider-status"
};
