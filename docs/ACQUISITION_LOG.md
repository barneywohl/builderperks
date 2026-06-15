# BuilderPerks Acquisition Log

## 2026-06-15 14:45 ET

Authenticated outreach evidence lane connected for the hardening/build slice.

- Target/source/status fields remain anchored in `docs/GROWTH_SEND_CHECKLIST_20260613.md`.
- Public UI copy now requires every copied outreach ask to be sent only from an authenticated account and logged with target, channel, evidence path, follow-up, and next action.
- No external email, form, social post, or community reply was sent in this build pass.
- Next action: use an approved authenticated browser/account lane for the next send-capable pass, capture screenshot evidence for each actual send, and append the result here.

## 2026-06-15 13:20 ET

Third-party serving readiness rechecked after Jake request.

Production status:

- `/api/provider-status`: 78 mapped providers, 0 third-party providers can serve now, 0 configured credentials, 0 provider approvals.
- `/api/stats`: 70 impressions, 9 clicks, 0 claims, 9 publishers, 1 builder signup, 6 pending proof sessions, 0 verified proof/workflow sessions.
- Current live demand remains BuilderPerks seed/direct approved placements.

Activation artifact:

- `docs/THIRD_PARTY_SERVING_ACTIVATION_20260615.md`

Gmail response check:

- Authenticated Gmail browser lane is reachable through Clawd Chrome/CDP 18800 for `barneywohl@gmail.com`.
- Fresh relevant reply found from Cat Yu / Exa at 2026-06-15 11:52 ET.
- Exa declined paid placements as not part of their model, but offered API credits for testing.
- Evidence screenshot: `/Volumes/X10/clawd/shared/status/builderperks-gmail-exa-reply-20260615-1320.png`
- Drafted clean reply with real paragraph breaks: `docs/EXA_REPLY_DRAFT_20260615.md`
- No email was sent from this pass.

## 2026-06-13 04:36 ET

Expanded the growth target map beyond the first wave of obvious developer ad partners.

New artifact:

- `docs/GROWTH_TARGET_MATRIX_20260613.md`

Coverage added:

- Developer ad networks and demand partners.
- Newsletter ad marketplaces.
- Individual developer newsletters across backend, frontend, Python, AWS, SRE, API, React, JavaScript, and engineering leadership niches.
- Developer podcasts and media networks.
- AI-builder communities and rule-sensitive community feedback lanes.
- Direct advertiser categories for AI coding, observability, deploy, database, API/data, auth/payments, testing/security, and frontend/design-to-code.

Browser/account status:

- Real Chrome is currently running without remote debugging. To drive logged-in Gmail/forms programmatically, Chrome needs to be relaunched with debugging.
- Clawd Chrome crashed when opening Gmail. This is recorded as an automation blocker, not a reason to stop research or queue preparation.

Execution posture:

- Do not duplicate sends already logged for DEV, TLDR, Raycast, daily.dev, Cooper Press, Console.dev, EthicalAds, Carbon/BuySellAds, AdButler, Kevel, CodeRabbit, Helicone, Firecrawl, Railway, Langfuse, PostHog, Clerk, and Exa unless there is a concrete update.
- Use the new matrix for the next controlled outbound wave.
- Official contact/form paths only; no guessed emails or fake traction claims.

## 2026-06-13 12:42 ET

Converted the broad growth target matrix into a send checklist with per-target readiness status.

New artifact:

- `docs/GROWTH_SEND_CHECKLIST_20260613.md`

What changed:

- Split targets into `verified_official_path`, `queued_needs_source_check`, and `do_not_send_duplicate`.
- Added the missing events/conferences category.
- Confirmed several provider/newsletter/event paths by HTTP/source check.
- Downgraded stale or incomplete rows instead of treating them as send-ready:
  - Real Python sponsorship URL needs browser recheck.
  - Last Week in AWS sponsorship URL needs browser recheck.
  - Web Tools Weekly, Programming Digest, and React Digest candidate `/advertise` or `/sponsor` paths returned 404 and need corrected source paths.
  - API Developer Weekly, AI DevSummit, The AI Conference, AI Council, and NVIDIA GTC need final contact/form verification before outreach.

Browser/send status:

- Real Chrome remains unavailable for authenticated automation because it is running without remote debugging.
- Clawd Chrome is active but hung on a public Stack Overflow Ads page navigation during this pass; the stuck `agent-browser` command was killed.
- No new external sends are claimed from this pass. The checklist is now the authoritative queue for the next send-capable browser/account lane.

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

## 2026-06-13 03:39 ET

Conversion/onboarding pass shipped live.

Product change:

- Public hero now routes visitors by job: builder, advertiser, or publisher.
- Added a 60-second demo before install so builders can see the card and controls first.
- Advertiser pilot flow now accepts rough copy and frames the launch as an assisted, manually reviewed pilot.
- Publisher registration now includes surface presets and allowed topic presets.
- Public admin section is hidden from normal visitors.
- Netlify build is now self-contained for `web/` uploads by including the extension source inside the web package and keeping the ZIP builder independent of the system `zip` binary.

Deployment:

- Production deploy: `6a2d0793fef10a490e36ea15`
- Commit pushed: `8185c0c`
- Live URL: `https://builderperks.netlify.app`
- Evidence screenshot: `/Volumes/X10/clawd/shared/status/builderperks-conversion-pass-prod-desktop-20260613-0336.png`

Verification:

- `npm run check` passed.
- `npm run build` passed.
- `unzip -t public/builderperks-extension-beta.zip` passed.
- `npm run smoke` passed.
- `git diff --check` passed.
- Production HTML contains the new path router, 60-second demo, assisted pilot copy, and publisher presets.
- Production ZIP download passed `unzip -t`.
- Production API stats healthy: `3` publishers, `18` impressions, `$0.63` estimated publisher earnings.
- Netlify secret scan checked `103` files and found no matches.

## 2026-06-13 03:46 ET

Third narrow acquisition wave sent after Jake provided directive keyword.

Decision:

- Do not duplicate prior advertiser/provider sends.
- Focus on new developer-distribution and publisher-surface paths: DEV, TLDR, Raycast, and daily.dev.
- Use authenticated Gmail browser because Gmail API remains blocked by stale `invalid_grant`.

Sent:

| Segment | Target | Channel | Ask | Evidence |
| --- | --- | --- | --- | --- |
| Developer community / publisher-ad path | DEV, `partners@dev.to` | Gmail | Route BuilderPerks to DEV partnerships/ads for advertiser test or tutorial resource/perk line feedback. | `/Volumes/X10/clawd/shared/status/builderperks-growth-devto-partners-sent-20260613-0341.png` |
| Developer newsletter acquisition | TLDR, `sponsors@tldr.tech` | Gmail | Small sponsorship test in TLDR Dev / AI / DevOps to recruit real builder testers. | `/Volumes/X10/clawd/shared/status/builderperks-growth-tldr-sponsor-sent-20260613-0343.png` |
| Publisher surface / extension ecosystem | Raycast, `affiliates@raycast.com` | Gmail | Explore affiliate/perk partnership or extension README/support surface test. | `/Volumes/X10/clawd/shared/status/builderperks-growth-raycast-affiliates-sent-20260613-0344.png` |
| Developer discovery / ads route | daily.dev, `hi@daily.dev` | Gmail | Route to daily.dev Ads/business contact for a small builder-test acquisition campaign. | `/Volumes/X10/clawd/shared/status/builderperks-growth-dailydev-sent-20260613-0346.png` |

Notes:

