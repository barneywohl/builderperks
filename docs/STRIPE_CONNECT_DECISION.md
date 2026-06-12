# Stripe Connect Decision

Generated: 2026-06-12

## Decision

BuilderPerks should keep the current live Stripe Checkout integration for the first advertiser pilots.

Do not build Stripe Connect yet.

## Why

Stripe's SaaS Connect guide says Connect is for platforms that extend Stripe payment processing to connected merchant accounts. In that model, merchants accept payments from their own customers and receive payouts from their Stripe balance.

BuilderPerks v0.2 is not doing that yet. The current product sells manually approved advertiser placements directly through BuilderPerks. That means:

- BuilderPerks is the seller for the placement pilot.
- Advertisers pay BuilderPerks directly.
- There are no third-party merchant accounts to onboard.
- There are no creator or publisher payouts.

The existing Checkout + webhook path is the right first paid-pilot path.

## When To Add Connect

Add Stripe Connect when BuilderPerks becomes one of these:

- A publisher network where site owners or extension creators earn payouts.
- A marketplace where third-party sellers accept payments from their own customers.
- A platform where advertisers or partners need their own Stripe account, Dashboard access, payment method settings, refunds, disputes, or direct charges.
- An agentic commerce platform where connected accounts sell products through AI agents.

## Future Architecture

If Connect becomes necessary:

1. Create connected accounts with Stripe Accounts v2.
2. Use Stripe-hosted onboarding first because it is lower implementation effort.
3. Use direct charges if connected accounts are merchant of record.
4. Add application fees only after the connected-account model is proven.
5. Add refund/dispute handling before any broad launch.

## Sources

- Stripe SaaS platform guide: https://docs.stripe.com/connect/saas
- Stripe SaaS quickstart: https://docs.stripe.com/connect/saas/quickstart
- Stripe SaaS essential tasks: https://docs.stripe.com/connect/saas/essential-tasks
- Stripe connected account creation: https://docs.stripe.com/connect/saas/tasks/create
- Stripe SaaS payments: https://docs.stripe.com/connect/saas/tasks/accept-payment
- Stripe agentic commerce for SaaS platforms: https://docs.stripe.com/connect/saas/tasks/enable-in-context-selling-on-ai-agents
