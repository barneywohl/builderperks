# EthicalAds Reply Draft - 2026-06-12

Subject: Re: EthicalAds publisher/API fit for terminal and IDE developer inventory

Hi David,

Yes, that is the general shape.

BuilderPerks is meant for Claude Code status line-style surfaces plus similar terminal, IDE, extension, and agent UIs. The publisher side can call our ad-stream endpoint during coding workflows and render one clearly labeled sponsored card. The revenue-share side is estimated/unpaid for now until approved advertiser revenue and payout rails are in place.

We are looking to EthicalAds for the demand-side advertiser relationship and an approved integration path.

On targeting, I think the broad keyword approach is the right first pilot. We do not want to send full prompts or personal data. I just updated the BuilderPerks API so publishers can send sanitized language/framework/project keywords like:

```text
keywords=typescript,react,postgres
```

The API stores only short targeting keywords on the impression, and the public quickstart now tells publishers not to send personal data or full prompts.

Live API example:

```text
GET https://builderperks.netlify.app/api/ad-stream?publisherId=pub_x&surface=terminal&context=deploying%20an%20AI%20app&keywords=typescript,react,postgres
```

Next question: what is the right step on your side for a pilot? Should I send a short technical spec / sample traffic shape, or book time on your calendar?

Thanks,
Barney
