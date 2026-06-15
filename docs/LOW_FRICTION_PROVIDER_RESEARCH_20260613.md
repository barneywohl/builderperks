# Low-Friction Provider Research - 2026-06-13

Founder question: find a niche ad/provider path that can approve quickly, and verify whether BuilderPerks works naturally in terminals and IDEs.

## Decision

The best immediate niche target is Carbon's tool-native/CLI product, not generic web-display ad networks.

Carbon now explicitly positions a product for CLI tools, AI assistants, IDE extensions, and terminal apps. That is the closest external demand lane to BuilderPerks' real app/tool-native surfaces. Treat it as a primary commercial onboarding lane, not as a strange or unsupported inventory type.

Second-best demand lane remains EthicalAds because it is developer/privacy aligned and already has a warm reply thread. It is also approval-based.

Fastest "real offer" backfill is affiliate/referral marketplaces such as PartnerStack, FlexOffers, and Awin. These are not CPM/native ad networks. They can provide disclosed SaaS/tool offers if BuilderPerks joins approved programs, but they should be shown as affiliate/referral offers with proper disclosure and compliance review.

The deeper answer to "there must be an API" is yes: many ad APIs can stream ads into a website, app, or custom UI. Google Ad Manager, Kevel, AdButler, AdGlare, Epom, Broadstreet, and Revive can all serve or manage ads programmatically in some form. BuilderPerks should frame itself as an app/tool-native sponsored placement surface. The next step is choosing the right commercial lane: AI-native network demand, tool-native developer demand, self-sold campaigns, mobile/app networks, or disclosed SaaS/referral offers.

Jake's push to expand beyond obvious providers was correct. The newer strategic category is AI-native ads: AdsBind, ChatAds, Nexad, Aryel In-Chat Ads, Microsoft chat ads, and related emerging networks. These are closer to BuilderPerks' product shape than legacy display networks because they are explicitly about native placements inside AI/chat/app interactions.

Jake is also right that Google is not the highest-paying demand ceiling. Higher-paying lanes usually come from narrower buyer intent: B2B SaaS, enterprise IT, cybersecurity, finance/insurance, crypto/web3, cloud/data infrastructure, and high-value SaaS affiliate programs. BuilderPerks should support those lanes without making them default. The right architecture is category-gated demand: default safe developer ads first, high-value categories only when a publisher/user explicitly opts in.

Jake's "all categories, don't limit" direction is correct at the platform layer. BuilderPerks should not hard-code itself into only devtool ads forever. The product should support a broad category taxonomy: developer tools, cloud, AI, cybersecurity, data, productivity, design, marketing, ecommerce, education, jobs, travel, real estate, finance, legal, health, gaming, crypto/web3, adult, dating, sweepstakes/CPA, push/pop, and gambling/iGaming. The default experience should still be narrow and trustworthy: safe developer/SaaS/cloud/security/data offers first, with regulated and restricted categories requiring explicit publisher/user opt-in.

## Provider ranking

| Rank | Provider lane | Why it matters | Reality check | BuilderPerks action |
| --- | --- | --- | --- | --- |
| 1 | Carbon for CLI, AI assistants, IDE extensions | Best surface match: CLI, AI assistant, IDE extension, terminal app | Commercial onboarding lane | Add readiness lane, pursue approval, prepare proof packet |
| 2 | EthicalAds | Developer/privacy ad network, no tracking posture, tool/web-app fit | Approval-based, warm conversation exists | Continue warm thread with live stats and tool-native proof |
| 3 | PartnerStack | Large SaaS partner marketplace with developer/SaaS offers | Affiliate/referral sponsored-offer lane | Candidate for disclosed offer backfill |
| 4 | FlexOffers | Broad affiliate network plus Web Services API | Affiliate/referral sponsored-offer lane | Candidate for disclosed offer feed |
| 5 | Awin | Publisher APIs and offer/link tooling | Affiliate/referral sponsored-offer lane | Candidate for approved offer feed |
| 6 | AdButler / Kevel | Good infrastructure for self-sold ads and ad decisions | Does not bring demand by itself | Keep as infrastructure lanes after direct advertisers exist |

