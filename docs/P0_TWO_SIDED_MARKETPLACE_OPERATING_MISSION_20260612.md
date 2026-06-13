# BuilderPerks P0 Two-Sided Marketplace Operating Mission

## Goal

Turn BuilderPerks from a working prototype into a live two-sided marketplace motion:

- Publisher/builders install and see real ad/perk inventory.
- Ad supply is available through provider lanes first.
- Direct advertiser conversations start with proof from actual usage.
- Customer feedback is collected, synthesized, and converted into product changes.
- Status, blockers, sends, evidence, and next actions are tracked in durable artifacts.

## Founder Direction

Jake's priority is not speculative feature work. The mission is users and ads running:

1. Get publisher users using BuilderPerks.
2. Ensure users can receive ads/perks with clear preference controls.
3. Bring in ad supply through providers first where direct advertisers are not ready.
4. Use traction and feedback to convert first direct paying advertisers.
5. Keep iterating with proof, not vanity work.

## Workstreams

### 1. Product Flow QA

Owner: Kai/Riley lane

Acceptance evidence:

- Verify public landing/install path.
- Verify extension/helper install path.
- Verify ad-stream response on production.
- Verify publisher controls: wanted keywords, blocked keywords, categories, blocked categories, value mode.
- Verify no broken states for blocked or restricted categories.
- Capture screenshots and endpoint outputs under `shared/status/`.
- File precise fixes or ship small fixes when safe.

### 2. Publisher User Acquisition

Owner: Blake/Maya lane

Acceptance evidence:

- Refresh the builder-user target queue.
- Identify highest-likelihood early users from Claude Code, Cursor, AI coding, daily.dev, and devtool communities.
- Produce/send only authenticated, non-spammy outreach where available.
- Record every send, blocked send, reply, and next action in `docs/ACQUISITION_LOG.md`.
- Collect at least three concrete feedback asks/questions for user interviews or async replies.

### 3. Ad Supply / Provider Coverage

Owner: Cole/Atlas lane

Acceptance evidence:

- Map ad-provider lanes by category and fit: devtools, SaaS, AI infra, cloud credits, newsletters/native, affiliate/performance, and regulated/high-value categories.
- Identify which providers are API/self-serve accessible now versus partner/application gated.
- Include niche ad providers when they can get real, relevant inventory live faster than broad generic networks.
- Prioritize niche lanes that match BuilderPerks' early audience: developer tools, AI infra, open-source sponsorships, newsletters/native dev audiences, SaaS credits, affiliate/performance offers, and creator/community sponsorship marketplaces.
- Draft integration order and requirements for the top provider lanes.
- Keep restricted categories opt-in/gated with compliance notes.
- Update `docs/AD_API_RESEARCH_20260612.md` or a successor artifact.

### 4. Direct Advertiser Conversion

Owner: Blake/Morgan lane

Acceptance evidence:

- Refresh direct advertiser target queue with contact path, pitch hook, current status, and next action.
- Prioritize companies already contacted or most likely to buy a small pilot: Firecrawl, Clerk, PostHog, Railway, Langfuse, CodeRabbit, EthicalAds/provider partners.
- Prepare follow-ups based on actual product state and screenshots.
- Do not claim sends unless visible evidence exists.

### 5. Feedback to Breakout Features

Owner: Maya/Barney lane

Acceptance evidence:

- Synthesize Jake's latest insight into product requirements:
  - categories for simple UX,
  - optional keywords for precision,
  - hard blocked topics,
  - value modes,
  - user-controlled monetized attention.
- Compare against shipped behavior.
- Recommend only features that advance installs, ad supply, or advertiser conversion.
- Create a short ranked backlog: ship now, validate next, later.

### 6. Operating Status Packet

Owner: Barney/Sterling lane

Acceptance evidence:

- Produce a current status packet with:
  - what is live,
  - what has been sent,
  - what is blocked,
  - what is being worked now,
  - next 3 moves,
  - evidence paths.
- Report back to Jake in Telegram.

## Guardrails

- No fake traction.
- No deceptive outreach.
- No mass spam.
- No external high-impact send without authenticated access and Jake's directive keyword when required.
- Provider categories that involve gambling, adult, political, financial products, health, or other regulated/high-risk areas must be opt-in/gated and reviewed before production exposure.

## Acceptance Standard

This mission is complete only when there is a durable status packet and the next concrete work is either actively queued through the broker or explicitly blocked with owner and reason.
