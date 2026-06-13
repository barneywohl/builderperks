# BuilderPerks Acquisition Log

## 2026-06-12 10:35 ET

### Public Funnel

- Live product: https://builderperks.netlify.app/
- Public GitHub repo: https://github.com/barneywohl/builderperks
- Beta release ZIP: https://github.com/barneywohl/builderperks/releases/tag/v0.1.0-beta
- Builder feedback issue: https://github.com/barneywohl/builderperks/issues/2
- Advertiser pilot issue: https://github.com/barneywohl/builderperks/issues/1
- X launch post: https://x.com/BarneyWohl/status/2065442749998916003

### Advertiser Outreach Sent

Sent from `barneywohl@gmail.com` via authenticated Gmail browser session.

| Company | Contact | Channel | Ask | Status |
| --- | --- | --- | --- | --- |
| CodeRabbit | contact@coderabbit.ai | Gmail | $250 / 48-hour advertiser pilot + mock placement | sent |
| Helicone | cole@helicone.ai | Gmail | $250 / 48-hour advertiser pilot + mock placement | sent |
| Firecrawl / Mendable | caleb@mendable.ai | Gmail | $250 / 48-hour advertiser pilot + mock placement | sent |

### Builder Outreach

- Public X post asks for 10 AI-heavy builders to try one work session and report `useful / neutral / annoying`.
- GitHub issue #2 is the feedback collection point.
- X search for live `Claude Code` builder threads was checked, but the first result set was noisy and not relevant enough for replies. No low-quality replies were sent.

### Live Product Stats At Log Time

```json
{
  "approvedPlacements": 3,
  "pendingPlacements": 1,
  "clicks": 0,
  "claims": 2,
  "feedback": 2,
  "builderFeedback": 2,
  "advertiserFeedback": 0
}
```

### Next Moves

- Monitor Gmail replies and GitHub issues.
- Recheck product stats for new clicks, claims, and feedback.
- If X post gets impressions but no conversion, reply only to highly relevant AI-builder posts with the GitHub issue as the CTA.
- If advertiser replies arrive, create a mock placement and route payment through the live buy form or Stripe link once configured.

## 2026-06-12 12:35 ET

Implemented the first complaint-driven product hardening pass:

- Added extension dismiss button.
- Added pause-for-today control.
- Added persistent enable/disable setting.
- Added daily card cap, defaulting to 3.
- Added public trust section explaining one-card, no advertiser scripts, no hidden retargeting posture.

Reason: developer ad complaints cluster around obstruction, tracking creep, and lack of control.

## 2026-06-12 14:10 ET

Shipped the breakout-feature pass and live payment wiring:

- Upgraded the extension beta to `0.2.0`.
- Added local contextual offer matching so cards are selected against the current AI-build page context instead of random rotation.
- Added a visible match reason on cards, for example `Matched locally to database work`.
- Wired live Stripe Checkout for advertiser buy requests.
- Created the live Stripe webhook for `checkout.session.completed`.
- Verified the webhook marks a placement `paid`.
- Rejected all runtime verification placements after testing so they do not enter the public queue.

Readiness change: BuilderPerks can now pitch `one locally matched devtool perk during AI wait time` and can accept a live advertiser checkout.

## 2026-06-12 16:05 ET

Shipped the launch-readiness attribution fix:

- Production deploy id: `6a2c6559d242d7b1b953139d`.
- GitHub commit: `f63ab5c` (`Add placement attribution to tracked redirects`).
- Tracked advertiser redirects now append `placementId` and `source` to the destination URL.
- Verified production redirect:
  - `seed-neon` -> `https://neon.tech/?placementId=seed-neon&source=prod-smoke`
  - `seed-railway` -> `https://railway.app/?placementId=seed-railway&source=prod-post-push-smoke`
- Local API smoke passed for placement creation, admin approval, tracking redirect, claim capture, and placement reporting.
- Production screenshot: `/Volumes/X10/clawd/shared/status/builderperks-prod-verified-20260612-1606.png`
- Local screenshot: `/Volumes/X10/clawd/shared/status/builderperks-local-verified-20260612-1604.png`

Live stats after two controlled production tracking checks:

```json
{
  "approvedPlacements": 2,
  "pendingPlacements": 0,
  "clicks": 6,
  "claims": 0,
  "feedback": 2,
  "builderFeedback": 2,
  "advertiserFeedback": 0
}
```

Gmail reply check:

- Searched authenticated Gmail for replies from `contact@coderabbit.ai`, `cole@helicone.ai`, and `caleb@mendable.ai` newer than 2026-06-12.
- Result: no matching reply threads.
- Evidence screenshot: `/Volumes/X10/clawd/shared/status/builderperks-gmail-reply-search-20260612-1607.png`

Ads API decision:

- Do not integrate an ads API yet.
- Current bottleneck is conversion/acquisition: clicks exist, claims are still `0`, and no advertiser replies are present.
- Keep the first-customer path manual: targeted outbound, manual advertiser pilots, Stripe Checkout/payment links, manual approval, and tracked redirects.
- Revisit ads API/auction machinery only after paying advertiser demand or manual operations become a bottleneck.

Mission:

- Durable mission active: `mission-20260612-195820-9f7dab`.
- Broker tasks: scope in progress with `ruflo_opus_1`; build, verify, review, and closeout are queued behind it.

## 2026-06-12 16:36 ET

First-customer goal set and advertiser acquisition push started.

Goal artifact:

- `docs/FIRST_CUSTOMER_GOAL_20260612.md`

Durable mission:

- `mission-20260612-203219-43ec7a`
- Goal: close one real advertiser/customer pilot using the shipped product; send targeted outbound; monitor replies; create/approve placement and route checkout if an advertiser commits; do not build an ads API unless demand proves it.

Outbound sent from authenticated Gmail:

| Company | Recipient | Ask | Evidence |
| --- | --- | --- | --- |
| Railway | `team@railway.com` | $250 / 48-hour Railway credits pilot | `/Volumes/X10/clawd/shared/status/builderperks-gmail-railway-sent-20260612-1634.png` |
| Langfuse | `contact@langfuse.com` | $250 / 48-hour Langfuse AI-builder pilot | `/Volumes/X10/clawd/shared/status/builderperks-gmail-langfuse-sent-20260612-1636.png` |
| CodeRabbit | `sales@coderabbit.ai` | $250 / 48-hour AI code review pilot | `/Volumes/X10/clawd/shared/status/builderperks-gmail-coderabbit-sales-sent-20260612-1636.png` |
| Helicone | `cole@helicone.ai` | $250 / 48-hour LLM observability pilot follow-up | `/Volumes/X10/clawd/shared/status/builderperks-gmail-helicone-followup-sent-20260612-1636.png` |
| Firecrawl / Mendable | `caleb@mendable.ai` | $250 / 48-hour scraping/extract API pilot follow-up | `/Volumes/X10/clawd/shared/status/builderperks-gmail-firecrawl-followup-sent-20260612-1636.png` |

Contact source notes:

- Railway sales email from Railway support docs: `https://docs.railway.com/platform/support`
- Langfuse email from Langfuse imprint: `https://langfuse.com/imprint/imprint`
- CodeRabbit sales/support email from public CodeRabbit contact/Atlassian listings: `https://coderabbit.ai/contact-us` and `https://marketplace.atlassian.com/vendors/1225092/coderabbit`
- Helicone and Firecrawl/Mendable recipients came from the existing 2026-06-12 Gmail outreach log.

Next checkpoint:

- Monitor Gmail for replies every 30-60 minutes during the launch window.
- If any advertiser says yes, immediately create a matching placement, mark it pending/approved depending on content safety, and route them to checkout.
- If no advertiser replies by next checkpoint, use daily.dev/GitHub/X-authenticated channels for builder-side proof, because claims remain the bottleneck.

## 2026-06-12 16:50 ET

Decision on API / paying users for ads:

- Do not build or connect a full ads API yet.
- Do not pay users for fake ad views or forced clicks; that would create low-quality traffic and weaken advertiser trust.
- Do add lightweight supply proof now: a public `Founding builders` section that recruits real AI-heavy builders and explains future revenue share only after real advertiser dollars exist.

Shipped product change:

- Added `#builders` section to the live page.
- Copy explicitly says: real builders, no paid fake clicks, revenue share only after advertiser revenue, and advertisers see clicks/claims/feedback.
- Commit: `c40c34c` (`Add founding builder supply proof section`)

Reason:

- Advertisers need to see supply, but the earliest believable supply is real opted-in builder testers and claim intent, not an API or payout ledger.
- The existing `/api/placements`, `/api/track`, `/api/claims`, `/api/feedback`, and `/api/stats` endpoints are enough for the first paid pilot.

## 2026-06-12 17:02 ET

Built the next lightweight supply-onboarding layer:

- Added `/api/builders` Netlify function for founding-builder signups.
- Added `builderSignups` to `/api/stats`.
- Added founding-builder signup form to the live-page source.
- Local verification passed:
  - `npm run build`
  - `npm run check`
  - `npm run smoke`
  - local `POST /api/builders`
  - local `GET /api/stats` showing `builderSignups`