## Newer / niche app and AI-native candidates

| Provider | Category | Why it matters | BuilderPerks action |
| --- | --- | --- | --- |
| AdsBind | AI app monetization | Built for devs adding ads to AI apps with contextual/brand-safety positioning | High-priority outreach / API access check |
| ChatAds | AI chatbot/app monetization | Tracks AI chatbot/app ad networks, native ads, sponsored content, and affiliate units | High-priority access check |
| Nexad | AI-native advertising | AI-native ads for AI applications/search/chat, backed by venture funding | Strategic BD lane |
| Aryel In-Chat Ads | AI conversation ads | In-chat ad distribution for AI conversation surfaces | Explore publisher/app partner route |
| Microsoft chat ads | AI/chat app monetization | Announced monetization solution for online services, apps, and publishers with native chat experiences | Explore Microsoft Advertising partner route |
| Carbon CLI/tool-native | Tool-native developer ads | Explicitly supports CLI tools, AI assistants, IDE extensions, and terminal apps | Primary developer-native demand lane |
| Idlen | Developer ads | Carbon alternative targeting developers with broader placement / tech-stack targeting | Contact as developer-demand candidate |
| Paved | Developer newsletter sponsorships | Developer newsletter demand and sponsor matching | Use for user acquisition / sponsor lead generation |
| beehiiv sponsorships | Newsletter sponsor marketplace | One-click ad placement and sponsor management for newsletters | Use for audience acquisition or future media inventory |
| Meta Audience Network | Mobile app ads | Large app advertiser demand and native/mobile formats | Relevant only for mobile/app SDK surfaces |
| AppLovin MAX | Mobile app mediation | Large mobile monetization/mediation platform | Relevant for mobile/app SDK experiments |
| CAS.AI | Mobile app mediation | Mobile monetization with native ad formats and hybrid waterfall/RTB | Relevant for mobile/app SDK experiments |
| Yango Ads | Mobile app ads | Mobile ad network/mediation positioning with native placements | Relevant for mobile/app SDK experiments |

## High-paying niche demand categories

