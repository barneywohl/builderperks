# BuilderPerks Ad API Research - 2026-06-12

## Question

What external ad API/network should BuilderPerks integrate so terminal/IDE/product surfaces can stream ads and earn money, giving us supply before direct advertisers commit?

## Recommendation

Do not start with Google/AdSense-style monetization or a generic programmatic feed. Start with our own supply-side API and pursue BuySellAds/Carbon as the best external partner path for developer-relevant demand.

Best path:

1. Use BuilderPerks `/api/publishers` and `/api/ad-stream` as the product-native integration layer.
2. Recruit terminal/IDE/extension/plugin publisher surfaces.
3. Track impressions, clicks, claims, and estimated unpaid earnings.
4. Approach BuySellAds/Carbon with evidence that we have developer-native supply.
5. Use AdButler or Kevel only if we need ad-server infrastructure before BuySellAds/Carbon is available.

## Category Value Strategy

Jake's key product insight is right: online ad value varies massively by category, and publishers should benefit when they intentionally opt into higher-value discovery. BuilderPerks should expose this as user-controlled category/value modes, not as a hidden feed.

Shipped primitive:

- `valueMode=passive|relevant|high_value`
- `allowedCategories=finance,legal,...` for explicit opt-in
- `blockedCategories=adult,gambling,...` for category-level blocks
- `marketplace.categoryProfiles` in `/api/ad-stream`, including value tier, estimated publisher revenue, provider lane, and compliance note
- Restricted and regulated categories are not default-eligible.

Category posture:

- Default developer categories: hosting, database, observability, testing, AI, auth, analytics.
- Regulated opt-in categories: finance, legal, health.
- Restricted opt-in categories: gambling, adult.

Provider posture:

- Developer categories should go first through direct advertisers, EthicalAds, BuySellAds/Carbon, and developer-native campaigns.
- Regulated categories require approved advertisers, disclosures, and partner support before any payout claims.
- Restricted categories require a separate compliance program and should not appear in default terminal/IDE workflows.

This preserves the 199x wedge: publishers control what they are willing to host, higher-value categories can carry higher estimated revenue share, and the system remains legible enough for serious ad partners to approve.

## Ranked Options

### 1. BuySellAds / Carbon Ads - best demand partner to pursue

Why:

- Carbon is developer/design focused and reaches technical audiences.
- BuySellAds has an Ad Serving API for custom UI flows and direct access to ad data.
- Carbon/BuySellAds is closer to the advertisers BuilderPerks wants: devtools, infra, design/dev products.

Limitations:

- Carbon is curated and not an instant fill API.
- Publisher acceptance likely requires credible supply and compliant placements.
- We should approach them with usage proof, not before.

Sources:

- `https://docs.buysellads.com/ad-serving-api`
- `https://www.carbonads.net/`
- `https://www.carbonads.net/faq`

### 2. EthicalAds - good values fit, but likely not first

Why:

- Developer-focused, privacy-first ad network.
- Their client fetches ads from a decision API, and public discussion indicates API/direct use is possible.

Limitations:

- Publisher guide says they seek developer-focused sites with meaningful traffic.
- Product Hunt / terminal/IDE supply probably needs proof before approval.

Sources:

- `https://www.ethicalads.io/publisher-guide/`
- `https://ethical-ad-client.readthedocs.io/`
- `https://github.com/readthedocs/ethical-ad-client`

### 3. AdButler - best generic ad-server if we self-sell demand

Why:

- API-first ad serving.
- Useful if BuilderPerks needs to manage campaigns, zones, targeting, reporting, and self-serve advertiser workflows.

Limitations:

- It is infrastructure, not guaranteed advertiser demand.
- It does not solve the marketplace cold start by itself.

Sources:

- `https://www.adbutler.com/api-ad-server/`
- `https://www.adbutler.com/native-ad-server/`

### 4. Kevel - powerful but likely too heavy right now

Why:

- Strong API ad infrastructure for custom native ad platforms.
- Good if BuilderPerks becomes a serious marketplace/ad product.

Limitations:

- More platform than we need before first repeatable demand.
- No automatic advertiser demand.