- daily.dev advertiser onboarding page loaded but did not expose a usable form in browser automation, so the official contact inbox was used for routing.
- Frontdoor intake created follow-up mission `mission-20260613-073649-f4d5a0`; mission engine should own the next cycle.

Next:

- Monitor Gmail for replies from DEV, TLDR, Raycast, daily.dev, plus the previous outbound waves.
- If any channel replies with pricing or a next-step form, turn it into a small test decision packet before spending.
- If no replies, next best embedded action is direct OSS/template maintainer outreach, not another provider blast.

## 2026-06-13 03:52 ET

Setup and flow QA pass completed after Jake asked to ensure no bugs and easy setup.

Finding fixed:

- `npm run build` dirtied the tracked Chrome extension ZIP because the custom ZIP writer used the current timestamp.
- First deterministic fix still differed between local and Netlify because local used EDT and Netlify used UTC.
- Final fix writes ZIP DOS timestamps from UTC fields, so local and production builds now match byte-for-byte.

Deployment:

- Production deploy: `6a2d0bc0b1ed24e7e577eeec`
- Fix commits pushed: `4ce44eb`, `2923bad`
- Live URL: `https://builderperks.netlify.app`

Verification:

- `npm run check` passed.
- `npm run build` twice produced the same ZIP hash.
- `npm run smoke` passed.
- `unzip -t public/builderperks-extension-beta.zip` passed.
- Production HTML contains builder path, 60-second demo, download CTA, and publisher registration CTA.
- Production ZIP downloads and passes `unzip -t`.
- Production ZIP hash: `443a1959e91ccf06c58b60ee6d0b4ae21b530ae9a014ec6c0a4dd728e4228b74`.
- Production API stats healthy after QA: `4` publishers, `19` impressions, `$0.69` estimated publisher earnings.
- Publisher registration endpoint succeeded with active publisher `pub-mqc1vaou-c10a664c`.
- Registered publisher ad-stream returned a real Neon sponsored status-line placement.
- Production admin endpoint rejects the demo key with `401`, which is expected security behavior.
- Desktop screenshot: `/Volumes/X10/clawd/shared/status/builderperks-qa-desktop-20260613-0346.png`
- Mobile screenshot: `/Volumes/X10/clawd/shared/status/builderperks-qa-mobile-20260613-0348.png`
- Netlify deploy validation scanned `103` files and found no secret matches.

Remaining note:

- Local Netlify dev did not bind to `localhost:8888` during this pass, so admin-gated smoke was not rerun locally. Production admin unauthorized behavior was verified; production admin mutation was intentionally not run from this specific message without a fresh keyword.
- Missing-publisher helper run exited `0` quietly.

Deploy verification:

- Commit: `8a10a53` (`Add one-command publisher status-line install`).
- Netlify deploy: `6a2cc75488b83fe26d083d5f`.
- Live page contains the one-command install and status-line run commands.
- Live `/install-statusline.sh` and `/builderperks-statusline.sh` both fetch successfully.
- Temporary install test succeeded against production using publisher `pub-mqboquuy-956a54e1`.
- Production helper output printed a real sponsored line for Neon with a tracked BuilderPerks click URL.

## 2026-06-13 02:14 ET

Second narrow acquisition wave sent/submitted after Jake provided directive keyword.

Decision:

- Move from acquisition prep into controlled outbound.
- Keep the wave narrow and high-fit: developer newsletter/publisher channels, the most relevant privacy-first ad/provider partner, and direct AI-builder advertiser prospects.
- Do not broad-launch Product Hunt/HN/daily.dev yet; conversion proof and onboarding clarity are still the bottlenecks.

Sent/submitted:

| Segment | Target | Channel | Ask | Evidence |
| --- | --- | --- | --- | --- |
| Publisher / developer audience | console.dev, `hello@console.dev` | Gmail | Tool submission, small sponsor test, or positioning feedback for experienced developer audience. | `/Volumes/X10/clawd/shared/status/builderperks-growth-consoledev-sent-20260613-0207.png` |
| Publisher / developer audience | Cooperpress, `sales@cooperpress.com` | Gmail | Small developer-newsletter test across JavaScript Weekly / Node Weekly / React Status / Frontend Focus. | `/Volumes/X10/clawd/shared/status/builderperks-growth-cooperpress-sent-20260613-0209.png` |
| Demand-side ad/provider partner | EthicalAds, `ads@ethicalads.io` | Gmail | Sample traffic shape + privacy-safe keyword/category targeting follow-up; asked for technical spec, traffic/report packet, or short call. | `/Volumes/X10/clawd/shared/status/builderperks-growth-ethicalads-followup-sent-20260613-0210.png` |
| Direct advertiser | Exa, `sales@exa.ai` | Gmail | AI-builder search/API intent pilot or routing to growth/partnership contact. | `/Volumes/X10/clawd/shared/status/builderperks-growth-exa-advertiser-sent-20260613-0212.png` |
| Direct advertiser / partner | Browserbase | Website contact form | Small advertiser/partner pilot for agent/browser automation builders. | `/Volumes/X10/clawd/shared/status/builderperks-growth-browserbase-form-submitted-20260613-0214.png` |

Current live stats after the wave:

```json
{
  "approvedPlacements": 2,
  "pendingPlacements": 0,
  "clicks": 7,
  "claims": 0,
  "relevanceEvents": 1,
  "needThis": 1,
  "builderSignups": 1,
  "publishers": 3,
  "adImpressions": 18,
  "estimatedPublisherEarningsUsd": 0.63
}
```

Notes:

- Gmail API token was stale (`invalid_grant`), so the send path used authenticated Gmail in the controlled Clawd browser.
- `gog` remains authenticated for docs/drive/sheets only, not Gmail.
- The product bottleneck remains onboarding clarity: split builder/advertiser/publisher paths and add demo/install guide before broad launch.

Next:

- Monitor Gmail for replies from console.dev, Cooperpress, EthicalAds, Exa, Browserbase, and prior outbound targets.
- If any advertiser/provider replies positively, create or refine a matching placement/report packet immediately.
- If no replies within the next checkpoint, send the next narrow wave to 5 publisher surfaces or improve the landing-page segmentation first.

## 2026-06-12 23:02 ET

Cold-start demand clarity added locally for the next deploy.

Decision:

- Do not pipe unapproved third-party ads into paid terminal/IDE users.
- Keep users seeing ads through `builderperks_seed` and manually approved direct placements until an external partner approves the inventory.
- Treat EthicalAds, BuySellAds/Carbon, AdButler, and Kevel as pending partner integrations, not active demand.

Product change:

- `/api/ad-stream` now returns a `demand` object showing the active demand source, pending partner integrations, and the approval boundary.
- Seed placements are explicitly marked `builderperks_seed`.

Why it matters:

- Publishers can try the product now and see working ads.
- Advertisers see honest usage proof.
- External ad partners get a clean, compliant pilot shape instead of hidden pass-through.

## 2026-06-12 23:14 ET

Publisher ad preferences shipped locally for the next deploy.

Insight:

- The strongest simple user-control feature is letting the terminal/IDE publisher choose what kinds of sponsors feel acceptable.
- This should be preference targeting, not personal profiling.

Product change:

- `/api/ad-stream` supports `blockedKeywords` and `excludeKeywords`.
- The status-line helper supports `BUILDERPERKS_BLOCKED_KEYWORDS`.
- The public onboarding examples now show wanted keywords and blocked keywords together.
- If blocked keywords filter out every approved placement, the API returns `no_approved_placements_after_preferences` with a clear preference note.

Verification:

