# BuilderPerks Third-Party Serving Activation

Status checked: 2026-06-15 13:20 ET

## Current State

- Production provider status: 78 mapped providers, 0 third-party providers can serve now.
- Production credentials configured: 0.
- Production provider approvals configured: 0.
- Current live demand source: BuilderPerks seed/direct approved placements only.
- Production stats at check: 70 impressions, 9 clicks, 0 claims, 9 publishers, 1 builder signup, 6 pending proof sessions, 0 verified proof/workflow sessions.

## What Is Already Built

- `/api/ad-stream` can serve approved placements to terminal, IDE, extension, and agent publisher surfaces.
- Third-party JSON offer feeds are wired through `BUILDERPERKS_APPROVED_PARTNER_FEED_URLS`.
- Provider-specific readiness is mapped in `_providers.mts`.
- Provider ads remain gated by:
  - credentials or feed URL,
  - explicit provider approval,
  - approved placement/feed item shape,
  - publisher category controls,
  - restricted category opt-ins.

## Fastest Lawful Activation Path

Use an approved JSON offer feed first. This is faster than waiting for a full ad-network API integration and still avoids claiming unapproved networks are live.

Required production env:

```text
BUILDERPERKS_APPROVED_PARTNER_FEED_URLS=https://example.com/builderperks-approved-offers.json
```

Feed item shape:

```json
{
  "company": "Example Devtool",
  "headline": "Relevant offer headline",
  "body": "One sentence that explains the developer benefit.",
  "cta": "Learn more",
  "url": "https://example.com/offer",
  "audience": "AI builders",
  "targetTools": ["Claude", "Cursor", "ChatGPT"],
  "categories": ["ai", "data", "productivity"]
}
```

After env is configured, verify:

```bash
curl -sS https://builderperks.netlify.app/api/provider-status
curl -sS "https://builderperks.netlify.app/api/ad-stream?publisherId=pub_x&surface=terminal&context=building%20an%20AI%20research%20agent&keywords=ai,data&format=statusline"
```

## Provider-Specific Activation Path

For a named provider, configure the provider credential env and the explicit approval flag only after that provider approves BuilderPerks terminal/IDE/native inventory.

Example for EthicalAds:

```text
BUILDERPERKS_ETHICALADS_PUBLISHER_ID=...
BUILDERPERKS_PROVIDER_APPROVED_ETHICALADS=1
```

Example for Carbon CLI:

```text
BUILDERPERKS_CARBON_CLI_SDK_KEY=...
BUILDERPERKS_PROVIDER_APPROVED_CARBON_CLI=1
```

Example for BuySellAds publisher endpoint:

```text
BUILDERPERKS_BSA_ADS_URL=...
BUILDERPERKS_PROVIDER_APPROVED_BUYSELLADS_PUBLISHER=1
```

## Guardrails

- Do not set approval env vars for networks that have not approved terminal/IDE/native inventory.
- Do not enable adult, gambling, dating, sweepstakes, crypto, or push/pop lanes as default developer inventory.
- Do not store raw prompts or personal data in feed/context fields.
- Do not describe mapped providers as serving providers until `/api/provider-status` shows `canServeNow`.

## Immediate Owner Action Needed

Pick one approved third-party source:

1. A partner-provided JSON offer feed URL, or
2. a provider credential plus written approval for BuilderPerks terminal/IDE/native inventory.

Then configure the matching Netlify env vars and rerun the verification commands above.