- Commit: `4302d80` (`Add founding builder signup API`)

Production deploy blocker:

- Netlify deploy `6a2c73667730e19707080cb1` failed before build execution.
- Netlify error: `Skipped due to account credit usage exceeded`.
- Current production remains on the prior working deploy until Netlify account credits/billing are fixed.

Fallback while blocked:

- Continue advertiser outreach with the existing live product.
- Use the existing feedback form/GitHub issue flow for builder proof until `/api/builders` can deploy.
- Once Netlify credits are fixed, redeploy commit `4302d80`.

## 2026-06-12 17:07 ET

Clarified founder requirement: build an API that lets terminal/IDE/product surfaces run BuilderPerks ads so the supply side can onboard first, accrue estimated earnings, and create a stronger advertiser story.

Built locally and pushed:

- `/api/publishers`
  - Registers a publisher/integration surface.
  - Returns publisher id and tracks active publisher surfaces.
- `/api/ad-stream`
  - Accepts `publisherId`, `surface`, and `context`.
  - Selects an approved placement.
  - Records an impression.
  - Returns a labeled sponsored card plus tracked `clickUrl`.
  - Returns estimated unpaid publisher earnings.
- `/api/stats`
  - Now includes `publishers`, `adImpressions`, and `estimatedPublisherEarningsUsd`.
- Live-page source now includes an `Ad API` section with publisher registration form and example terminal/IDE request.

Verification:

- `npm run build` passed.
- `npm run check` passed.
- `npm run smoke` passed.
- `npm run smoke:api` passed, including publisher registration and ad-stream delivery.
- Local browser evidence: `/Volumes/X10/clawd/shared/status/builderperks-ad-stream-local-20260612-1706.png`

Commit:

- `e7327f1` (`Add supply side ad stream API`)

Production deploy status:

- Still blocked by Netlify account credit usage exceeded.
- Code is pushed and ready; production cannot receive the new API until Netlify credits/billing are fixed.

Important safety/product line:

- This records estimated unpaid publisher earnings only.
- No automatic payouts happen until advertiser revenue exists and payout rails are explicitly approved.

## 2026-06-12 17:15 ET

Netlify upgraded and supply-side ad stream API deployed live.

Production deploy:

- Deploy id: `6a2c76954096c90a4bde26de`
- URL: `https://builderperks.netlify.app/`

Live verification:

- `GET /api/stats` before API smoke showed:
  - `publishers: 0`
  - `adImpressions: 0`
  - `estimatedPublisherEarningsUsd: 0`
- `POST /api/publishers` created live smoke publisher:
  - `pub-mqbfdfwg-76b3d769`
- `GET /api/ad-stream?publisherId=pub-mqbfdfwg-76b3d769&surface=terminal&context=deploying%20an%20AI%20app`
  - returned Railway sponsored card
  - recorded impression `imp-mqbfdgqh-c1e2a008`
  - returned tracked `clickUrl`
  - returned estimated unpaid publisher earnings `$0.02`
- `GET /api/stats` after API smoke showed:
  - `publishers: 1`
  - `adImpressions: 1`
  - `estimatedPublisherEarningsUsd: 0.02`

Evidence:

- `/Volumes/X10/clawd/shared/status/builderperks-ad-stream-prod-20260612-1715.png`

Status:

- The terminal/IDE/product ad-stream API is now live.
- Real payouts remain disabled/estimated until advertiser revenue and payout rails are approved.

Ad-network reality check:

- Carbon Ads is relevant for developer audiences, but it is a curated network for hand-picked tech/design publishers, not an instant backfill API for a new terminal/IDE ad surface.
  - Source: `https://www.carbonads.net/`
  - Publisher criteria include relevance, monthly page views, active maintenance, current network capacity, and compliance with placement/exclusivity requirements: `https://www.carbonads.net/faq`
- EthicalAds is also developer-focused, but publishers apply and it explicitly seeks developer-focused sites with substantial traffic.
  - Source: `https://www.ethicalads.io/publisher-guide/`
  - Their client docs say you need to become a publisher before configuring a site: `https://ethical-ad-client.readthedocs.io/`
- Google AdSense-style monetization is unsafe for this exact idea if framed as paying users to view/click ads. Google’s policy prohibits compensating users for viewing ads or performing searches except for specific rewarded inventory contexts.
  - Source: `https://support.google.com/adsense/answer/48182`

Conclusion:

