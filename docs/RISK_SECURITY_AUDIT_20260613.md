# BuilderPerks Risk/Security Audit - 2026-06-13

Mission: `mission-20260613-080625-a572a5`
Lane: risk/security verification
Auditor: marcus
Timestamp: 2026-06-13T08:46:27Z

## Verdict

BuilderPerks is acceptable for the current launch/demo posture if the team keeps claims truthful: seed/direct placements, estimated unpaid publisher earnings, no fake traction, and manual advertiser approval before serving non-seed demand.

Do not treat the current public metrics as fraud-resistant or payout-grade. The biggest risk is that public growth endpoints can create or inflate signups, publishers, claims, relevance events, impressions, and click counters without authentication or rate limits.

## Positive Controls Confirmed

- Admin approval is gated: `/api/admin` requires `adminAuthorized(req)` before GET or POST access. Evidence: `web/netlify/functions/admin.mts:17`.
- Pending advertiser placements are not publicly returned unless admin authorization succeeds. Evidence: `web/netlify/functions/placements.mts:55-63`.
- Stripe webhook has HMAC signature verification and fails closed when `STRIPE_WEBHOOK_SECRET` is absent. Evidence: `web/netlify/functions/stripe-webhook.mts:35-41`.
- Ad-stream redacts raw publisher context before storage. Evidence: `web/netlify/functions/ad-stream.mts:291-299`.
- Production response headers observed over HTTPS include HSTS and `x-content-type-options: nosniff`.

## Findings

### P1 - Public publisher activation plus public publisher IDs allow impression inflation

Evidence:
- `web/netlify/functions/publishers.mts:7-24` publicly lists active publisher IDs and estimated earnings.
- `web/netlify/functions/publishers.mts:40-48` creates new publishers with `status: "active"`.
- `web/netlify/functions/ad-stream.mts:245-303` accepts any active `publisherId`, stores an impression, and increments estimated unpaid earnings.

Impact: anyone can create a publisher or reuse public publisher IDs to inflate impressions and estimated unpaid earnings. This is not safe for payout decisions or traction claims.

Recommended fix: make new publishers `pending` by default, require an admin approval step or publisher token for `/api/ad-stream`, and hide publisher IDs from public aggregate listing.

### P1 - Public claim/relevance/click endpoints can inflate traction metrics

Evidence:
- `web/netlify/functions/claims.mts:12-30` stores claims for approved placements with only placement ID and email.
- `web/netlify/functions/relevance.mts:25-47` stores relevance events for approved placements without publisher/session proof.
- `web/netlify/functions/track.mts:21-29` stores click events and redirects without rate limiting.

Impact: claims, relevance events, and clicks are not proof of real user demand. Marketing copy and closeout reports must label these as unverified unless backed by external screenshots or authenticated channel evidence.

Recommended fix: add bot/rate limits, signed impression or session tokens, and separate verified conversions from raw event counters.

### P2 - Duplicate existing signup responses leak stored contact fields to unauthenticated callers

Evidence:
- `web/netlify/functions/builders.mts:29-31` returns the full stored builder object on duplicate email.
- `web/netlify/functions/publishers.mts:37-38` returns the full stored publisher object on duplicate email, including payout handle.

Impact: a caller who guesses an email can confirm membership and retrieve fields that are intentionally hidden from public GET responses.

Recommended fix: on duplicate, return only `{ ok: true, alreadyJoined: true }` or a redacted object.

### P2 - Stripe webhook does not enforce timestamp freshness or constant-time signature compare

Evidence:
- `web/netlify/functions/stripe-webhook.mts:15-27` validates HMAC but does not reject old timestamps and compares hex strings directly.

Impact: if a signed payload is captured, replay resistance depends on Stripe/provider behavior outside this function. Direct string comparison is also weaker than a timing-safe comparison.

Recommended fix: reject signatures older than a small tolerance window and use a constant-time byte comparison.

### P2 - Public state mutation has no visible rate limiting or retention guard

Evidence:
- `writeState(state)` is called directly from public POST/GET-driven mutation paths: publishers, builders, claims, feedback, relevance, track, and ad-stream.
- Impression and event arrays are prepended but not capped in the audited handlers.

Impact: abuse or automated testing can grow blob state and distort dashboard metrics.

Recommended fix: add coarse IP/user-agent rate limiting at the edge, cap retained public event arrays, and keep raw audit events separate from public marketing counters.

## Verification Evidence

- `npm run check` passed at 2026-06-13T08:45Z.
- `npm audit --omit=dev --json` passed with 0 production vulnerabilities.
- `npm run build` passed at 2026-06-13T08:45Z.
- `npm run smoke` passed at 2026-06-13T08:45Z.
- `GET https://builderperks.netlify.app/api/stats` returned HTTP/2 200.
- `GET https://builderperks.netlify.app/api/publishers` returned HTTP/2 200 and exposed 4 active publisher IDs, confirming the P1 impression-inflation risk is observable in production.

## Safe Claims Guidance

Allowed now:
- "Production API is live."
- "Seed/direct placements are served."
- "Publisher earnings are estimated and unpaid."
- "External demand partners are pending approval."

Avoid until controls are added:
- "Fraud-resistant metrics."
- "Verified clicks/conversions."
- "Publisher payout balance."
- "Real traction" based only on raw public API counters.

