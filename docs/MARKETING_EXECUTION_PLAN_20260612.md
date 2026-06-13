# BuilderPerks Marketing Execution Plan - 2026-06-12

## Goal

Reach first real users, then first paying advertiser, without broad-launching before proof exists.

## Product Readiness Line

BuilderPerks is ready for narrow acquisition, not broad Product Hunt/Hacker News launch.

Ready:

- Advertiser intake and manual approval.
- Publisher registration.
- Universal ad-stream API.
- Privacy-safe keyword targeting.
- Render variants for terminal, status line, Markdown, IDE cards, extension cards, and agent UIs.
- Tracking, claims, feedback, and stats.
- EthicalAds warm thread.

Not ready for broad launch:

- No real claim.
- No paying advertiser.
- Limited builder feedback.
- Chrome install still requires ZIP/unpacked install.

## Target Research

Best first users are not generic developers. They are people already modifying coding surfaces:

1. Claude Code status-line users.
2. Terminal dashboard / CLI maintainers.
3. Cursor / VS Code extension builders.
4. AI agent runner maintainers.
5. Devtool founders who already sell to AI builders.

Why:

- They understand programmable surfaces.
- They can integrate with a single HTTP call.
- They can provide real publisher inventory proof for EthicalAds.
- They are more likely to tolerate a beta if the integration is transparent and privacy-safe.

## First 10 Outreach Targets

Prioritize people/projects discussing:

- Claude Code `statusLine`.
- Terminal status bars.
- AI coding workflow tools.
- CLI dashboards.
- Devtool discovery.
- Plugin monetization.

Outbound message:

```text
I’m testing BuilderPerks: one privacy-safe sponsored devtool line/card inside AI coding workflows.

It does not send prompts or personal data. Publisher surfaces send broad keywords only, like typescript/react/postgres.

The API returns ready render formats for terminal/status-line/IDE/agent UIs:
GET /api/ad-stream?...&keywords=typescript,react,postgres&format=statusline

Would you test it in one work session and tell me if it feels useful, neutral, or annoying?
```

## First Advertiser Pitch

Target companies:

- Railway
- Neon
- Supabase
- Clerk
- Sentry
- PostHog
- Langfuse
- Helicone
- Firecrawl

Pitch:

```text
BuilderPerks puts one relevant devtool offer inside active AI build moments.

Your category is already a fit: builders deploying apps / adding databases / debugging AI workflows.

Want a $250 manually approved 48-hour pilot? We write the first card, track impressions/clicks/claims/feedback, and send a short report.
```

## Guerrilla Rules

Do:

- Reply only where the topic is already Claude Code/status-line/devtool/AI workflow.
- Lead with privacy-safe keyword targeting.
- Offer to set up the first integration manually.
- Ask for one work-session test, not a generic signup.
- Capture feedback immediately.

Do not:

- Spam Product Hunt/HN cold.
- Say builders are earning real money yet.
- Pitch fake payout arbitrage.
- Send full prompts to partners.
- Build auction/payout/dashboard complexity before proof.

## Product Hunt / HN Gate

Launch only after:

- 5 real publisher surfaces.
- 25 real impressions.
- 5 feedback notes.
- 1 real claim or advertiser pilot signal.
- EthicalAds next-step response or clear rejection.
- One demo GIF / screenshot packet.

## Next Execution Checklist

- [ ] Create proof packet screenshots/GIF.
- [ ] Send EthicalAds pilot packet if David asks for technical detail.
- [ ] Identify 10 status-line/terminal publisher targets.
- [ ] Send authorized targeted outreach.
- [ ] Follow up with Railway/Neon/Supabase-style advertisers using mocked category card.
- [ ] Record every reply and objection in `docs/ACQUISITION_LOG.md`.