- `bash -n web/public/builderperks-statusline.sh web/public/install-statusline.sh` passed.
- `npm run build` passed.
- `npm run check` passed.
- `npm run smoke` passed.

## 2026-06-13 03:57 ET

Publisher setup fine-tuning shipped and deployed.

Problem found:

- Publisher setup still required too much copy/paste and repeated inline env vars after install.
- One live UI label said `Hide similar` while the tracking event is actually `hide_category`.

Product change:

- Installer now writes `~/.builderperks/config.env` with the publisher id and safe default preferences.
- Publisher can run `~/.builderperks/statusline.sh` directly after install.
- Status-line helper now loads saved config and supports `BUILDERPERKS_DEBUG=1` for setup diagnostics.
- Publisher success screen now shows a clearer step-by-step install, test, and Claude Code `statusLine` setup path.
- Public copy now says `Hide category`.

Deploy:

- Commit: `4446cba` (`Simplify BuilderPerks publisher setup`)
- Netlify deploy: `6a2d0cd791b0232927877f07`
- Live URL: `https://builderperks.netlify.app`

Verification:

- `bash -n web/public/install-statusline.sh web/public/builderperks-statusline.sh` passed.
- Temporary install created `config.env` and set `0600` permissions.
- Temporary status-line run printed a real live Neon placement with no stderr.
- Debug run printed diagnostics to stderr and kept the status line on stdout.
- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- `git diff --check` passed.
- Live deploy contains `Hide category`, `BUILDERPERKS_DEBUG=1`, `~/.builderperks/config.env`, and the Claude Code setup snippet.

Current live stats after the pass:

```json
{
  "approvedPlacements": 2,
  "pendingPlacements": 2,
  "clicks": 7,
  "claims": 0,
  "relevanceEvents": 1,
  "needThis": 1,
  "builderSignups": 1,
  "publishers": 4,
  "adImpressions": 21,
  "estimatedPublisherEarningsUsd": 0.81
}
```

## 2026-06-13 14:04 ET

Roger / BuySellAds feedback converted into product copy and reliability fixes.

Feedback found in Gmail:

- Roger said the landing page left him confused about what BuilderPerks is.
- The confusion risk was real: first-viewport copy still sounded too much like builder rewards instead of an opt-in publisher/ad network.
- A prior Gmail follow-up also rendered escaped `\n\n` line breaks, so future outreach should be sent through visible browser compose with normal newlines.
- Follow-up correction: outbound draft preparation now has a reusable newline guard at `/Volumes/X10/clawd/ops/scripts/email_body_guard.py`, and `docs/OUTREACH.md` + `docs/GROWTH_SEND_CHECKLIST_20260613.md` explicitly require real paragraph breaks before Gmail/browser sends.

Product change:

- First screen now explains the system plainly: advertisers buy manually approved devtool placements, publishers opt into one controlled surface, builders keep dismiss/pause/feedback controls, and targeting uses coarse context without raw prompts or personal data.
- Hero headline changed from a builder-perks framing to `One labeled sponsor line for real AI build workflows.`
- Added a first-viewport role grid for Advertisers, Publishers, Builders, and Privacy.
- Added a seeded fallback placement so the hero card does not render as a blank box when local/static testing cannot reach `/api/placements`.
- Busted the cached module URL for `app.js` so browsers pick up the fixed client script.

Verification:

- `node --check public/app.js` passed.
- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- Local visual check captured: `/Volumes/X10/clawd/shared/status/builderperks-roger-clarity-card-fixed-20260613-1431.png`
- Production deploy: `6a2d9bf8b1ed24781177ef8c`
- Live visual check captured: `/Volumes/X10/clawd/shared/status/builderperks-roger-clarity-live-20260613-1438.png`
- Live homepage contains `One labeled sponsor line for real AI build workflows.`

Current live stats before deploy:

```json
{
  "approvedPlacements": 2,
  "pendingPlacements": 2,
  "clicks": 7,
  "claims": 0,
  "relevanceEvents": 1,
  "needThis": 1,
  "feedback": 2,
  "builderSignups": 1,
  "publishers": 5,
  "adImpressions": 30,
  "estimatedPublisherEarningsUsd": 1.32
}
```

## 2026-06-13 14:17 ET

Jake feedback iteration prepared after setup/email-formatting review.

Product change:

- Added a `First-run test` section to the public page so Jake and testers can distinguish terminal setup, browser extension setup, and feedback capture.
- The first-run checklist now has three concrete proof points: terminal proof, browser proof, and feedback proof.
- Static smoke coverage now asserts the first-run section and CSS are present.

Outreach reliability change:

- `/Volumes/X10/clawd/ops/scripts/email_body_guard.py` now supports `--check`.
- The check fails if the original draft contains literal escaped newlines such as `\n`, preventing the malformed Gmail paste issue from recurring silently.
- `docs/GROWTH_SEND_CHECKLIST_20260613.md` now says to run the guard in `--check` mode before browser/Gmail paste-send workflows.

Verification:

- `npm run smoke` passed.
- `npm run build` passed.
- `npm run check` passed.
- `python3 -m py_compile /Volumes/X10/clawd/ops/scripts/email_body_guard.py` passed.
- Good Roger-style sample passed `email_body_guard.py --check`.
- Bad escaped-newline sample failed `email_body_guard.py --check` with `original body contains literal escaped newlines such as \n`.
- `git diff --check` passed.

Deployment:

- Not deployed in this Telegram turn. Production deploy is keyword-gated; Netlify returned the existing-site deploy command, and Jake has not supplied the directive keyword in this message.

## 2026-06-13 14:21 ET

Third-party provider integration readiness layer shipped locally after Jake pushed on demand/backfill urgency.

Problem:

- BuilderPerks cannot become a real customer/user acquisition product if it only has seeded ads and direct manual sales.
- Existing code showed pending providers in `/api/ad-stream`, but there was no operational readiness layer for "provider is approved and credentials are configured."

Product/API change:

- Added `web/netlify/functions/_providers.mts`.
- Added `/api/provider-status`.
- Added Netlify redirect for `/api/provider-status`.
- `/api/ad-stream` now reports `configuredPartnerIntegrations` separately from `approvedPartnerIntegrations` and `pendingPartnerIntegrations`.
- Provider readiness is config-gated:
  - EthicalAds: `BUILDERPERKS_ETHICALADS_PUBLISHER_ID`
  - BuySellAds / Carbon: `BUILDERPERKS_BSA_ADS_URL`
  - AdButler: `BUILDERPERKS_ADBUTLER_JSON_URL`
  - Kevel: `BUILDERPERKS_KEVEL_NETWORK_ID`, `BUILDERPERKS_KEVEL_SITE_ID`, `BUILDERPERKS_KEVEL_AD_TYPE_ID`

Decision:

- This is the correct immediate integration shape: provider credentials/endpoints can be added as soon as a partner approves BuilderPerks, without another product rewrite.
- Do not mark provider demand live until a partner approves inventory and a placement is explicitly set to `approved_partner`.
- AdButler and Kevel are infrastructure lanes, not customer/demand sources by themselves.

Verification:

- `npm run check` passed.
- `npm run smoke` passed.
- `npm run build` passed.
- `git diff --check` passed.

Deployment:

- Not deployed in this Telegram turn; production deploy remains keyword-gated.

## 2026-06-13 14:52 ET

Jake first-run/product usability escalation: make the product visibly work for him and for early users while third-party demand approval is still pending.

Product change:

- Added a deterministic Chrome extension first-run action: popup button `Show test card in this AI tab`.
- The button sends `builderperks:show-test-card` to the active Claude/ChatGPT tab and inserts a BuilderPerks sponsored card immediately.
- Manual test cards are labeled with `(manual test)` in the match reason.
- Added `activeTab` permission so the popup can message the current AI tab.
- Updated both root `extension/` and mirrored `web/extension/` source.
- Rebuilt `web/public/builderperks-extension-beta.zip` so the public download contains the new first-run action.
- Hardened popup ad-card rendering by replacing `innerHTML` with DOM text nodes.
- Updated `~/Desktop/BuilderPerks Start Here.command` so Jake's Mac first-run flow says exactly how to force the first ad card.

Verification:

- `npm run smoke` passed.
- `npm run check` passed.
- `npm run build` passed.
- `git diff --check` passed.
- Live page contains `Works today`, `First-run test`, `Show useful ads now`, and `Get live in one pass`.
- Live `/api/provider-status` returns pending lanes for EthicalAds, Carbon Ads, BuySellAds Publisher Solutions, BuySellAds Newsletter Network, AdButler, and Kevel.
- Live extension ZIP contains:
  - popup button handler `show-test-card`
  - content-script handler `builderperks:show-test-card`
  - `insertTestCard`
  - manifest permission `activeTab`
- Live ad stream works for Jake's installed publisher id `pub-mqcmkwdx-6d019ed0` and returned a Neon sponsored status-line placement.
- `BUILDERPERKS_DEBUG=1 ~/.builderperks/statusline.sh` returned a production Neon sponsored line.
- Dedicated Chrome test profile was launched with the updated local extension:
  - profile: `~/.builderperks/chrome-extension-test-profile`
  - extension: `/Volumes/X10/clawd/projects/builderperks/extension`
  - URL: `https://claude.ai/new`

Deployment:

- Production deploy completed.
- Deploy id: `6a2da6908a01267618e34ec1`
- Live URL: `https://builderperks.netlify.app`

Current business truth:

- BuilderPerks can now show ads to real users today through seed/direct approved placements.
- Third-party provider lanes are integrated as readiness/config/status lanes, but they still require external approval before serving real partner demand.
- Immediate cold-start goal is real user installs plus relevance feedback, then use that proof to close EthicalAds/BSA/direct advertiser demand.

## 2026-06-13 14:59 ET

Seamless developer AI workflow pass shipped after Jake clarified that the ad flow must match how developers actually use AI.

Product change:

- Reduced dependency on brittle Claude/ChatGPT wait-state text.
- Added active AI session detection:
  - Enter from a textarea/input/contenteditable prompt marks a 90-second active AI build session.
  - Send/submit/run/ask button clicks mark a 90-second active AI build session.
  - DOM mutations during that active session can trigger card insertion into the active AI workspace.
- Existing explicit wait-state matching remains in place.
- Manual first-run proof remains available through the popup, now labeled `Show first card now`.
- Popup success copy now tells users to keep using AI normally; future cards appear during active build sessions.
- Public site copy now explains that cards appear inside the active AI workspace when BuilderPerks sees a wait state or recent prompt send.
- Jake's Desktop launcher now matches the new popup label and workflow.

Verification:

- `npm run build` passed.
- `npm run check` passed.
- `npm run smoke` passed.
- `git diff --check` passed.
- Production deploy completed.
- Deploy id: `6a2da86188511d0a30a25374`.
- Live page contains `recent prompt send`, `Show first card now`, and `active AI workspace`.
- Live extension ZIP contains `activeAiSessionUntil`, `markActiveAiSession`, `likelySendControl`, `active AI session`, `Show first card now`, and `First card inserted`.
- `BUILDERPERKS_DEBUG=1 ~/.builderperks/statusline.sh` returned a production Neon sponsored line.
- Dedicated Chrome test profile relaunched with the updated local extension at Claude.

## 2026-06-13 15:13 ET

Low-friction provider and terminal/IDE workflow audit after Jake asked for a niche provider that might approve quickly and for a full-angle seamlessness pass.

Research conclusion:

- No credible source confirmed a real auto-approval CPM/native developer ad network suitable for terminal/IDE/AI assistant inventory.
- Best niche fit is Carbon's CLI/tool-native lane because Carbon explicitly describes CLI tools, AI assistants, IDE extensions, and terminal apps.
- Carbon CLI still appears to require publisher setup/contact, so it is high-fit and probably faster than generic web publisher approval, but not confirmed automatic.
- EthicalAds remains the best warm developer/privacy lane.
- PartnerStack, FlexOffers, and Awin are possible low-friction affiliate/referral offer backfills, not true CPM/native ad demand.
- Affiliate/referral offers must be disclosed and treated as approved sponsored/referral offers, not generic ad-network fill.

Product changes made locally:

- Added `Carbon for CLI, AI assistants, and IDE extensions` as a separate provider readiness lane.
- Added affiliate/referral backfill readiness lanes for PartnerStack, FlexOffers, and Awin.
- Added environment gates:
  - `BUILDERPERKS_CARBON_CLI_SDK_KEY`
  - `BUILDERPERKS_PARTNERSTACK_FEED_URL`
  - `BUILDERPERKS_FLEXOFFERS_API_KEY`
  - `BUILDERPERKS_AWIN_API_TOKEN`
- Added VS Code / Cursor task snippets to the publisher success flow and public API section.
- Added research artifact: `docs/LOW_FRICTION_PROVIDER_RESEARCH_20260613.md`.

Verification:

- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- `git diff --check` passed.

Deployment:

- Not deployed in this turn because Jake's latest Telegram message did not include the high-impact directive keyword for production changes.

## 2026-06-13 16:09 ET

High-paying niche demand expansion after Jake pointed out that Google is not the top-paying ceiling and that high-value categories need coverage.

Research conclusion:

- High-value demand usually comes from narrow buyer intent, not generic ad fill.
- Better-than-Google categories for BuilderPerks:
  - B2B SaaS / software affiliate and partner programs
  - Cloud/devtools/developer ads
  - AI-native app ads
  - Cybersecurity / enterprise IT / B2B intent
  - Finance / insurance / legal
  - Crypto / web3
  - Premium native
  - Publisher SSP/exchange
- Safe default inventory should remain developer/cloud/SaaS/AI tools.
- Regulated or trust-sensitive categories such as finance, legal, crypto, gambling, and adult must remain explicit opt-in and compliance gated.

Local product changes:

- Added provider/status lanes and env gates for:
  - Impact.com
  - CJ Affiliate
  - Rakuten Advertising
  - Partnerize
  - Coinzilla
  - Bitmedia
  - Cointraffic
  - A-ADS
  - AdEx
  - Informa TechTarget
  - Foundry / IDG
  - TechnologyAdvice
  - Madison Logic
  - Outbrain
  - Taboola
  - MGID
  - TripleLift
  - Revcontent
  - Sovrn
  - PubMatic
  - Magnite
  - Index Exchange
  - Amazon Publisher Services
- Added lane classes:
  - `high_value_affiliate`
  - `crypto_web3_network`
  - `b2b_intent_network`
  - `premium_native_network`
  - `publisher_ssp`
- Expanded `docs/LOW_FRICTION_PROVIDER_RESEARCH_20260613.md` with high-paying category map, high-value provider map, and source links.
- Updated smoke coverage for the high-value vertical provider lanes.

Verification:

- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- `git diff --check` passed.

Deployment:

- Not deployed in this turn because Jake's latest Telegram message did not include the high-impact directive keyword for production changes.

## 2026-06-13 16:04 ET

Expanded provider horizon after Jake correctly noted there are definitely more niche and newer ad options.

Research conclusion:

- The next-best category beyond Carbon/EthicalAds/Google/Kevel is AI-native ad networks and app-native monetization.
- Higher-priority newer lanes:
  - AdsBind
  - ChatAds
  - Nexad
  - Aryel In-Chat Ads
  - Microsoft chat ads
- Useful developer/audience lanes:
  - Idlen
  - Paved
  - beehiiv sponsorships
- Mobile/app-only lanes for future SDK surfaces:
  - Meta Audience Network
  - AppLovin MAX
  - CAS.AI
  - Yango Ads

Local product changes:

- Added provider/status lanes and env gates for:
  - AdsBind
  - ChatAds
  - Nexad
  - Aryel In-Chat Ads
  - Microsoft chat ads
  - Idlen
  - Paved
  - beehiiv sponsorships
  - Meta Audience Network
  - AppLovin MAX
  - CAS.AI
  - Yango Ads
- Added lane classes:
  - `ai_native_network`
  - `developer_distribution`
  - `sponsorship_marketplace`
  - `mobile_app_mediation`
- Expanded `docs/LOW_FRICTION_PROVIDER_RESEARCH_20260613.md` with the newer/niche provider map and source links.
- Updated smoke coverage for the expanded provider horizon.

Verification:

- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- `git diff --check` passed.

Deployment:

- Not deployed in this turn because Jake's latest Telegram message did not include the high-impact directive keyword for production changes.

## 2026-06-13 16:00 ET

Positioning correction after Jake pushed back that BuilderPerks should not frame the inventory negatively.

Decision:

- Correct framing is: BuilderPerks is app/tool-native sponsored placement inventory.
- The category is valid: ads can be streamed into websites, apps, mobile apps, custom UIs, terminals, IDE extensions, and AI assistants through existing ad-serving APIs.
- The open work is commercial lane selection and provider onboarding, not technical feasibility.

Local changes:

- Reworded provider status notes to remove defensive "not automatic / not for terminal" framing.
- Reframed Carbon CLI as the primary app/tool-native commercial onboarding lane.
- Reframed Google Ad Manager, AdMob, AdGlare, Epom, Broadstreet, Revive, PartnerStack, FlexOffers, and Awin as possible lanes with clear use cases.
- Updated `docs/LOW_FRICTION_PROVIDER_RESEARCH_20260613.md` to lead with feasibility and lane choice.

Verification:

- `npm run check` passed.
- `npm run smoke` passed.
- `git diff --check` passed.

Deployment:

- Not deployed in this turn because Jake's latest Telegram message did not include the high-impact directive keyword for production changes.

## 2026-06-13 15:59 ET

Deep ad API pass after Jake challenged the premise that no APIs exist for streaming ads into a website/app/custom surface.

Conclusion:

- Jake is right that ad APIs exist.
- The issue is not technical ad delivery; the issue is approved demand for terminal, IDE, Chrome extension, and AI-assistant surfaces.
- Added the larger provider/API map so BuilderPerks distinguishes:
  - real ad-serving APIs
  - website/app/mobile ad networks
  - tool-native developer networks
  - affiliate/referral backfill
  - self-sold ad-server infrastructure

Local product changes:

- Added readiness lanes for:
  - Google Ad Manager
  - Google AdMob
  - AdGlare Native / JSON Ad Server
  - Epom Ad Server API
  - Broadstreet Ad Manager
  - Revive Adserver
- Added env gates for those lanes.
- Expanded `docs/LOW_FRICTION_PROVIDER_RESEARCH_20260613.md` with an "Ad APIs that can stream ads to websites/apps/custom UIs" table.
- Updated smoke coverage for website/app network and mobile app network lanes.

Verification:

- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- `git diff --check` passed.

Deployment:

- Not deployed in this turn because Jake's latest Telegram message did not include the high-impact directive keyword for production changes.

## 2026-06-13 14:24 ET

Mac install/run verification and provider recommendation refresh completed.

Mac setup:

- `~/Desktop/BuilderPerks Test.command` exists.
- `~/Desktop/Open BuilderPerks Extension Test Chrome.command` exists.
- `~/.builderperks/config.env` exists.
- `~/.builderperks/statusline.sh` exists.
- `BUILDERPERKS_DEBUG=1 ~/.builderperks/statusline.sh` returned a production Neon sponsored line.
- Dedicated Chrome test profile launched with the local BuilderPerks extension via `--load-extension=/Volumes/X10/clawd/projects/builderperks/extension` and opened Claude.

Provider research conclusion:

- Best first demand partner: EthicalAds, because it is developer/privacy aligned and there is already a warm reply thread.
- Best in-product ad API after approval: BuySellAds / Carbon, because official docs expose an Ad Serving API for custom UI flows and direct ad data access.
- Fastest self-sold campaign infrastructure: AdButler JSON Ad API.
- Powerful later marketplace infrastructure: Kevel Decision API.
- Do not rely on generic/rewarded ad networks; BuilderPerks must avoid any invalid/incentivized traffic posture.

Sources checked:

- EthicalAds client docs: `https://ethical-ad-client.readthedocs.io/`
- EthicalAds publisher guide: `https://www.ethicalads.io/publisher-guide/`
- BuySellAds Ad Serving API: `https://docs.buysellads.com/ad-serving-api`
- AdButler JSON Ad API: `https://www.adbutler.com/help/article/json-ad-tag-api`
- Kevel Decision API: `https://dev.kevel.com/reference/request`

## 2026-06-13 14:32 ET

Cold-start UX iteration shipped locally after Jake clarified the product must actually work before provider approval.

Product decision:

- BuilderPerks must not feel blocked on EthicalAds/BSA approval.
- Users should be able to install and see useful seed/direct approved ads now.
- Third-party providers are the demand scale path after usage proof, not a prerequisite for the product to work.

Product change:

- Added a `Works today` public section.
- Added a simple three-step cold-start loop:
  - Show useful ads now through seed/direct approved offers.
  - Get builders using it and leaving relevance feedback.
  - Convert usage proof into provider/advertiser demand.
- Added a demand status block that reads `/api/provider-status` when available.
- If provider-status is unavailable, the public page falls back to the honest message that seed/direct offers work today and EthicalAds/BSA are priority provider paths.
- Updated smoke coverage for the new section and status wiring.

Verification:

- `npm run smoke` passed.
- `npm run check` passed.
- `npm run build` passed.
- `git diff --check` passed.
- Local visual evidence:
  - `/Volumes/X10/clawd/shared/status/builderperks-cold-start-ux-works-now-20260613-1433.png`
  - `/Volumes/X10/clawd/shared/status/builderperks-cold-start-ux-first-run-20260613-1433.png`

Deployment:

- Not deployed in this Telegram turn; production deploy remains keyword-gated.
## 2026-06-13 16:18 ET - Restricted / All-Category Provider Expansion

Jake pushed to cover all categories, including adult, because cold-start demand requires broader commercial lanes.

Research conclusion:
- Ad/app monetization APIs do exist for restricted and performance categories too.
- Adult, dating, gambling/iGaming, CPA, push/pop, and broad performance networks can provide faster fill or higher payouts than generic web display.
- Those categories are commercially useful but product-trust sensitive. They must be isolated from the default developer/AI workflow.

Local changes:
- Added restricted/high-risk provider/status lanes for ExoClick, TrafficJunky, TrafficStars, JuicyAds, PlugRush, CrakRevenue, Cpamatica, Trafee, Mobipium, ClickDealer, MaxBounty, Zeydoo, RichAds, PropellerAds, Adsterra, Mondiad, 1xBet Partners, Betway Partners, and PIN-UP Partners.
- Added lane classes: `adult_network`, `dating_affiliate`, `gambling_affiliate`, `performance_cpa`, and `push_pop_network`.
- Added env gates for each provider.
- Updated `projects/builderperks/docs/LOW_FRICTION_PROVIDER_RESEARCH_20260613.md` with restricted-category guardrails and source evidence.
- Updated smoke coverage so the provider map cannot silently drop the restricted lanes.