| Category | Provider examples | Why it can pay more | Product trust guardrail |
| --- | --- | --- | --- |
| B2B SaaS / software affiliate | PartnerStack, Impact, CJ Affiliate, Rakuten Advertising, Partnerize, FlexOffers, Awin | High LTV SaaS products can pay recurring or high bounty commissions | Disclose sponsored/referral offer; prefer devtool/SaaS fit |
| Cloud / devtools / developer ads | Carbon, Carbon CLI, EthicalAds, Idlen, BuySellAds | Developer intent is valuable and directly aligned with BuilderPerks | Default-safe if offers are devtool-relevant and non-invasive |
| AI-native app ads | AdsBind, ChatAds, Nexad, Aryel, Microsoft chat ads | Emerging category built for AI/chat/app native placements | High priority, but require brand-safety and no prompt leakage |
| Cybersecurity / enterprise IT | Informa TechTarget, Foundry, TechnologyAdvice, Madison Logic | Enterprise leads and intent data are high value | B2B lead-gen style; use only if experience stays lightweight |
| Finance / insurance / legal | Impact, CJ, Rakuten, Partnerize, direct advertisers | High commissions and advertiser LTV | Explicit opt-in, compliance review, no default developer flow |
| Crypto / web3 | Coinzilla, Bitmedia, Cointraffic, A-ADS, AdEx | High advertiser spend in bull markets and niche targeting | Explicit crypto/web3 opt-in only; blocked by default |
| Premium native | Outbrain, Taboola, MGID, TripleLift, Revcontent | Large demand and native formats | Strict quality/category filtering; not default for devtools |
| SSP / exchange | Sovrn, PubMatic, Magnite, Index Exchange, Amazon Publisher Services | Scaled programmatic demand once inventory grows | Later-stage scale lane, requires meaningful supply and controls |
| Adult / XXX / restricted | ExoClick, TrafficJunky, TrafficStars, JuicyAds, PlugRush, Adnium, EroAdvertising, TwinRed, TrafficFactory, TrafficShop, Clickadu | Large traffic pools and higher-payout verticals can fill quickly | Restricted inventory only; explicit opt-in, age/geo/legal gating, never default AI/devtool flow |
| Dating / adult CPA | CrakRevenue, Cpamatica, Trafee, Mobipium | CPA/smartlink offers can monetize niche traffic faster than CPM demand | Disclosed sponsored/referral offers only; category consent and offer review required |
| Gambling / iGaming | 1xBet Partners, Betway Partners, PIN-UP Partners | Very high CPA/rev-share economics in eligible markets | Strict legal geo checks, age gating, advertiser review, blocked by default |
| Push / pop / broad CPA | RichAds, PropellerAds, Adsterra, Mondiad, ClickDealer, MaxBounty, Zeydoo | Broad fill and performance budgets can be accessible earlier than premium display | Use only where the format fits; no intrusive units in developer AI workflows |
| Mainstream commerce / jobs / education / travel | Impact, CJ, Rakuten, Partnerize, direct sponsors, native networks | Large advertiser bases and lower policy risk than restricted verticals | Allowed when relevant, still quality filtered |
| Real estate / housing | Impact, CJ, Rakuten, direct advertisers | Higher-value leads and local intent | Explicit opt-in and fair-housing/policy review |
| Gaming / game development | Direct sponsors, mobile/app networks, native networks | Strong fit for game builders, engines, assets, hosting, analytics | Keep separate from gambling/iGaming |

## High-value provider map

| Provider | Lane | BuilderPerks use |
| --- | --- | --- |
| Impact.com | high-value affiliate | SaaS, finance, commerce, and B2B referral/sponsored offers |
| CJ Affiliate | high-value affiliate | Broad advertiser catalog and high-value affiliate offers |
| Rakuten Advertising | high-value affiliate | Premium commerce/finance/software partnership offers |
| Partnerize | high-value affiliate | Enterprise partnership automation and high-value offers |
| Coinzilla | crypto/web3 | Crypto/web3 sponsored offers, opt-in only |
| Bitmedia | crypto/web3 | Crypto/gaming/blockchain ad demand, opt-in only |
| Cointraffic | crypto/web3 | Premium crypto publisher network, opt-in only |
| A-ADS | crypto/privacy | Privacy/crypto demand, high trust risk, opt-in only |
| AdEx | crypto/web3 | Web3 ad network candidate, opt-in only |
| Informa TechTarget | B2B intent | Enterprise IT/cloud/security/software demand |
| Foundry / IDG | B2B intent | Enterprise tech buyer audience and intent demand |
| TechnologyAdvice | B2B intent | Cybersecurity/SaaS/IT lead-gen and content syndication |
| Madison Logic | B2B intent | ABM/enterprise software demand |
| Outbrain | premium native | Native distribution experiments with strict quality controls |
| Taboola | premium native | Native/storytelling demand with strict filtering |
| MGID | premium native | Native demand candidate; quality review required |
| TripleLift | premium native | Premium native/programmatic lane |
| Revcontent | premium native | Native network candidate; quality controls required |
| Sovrn | publisher SSP / commerce | Publisher monetization and commerce/affiliate lane |
| PubMatic | SSP | Later-stage programmatic demand |
| Magnite | SSP | Later-stage programmatic demand |
| Index Exchange | SSP | Later-stage premium exchange demand |
| Amazon Publisher Services | SSP | Later-stage app/web demand through Amazon publisher services |

## Restricted / explicit opt-in high-payout map

These lanes should exist in BuilderPerks' provider map because Jake is right that all categories need to be considered. They should not become the default product experience. The default developer/AI workflow must remain clean, low-friction, and trust-preserving.

