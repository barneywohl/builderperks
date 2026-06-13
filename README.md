# BuilderPerks

Sponsored builder offers during AI wait states.

Live beta: https://builderperks.netlify.app/

BuilderPerks is looking for first testers. Try it for one AI coding work session and tell us whether it feels useful, neutral, or annoying.

## Beta Tester CTA

1. Download the beta extension ZIP from the live site or latest GitHub release.
2. Load `extension/` as an unpacked Chrome extension, or unzip the packaged beta.
3. Work normally in Claude, ChatGPT, Cursor, v0, Lovable, Bolt, or another AI build tool.
4. Open a `Builder beta feedback` issue with the result.

The beta includes builder controls from the first complaint pass: dismiss any card, pause cards for the day, disable cards, and cap daily card appearances. Version 0.2.0 also locally matches offers to the page context and shows why a card appeared.

## Advertiser Pilot CTA

Devtool companies can test a manually approved launch placement:

- $250 starter pilot.
- 48-hour placement.
- Manual approval before anything goes live.
- Clicks, claims, and feedback tracked.

Open an `Advertiser pilot interest` issue or use the live buy form.

## What Ships In This MVP

- Advertiser buy request form with package selection.
- Placement API that records pending ads.
- Admin approval workflow for pending ads.
- Public live placement feed.
- Builder claim workflow.
- Click tracking for advertiser reporting.
- Builder/advertiser feedback capture.
- Chrome extension that reads the live feed, locally matches offers to AI build context, and injects cards near wait-state text.
- Supply-side ad stream API for terminal, IDE, extension, and agent publishers.

## Publisher API Quickstart

Register a publisher surface:

```bash
curl -X POST https://builderperks.netlify.app/api/publishers \
  -H "content-type: application/json" \
  -d '{"name":"My CLI","email":"founder@example.com","surface":"terminal"}'
```

Stream a labeled sponsored card:

```bash
curl "https://builderperks.netlify.app/api/ad-stream?publisherId=pub_x&surface=terminal&context=deploying%20an%20AI%20app&keywords=typescript,react,postgres&format=statusline"
```

Use the returned `card` fields in your UI and route clicks through the returned `clickUrl`.
Use `keywords` for broad programming language, framework, and project targeting only.
Do not send personal data or full prompts.
Terminal publishers can use `format=statusline` and render `render.statusLine` directly.
Publisher earnings are estimated and unpaid until advertiser revenue and payout rails are approved.

## KISS Scope

No auction engine, no wallet payouts, no revenue share ledger, no self-serve targeting dashboard.
The first product question is whether advertisers want this attention surface and whether builders tolerate or value the cards.

## Local

```bash
cd projects/builderperks/web
npm install
npm run build
npm run check
npm run smoke
npm run smoke:api
```

Use `npm run dev` for Netlify local functions. `npm run smoke:api` defaults to `http://localhost:8888` and refuses to mutate a non-local site unless `BUILDERPERKS_MUTATE_LIVE=1` is set.

## Admin

Set `BUILDERPERKS_ADMIN_KEY` in production. Without it, the demo key is `demo-admin`.

Set `BUILDERPERKS_CHECKOUT_URL` to route every buy request into Stripe or another checkout page.
For package-specific Stripe Payment Links, set:

- `BUILDERPERKS_CHECKOUT_URL_STARTER`
- `BUILDERPERKS_CHECKOUT_URL_LAUNCH`
- `BUILDERPERKS_CHECKOUT_URL_TAKEOVER`

For dynamic Stripe Checkout Sessions, set:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Then configure a Stripe webhook for `checkout.session.completed` pointing at `/api/stripe-webhook`.
Paid sessions are marked `paid`; approval is still manual so bad offers cannot go live automatically.
Without Stripe credentials or checkout URLs, buy requests are stored as invoice/manual approval requests.

Jake/company must create or own the Stripe account because Stripe needs business, tax, ownership, and bank details. Once the live API keys exist, BuilderPerks can accept paid placement requests.

Stripe Connect is intentionally not in the first paid-pilot path because BuilderPerks is currently charging advertisers directly, not onboarding third-party merchants or paying out publishers. See `docs/STRIPE_CONNECT_DECISION.md`.

Stripe development/security checklist: `docs/STRIPE_DEVELOPMENT_CHECKLIST.md`.

## Extension

Load `projects/builderperks/extension` as an unpacked Chrome extension, then set the deployed API URL in the popup.

## Growth

- Acquisition sprint: `docs/USER_ACQUISITION_SPRINT.md`
- First-user campaign: `docs/FIRST_USER_CAMPAIGN.md`
- First-user target queue: `docs/FIRST_USER_TARGETS.csv`
- Outreach copy: `docs/OUTREACH.md`
- Guerrilla launch playbook: `docs/GUERRILLA_LAUNCH_PLAYBOOK.md`
