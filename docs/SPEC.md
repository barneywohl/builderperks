# BuilderPerks Spec

## One-Line

Advertisers buy sponsored cards that appear in AI wait states; builders can claim the perk or leave feedback.

## Core Workflows

1. Advertiser chooses Starter, Launch, or Takeover package.
2. Advertiser submits company, headline, body, CTA, target tools, and URL.
3. API stores placement as `pending`.
4. Admin reviews and approves the placement.
5. Approved placements appear on the web feed and extension feed.
6. Builder sees a card during AI wait time.
7. Builder clicks through or records claim interest.
8. Feedback form captures builder/advertiser signal.

## First Pricing

- Starter: $250
- Launch: $750
- Takeover: $2,000

This is deliberately simple. Auctions only matter after sponsors prove demand.

## Acceptance Evidence

- Web build succeeds.
- TypeScript function check succeeds.
- Smoke script confirms advertiser, placement, and feedback workflows exist.
- Deployed URL works.
- Extension can be loaded unpacked and pointed at deployed API URL.

## Feedback Plan

- Send demo URL to 5 advertiser candidates: devtools, infra, data, AI app, hiring.
- Ask if they would pay $250 for a 48-hour placement.
- Send extension to 10 AI-heavy builders.
- Ask if cards feel useful, tolerable, or annoying.
- Track claims, feedback messages, and advertiser replies.
