# BuilderPerks 5-Hour First-User Sprint

## Goal

By the end of the sprint, BuilderPerks should have first-user acquisition motion underway with proof:

- 10 builder tester asks sent or queued to authenticated channels.
- 10 advertiser pilot asks sent or queued to authenticated channels.
- 1 payment-ready advertiser conversation targeted.
- Live stats checked and recorded.
- All sends/replies/statuses logged in `docs/FIRST_USER_TARGETS.csv`.

## Timebox

Start: 2026-06-12 04:50 ET  
End: 2026-06-12 09:50 ET

## Acceptance Evidence

- Live app URL: https://builderperks.netlify.app/
- Sprint artifact: `docs/FIRST_USER_CAMPAIGN.md`
- Target queue: `docs/FIRST_USER_TARGETS.csv`
- Launch playbook: `docs/GUERRILLA_LAUNCH_PLAYBOOK.md`
- Status artifact: `artifacts/FIRST_USER_SPRINT_STATUS.md`
- Live stats snapshot from `/api/stats`.

## Workstreams

### Growth / Advertiser Pilots

Owner: Blake-style BD lane

Deliverables:

- Prioritize 10 devtool advertisers.
- Identify best contact path for each.
- Prepare one personalized opening line per target.
- Mark status as `ready_to_send`, `sent`, or `blocked_auth`.

Priority advertiser list:

- Railway
- Neon
- Supabase
- Turso
- Fly.io
- Render
- Langfuse
- Browserbase
- Firecrawl
- CodeRabbit

### Builder Tester Seeding

Owner: Maya/Community lane

Deliverables:

- Identify 10 builder-user surfaces.
- Prepare channel-specific post/reply/DM copy.
- Mark status as `ready_to_send`, `sent`, or `blocked_auth`.

Priority builder surfaces:

- Claude Code posts
- Cursor power users
- v0/Lovable/Bolt builders
- r/ClaudeAI
- r/ChatGPTCoding
- r/SideProject
- daily.dev Squads
- Hacker News later wave

### Copy / Public Attention

Owner: Morgan/content lane

Deliverables:

- Public post copy.
- Builder DM.
- Advertiser DM.
- Follow-up copy.
- Demo/screenshot copy.

### Product Proof / Readiness

Owner: Riley/Kai lane

Deliverables:

- Verify live app.
- Verify live stats endpoint.
- Verify admin access.
- Verify extension ZIP.
- Record evidence paths.

### Coordination / Closeout

Owner: Barney/Sterling lane

Deliverables:

- Mission status.
- Blockers.
- Next checkpoint.
- Updated artifacts.

## Approval Boundary

External sending is allowed only through authenticated accounts/channels that are available in the runtime or explicitly opened by Jake. No fake accounts, no fake traction, no mass spam, no deceptive claims.

## Current Known Blockers

- No Gmail/X/Reddit sender connector is currently exposed in this runtime.
- Stripe live payment collection is not active until Stripe credentials or Payment Links are provided.

## Execution Standard

If sending is blocked by channel auth, produce a send-ready queue with target, channel, message, and next action. Do not claim sends happened unless they actually happened.
