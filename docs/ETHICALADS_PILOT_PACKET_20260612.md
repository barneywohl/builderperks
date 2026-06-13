# EthicalAds Pilot Packet - 2026-06-12

## Goal

Get EthicalAds to approve a small BuilderPerks pilot as a developer-native publisher surface for Claude Code status-line style interfaces, terminals, IDEs, extensions, and agent UIs.

## Why This Fits

BuilderPerks is not a generic ad slot. It is a contextual sponsored devtool/perk surface shown during an active build workflow.

The pilot thesis:

- Developers are already in build mode.
- The publisher surface sends broad programming/project keywords only.
- EthicalAds supplies privacy-conscious developer demand.
- BuilderPerks renders one labeled sponsored card or status-line message.
- Clicks, claims, impressions, feedback, and estimated unpaid publisher earnings are tracked.

## Live Product

- Site: `https://builderperks.netlify.app/`
- Register publisher: `POST /api/publishers`
- Stream ad: `GET /api/ad-stream`
- Track redirect: `GET /api/track`
- Stats: `GET /api/stats`

Current live stats after audit traffic:

- Approved placements: `2`
- Clicks: `6`
- Builder signups: `1`
- Publishers: `2`
- Ad impressions: `5`
- Estimated unpaid publisher earnings: `$0.10`

## Privacy-Safe Targeting

BuilderPerks does not need full prompts, private code, user profiles, or personal data.

Publishers send broad targeting keywords:

```text
keywords=typescript,react,postgres
```

BuilderPerks stores only sanitized short keywords on the impression. The live API returns the exact targeting object so publishers can inspect what was used:

```json
{
  "keywords": ["typescript", "react", "postgres"],
  "categories": ["hosting", "database", "ai"],
  "note": "Send broad programming language, framework, and project keywords only. Do not send personal data or full prompts."
}
```

## Status-Line Format

Claude Code/status-line and terminal-native publishers can request:

```text
format=statusline
```

Example request:

```bash
curl "https://builderperks.netlify.app/api/ad-stream?publisherId=pub_x&surface=terminal&context=deploying%20an%20AI%20app&keywords=typescript,react,postgres&format=statusline"
```

Example response shape:

```json
{
  "render": {
    "format": "statusline",
    "statusLine": "Sponsored: Railway - $5 in credits for AI builders shipping tonight | https://builderperks.netlify.app/api/track?placementId=seed-railway&source=stream..."
  }
}
```

## Pilot Ask

BuilderPerks should ask EthicalAds for the next concrete pilot step:

1. Technical approval for a keyword-only integration.
2. Confirmation of the ad request fields EthicalAds would need.
3. Guidance on whether sample traffic should be sent before live demand.
4. A small pilot with LLM/status-line inventory if they are ready.

## Guardrails

- No full prompts.
- No personal data.
- No incentivized clicks.
- No fake views.
- Publisher earnings remain estimated/unpaid until approved advertiser revenue and payout rails exist.
- Builders must see a clear sponsored disclosure.