- Do not rely on generic ad-network backfill as the first step.
- The correct first product primitive is our own supply-side API (`/api/publishers`, `/api/ad-stream`) with estimated unpaid earnings.
- Once we have real publisher surfaces and clean usage, approach Carbon/EthicalAds/BuySellAds as a partner or advertiser-demand source rather than assuming instant API monetization.

## 2026-06-12 18:25 ET

Ads integration access requests sent after live supply-side API deployment.

Context:

- Jake explicitly asked to pursue external ad API/access so BuilderPerks can backfill developer inventory until direct advertisers buy placements.
- The live BuilderPerks API is already able to register publisher surfaces and serve labeled sponsored cards with tracked impressions/clicks.
- Real payouts remain disabled; current publisher earnings are estimated/unpaid until advertiser revenue and payout rails are approved.

Outbound requests:

| Partner | Contact | Ask | Evidence |
| --- | --- | --- | --- |
| BuySellAds | `support@buysellads.com` | Ad Serving API access, Carbon publisher review, or pilot partnership for developer-native terminal/IDE inventory. | `/Volumes/X10/clawd/shared/status/builderperks-ads-api-bsa-api-access-sent-20260612-1825.png` |
| Carbon Ads | `support@carbonads.net` | Carbon publisher/API pilot for terminal and IDE developer inventory. | `/Volumes/X10/clawd/shared/status/builderperks-ads-api-carbon-publisher-access-sent-20260612-1825.png` |
| EthicalAds | `ads@ethicalads.io` | Publisher/API fit for privacy-conscious terminal and IDE developer inventory. | `/Volumes/X10/clawd/shared/status/builderperks-ads-api-ethicalads-access-sent-20260612-1825.png` |
| AdButler | `hello@adbutler.com` | API/trial access for native ad-server infrastructure and reporting. | `/Volumes/X10/clawd/shared/status/builderperks-ads-api-adbutler-api-access-sent-20260612-1825.png` |
| Kevel | `support@kevel.com` | API access or pilot/trial for native ad decisioning, campaign management, and reporting. | `/Volumes/X10/clawd/shared/status/builderperks-ads-api-kevel-api-access-sent-20260612-1825.png` |

Status:

- External ad backfill/API access is now in motion.
- BuilderPerks should keep using its own direct placement feed until one of these partners approves access or provides a compliant pilot path.
- Avoid positioning this as paying users for ad clicks/views. The safe positioning is publisher revenue share from compliant sponsored placements.

Next:

- Monitor Gmail replies from BuySellAds, Carbon, EthicalAds, AdButler, and Kevel.
- If BuySellAds/Carbon or EthicalAds accepts, wire their API/placement approval path into `/api/ad-stream`.
- If AdButler or Kevel responds first, use them as campaign/ad-server infrastructure while continuing direct advertiser sales.
- Continue recruiting publisher surfaces so the partner replies have real inventory proof behind them.

## 2026-06-12 18:32 ET

Post-restart continuation checkpoint.

Verified state:

- Repo was intact with latest pushed commit `a57df11`.
- Production API responded at `https://builderperks.netlify.app/api/stats`.
- Current live stats:
  - `approvedPlacements: 2`
  - `clicks: 6`
  - `claims: 0`
  - `publishers: 1`
  - `adImpressions: 2`
  - `estimatedPublisherEarningsUsd: 0.04`
- Gmail search for replies from BuySellAds, Carbon, EthicalAds, AdButler, and Kevel since 2026-06-12 returned no matches.

Product hardening shipped next:

- Added a clearer publisher API quickstart to the live page.
- Added immediate post-registration curl example using the generated publisher id.
- Added live dashboard stats for publisher count and estimated unpaid publisher earnings.
- Added README publisher quickstart so GitHub visitors can self-serve the API flow.

Verification:

- `npm run build` passed.
- `npm run check` passed.
- `npm run smoke` passed.
- `npm run smoke:api` was not run locally because `netlify dev` failed after restart with Netlify CLI unauthorized. Production API was verified directly instead.

## 2026-06-12 21:38 ET

EthicalAds replied to the publisher/API fit request.

Evidence:

- `/Volumes/X10/clawd/shared/status/builderperks-ethicalads-reply-20260612-2138.png`

Summary:

- David Fischer said EthicalAds is already working on pilots with a few LLM-based publishers.
- He understood the BuilderPerks direction as Claude Code status line or similar surfaces showing ads to users with a publisher revenue-share model.
- He asked whether BuilderPerks is looking to EthicalAds for demand-side advertisers.
- He flagged targeting as the main open question.
- He said broad programming language/framework/project keywords related to the prompt/project are useful and do not require personal data.
- He mentioned prompt embeddings as another possible route, but broad keywords are the cleaner first integration path.