| Provider | Category | BuilderPerks use | Guardrail |
| --- | --- | --- | --- |
| ExoClick | adult / mainstream ad network | Restricted-category ad fill candidate | Enable only on opted-in adult inventory with age/geo/legal checks |
| TrafficJunky | adult ad marketplace | High-volume restricted inventory candidate | Never default; explicit publisher/user category consent |
| TrafficStars | adult ad network | Native/display/video/pop candidate for restricted surfaces | Keep separate from AI/devtool inventory |
| JuicyAds | adult publisher network | Restricted adult inventory candidate | Approval, age gate, and category block controls required |
| PlugRush | adult/mainstream push/native/pop | Restricted fill lane | No intrusive formats in developer workflows |
| Adnium | adult CPM network | Banner/pop candidate for restricted adult inventory | Explicit XXX/adult opt-in only |
| EroAdvertising | adult advertising network | Publisher monetization candidate with multiple formats | Adult/XXX opt-in and compliance gating required |
| TwinRed | adult/dating/iGaming ad network | Publisher/RTB-style candidate for restricted verticals | Legal, age, geo, and category controls required |
| TrafficFactory | adult traffic network | Large-scale restricted traffic candidate | Adult/XXX opt-in only |
| TrafficShop | traffic monetization network | Restricted/high-risk traffic fill candidate | Quality, policy, and category controls required |
| Clickadu | broad/adult-capable ad network | Push/pop/banner/video/skim candidate | Format-sensitive inventory only |
| HilltopAds | broad traffic network | Push/pop/broad fill candidate | Strict quality filters and explicit controls required |
| AdMaven | broad performance ad network | Publisher API and performance-format candidate | Not default for developer workflows |
| CrakRevenue | dating/adult CPA | Disclosed restricted referral/sponsored-offer backfill | Offer review and disclosure required |
| Cpamatica | dating/performance CPA | Smartlink/CPA candidate | Consent, disclosure, and category gating required |
| Trafee | dating/adult smartlink CPA | Restricted CPA candidate | Never default; only opted-in category surfaces |
| Mobipium | mobile/performance CPA | Performance backfill candidate | Use only where offer quality and category fit are reviewed |
| ClickDealer | CPA network | Broad performance offers across many verticals | Program approval plus disclosure required |
| MaxBounty | CPA network | High-payout CPA offer candidate | Offer approval and explicit disclosure |
| Zeydoo | CPA network | Broader performance backfill candidate | Quality controls before any live use |
| RichAds | push/pop/native | Quick-fill push/pop/native candidate | Avoid formats that interrupt AI/developer workflows |
| PropellerAds | push/pop/native | Large broad-fill network | Opt-in surfaces only; no default terminal/IDE use |
| Adsterra | display/native/pop/social bar | Broad-fill candidate | Strict quality/category controls required |
| Mondiad | push/native | Broader performance fill candidate | Opt-in only and quality filtered |
| 1xBet Partners | iGaming affiliate | Restricted gambling affiliate lane | Legal geo checks, age gating, opt-in only |
| Betway Partners | iGaming affiliate | Restricted gambling affiliate lane | Legal geo checks, age gating, opt-in only |
| PIN-UP Partners | iGaming affiliate | Restricted gambling affiliate lane | Legal geo checks, age gating, opt-in only |

Restricted-category implementation rule:

- Default developer and AI-assistant inventory must not serve adult, gambling, dating, crypto, intrusive push/pop, or low-quality CPA demand.
- These categories can be configured only by provider env gates plus explicit publisher/user category opt-in.
- The app should keep allow/block controls surfaced in onboarding and publisher settings.
- No raw prompts, personal data, or private code context should ever be sent to providers.
- These lanes are for commercial breadth and cold-start optionality, not for the default BuilderPerks brand.

## Ad APIs that can stream ads to websites/apps/custom UIs