Guardrails:
- Adult, dating, gambling, crypto, intrusive push/pop, and broad CPA demand must never serve by default in the terminal, IDE, browser extension, or default developer inventory.
- These lanes require explicit publisher/user opt-in, legal/age/geo checks where applicable, category blocks, disclosure, and advertiser/provider review.
- No raw prompts, personal data, or private code context should ever be sent to providers.

Verification:
- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- `git diff --check` passed.

Deployment:
- Not deployed because Jake's latest Telegram message did not include the high-impact directive keyword for production changes.

## 2026-06-13 16:24 ET - Seamless UX Pass

Jake asked to make sure the user experience is seamless after provider expansion.

Local changes:
- Added a public `Seamless workflow` section tying the product into one path across browser AI sessions, terminal/status-line, IDE tasks, and publisher controls.
- Made the UX acceptance bar explicit: install, see one real card or line, keep working, give feedback, and never send prompts/private code context.
- Updated smoke coverage for the new workflow section.
- Updated API smoke expectations so the expanded provider map and restricted lanes are covered instead of the older provider-count assumption.

Visual evidence:
- Desktop: `/Volumes/X10/clawd/shared/status/builderperks-seamless-workflow-desktop-20260613-1619.png`
- Mobile: `/Volumes/X10/clawd/shared/status/builderperks-seamless-workflow-mobile-20260613-1619.png`

Verification:
- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- `git diff --check` passed.
- Browser snapshot confirmed the `#workflow` section renders with Browser AI, Terminal, IDE, Controls, and Seamless bar content.

Known test limitation:
- `npm run smoke:api` was not run because `netlify dev --port 8888` failed on this machine with Netlify CLI account authorization. Do not claim local function smoke passed until Netlify CLI auth is fixed or another local function runner is used.

Deployment:
- Not deployed because Jake's latest Telegram message did not include the high-impact directive keyword for production changes.

## 2026-06-13 16:27 ET - All-Category Taxonomy Expansion

Jake clarified that gambling and all categories should be covered, not artificially limited.

Local changes:
- Expanded the ad-stream category taxonomy beyond the earlier developer/regulatory set.
- Added mainstream/high-value categories: cybersecurity, data, productivity, design, marketing, ecommerce, education, jobs, travel, real estate, sweepstakes, dating, and gaming.
- Separated mainstream gaming from gambling/iGaming.
- Kept regulated/restricted defaults safe: finance, legal, health, real estate, adult, dating, sweepstakes/CPA, and gambling/iGaming are not default-eligible unless explicitly opted in where appropriate.
- Updated public site copy to say category controls support mainstream, high-value, regulated, and restricted lanes.
- Updated smoke coverage for the expanded taxonomy.
- Updated `docs/LOW_FRICTION_PROVIDER_RESEARCH_20260613.md` with the "all categories, don't limit" platform rule.

Product rule:
- BuilderPerks should support every commercially relevant category at the platform/config layer.
- The default AI/developer workflow should still stay clean and safe: devtools, cloud, AI, SaaS, security, data, and productivity first.
- Restricted categories are opt-in only and require disclosure, quality filters, and legal/compliance controls where applicable.

Verification:
- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- `git diff --check` passed.

Deployment:
- Not deployed because Jake's latest Telegram message did not include the high-impact directive keyword for production changes.

## 2026-06-13 16:33 ET - XXX / Adult Provider Expansion

Jake clarified that XXX should be included, gated like other high-risk categories, and that the provider list should be broadened further.

Local changes:
- Adult/XXX already existed as a restricted category; made the provider coverage wider.
- Added restricted adult/XXX-capable provider lanes for Adnium, EroAdvertising, TwinRed, TrafficFactory, TrafficShop, Clickadu, HilltopAds, and AdMaven.
- Added env gates for each provider.
- Updated smoke coverage for the new provider gates.
- Updated `docs/LOW_FRICTION_PROVIDER_RESEARCH_20260613.md` with the expanded restricted provider map and source links.

Guardrail:
- XXX/adult remains restricted inventory only.
- It must never serve by default in terminal, IDE, browser extension, AI assistant, or default developer inventory.
- Requires explicit opt-in, disclosure, age/geo/legal checks where applicable, category blocks, and quality review.

Verification:
- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- `git diff --check` passed.

Deployment:
- Not deployed because Jake's latest Telegram message did not include the high-impact directive keyword for production changes.

## 2026-06-13 16:38 ET - Provider Expansion Deployed

Jake supplied the deploy authorization and asked to integrate as many providers as possible, test it, and keep the user experience seamless/easy.

Local gate before deploy:
- Provider map count: 78 providers across 21 lanes.
- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke` passed.
- `git diff --check` passed.

Deploy:
- Netlify CLI deploy from local auth failed: `Unauthorized: could not retrieve project`.
- Netlify MCP deploy from repo root failed during upload with `fetch failed`.
- Netlify MCP deploy from `projects/builderperks/web` succeeded.
- Deploy id: `6a2dbd28f5e5fa3e291cd953`.
- Build id: `6a2dbd27f5e5fa3e291cd951`.
- Live URL: `https://builderperks.netlify.app`.

Production verification:
- Home page contains `One labeled sponsor line for real AI build workflows`.
- Home page contains `Seamless workflow`.
- Home page contains the mainstream/high-value/regulated/restricted category copy and `gambling/iGaming`.
- `GET /api/provider-status` returned `ok: true`.
- Live provider count: 78.
- Live adult/restricted network lane count: 11.
- Live gambling affiliate lane count: 3.
- Live push/pop lane count: 6.
- Live provider map includes Adnium, TwinRed, and Clickadu.
- `GET /api/stats` returned `ok: true` with 2 approved placements, 5 publishers, 52 impressions, and 2 feedback notes.
- Live ad-stream returned a normal developer-network sponsored Railway line with adult/gambling blocked and publisher context redacted.

Known limitation:
- Third-party provider credentials are not configured. These are readiness/status/env-gated integrations, not active external demand. Default demand remains BuilderPerks seed/direct approved placements until providers approve/configure.

## 2026-06-13 19:15 ET - Directive Confirmed, Send Lane Blocked

Jake supplied directive confirmation for the next growth phase: spread BuilderPerks to users/customers once the terminal workflow is working and seamless.

Current truthful product state:
- Terminal/status-line streaming works in production.
- Live status-line returns a labeled Neon sponsored line.
- Working demand source is BuilderPerks seed/direct approved placements.
- `/api/provider-status` shows 78 mapped third-party providers, but 0 can serve now because no third-party credentials or approval env vars are configured.

Prepared artifact:
- `/Volumes/X10/clawd/shared/status/builderperks-directive-growth-packet-20260613-1915.md`

Prepared first send order:
1. Stack Overflow Ads.
2. Carbon / BuySellAds.
3. BuySellAds Developer.
4. EthicalAds.
5. Changelog.
6. Software Engineering Daily.
7. CSS Weekly / AI Developer.
8. PyCoder's Weekly.
9. SRE Weekly.
10. Bytes.

Send-lane status:
- External sending is now directive-approved.
- Gmail connector is not loaded in the current session.
- Local `gog` auth is present for docs/drive/sheets only; Gmail is not enabled.
- Existing growth checklist still records authenticated browser/Gmail send lane as blocked.
- No outreach was marked sent.

