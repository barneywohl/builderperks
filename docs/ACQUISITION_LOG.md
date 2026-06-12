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