| Provider | What the API can do | Demand reality | BuilderPerks fit |
| --- | --- | --- | --- |
| Google Ad Manager | Manage inventory, orders, and reports for website/app ad serving | Network/access setup | Useful later for broader website/app inventory |
| Google AdMob | Mobile app ad monetization through SDKs/ad units | Mobile app setup | Relevant if BuilderPerks ships a mobile app surface |
| Kevel Decision API | Server-side ad decisions for custom/native ad units | Bring or manage campaigns/demand | Good long-term marketplace/ad decision layer |
| AdButler JSON Ad API | Request ad items in JSON and style them natively | Self-sold or approved campaigns | Good campaign infrastructure |
| AdGlare Native JSON | JSON endpoint/native ad server for websites/apps | Self-sold or approved campaigns | Good native serving option |
| Epom Ad Server API | Campaign, targeting, stats, and creative management | Ad-server operations lane | Good full ad-server operations option |
| Broadstreet | Ad manager/API for direct-sold publishers | Direct-sold lane | Useful if BuilderPerks runs direct-sold sponsorships |
| Revive Adserver | Self-hosted/open-source zone invocation and ad serving | Self-hosted campaign lane | Cheapest self-sold control path |
| Vistar Media | REST ad-serving API for media owners / proof-of-play | Digital-out-of-home style surface | Low priority for BuilderPerks |

## Source evidence

- Carbon CLI/tool product: `https://www.carbonads.net/cli`
  - Carbon describes monetizing CLI tools, AI assistants, IDE extensions, and terminal apps.
  - It says tool authors choose placements such as post-install, post-build, between responses, and panel integrations.
- Carbon publisher network: `https://www.carbonads.net/join`
  - Publisher flow is apply/contact based.
- EthicalAds publishers: `https://www.ethicalads.io/publishers/`
  - Developer-focused, no tracking, one controlled ad, human support.
- EthicalAds web/tool topic: `https://www.ethicalads.io/publishers/topics/web-developers/`
  - Positions EthicalAds for online tools and developer audiences.
- PartnerStack marketplace: `https://market.partnerstack.com/`
  - SaaS partner/referral program marketplace.
- FlexOffers Web Service API: `https://www.flexoffers.com/publishers/web-service-api/`
  - API for publisher content delivery / promotional feeds.
- Awin API docs: `https://help.awin.com/apidocs/introduction-1`
  - APIs for affiliate marketing workflows.
- Google Ad Manager API: `https://developers.google.com/ad-manager/api/start`
  - Manages Ad Manager inventory, orders, and reports.
- Google AdMob: `https://developers.google.com/admob`
  - Mobile app monetization path with paid advertiser demand.
- Kevel Decision API: `https://dev.kevel.com/reference/request`
  - Server-side REST ad decision endpoint.
- AdButler JSON Ad API: `https://www.adbutler.com/help/article/json-ad-tag-api`
  - JSON ad responses can be styled for the display environment.
- AdGlare native JSON ad server: `https://www.adglare.com/native-ad-server-via-a-json-ad-serving-api-84159`
  - JSON endpoint returns ads for native rendering.
- Epom Ad Server API: `https://epom.com/ad-server/api`
  - REST API for campaign, targeting, creative, and stats workflows.
- Broadstreet API: `https://information.broadstreetads.com/api-documentation/`
  - API access for publisher ad-management workflows.
- Revive Adserver zone invocation: `https://www.revive-adserver.com/how-to/create-zone-invocation-code/`
  - Zone invocation code triggers ad-server calls.
- AdsBind AI-app ads: `https://adsbind.com/blog/how-developers-monetize-ai-apps-by-adding-ads`
  - Positions itself for devs plugging ads into AI apps with contextual brand-safety checks.
- ChatAds AI network roundup: `https://www.getchatads.com/blog/top-eleven-ad-networks-for-ai/`
  - Tracks monetization options for AI chatbots, agents, and apps.
