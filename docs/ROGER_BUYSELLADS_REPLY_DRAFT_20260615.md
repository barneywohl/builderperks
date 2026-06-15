Subject: Re: BuilderPerks ad-serving API / developer inventory partnership

Hi Roger,

Quick correction on my last reply: the content was right, but Gmail received escaped line breaks, so it rendered badly. Sorry about that.

The short version is:

BuilderPerks is not a paid-to-view or incentivized-impression product.

It is an opt-in publisher surface for developer workflows: terminal/status line, IDE, extension, or agent UI. The publisher can show one clearly labeled sponsored devtool offer in context. Users can ignore it, hide categories, or block it. There is no reward for individual users to watch, click, or generate impressions.

I also tightened the product so third-party demand is gated correctly:

- External providers only become serve-ready after credentials plus explicit provider approval.
- Approved partner JSON offer feeds can now enter the serving pool without misrepresenting unapproved networks as live.
- Partner ads still use coarse context only: surface, broad tooling keywords, blocked categories, and publisher opt-ins. No raw prompts or personal data.
- Restricted categories remain off by default.

If this model fits the Carbon/BuySellAds standards better than the initial page suggested, what is the right API or publisher evaluation path for this kind of terminal/IDE/native developer inventory?

Thanks,
Barney
