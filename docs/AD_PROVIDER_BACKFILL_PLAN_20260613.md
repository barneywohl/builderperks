# BuilderPerks Ad Provider Backfill Plan - 2026-06-13

## Goal

Give BuilderPerks credible ad demand lanes before direct advertiser volume is proven, without pretending that third-party network demand is already approved.

The product posture is:

1. Keep BuilderPerks seed/direct placements live so the builder/publisher workflow is testable.
2. Pursue developer-native demand partners first.
3. Treat generic ad-server platforms as infrastructure, not demand.
4. Expose partner status transparently in `/api/ad-stream`.
5. Do not route third-party ads until the provider has approved the inventory and terms.

## Provider Lanes

### Lane 1 - EthicalAds

Status: warmest near-term lane.

Why it fits:

- Developer-focused and privacy-oriented.
- Contextual matching aligns with BuilderPerks keyword-only targeting.
- Prior reply indicated LLM/status-line publisher pilots are directionally relevant.

Primary sources:

- `https://www.ethicalads.io/`
- `https://www.ethicalads.io/publishers/`
- `https://www.ethicalads.io/advertisers/`
- `https://ethical-ad-client.readthedocs.io/`

Next action:

- Send the EthicalAds reply/spec from `docs/ETHICALADS_REPLY_DRAFT_20260612.md`.
- Attach the live API example, privacy guardrails, and current metrics.
- Ask for the exact request fields and sample traffic shape needed for a pilot.

### Lane 2 - Carbon Ads / BuySellAds Developer Network

Status: strongest developer-demand partner once BuilderPerks has credible publisher supply.

Why it fits:

- Carbon is developer/designer focused and curated.
- BuySellAds operates publisher solutions and developer ad products.
- Best story once BuilderPerks can show terminal/IDE/plugin publisher inventory and real engagement.

Primary sources:

- `https://www.carbonads.net/`
- `https://www.carbonads.net/join`
- `https://www.carbonads.net/faq`
- `https://www.buysellads.com/publishers`
- `https://discover.buysellads.com/developer`

Next action:

- Prepare a BuySellAds/Carbon partner ask with:
  - live URL
  - publisher API docs
  - sample `/api/ad-stream` response
  - current traffic/activity metrics
  - statement that third-party demand will only run after approval.

### Lane 3 - BuySellAds Newsletter Network

Status: useful adjacent lane for newsletters and sponsor slots, not core in-product ads.

Why it fits:

- Explicitly positioned around filling unsold newsletter inventory.
- Useful if BuilderPerks launches a builder/devtool digest or partners with developer newsletters.

Primary source:

- `https://www.buysellads.com/newsletter-network`

Next action:

- Do not integrate into the in-app ad stream yet.
- Add to partner pipeline for newsletter/digest monetization or cross-promotion after initial user activity.

### Lane 4 - AdButler

Status: ad-server infrastructure option, not demand.

Why it fits:

- Useful if BuilderPerks self-sells direct pilots and needs campaign/zone/reporting infrastructure.

Current decision:

- Keep deferred until direct demand management is painful.
- Do not pitch as user acquisition or guaranteed fill.

### Lane 5 - Kevel

Status: powerful but too heavy until marketplace mechanics are validated.

Why it fits later:

- API-native ad serving for custom native ad platforms.

Current decision:

- Keep as future infrastructure candidate, not a near-term cold-start provider.

## What Shipped

Updated `/api/ad-stream` demand metadata so pending partner lanes are explicit:

- `EthicalAds`
- `Carbon Ads`
- `BuySellAds Publisher Solutions`
- `BuySellAds Newsletter Network`
- `AdButler`
- `Kevel`

Updated `web/scripts/api-smoke.mjs` so the pending partner metadata is regression-tested.

## Integration Readiness Layer - 2026-06-13 14:21 ET

Jake pushed to integrate every third party we can, because without real demand BuilderPerks cannot get customers or show enough real ads.

Shipped local integration scaffolding:

- Added `web/netlify/functions/_providers.mts`.
- Added `/api/provider-status`.
- Added provider readiness checks for:
  - EthicalAds: `BUILDERPERKS_ETHICALADS_PUBLISHER_ID`
  - BuySellAds / Carbon: `BUILDERPERKS_BSA_ADS_URL`
  - AdButler: `BUILDERPERKS_ADBUTLER_JSON_URL`
  - Kevel: `BUILDERPERKS_KEVEL_NETWORK_ID`, `BUILDERPERKS_KEVEL_SITE_ID`, `BUILDERPERKS_KEVEL_AD_TYPE_ID`
- `/api/ad-stream` now reports `configuredPartnerIntegrations` separately from approved active partner demand.

Decision:

- This is the right technical integration boundary now: once a provider approves BuilderPerks and supplies credentials or endpoint details, the product can show that provider as configured without changing the public flow.
- Configured provider does not equal active ad demand. A placement still must be explicitly approved as `approved_partner` before BuilderPerks represents it as active provider demand.
- Do not fake live third-party ads with generic tags or unsupported endpoints. That would make partner approval harder and could create invalid/incentivized inventory risk.

