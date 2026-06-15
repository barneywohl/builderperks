# BuilderPerks Verified Send Checklist - 2026-06-13

Purpose: turn the broad growth matrix into an execution queue that distinguishes verified official paths from promising-but-not-yet-sendable targets.

Status meanings:

- `verified_official_path`: official URL or public role email checked in this pass and ready for controlled outreach.
- `queued_needs_source_check`: promising target but contact/form path is incomplete, stale, blocked, or needs a browser/manual check.
- `do_not_send_duplicate`: already contacted unless there is a concrete update or reply.

Guardrails:

- Send only truthful early-pilot asks.
- No guessed emails.
- No duplicate follow-ups without a new update.
- No claims of approved third-party demand, paid customers, or guaranteed inventory.
- Capture screenshot/evidence and append to `docs/ACQUISITION_LOG.md` for every actual send.
- Use real paragraph breaks in Gmail. Never paste bodies containing literal `\n\n`; run `/Volumes/X10/clawd/ops/scripts/email_body_guard.py --check` on scripted drafts before browser paste/send.

## Verified Official Path - Provider / Network

| Status | Target | Official path | Ask | Verification |
| --- | --- | --- | --- | --- |
| verified_official_path | Stack Overflow Ads | `https://stackoverflow.co/advertising/` | Ask for developer inventory/provider route for terminal/IDE/native sponsored offers. | HTTP 200 on 2026-06-13. |
| verified_official_path | Carbon Ads / BuySellAds | `https://www.carbonads.net/join` | Ask whether terminal/IDE/plugin publisher supply can be evaluated. | HTTP 200 on 2026-06-13. |
| verified_official_path | BuySellAds Developer | `https://discover.buysellads.com/developer` | Ask which BSA/Carbon lane evaluates new developer surfaces. | HTTP 200 on 2026-06-13. |
| verified_official_path | EthicalAds | `https://www.ethicalads.io/publishers/` | Continue warm pilot discussion with privacy/API status details. | Existing source-verified warm lane. |
| do_not_send_duplicate | daily.dev Ads | `https://business.daily.dev/` | Already routed through `hi@daily.dev`; send only with concrete update. | Logged prior send. |
| queued_needs_source_check | Idlen | `https://www.idlen.io/advertisers/alternative-to/carbon-ads/` | Verify current contact path before sending. | Needs direct source check. |
| queued_needs_source_check | Paved | `https://www.paved.com/` | Marketplace/digest monetization research. | Needs account/form path check. |
| queued_needs_source_check | SponsorGap | `https://sponsorgap.com/` | Use for sponsor intelligence; not direct send-ready. | Needs account/form path check. |

## Verified Official Path - Newsletters / Podcasts

| Status | Target | Official path | Ask | Verification |
| --- | --- | --- | --- | --- |
| verified_official_path | Quastor | `https://www.quastor.org/sponsorship` | Sponsorship/partnership fit for backend developer audience. | Source listed in developer-newsletter directory; queue for browser check before form submit. |
| verified_official_path | Changelog | `https://changelog.com/sponsor` | Sponsor/publisher partnership conversation. | Official sponsor page. |
| verified_official_path | Software Engineering Daily | `https://softwareengineeringdaily.com/sponsor/` / `sponsor@softwareengineeringdaily.com` | Sponsor/publisher partnership and early builder-test CTA. | Public sponsor path and role email from source research. |
| verified_official_path | CSS Weekly / AI Developer | `https://css-weekly.com/advertise` | Sponsor/advertiser channel and founding publisher discussion. | HTTP 200 on 2026-06-13. |
| verified_official_path | PyCoder's Weekly | `https://pycoders.com/advertise` | Python audience sponsorship / advertiser lead mining. | HTTP 200 on 2026-06-13. |
| queued_needs_source_check | Real Python | `https://realpython.com/sponsorships/` | Sponsorship/publisher discussion. | URL returned non-200/ambiguous in verification pass; recheck in browser. |
| queued_needs_source_check | Last Week in AWS | `https://www.lastweekinaws.com/sponsorship/` | Cloud/devops sponsor fit. | URL returned non-200/ambiguous in verification pass; recheck in browser. |
| verified_official_path | SRE Weekly | `https://sreweekly.com/sponsorship-information/` | SRE/devops sponsor fit. | HTTP 200 on 2026-06-13. |
| queued_needs_source_check | API Developer Weekly | `https://apideveloperweekly.com/` | Find sponsor/contact path. | Site only; no verified sponsor path yet. |
| queued_needs_source_check | Web Tools Weekly | `https://webtoolsweekly.com/sponsor` | Web tools sponsor/publisher fit. | Candidate path returned 404; needs corrected source path. |
| queued_needs_source_check | Programming Digest | `https://programmingdigest.net/advertise` | Small sponsorship/cross-promo ask. | Candidate path returned 404; needs corrected source path. |
| queued_needs_source_check | React Digest | `https://reactdigest.net/advertise` | Small sponsorship/cross-promo ask. | Candidate path returned 404; needs corrected source path. |
| verified_official_path | Bytes | `https://bytes.dev/advertise` | JS audience sponsorship/publisher discussion. | HTTP 200 on 2026-06-13. |
| verified_official_path | Modern CTO | `https://moderncto.io/sponsorship/` | Engineering leader sponsor/publisher conversation. | HTTP 200 on 2026-06-13. |
| verified_official_path | Software Engineering Unlocked | `https://www.software-engineering-unlocked.com/sponsorship/` | Sponsor package and builder-test CTA. | Official sponsorship page from source research. |
| verified_official_path | Soft Skills Engineering | `https://softskills.audio/sponsors/` | Sponsor pricing/availability and builder feedback CTA. | Official sponsors page from source research. |
| queued_needs_source_check | The Pragmatic Engineer Podcast | `https://blog.pragmaticengineer.com/podcast-sponsors/` | Only queue if form/contact and budget fit are confirmed. | Needs browser/source verification. |
| verified_official_path | DeveloperMedia | `https://developermedia.com/sponsor-developer-podcast` / `sales@d2emerge.com` | Ask for developer media partnership advice. | Public sponsorship guide/contact from source research. |