Sources:

- `https://www.kevel.com/blog/what-are-ad-apis`
- `https://www.kevel.com/blog/the-future-of-native-advertising-lies-in-server-side-integration`

### Avoid for now: Google AdSense / generic rewarded traffic

Why:

- The proposed model risks being treated as incentivized ad views/clicks.
- Google AdSense policy prohibits compensating users for viewing ads or performing searches except in specific rewarded inventory contexts.
- This could create invalid traffic risk before BuilderPerks has trust.

Source:

- `https://support.google.com/adsense/answer/48182`

## Product Decision

The best immediate API is BuilderPerks' own:

- `/api/publishers`
- `/api/ad-stream`
- `/api/track`
- `/api/claims`
- `/api/stats`

This gives us the integration surface and usage proof. External ad networks should be treated as demand partners or ad-server vendors after we can show real publisher supply.

## Cold-Start Demand Architecture

BuilderPerks should not represent third-party network ads as active until the network approves the inventory.
The compliant cold-start path is a transparent demand waterfall:

1. `builderperks_seed` placements keep the publisher experience functional while supply is tiny.
2. Manually approved `direct_advertiser` placements become the first paid demand source.
3. `approved_partner` demand is enabled only after EthicalAds, BuySellAds/Carbon, AdButler, or Kevel approves the placement and traffic shape.

The `/api/ad-stream` response now includes a `demand` object so publishers, advertisers, and partner reviewers can see whether an ad came from seed/direct demand or an approved partner.
This avoids fake arbitrage, incentivized ad-network traffic, or hidden third-party pass-through before approval.

## Next Actions

1. Fix Netlify account credit/billing blocker so the pushed API can deploy.
2. Recruit 5 terminal/IDE/plugin publishers with the API as the CTA.
3. Track real impressions/clicks/claims through BuilderPerks.
4. Email BuySellAds/Carbon with the new API proof and ask about a pilot/ad-serving partnership.
5. Keep payouts estimated/unpaid until advertiser revenue and payout rails are approved.

## 2026-06-13 Provider Backfill Update

Jake explicitly prioritized hooking up niche and general ad providers so BuilderPerks has credible demand lanes while user supply is still small.

Concrete update:

- Added `docs/AD_PROVIDER_BACKFILL_PLAN_20260613.md`.
- Expanded `/api/ad-stream` pending partner metadata from a generic list to explicit lanes:
  - EthicalAds
  - Carbon Ads
  - BuySellAds Publisher Solutions
  - BuySellAds Newsletter Network
  - AdButler
  - Kevel
- Added API smoke assertions so those pending provider lanes stay visible in demand metadata.

Decision:

- EthicalAds remains the warmest immediate partner path.
- Carbon/BuySellAds is the best developer-demand partner path once there is supply proof.
- BuySellAds Newsletter Network is an adjacent newsletter/digest backfill lane, not an in-product ad stream yet.
- AdButler and Kevel remain infrastructure options, not demand sources.

Do not mark any third-party provider as active until they approve the BuilderPerks inventory and integration terms.

## EthicalAds Response - 2026-06-12

David Fischer from EthicalAds replied positively. Key points:

- EthicalAds is already working on pilots with a few LLM-based publishers.
- The BuilderPerks use case appears directionally relevant: Claude Code status line or similar surfaces, ads shown in coding workflows, and revenue share with publishers.
- The main integration question is targeting.
- Their current similar pilots use broad programming keywords related to the prompt/project.
- They do not need personal data.
- An embedding-based approach was mentioned as another possibility, but broad keywords are the simpler first step.

Product implication:

- `/api/ad-stream` should support privacy-safe `keywords` such as `typescript,react,postgres`.
- BuilderPerks should not send full prompts or personal data to ad partners.
- Terminal/status-line publishers should be able to request `format=statusline` and render one ready-made sponsored line.
- BuilderPerks should return simple advertiser category hints from keywords and placement copy so demand partners can reason about targeting.
- The reply should confirm status-line/similar surfaces, demand-side need, revenue-share intent, and keyword-only targeting as the preferred pilot path.