Next action:
- Use the prepared packet immediately when an authenticated Gmail/social/browser send lane is available.
- Keep claims truthful: do not claim third-party network fill until provider credentials, provider approval, and placement-level `approved_partner` demand are configured.

## 2026-06-13 20:21 ET - Remaining Work Spec Created

Jake asked for the remaining work to be specified, executed, and then pushed into user/customer acquisition.

Created execution artifact:
- `/Volumes/X10/clawd/shared/status/builderperks-remaining-work-spec-20260613-2021.md`

Verified live state:
- BuilderPerks production is live.
- Terminal/status-line streaming works.
- Latest live stats: 61 impressions, 7 clicks, 1 builder signup, 0 claims, 1 "Need this" relevance event, 2 approved placements, 2 pending placements, 5 publishers, $3.16 estimated unpaid publisher earnings.
- Provider readiness: 78 providers mapped, 0 credentials configured, 0 provider approvals enabled, 0 providers can serve now.

Execution priorities:
1. Turn provider mapping into working demand by securing real provider credentials/approvals.
2. Restore one authenticated external send lane.
3. Run 10 builder proof sessions.
4. Execute first 10 user/customer/provider outreach targets from the prepared growth packet.
5. Split raw stats from verified proof-session metrics before broader claims.

Current blocker:
- No authenticated Gmail/social/browser send lane is available from this session, so outreach remains prepared but not marked sent.
- No third-party provider credentials or approvals are configured, so third-party network fill remains mapped/readiness-gated, not live-serving.

## 2026-06-13 21:56 ET - First-User Proof Session Flow Added Locally

Jake asked again whether all flows are good and to get first users. Frontdoor intake created a new durable mission:
- Mission: `mission-20260614-014956-9a5c37`
- Context pack: `/Volumes/X10/clawd/ops/state/mission_runs/mission-20260614-014956-9a5c37/context_pack.md`
- Task plan: `/Volumes/X10/clawd/ops/state/mission_runs/mission-20260614-014956-9a5c37/task_plan.json`
- Queued tasks: 3
- Blocked dispatches: none

Local product improvement prepared before mission result returned:
- Added `/api/proof-sessions` for first-user workflow proof.
- Added redacted public proof-session listing.
- Added stats fields for `proofSessions`, `verifiedWorkflowSessions`, `blockedProofSessions`, `verified`, and `raw`.
- Added a landing-page proof-session form for surface/tool/install time/saw sponsored line/sentiment/blocker/note.
- Added static and API smoke coverage.

Verification:
- `npm run smoke` passed.
- `npm run check` passed.
- `npm run build` passed.
- `npm run smoke:api` passed against offline Netlify dev.
- Parent Netlify dev mode is still blocked by Netlify account auth, but offline Netlify dev loaded the functions and verified the API.

Deployment status:
- Not deployed from this latest turn because the latest Telegram production-change request did not include the high-impact directive keyword.

## 2026-06-13 22:32 ET - Connect/Test/Audit Packet

Jake asked to ship, connect, test, and audit everything.

Created audit packet:
- `/Volumes/X10/clawd/shared/status/builderperks-connect-test-audit-20260613-2232.md`

Local verification passed:
- `npm run smoke`
- `npm run check`
- `npm run build`
- `git diff --check`
- `npm run smoke:api` against offline Netlify dev

Live production verification:
- `/api/stats` healthy.
- `/api/provider-status` healthy.
- Local installed status-line script returned a live Neon sponsored line from production.

Live state remains:
- BuilderPerks seed/direct approved placements are serving.
- 78 providers mapped.
- 0 third-party provider credentials configured.
- 0 third-party provider approvals enabled.
- 0 third-party providers can serve now.

Deployment status:
- Latest proof-session patch remains local/ready but not deployed because the current Telegram deploy request did not include the required high-impact directive keyword.

Review gate:
- Native Codex review gate is blocked by Codex CLI auth: OpenAI Responses API returned `401 Unauthorized`.

## 2026-06-13 22:46 ET - Proof Session Patch Deployed

Jake supplied the high-impact directive keyword after the deploy request.

Deploy:
- Site id: `a5935830-d211-4610-b801-2ed41b01c197`
- Deploy id: `6a2e156ac5fc3d0ebd2f2e79`
- Build id: `6a2e1569c5fc3d0ebd2f2e77`
- Production URL: `https://builderperks.netlify.app`
- Netlify state: `ready`
- Functions deployed: 16
- Secret scan: 107 files scanned, 0 matches

Pre-deploy verification:
- `npm run smoke` passed.
- `npm run check` passed.
- `npm run build` passed.
- `git diff --check` passed.
- `npm run smoke:api` passed against offline Netlify dev.

Production verification:
- `GET /api/proof-sessions` returned `ok: true` with redacted public sessions list.
- `GET /api/stats` includes `proofSessions`, `verifiedWorkflowSessions`, `blockedProofSessions`, `verified`, and `raw`.
- Production home page includes the proof-session form and "Saw one labeled sponsored line during a real workflow" field.
- Production `app.js` includes `/api/proof-sessions` and `submitProofSession`.
- Invalid proof-session POST rejects malformed email.
- `~/.builderperks/statusline.sh` returned a live Neon sponsored line.
- `GET /api/provider-status` remains healthy and correctly reports seed/direct demand serving, 78 mapped providers, 0 configured third-party credentials, 0 provider approvals, and 0 third-party providers that can serve now.

Important:
- No fake proof session was created on production.
- Third-party fill remains blocked on provider credentials and approvals.
- External outreach remains blocked on an authenticated sender lane.

## 2026-06-13 22:47 ET - Autonomous Follow-Up Scheduled

Jake asked Barney to do whatever is needed to achieve the BuilderPerks goal.

Action taken:
- Confirmed current request captured as opportunity `opp-external-requirement-do-whatever-u-to-achieve-ur-goal-812e6f5d783d`.
- Rechecked mission `mission-20260614-014956-9a5c37`.
- Current fanout remains pending:
  - Jordan task `6af48e7c-99b`
  - Sterling task `69b5c8f9-218`
- No authenticated outbound email/social connector is available in this context, so external outreach remains blocked.

Scheduled follow-up:
- Cron job: `c0fb942d-92e5-45a2-9860-1fb165358d37`
- Run time: 2026-06-13 23:20 ET
- Purpose: collect Jordan/Sterling fanout after the delayed wave, retry stale tasks if needed, summarize evidence, and report the next executable action.

## 2026-06-13 23:01 ET - Execution Forecast

Jake asked to continue, forecast as agents ship, and get first users.

Created forecast artifact:
- `/Volumes/X10/clawd/shared/status/builderperks-execution-forecast-20260613-2301.md`

Current production counters:
- Raw impressions: 63
- Clicks: 7
- Claims: 0
- Publishers: 5
- Proof sessions: 0
- Verified workflow sessions: 0
- Third-party providers serving: 0

Agent forecast:
- Jordan task `6af48e7c-99b`: engineering execution evidence or next patch plan.
- Sterling task `69b5c8f9-218`: risk/security/strategy evidence and GTM claim discipline.
- Sterling wave opens at 2026-06-13 23:12 ET.
- Collection/retry job runs at 2026-06-13 23:20 ET.

Next legitimate first-user path:
- Bring a real builder to `https://builderperks.netlify.app/#first-run`.
- Have them run Terminal / Claude Code status-line flow.
- Have them submit the live proof-session form.
- Verify `/api/stats` increments `proofSessions` and `verifiedWorkflowSessions` when successful.