- Nexad: `https://nex.ad/`
  - Positions around AI-native advertising and GTM for AI-era surfaces.
- Business Insider on Nexad: `https://www.businessinsider.com/adtech-startup-nexad-raises-seed-ai-native-ads-pitch-deck-2025-4`
  - Reports Nexad raised a seed round for native ads in AI applications and had AI app partners.
- Microsoft chat ads: `https://about.ads.microsoft.com/en/blog/post/may-2023/a-new-solution-to-monetize-ai-powered-chat-experiences`
  - Announces monetization for online services, apps, and publishers with native chat experiences.
- Aryel In-Chat Ads: `https://aryel.io/blog/aryel-launches-in-chat-ads-the-first-native-ad-format-and-distribution-network-for-ai-apps/`
  - Describes native in-chat ad format/distribution for AI conversations.
- Idlen Carbon alternative: `https://www.idlen.io/advertisers/alternative-to/carbon-ads/`
  - Developer ad candidate positioned around Carbon alternatives.
- Paved developer newsletter advertising: `https://www.paved.com/blog/advertise-to-developers/`
  - Developer sponsorship/acquisition lane.
- beehiiv direct sponsorships: `https://www.beehiiv.com/features/direct-sponsorships`
  - Newsletter sponsorship management and placement lane.
- Meta Audience Network: `https://www.facebook.com/audiencenetwork/`
  - Mobile app monetization with Meta advertiser demand.
- CAS.AI: `https://cas.ai/`
  - Mobile monetization with native ad formats and mediation.
- PartnerStack / SaaS affiliate software context: `https://www.referralcandy.com/blog/best-affiliate-program-software-in-2026-ranked-by-features-pricing-and-use-case`
  - Positions PartnerStack as a B2B SaaS-focused partner platform.
- High-value B2B/software affiliate context: `https://funnelish.com/blog/best-affiliate-marketing-platforms`
  - Describes PartnerStack and Impact as strong ecosystems for B2B/software.
- Coinzilla: `https://coinzilla.com/`
  - Crypto ad network and traffic source.
- Cointraffic: `https://cointraffic.com/`
  - Premium crypto ad network with manually vetted blockchain publisher positioning.
- Crypto ad network category context: `https://aads.com/blog/best-crypto-ad-networks/`
  - Lists Coinzilla, Bitmedia, and other crypto networks.
- Informa TechTarget: `https://www.informatechtarget.com/`
  - B2B technology audience and intent-data demand lane.
- Foundry: `https://foundryco.com/`
  - B2B tech audience and intent-data lane.
- TechnologyAdvice cybersecurity marketing: `https://solutions.technologyadvice.com/cybersecurity-marketing-solutions/`
  - B2B cybersecurity/IT decision-maker lead-gen lane.
- Outbrain native context: `https://www.aidigital.com/blog/native-advertising-platforms`
  - Describes Outbrain as a major premium native network.
- Taboola native platform context: `https://www.taboola.com/marketing-hub/native-advertising-platform/`
  - Native advertising platform and performance/native lane.
- Native network category context: `https://voluum.com/blog/best-ad-networks/`
  - Lists Taboola, Outbrain, MGID, Revcontent, TripleLift, and related native networks.
- ExoClick developer API: `https://docs.exoclick.com/docs/developer-api/`
  - Publisher automation includes ad formats/zones, sites, URL verification, category blocking, stats, bidding prices by format/GEO, and payment types.
- TrafficJunky: `https://www.trafficjunky.com/`
  - Adult traffic marketplace candidate for restricted opt-in inventory.
- TrafficStars OpenRTB/API docs: `https://rtb-docs.trafficstars.com/`
  - Technical integration docs for advertisers and publishers connecting to TrafficStars.
- JuicyAds: `https://www.juicyads.com/`
  - Adult publisher ad-network candidate.
- PlugRush API: `https://www.plugrush.com/support/api/`
  - API is documented for integrating external systems and managing account data.
