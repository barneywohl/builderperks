# BuilderPerks First Customer Goal - 2026-06-12

Status: active

## Goal

Get BuilderPerks one real first customer: either a paying advertiser, a committed advertiser pilot, or a signed-off pilot that can be converted to checkout.

## Current Position

- Product is live: https://builderperks.netlify.app/
- Production deploy is healthy.
- Payment/checkout path exists.
- Manual approval workflow exists.
- Tracking redirects now pass `placementId` and `source` to advertiser URLs.
- Live stats before this acquisition push: `2` approved placements, `0` pending, `6` clicks, `0` claims, `2` feedback entries, `0` advertiser feedback.

## Operating Decision

Do not build an ads API yet.

Reason: the current bottleneck is demand, not ad infrastructure. The first customer should be closed manually with a fixed-price pilot, Stripe checkout/payment link, manual approval, and attribution.

## Acceptance Criteria

One of:

- Advertiser says yes to a paid or committed pilot.
- Advertiser submits/buys a placement.
- Advertiser explicitly asks for checkout/invoice after seeing the pitch.

Secondary:

- At least 5 new targeted advertiser/customer asks sent.
- Gmail reply monitoring evidence captured.
- Acquisition log updated with exact sends and next follow-up.

## Target Strategy

Prioritize devtools where a credit/perk offer is naturally useful during AI coding wait time:

- Railway
- Neon
- Browserbase
- Langfuse
- Supabase
- Firecrawl/Mendable follow-up
- Helicone follow-up
- CodeRabbit follow-up

Pitch stays simple: one 48-hour fixed-price pilot to AI-native builders, manual approval, tracked clicks/claims, no auction or ad network machinery.
