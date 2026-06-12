# Stripe Development Checklist

Generated: 2026-06-12

## Current State

BuilderPerks uses live Stripe Checkout for advertiser placement requests and a signed webhook for `checkout.session.completed`.

This is production-capable for first paid pilots, with one important security follow-up: replace the pasted live secret key with a rotated restricted API key.

## What Stripe's Development Docs Changed

Stripe's development docs reinforce four operating rules for BuilderPerks:

1. Use sandbox keys and test cards for normal integration testing.
2. Use live keys only when ready to accept real payments.
3. Store live server-side keys in environment variables or a secrets vault, never in source.
4. Prefer restricted API keys for backend code instead of unrestricted secret keys.

## Action Items

### Required Before Paid Outreach

- Rotate the live server-side key because it was pasted into Telegram during setup.
- Replace `STRIPE_SECRET_KEY` with a restricted live key if Stripe allows the needed Checkout Session permissions.
- Keep `STRIPE_WEBHOOK_SECRET` separate from API keys.
- Confirm live webhook endpoint remains subscribed to `checkout.session.completed`.
- Keep manual approval after payment so paid bad offers cannot auto-publish.

### Useful, Not Blocking

- Install/login to Stripe CLI for local webhook testing.
- Use `stripe listen` for local webhook development.
- Use Stripe Dashboard request logs when debugging live or sandbox API requests.
- Add a recurring checklist to review Stripe health alerts, failed webhooks, and disputes once real payments start.

## Current Integration Fit

The current implementation follows the right shape:

- Backend-only server function creates Checkout Sessions.
- Live secret is only read from runtime environment.
- Webhook signature is verified before marking a placement paid.
- The publishable key is not required for the current hosted Checkout flow.
- Stripe Connect is intentionally deferred until BuilderPerks has connected merchants, publisher payouts, or marketplace flows.

## Sources

- Stripe developer resources: https://docs.stripe.com/development
- Stripe testing: https://docs.stripe.com/testing
- Stripe API keys: https://docs.stripe.com/keys
- Stripe CLI: https://docs.stripe.com/cli
- Stripe webhooks: https://docs.stripe.com/webhooks