- Adnium: `https://adnium.com/`
  - Adult-only CPM ad-network candidate with targeting and real-time statistics positioning.
- EroAdvertising publishers: `https://www.eroadvertising.com/publishers/`
  - Adult advertising network with publisher monetization tools and banners, pops, native, and invideo formats.
- TwinRed publishers: `https://www.twinred.com/publishers/`
  - Publisher ad network for monetizing traffic, with RTB and multiple ad formats.
- TrafficFactory: `https://www.trafficfactory.com/index.html`
  - Premium adult traffic network with self-serve RTB positioning.
- TrafficShop: `https://trafficshop.com/`
  - International traffic network for publisher monetization and targeted traffic.
- Clickadu: `https://www.clickadu.com/`
  - Ad network with banner, popunder, push, in-page push, video pre-roll, and skim formats.
- HilltopAds: `https://hilltopads.com/`
  - Broad ad network with publisher/advertiser positioning and API tooling.
- AdMaven publisher API: `https://publishers-help.ad-maven.com/en/category/api-1fvhmuv/`
  - Publisher API tooling for creating links and managing publisher integrations.
- CrakRevenue: `https://www.crakrevenue.com/`
  - Dating/adult CPA affiliate-network candidate.
- Cpamatica: `https://www.cpamatica.io/`
  - Dating and performance CPA candidate.
- Trafee: `https://trafee.com/`
  - Smartlink/performance affiliate candidate.
- Mobipium: `https://www.mobipium.com/`
  - Mobile/performance CPA candidate.
- ClickDealer: `https://clickdealer.com/`
  - Performance affiliate-network candidate.
- MaxBounty: `https://www.maxbounty.com/`
  - CPA affiliate-network candidate.
- Zeydoo: `https://zeydoo.com/`
  - Performance CPA network candidate.
- RichAds: `https://richads.com/`
  - Push/pop/native ad-network candidate.
- PropellerAds: `https://propellerads.com/`
  - Broad ad-network candidate across push/pop/native formats.
- Adsterra API: `https://adsterra.com/api/`
  - Ad network API for advertisers and publishers to manage assets and performance parameters.
- Mondiad: `https://www.mondiad.com/`
  - Push/native ad-network candidate.
- 1xBet Partners: `https://1xbetpartners.com/`
  - iGaming affiliate lane requiring legal/age/geo controls.
- Betway Partners: `https://betwaypartners.com/`
  - iGaming affiliate lane requiring legal/age/geo controls.
- PIN-UP Partners: `https://pin-up.partners/`
  - iGaming affiliate lane requiring legal/age/geo controls.

## Terminal / IDE workflow audit

Works today:

- Terminal: `~/.builderperks/statusline.sh` prints one sponsored line and fails quietly when unavailable.
- Claude Code: same command can run as `statusLine`.
- IDE terminal: same command works inside Cursor, VS Code, JetBrains terminal, or any shell.
- VS Code / Cursor task: BuilderPerks now provides a `.vscode/tasks.json` snippet that runs the status-line helper as a named task.
- Raw API: `/api/ad-stream` returns `render.statusLine`, `render.terminalLine`, `render.ideCard`, and `render.markdown`.
- Browser AI workflow: Chrome extension works in Claude/ChatGPT with wait-state detection plus recent prompt-send fallback.

Still missing for a truly native IDE experience:

- A packaged VS Code/Cursor extension panel that renders `render.ideCard` directly.
- JetBrains plugin.
- Auto-detection of current repo/language keywords from IDE workspace without sending sensitive data.
- One-click install from Chrome Web Store / VS Code Marketplace.

## Product posture

Do not wait for third-party approval to get users. Seed/direct approved devtool offers work now and are sufficient for UX/user proof.

Do not call affiliate offers "ads" without disclosure. If used, label them as sponsored/referral offers and keep normal click/claim/relevance tracking.

Do not send prompts or personal data from terminal/IDE/extension surfaces. Use broad keywords and explicit publisher preferences only.
