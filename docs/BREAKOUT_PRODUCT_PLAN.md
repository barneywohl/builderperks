# BuilderPerks Breakout Product Plan

## Thesis

The current MVP proves the surface can exist, but the breakout version cannot be framed as ads in AI wait time. Developers will resist that.

The breakout version is contextual build assistance during AI wait time:

> BuilderPerks detects what a builder is trying to ship and surfaces the one useful tool, credit, template, or next step that helps that build move forward.

Advertisers pay because the placement is tied to a real build moment, not a generic impression.

## Hard Critique

### What Is Working

- Product is live.
- Extension works as a beta.
- Placement submission, approval, feed, tracking, claims, feedback, and admin all work.
- Public GitHub/release/social/outreach funnel exists.
- v0.1.1 added the first trust controls: dismiss, pause, enable/disable, daily cap.

### What Is Not Breakout Yet

- The install ask is still uphill: "install an ad extension" is not a natural developer desire.
- The offers are feed-based, not context-matched.
- There is no compounding user habit yet.
- Advertisers do not yet get a strong ROI dashboard or intent story.
- Builders do not yet get a clear saved-money/saved-time loop.
- Chrome Web Store trust and onboarding are missing.
- Stripe/payment links are not live.

## Breakout Feature

### BuilderPerks Copilot

During AI wait states, the extension locally classifies the current build context and shows only a relevant card.

Examples:

- Postgres, SQL, schema, migration -> Neon / Supabase / Turso.
- Deploy, Docker, hosting, logs -> Railway / Fly.io / Render.
- Browser automation, scraping, crawler -> Browserbase / Firecrawl.
- LLM evals, traces, observability -> Langfuse / Helicone.
- Code review, PR, tests -> CodeRabbit / Sentry / Checkly.
- No confident match -> show nothing, or ask what perk would help.

This moves BuilderPerks from inventory to intent.

## Product Principles

- One card at a time.
- Local/contextual matching first; no cross-site profile.
- No advertiser scripts.
- Manual approval until the quality bar is proven.
- User can dismiss, pause, disable, and cap frequency.
- If there is no useful match, do not show a card.
- Every card must be a real benefit: credits, useful template, setup shortcut, or relevant tool.

## Implementation Plan

### Phase 1: Intent-Matched Cards

Add fields to placements:

- `categories`: database, hosting, observability, ai-infra, browser-automation, code-review, testing, docs.
- `keywords`: advertiser-provided and admin-reviewed.
- `offerType`: credits, trial, template, guide, discount, consultation.
- `expiresAt`: optional.

Extension:

- Extract visible wait-state context from nearby text.
- Match keywords/category locally.
- Score each placement.
- Show only the highest-scoring approved placement.
- If no placement passes threshold, show nothing.

### Phase 2: Feedback That Trains The Market

Add card actions:

- `Need this`
- `Not relevant`
- `Hide this category`
- `I already use this`

Track:

- matched category
- action
- source tool
- placement id

This gives advertisers better signal than raw clicks.

### Phase 3: Advertiser ROI Packet

Create per-placement reporting:

- impressions/matched moments
- clicks
- claims
- "Need this" count
- "Not relevant" count
- feedback snippets
- screenshot/mockup of card
- category/context where it matched

This makes the $250 pilot easier to close.

### Phase 4: Builder Value Loop

Add a small "Perks I saved" view:

- claimed offers
- hidden categories
- useful tools discovered
- total credits available

This gives builders a non-ad reason to keep the extension.

### Phase 5: Trust And Distribution

- Publish Chrome Web Store listing.
- Add privacy page: local matching, no advertiser scripts, no sensitive-history profile.
- Add public banned-categories page.
- Add Product Hunt/HN only after 10+ real feedback notes.
- Use GitHub issues as public feedback loop until there is enough volume for in-app forum/community.

## Growth Plan

### Builder Side

- Lead with "AI wait-time utility," not ads.
- Ask for one work session and one rating: useful / neutral / annoying.
- Reply only to highly relevant Claude/Cursor/v0/Lovable/Bolt threads.
- Make the public scoreboard show matched categories and feedback, not just clicks.

### Advertiser Side

- Pitch intent, not impressions:
  "Your offer appears only when a builder is working on a relevant build context."
- Sell first pilots to companies where the category match is obvious:
  Neon/Supabase/Turso, Railway/Fly/Render, Langfuse/Helicone, Browserbase/Firecrawl, CodeRabbit.
- Offer to write and mock their first card.

## 7-Day Goal

- 25 builder testers.
- 10 written builder feedback notes.
- 10 advertiser conversations.
- 3 payment-ready advertisers.
- 1 paid pilot or explicit written commitment.
- Less than 20% of testers say "annoying."
- At least 1 in 10 matched cards gets click/claim/Need-this signal.

## Next Build Slice

Build `Build Moment Reports + Need this / Not relevant / Hide category` first.

Acceptance:

- Extension tracks `Need this`, `Not relevant`, and `Hide category` actions.
- Events include placement id, source, match reason, and timestamp.
- `/api/stats` includes matched/relevance feedback.
- Admin view shows per-placement relevance signals.
- A simple report can be sent to an advertiser after a 48-hour pilot.

This is the fastest path to making BuilderPerks meaningfully different from Carbon, EthicalAds, and daily.dev.

See also: `docs/BREAKOUT_FEATURE_REVIEW_20260612.md`.
