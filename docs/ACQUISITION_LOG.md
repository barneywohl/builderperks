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