## Verified Official Path - Events / Conferences

| Status | Target | Official path | Ask | Verification |
| --- | --- | --- | --- | --- |
| verified_official_path | AI Engineer World's Fair | `https://www.ai.engineer/worldsfair` | Ask about sponsor/community path for AI builders and agent/tooling audiences. | Search result/source page confirms 2026 event scale and AI engineer audience. |
| verified_official_path | AI Developer Conference by DeepLearning.AI | `https://ai-dev.deeplearning.ai/` | Sponsor/partner interest form for AI developer audience. | Search result shows sponsor/partner interest form; curl hit Cloudflare challenge, so use browser/form lane. |
| verified_official_path | DeveloperWeek / DevNetwork | `https://www.developerweek.com/` and `https://www.devnetwork.com/events/` | Sponsor/exhibit path for developer and AI engineering audiences. | HTTP 200 and source result confirms developer/AI conference positioning. |
| verified_official_path | RenderATL | `https://www.renderatl.com/` | Sponsor/community path for web/AI builders. | HTTP 200 after redirect; source result confirms Aug 12-13, 2026 event. |
| queued_needs_source_check | AI DevSummit | `https://aidevsummit.co/` | Sponsor path for AI engineer/dev audience. | Source result found; needs contact/form verification. |
| queued_needs_source_check | The AI Conference | `https://aiconference.com/` | Sponsor path for applied AI builders. | Source result found; needs contact/form verification. |
| queued_needs_source_check | AI Council | `https://aicouncil.com/sf-2026` | Sponsor/community path for engineers shipping AI. | Source result found; needs contact/form verification. |
| queued_needs_source_check | NVIDIA GTC | `https://www.nvidia.com/gtc/` | Broad AI/dev ecosystem sponsor intelligence, likely lower priority. | Source result found; high-cost/broad, verify before outreach. |

## Do Not Send Duplicate Without Update

| Target | Prior channel |
| --- | --- |
| DEV | `partners@dev.to` |
| TLDR | `sponsors@tldr.tech` |
| Raycast | `affiliates@raycast.com` |
| daily.dev | `hi@daily.dev` |
| Cooper Press | prior growth wave |
| Console.dev | prior growth wave |
| EthicalAds | warm/reply thread and API access wave |
| Carbon / BuySellAds | prior API/provider wave; new follow-up only with matrix/API update |
| AdButler | prior API/provider wave |
| Kevel | prior API/provider wave |
| CodeRabbit, Helicone, Firecrawl, Railway, Langfuse, PostHog, Clerk, Exa | prior advertiser waves |

## Send Order

1. Stack Overflow Ads.
2. Carbon / BuySellAds follow-up only if using new supply/status update.
3. Changelog.
4. Software Engineering Daily.
5. CSS Weekly / AI Developer.
6. PyCoder's Weekly.
7. SRE Weekly.
8. Bytes.
9. Modern CTO.
10. Software Engineering Unlocked.
11. Soft Skills Engineering.
12. AI Engineer World's Fair.
13. AI Dev / DeveloperWeek / RenderATL event paths via forms/browser.

Authenticated send lane status:

- Real Chrome must be relaunched with remote debugging before logged-in Gmail/form automation can be driven.
- Clawd Chrome is active for public page checks, but Gmail crashed in this lane.
- Until a send lane is available, this checklist is the authoritative queue and should not be marked sent.