Immediate product response:

- Add optional `keywords` support to `/api/ad-stream`.
- Store only sanitized short targeting keywords on impressions.
- Return a targeting note telling publishers not to send personal data or full prompts.
- Return category hints from broad placement/keyword matches.
- Return `render.statusLine` for Claude Code/status-line and terminal-native publisher surfaces.
- Update the public API quickstart and README to show `keywords=typescript,react,postgres`.

Reply status:

- Reply sent after Jake provided directive keyword in Telegram.
- Evidence:
  - `/Volumes/X10/clawd/shared/status/builderperks-ethicalads-reply-compose-20260612-2215.png`
  - `/Volumes/X10/clawd/shared/status/builderperks-ethicalads-reply-sent-20260612-2215.png`
- Reply confirmed:
  - BuilderPerks is for Claude Code status-line style surfaces plus similar terminal, IDE, extension, and agent UIs.
  - EthicalAds is the desired demand-side advertiser partner.
  - Revenue share remains estimated/unpaid until approved advertiser revenue and payout rails are in place.
  - Broad keyword-only targeting is the preferred first pilot path.
  - `/api/ad-stream` now supports sanitized keywords, category hints, and `format=statusline`.
  - Asked whether the next step should be a short technical spec/sample traffic shape or booking David's calendar.

## 2026-06-12 22:48 ET

First narrow growth outbound wave sent after Jake provided directive keyword.

Decision:

- Do not broad-launch Product Hunt, Hacker News, or daily.dev yet.
- Broad launch remains gated on real proof: 5 publisher surfaces, 25 impressions, 5 feedback notes, 1 claim or advertiser pilot signal, EthicalAds next step, and demo/proof packet.
- Focus this wave on direct advertiser pilots and one status-line publisher prospect.

Sent:

| Segment | Recipient | Ask | Evidence |
| --- | --- | --- | --- |
| Advertiser | `sales@posthog.com` | $250 manually approved 48-hour pilot for analytics/events build-moment intent. | `/Volumes/X10/clawd/shared/status/builderperks-growth-posthog-advertiser-pilot-sent-20260612-2248.png` |
| Advertiser | `support@clerk.com` | $250 manually approved 48-hour pilot for auth-category build-moment offers. | `/Volumes/X10/clawd/shared/status/builderperks-growth-clerk-advertiser-pilot-sent-20260612-2248.png` |
| Publisher feedback | `ddoliveira@uwaterloo.ca` | One-session feedback on privacy-safe sponsored Claude Code/status-line line. | `/Volumes/X10/clawd/shared/status/builderperks-growth-daniel-statusline-publisher-sent-20260612-2248.png` |
| Advertiser | `help@firecrawl.com` | $250 manually approved 48-hour pilot for AI agent builder traffic. | `/Volumes/X10/clawd/shared/status/builderperks-growth-firecrawl-advertiser-followup-sent-20260612-2248.png` |

Notes:

- Messaging emphasized build-moment intent, privacy-safe broad keywords, no full prompts/personal data, and a simple API that renders terminal/status-line/IDE/agent formats.
- This is a targeted proof-gathering wave, not a public launch.
- Next checkpoint should monitor Gmail for replies and pursue 6 more status-line/terminal/IDE publisher prospects.

## 2026-06-12 22:56 ET

Publisher onboarding hardening shipped locally for the next deploy.

Decision:

- Keep the publisher side simple enough for a terminal/status-line/IDE user to try in one command.
- Do not add a heavy SDK, dashboard dependency, prompt collection, wallet flow, or payout automation yet.
- The first adoption ask should be: register, install a tiny helper, set broad keywords, and run one labeled sponsored line.

Product changes:

- Added `/install-statusline.sh` for one-command helper installation.
- Added `/builderperks-statusline.sh` for terminal, IDE task, agent shell, and Claude Code status-line usage.
- Helper requires only `BUILDERPERKS_PUBLISHER_ID`.
- Helper accepts optional broad `BUILDERPERKS_KEYWORDS`.
- Helper fails quietly if the network or API is down so it does not break a terminal/status-line workflow.
- Updated live page and README copy around the simpler publisher flow.
- Updated post-registration success state to give the exact install/run commands for the new publisher id.

Verification:

- `bash -n web/public/builderperks-statusline.sh web/public/install-statusline.sh` passed.
- `npm run build` passed.
- `npm run check` passed.
- `npm run smoke` passed.
- Missing-publisher helper run exited `0` quietly.