## 2026-06-13 23:02 ET - Directive Keyword Reconfirmed

Jake sent `NEGNORDNUD` after the execution forecast.

State check:
- Frontdoor intake stayed in normal lane; no new mission created.
- Fanout remains pending:
  - Jordan task `6af48e7c-99b`
  - Sterling task `69b5c8f9-218`
- Production counters are unchanged:
  - Raw impressions: 63
  - Clicks: 7
  - Claims: 0
  - Publishers: 5
  - Proof sessions: 0
  - Verified workflow sessions: 0
  - Third-party providers serving: 0
- Next scheduled automation remains `c0fb942d-92e5-45a2-9860-1fb165358d37` at 2026-06-13 23:20 ET.

## 2026-06-14 02:23 ET - Acquisition Readiness Monitor

Cron readiness check against production APIs and local send docs.

Production state:
- `/api/provider-status` is healthy and still reports 78 mapped third-party providers, 0 configured third-party credentials, 0 provider approvals, and 0 third-party providers that can serve now.
- BuilderPerks seed/direct approved placements remain the only serving demand source.
- `/api/stats` now reports 64 raw impressions, 7 clicks, 0 claims, 5 publishers, 2 proof sessions, and 2 verified workflow sessions.

Send-lane state:
- No authenticated Gmail/social/browser send lane is available in this runtime.
- Growth docs still record Gmail/browser automation as blocked and the first-user target queue as `blocked_auth`.
- No external outreach was sent or marked sent.

Truthful execution status:
- First-user outreach is prepared but cannot be executed truthfully from automation until an authenticated external send lane is restored and send evidence can be logged.
- Product proof has materially improved from 0 to 2 verified workflow/proof sessions since the last logged production counter snapshot.

## 2026-06-14 04:23 ET - Acquisition Readiness Monitor

Cron readiness check against production APIs, local acquisition docs, and current browser send capability.

Production state:
- `/api/provider-status` is healthy: 78 mapped third-party providers, 0 configured third-party credentials, 0 provider approvals, and 0 third-party providers that can serve now.
- BuilderPerks seed/direct approved placements remain the only serving demand source.
- `/api/stats` reports 64 raw impressions, 7 clicks, 0 claims, 5 publishers, 2 proof sessions, and 2 verified workflow sessions.

Send-lane state:
- Authenticated Gmail browser lane is now reachable through Clawd Chrome at `https://mail.google.com/mail/u/0/#inbox` for `barneywohl@gmail.com`.
- No outreach was sent or marked sent during this readiness check.

Truthful execution status:
- First-user outreach can now be executed truthfully through controlled Gmail/browser sends if each send captures evidence under `shared/status/`.
- Outreach copy must still avoid claiming third-party provider/network fill until provider credentials, provider approval, and placement-level `approved_partner` demand are configured.

## 2026-06-14 19:06 ET - Acquisition Readiness Monitor

Cron readiness check against production APIs, local send docs, and current browser send capability.

Production state:
- `/api/provider-status` is healthy and still reports 78 mapped third-party providers, 0 configured third-party credentials, 0 provider approvals, and 0 third-party providers that can serve now.
- BuilderPerks seed/direct approved placements remain the only serving demand source.
- `/api/stats` reports 65 raw impressions, 7 clicks, 0 claims, 5 publishers, 2 proof sessions, and 2 verified workflow sessions.

Send-lane state:
- Clawd browser control could not connect to the expected CDP endpoint at `localhost:18800`, so the previously reachable Gmail browser lane is not currently available from this runtime.
- Local growth docs still require authenticated Gmail/social/browser sends with captured evidence before any outreach is marked sent.
- No external outreach was sent or marked sent during this readiness check.

Truthful execution status:
- First-user outreach remains prepared but cannot be executed truthfully from this automation run until a real authenticated send lane is reachable again and evidence can be logged under `shared/status/`.
- Outreach copy must continue to avoid claims of third-party provider/network fill until credentials, provider approval, and placement-level `approved_partner` demand are configured.

## 2026-06-14 19:07 ET - Acquisition Readiness Monitor

Cron readiness check against production APIs, local send docs, and current browser send capability.

Production state:
- `/api/provider-status` is healthy and still reports 78 mapped third-party providers, 0 configured third-party credentials, 0 provider approvals, and 0 third-party providers that can serve now.
- BuilderPerks seed/direct approved placements remain the only serving demand source.
- `/api/stats` reports 65 raw impressions, 7 clicks, 0 claims, 5 publishers, 2 proof sessions, and 2 verified workflow sessions.

Send-lane state:
- Clawd browser control is reachable again on port 18800, and authenticated Gmail is open at `https://mail.google.com/mail/u/0/#inbox` for `barneywohl@gmail.com`.
- Evidence screenshot: `/Volumes/X10/clawd/shared/status/builderperks-gmail-lane-ready-20260614-1907.png`
- No external outreach was sent or marked sent during this readiness check.

Truthful execution status:
- First-user outreach can be executed truthfully through controlled Gmail/browser sends if each send captures evidence under `shared/status/`.
- Outreach copy must continue to avoid claims of third-party provider/network fill until credentials, provider approval, and placement-level `approved_partner` demand are configured.

## 2026-06-14 21:07 ET - Acquisition Readiness Monitor

Cron readiness check against production APIs, local send docs, and current browser send capability.

Production state:
- `/api/provider-status` is healthy and still reports 78 mapped third-party providers, 0 configured third-party credentials, 0 provider approvals, and 0 third-party providers that can serve now.
- BuilderPerks seed/direct approved placements remain the only serving demand source.
- `/api/stats` now reports 69 raw impressions, 9 clicks, 0 claims, 8 publishers, 1 builder signup, 6 proof sessions, 6 pending proof sessions, and 0 verified workflow/proof sessions.

Send-lane state:
- Clawd browser control is reachable on port 18800, and authenticated Gmail is open at `https://mail.google.com/mail/u/0/#inbox` for `barneywohl@gmail.com`.
- Evidence screenshot: `/Volumes/X10/clawd/shared/status/builderperks-gmail-lane-check-20260614-2107.png`
- No external outreach was sent or marked sent during this readiness check.

Truthful execution status:
- First-user outreach can be executed truthfully through controlled Gmail/browser sends if each send captures evidence under `shared/status/`.
- Outreach copy must continue to avoid claims of third-party provider/network fill until credentials, provider approval, and placement-level `approved_partner` demand are configured.

## 2026-06-15 14:48 ET - Exa Reply Sent

Responded to Cat Yu / Exa in the existing Gmail thread after Jake supplied the external-send directive keyword.

- Thread: `BuilderPerks pilot for AI-builder search/API intent`
- Positioning adjusted based on feedback: paid placements are not Exa's current model; reply accepted API credits and proposed a small BuilderPerks/agent-search workflow test.
- Formatting guard: `python3 /Volumes/X10/clawd/ops/scripts/email_body_guard.py --check --file docs/EXA_REPLY_DRAFT_20260615.md` passed before send.
- Browser lane: isolated Clawd Chrome/CDP only.
- Evidence before send: `/Volumes/X10/clawd/shared/status/builderperks-gmail-exa-reply-before-send-20260615-1446.png`
- Evidence after send: `/Volumes/X10/clawd/shared/status/builderperks-gmail-exa-reply-sent-20260615-1448.png`
- Gmail showed `Message sent` and the sent reply in-thread at 14:46 ET.

No provider-live claim was made. This is an API-credit/business-development follow-up, not third-party ad supply activation.