## Provider Recommendation Refresh - 2026-06-13 14:24 ET

Jake asked to research and find the provider, because BuilderPerks needs real ads for customers to see value.

Current best answer:

1. **Best demand partner to pursue first: EthicalAds.**
   - Reason: developer/privacy fit and we already have a warm reply.
   - Official docs show EthicalAds supports publisher IDs, text placements, manual loading, page-specific keywords, and publisher reporting.
   - Official publisher guide says publishers apply first, then set up the client, then request paid-ad approval; it also says unpaid ads can serve before paid approval.
   - This is the best business lane, but still approval-gated for paid demand.

2. **Best developer ad API to wire once approved: BuySellAds / Carbon.**
   - Reason: their Ad Serving API is explicitly for custom UI flows and direct ad data access.
   - Official docs show a JSON endpoint shape at `https://srv.buysellads.com/ads/{zonekey}.json`.
   - This is likely the best actual in-product ad API fit after they approve the inventory.

3. **Fastest technical JSON ad-server lane: AdButler.**
   - Reason: official JSON Ad API returns native ad data including `image_url`, `redirect_url`, tracking fields, and can be requested server-side.
   - Limitation: it is ad serving infrastructure, not demand. We still need campaigns/advertisers or an AdButler sales path.

4. **Most powerful custom marketplace infrastructure: Kevel.**
   - Reason: Decision API is designed for native/custom ad decisions and accepts placements and keywords.
   - Limitation: heavier setup; not the fastest customer/demand unlock.

5. **Avoid generic AdSense/rewarded-style networks for now.**
   - Reason: BuilderPerks must avoid looking like paid-to-watch or incentivized traffic. Developer trust and provider approval matter more than generic fill.

Practical decision:

- Keep BuilderPerks running locally and in production with seed/direct ads.
- Push EthicalAds warm thread first for paid demand approval.
- In parallel, ask BuySellAds/Carbon for a zone/API path for terminal/IDE/native developer inventory.
- Use AdButler only if we want to manage self-sold direct campaigns before BSA/EthicalAds approve us.
- Do not claim third-party live demand until provider approval and environment credentials exist.

Mac setup verification:

- Desktop launcher exists: `~/Desktop/BuilderPerks Test.command`.
- Browser launcher exists: `~/Desktop/Open BuilderPerks Extension Test Chrome.command`.
- Local config exists: `~/.builderperks/config.env`.
- Status-line helper exists: `~/.builderperks/statusline.sh`.
- `BUILDERPERKS_DEBUG=1 ~/.builderperks/statusline.sh` returned a real production Neon sponsored line.
- The dedicated Chrome test profile launched with `--load-extension=/Volumes/X10/clawd/projects/builderperks/extension` and opened Claude.

Sources checked:

- EthicalAds client docs: `https://ethical-ad-client.readthedocs.io/`
- EthicalAds publisher guide: `https://www.ethicalads.io/publisher-guide/`
- BuySellAds Ad Serving API: `https://docs.buysellads.com/ad-serving-api`
- AdButler JSON Ad API: `https://www.adbutler.com/help/article/json-ad-tag-api`
- Kevel Decision API: `https://dev.kevel.com/reference/request`

## Guardrails

- No external provider is marked active until approved.
- No provider demand is represented as live unless `placement.demandSource === "approved_partner"` and `placement.demandPartner` is set.
- No full prompts, personal data, private code, or hidden profiles are sent to providers.
- Publisher earnings remain `estimated_unpaid` until advertiser revenue and payout rails are approved.
- User acquisition can use provider conversations and partnership asks, but not fake inventory claims.

## Immediate Outreach Copy

### EthicalAds

Use `docs/ETHICALADS_REPLY_DRAFT_20260612.md` and add:

> We now expose partner status directly in `/api/ad-stream`: BuilderPerks seed/direct demand is separate from approved partner demand, and EthicalAds would only appear as active after your approval.

### Carbon / BuySellAds

Subject: BuilderPerks terminal/IDE developer inventory pilot

Hi,

BuilderPerks is testing a developer-native sponsored offer surface for Claude Code-style status lines, terminals, IDEs, browser extensions, and agent UIs.

The live API lets publishers register a surface, send broad programming keywords only, and render one labeled sponsored devtool offer. We track impressions, clicks, claims, and relevance actions like Need this / Not relevant / Hide category.

We are not looking to pass through unapproved network demand. We are looking for the right approved partner path for developer inventory once we have enough supply proof.

Live site: `https://builderperks.netlify.app/`
Sample stream endpoint: `https://builderperks.netlify.app/api/ad-stream?publisherId=pub_x&surface=terminal&context=deploying%20an%20AI%20app&keywords=typescript,react,postgres&format=statusline`

What would you need to evaluate a small pilot or ad-serving partnership?

Thanks,
Barney
