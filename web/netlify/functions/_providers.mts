import { env } from "./_data.mjs";

export type ProviderKey =
  | "ethicalads"
  | "carbon_ads"
  | "carbon_cli"
  | "buysellads_publisher"
  | "buysellads_newsletter"
  | "adbutler"
  | "kevel"
  | "google_ad_manager"
  | "google_admob"
  | "adglare"
  | "epom"
  | "broadstreet"
  | "revive_adserver"
  | "adsbind"
  | "chatads"
  | "nexad"
  | "aryel_in_chat"
  | "microsoft_chat_ads"
  | "idlen"
  | "paved"
  | "beehiiv_sponsorships"
  | "meta_audience_network"
  | "applovin_max"
  | "cas_ai"
  | "yango_ads"
  | "partnerstack"
  | "impact"
  | "cj_affiliate"
  | "rakuten_advertising"
  | "partnerize"
  | "flexoffers"
  | "awin"
  | "coinzilla"
  | "bitmedia"
  | "cointraffic"
  | "a_ads"
  | "adex"
  | "informatechtarget"
  | "foundry"
  | "technologyadvice"
  | "madison_logic"
  | "outbrain"
  | "taboola"
  | "mgid"
  | "triplelift"
  | "revcontent"
  | "sovrn"
  | "pubmatic"
  | "magnite"
  | "index_exchange"
  | "amazon_publisher_services"
  | "exoclick"
  | "trafficjunky"
  | "trafficstars"
  | "juicyads"
  | "plugrush"
  | "adnium"
  | "eroadvertising"
  | "twinred"
  | "trafficfactory"
  | "trafficshop"
  | "clickadu"
  | "hilltopads"
  | "admaven"
  | "crakrevenue"
  | "cpamatica"
  | "trafee"
  | "mobipium"
  | "clickdealer"
  | "maxbounty"
  | "zeydoo"
  | "richads"
  | "propellerads"
  | "adsterra"
  | "mondiad"
  | "xbet_partners"
  | "betway_partners"
  | "pinup_partners";

export type ProviderStatus = {
  key: ProviderKey;
  name: string;
  lane:
    | "demand_partner"
    | "tool_native_network"
    | "affiliate_backfill"
    | "ad_server"
    | "mobile_app_network"
    | "website_app_network"
    | "ai_native_network"
    | "developer_distribution"
    | "sponsorship_marketplace"
    | "mobile_app_mediation"
    | "high_value_affiliate"
    | "crypto_web3_network"
    | "b2b_intent_network"
    | "premium_native_network"
    | "publisher_ssp"
    | "newsletter_community"
    | "adult_network"
    | "dating_affiliate"
    | "gambling_affiliate"
    | "performance_cpa"
    | "push_pop_network";
  status: "pending_approval" | "credentials_configured" | "configured";
  canServeNow: boolean;
  requiredEnv: string[];
  configuredEnv: string[];
  approvalEnv: string;
  credentialsConfigured: boolean;
  providerApproved: boolean;
  note: string;
  sourceUrl: string;
};

const PROVIDERS: Array<Omit<ProviderStatus, "status" | "canServeNow" | "configuredEnv" | "approvalEnv" | "credentialsConfigured" | "providerApproved">> = [
  {
    key: "ethicalads",
    name: "EthicalAds",
    lane: "demand_partner",
    requiredEnv: ["BUILDERPERKS_ETHICALADS_PUBLISHER_ID"],
    note: "Warm developer/privacy demand lane for app/tool-native sponsored placements. Enable when EthicalAds provides publisher or integration details.",
    sourceUrl: "https://ethical-ad-client.readthedocs.io/"
  },
  {
    key: "carbon_ads",
    name: "Carbon Ads",
    lane: "demand_partner",
    requiredEnv: ["BUILDERPERKS_CARBON_ZONE_KEY"],
    note: "Curated developer/designer demand lane. Use for BuilderPerks app/tool inventory when Carbon provides a zone key or API path.",
    sourceUrl: "https://docs.buysellads.com/ad-serving-api"
  },
  {
    key: "carbon_cli",
    name: "Carbon for CLI, AI assistants, and IDE extensions",
    lane: "tool_native_network",
    requiredEnv: ["BUILDERPERKS_CARBON_CLI_SDK_KEY"],
    note: "Best niche fit for BuilderPerks surfaces. Carbon explicitly markets CLI tools, AI assistants, IDE extensions, and terminal apps.",
    sourceUrl: "https://www.carbonads.net/cli"
  },
  {
    key: "buysellads_publisher",
    name: "BuySellAds Publisher Solutions",
    lane: "demand_partner",
    requiredEnv: ["BUILDERPERKS_BSA_ADS_URL"],
    note: "Developer publisher/demand partner path for BuilderPerks app/tool inventory when BSA provides an approved endpoint.",
    sourceUrl: "https://www.buysellads.com/publishers"
  },
  {
    key: "buysellads_newsletter",
    name: "BuySellAds Newsletter Network",
    lane: "newsletter_community",
    requiredEnv: ["BUILDERPERKS_BSA_NEWSLETTER_ACCOUNT_ID"],
    note: "Adjacent newsletter/digest lane for future BuilderPerks media inventory or cross-promotion.",
    sourceUrl: "https://www.buysellads.com/newsletter-network"
  },
  {
    key: "adbutler",
    name: "AdButler",
    lane: "ad_server",
    requiredEnv: ["BUILDERPERKS_ADBUTLER_JSON_URL"],
    note: "Ad-server infrastructure lane for self-sold campaigns. This is not demand by itself.",
    sourceUrl: "https://www.adbutler.com/help/article/json-ad-tag-api"
  },
  {
    key: "kevel",
    name: "Kevel",
    lane: "ad_server",
    requiredEnv: ["BUILDERPERKS_KEVEL_NETWORK_ID", "BUILDERPERKS_KEVEL_SITE_ID", "BUILDERPERKS_KEVEL_AD_TYPE_ID"],
    note: "Native decision API lane for a custom marketplace once campaign management is warranted.",
    sourceUrl: "https://dev.kevel.com/reference/request"
  },
  {
    key: "google_ad_manager",
    name: "Google Ad Manager",
    lane: "website_app_network",
    requiredEnv: ["BUILDERPERKS_GOOGLE_AD_MANAGER_NETWORK_CODE"],
    note: "Real website/app ad-management API for inventory, orders, and reporting. Strong fit for app-style inventory once an Ad Manager network is configured.",
    sourceUrl: "https://developers.google.com/ad-manager/api/start"
  },
  {
    key: "google_admob",
    name: "Google AdMob",
    lane: "mobile_app_network",
    requiredEnv: ["BUILDERPERKS_ADMOB_APP_ID"],
    note: "Real mobile app ad network/SDK path for BuilderPerks mobile or mobile-adjacent app surfaces.",
    sourceUrl: "https://developers.google.com/admob"
  },
  {
    key: "adglare",
    name: "AdGlare Native / JSON Ad Server",
    lane: "ad_server",
    requiredEnv: ["BUILDERPERKS_ADGLARE_JSON_URL"],
    note: "JSON/native ad server path for websites and apps. Good pipe for direct-sold or approved native sponsored placements.",
    sourceUrl: "https://www.adglare.com/native-ad-server-via-a-json-ad-serving-api-84159"
  },
  {
    key: "epom",
    name: "Epom Ad Server API",
    lane: "ad_server",
    requiredEnv: ["BUILDERPERKS_EPOM_API_URL", "BUILDERPERKS_EPOM_API_KEY"],
    note: "Ad-server API for campaigns, stats, targeting, creative assets, and native placements across app-style surfaces.",
    sourceUrl: "https://epom.com/ad-server/api"
  },
  {
    key: "broadstreet",
    name: "Broadstreet Ad Manager",
    lane: "ad_server",
    requiredEnv: ["BUILDERPERKS_BROADSTREET_API_KEY"],
    note: "Direct-sold ad manager for publishers with API access. Better for self-sold sponsorship operations than instant network fill.",
    sourceUrl: "https://information.broadstreetads.com/api-documentation/"
  },
  {
    key: "revive_adserver",
    name: "Revive Adserver",
    lane: "ad_server",
    requiredEnv: ["BUILDERPERKS_REVIVE_ZONE_URL"],
    note: "Open-source/self-hosted ad serving zone invocation path. Useful for self-sold ads, but does not bring advertiser demand.",
    sourceUrl: "https://www.revive-adserver.com/how-to/create-zone-invocation-code/"
  },
  {
    key: "adsbind",
    name: "AdsBind AI app monetization",
    lane: "ai_native_network",
    requiredEnv: ["BUILDERPERKS_ADSBIND_API_KEY"],
    note: "AI-app monetization candidate built around contextual ads inside AI apps. High-priority newer lane to evaluate for BuilderPerks app/tool inventory.",
    sourceUrl: "https://adsbind.com/blog/how-developers-monetize-ai-apps-by-adding-ads"
  },
  {
    key: "chatads",
    name: "ChatAds",
    lane: "ai_native_network",
    requiredEnv: ["BUILDERPERKS_CHATADS_API_KEY"],
    note: "AI chatbot/app ad-network candidate focused on native ads, sponsored content, and affiliate units in AI conversations.",
    sourceUrl: "https://www.getchatads.com/blog/top-eleven-ad-networks-for-ai/"
  },
  {
    key: "nexad",
    name: "Nexad AI-native ads",
    lane: "ai_native_network",
    requiredEnv: ["BUILDERPERKS_NEXAD_API_KEY"],
    note: "AI-native advertising platform candidate for context-aware ads inside AI applications. Treat as strategic BD lane.",
    sourceUrl: "https://nex.ad/"
  },
  {
    key: "aryel_in_chat",
    name: "Aryel In-Chat Ads",
    lane: "ai_native_network",
    requiredEnv: ["BUILDERPERKS_ARYEL_IN_CHAT_KEY"],
    note: "In-chat ad distribution candidate built for AI conversation surfaces.",
    sourceUrl: "https://aryel.io/blog/aryel-launches-in-chat-ads-the-first-native-ad-format-and-distribution-network-for-ai-apps/"
  },
  {
    key: "microsoft_chat_ads",
    name: "Microsoft chat ads",
    lane: "ai_native_network",
    requiredEnv: ["BUILDERPERKS_MICROSOFT_CHAT_ADS_KEY"],
    note: "Microsoft announced native chat monetization for online services, apps, and publishers. Candidate partner lane for chat/app-style inventory.",
    sourceUrl: "https://about.ads.microsoft.com/en/blog/post/may-2023/a-new-solution-to-monetize-ai-powered-chat-experiences"
  },
  {
    key: "idlen",
    name: "Idlen developer ads",
    lane: "developer_distribution",
    requiredEnv: ["BUILDERPERKS_IDLEN_ACCOUNT_ID"],
    note: "Developer-focused ad candidate positioned against Carbon Ads with broader placement and tech-stack targeting.",
    sourceUrl: "https://www.idlen.io/advertisers/alternative-to/carbon-ads/"
  },
  {
    key: "paved",
    name: "Paved developer newsletter sponsorships",
    lane: "sponsorship_marketplace",
    requiredEnv: ["BUILDERPERKS_PAVED_ACCOUNT_ID"],
    note: "Developer newsletter sponsorship lane for acquiring users or packaging BuilderPerks placements into newsletter-like sponsor inventory.",
    sourceUrl: "https://www.paved.com/blog/advertise-to-developers/"
  },
  {
    key: "beehiiv_sponsorships",
    name: "beehiiv direct sponsorships",
    lane: "sponsorship_marketplace",
    requiredEnv: ["BUILDERPERKS_BEEHIIV_SPONSORSHIP_ACCOUNT_ID"],
    note: "Newsletter sponsorship management/discovery lane. Useful for audience acquisition or future BuilderPerks media inventory.",
    sourceUrl: "https://www.beehiiv.com/features/direct-sponsorships"
  },
  {
    key: "meta_audience_network",
    name: "Meta Audience Network",
    lane: "mobile_app_network",
    requiredEnv: ["BUILDERPERKS_META_AUDIENCE_PLACEMENT_ID"],
    note: "Mobile app monetization network with global advertiser demand. Relevant if BuilderPerks ships mobile or app SDK surfaces.",
    sourceUrl: "https://www.facebook.com/audiencenetwork/"
  },
  {
    key: "applovin_max",
    name: "AppLovin MAX",
    lane: "mobile_app_mediation",
    requiredEnv: ["BUILDERPERKS_APPLOVIN_SDK_KEY"],
    note: "Large mobile app monetization and mediation lane. Relevant for app SDK experiments, not the first browser-extension path.",
    sourceUrl: "https://www.applovin.com/max/"
  },
  {
    key: "cas_ai",
    name: "CAS.AI",
    lane: "mobile_app_mediation",
    requiredEnv: ["BUILDERPERKS_CAS_AI_APP_ID"],
    note: "Mobile app monetization and mediation platform with native ad formats. Relevant for mobile/app SDK surfaces.",
    sourceUrl: "https://cas.ai/"
  },
  {
    key: "yango_ads",
    name: "Yango Ads",
    lane: "mobile_app_network",
    requiredEnv: ["BUILDERPERKS_YANGO_ADS_APP_ID"],
    note: "Mobile app ad-network candidate with native placement and mediation positioning.",
    sourceUrl: "https://yango-ads.com/"
  },
  {
    key: "partnerstack",
    name: "PartnerStack SaaS affiliate marketplace",
    lane: "affiliate_backfill",
    requiredEnv: ["BUILDERPERKS_PARTNERSTACK_FEED_URL"],
    note: "Low-friction fallback for disclosed SaaS/tool sponsored or referral offers while native ad demand is ramping.",
    sourceUrl: "https://market.partnerstack.com/"
  },
  {
    key: "impact",
    name: "Impact.com",
    lane: "high_value_affiliate",
    requiredEnv: ["BUILDERPERKS_IMPACT_ACCOUNT_SID", "BUILDERPERKS_IMPACT_AUTH_TOKEN"],
    note: "Higher-value partnership/affiliate lane for SaaS, finance, commerce, and B2B offers with server-to-server tracking options.",
    sourceUrl: "https://impact.com/"
  },
  {
    key: "cj_affiliate",
    name: "CJ Affiliate",
    lane: "high_value_affiliate",
    requiredEnv: ["BUILDERPERKS_CJ_API_KEY"],
    note: "Large affiliate network for higher-value advertiser programs. Candidate for disclosed offer backfill across many categories.",
    sourceUrl: "https://www.cj.com/"
  },
  {
    key: "rakuten_advertising",
    name: "Rakuten Advertising",
    lane: "high_value_affiliate",
    requiredEnv: ["BUILDERPERKS_RAKUTEN_ADVERTISING_TOKEN"],
    note: "Large affiliate/partner marketing lane for commerce, finance, and software offers with premium advertiser relationships.",
    sourceUrl: "https://rakutenadvertising.com/"
  },
  {
    key: "partnerize",
    name: "Partnerize",
    lane: "high_value_affiliate",
    requiredEnv: ["BUILDERPERKS_PARTNERIZE_API_KEY"],
    note: "Enterprise partnership automation lane for high-value partner/referral offers across SaaS, finance, and commerce.",
    sourceUrl: "https://partnerize.com/"
  },
  {
    key: "flexoffers",
    name: "FlexOffers publisher API",
    lane: "affiliate_backfill",
    requiredEnv: ["BUILDERPERKS_FLEXOFFERS_API_KEY"],
    note: "Broad affiliate/program feed candidate. Useful as offer backfill only after compliance review and explicit disclosure.",
    sourceUrl: "https://www.flexoffers.com/publishers/web-service-api/"
  },
  {
    key: "awin",
    name: "Awin publisher APIs",
    lane: "affiliate_backfill",
    requiredEnv: ["BUILDERPERKS_AWIN_API_TOKEN"],
    note: "Affiliate offer API candidate for self-serve program discovery. Use only for approved programs and disclosed affiliate/referral offers.",
    sourceUrl: "https://help.awin.com/apidocs/introduction-1"
  },
  {
    key: "coinzilla",
    name: "Coinzilla",
    lane: "crypto_web3_network",
    requiredEnv: ["BUILDERPERKS_COINZILLA_ZONE_ID"],
    note: "Crypto/web3 ad network candidate for high-value but regulated/risky categories. Use only behind explicit category opt-in and compliance review.",
    sourceUrl: "https://coinzilla.com/"
  },
  {
    key: "bitmedia",
    name: "Bitmedia",
    lane: "crypto_web3_network",
    requiredEnv: ["BUILDERPERKS_BITMEDIA_ZONE_ID"],
    note: "Crypto advertising network candidate. High payout potential, but keep isolated from default developer inventory.",
    sourceUrl: "https://bitmedia.io/"
  },
  {
    key: "cointraffic",
    name: "Cointraffic",
    lane: "crypto_web3_network",
    requiredEnv: ["BUILDERPERKS_COINTRAFFIC_ZONE_ID"],
    note: "Premium crypto ad network candidate with vetted blockchain publisher positioning. Explicit opt-in only.",
    sourceUrl: "https://cointraffic.com/"
  },
  {
    key: "a_ads",
    name: "A-ADS",
    lane: "crypto_web3_network",
    requiredEnv: ["BUILDERPERKS_A_ADS_UNIT_ID"],
    note: "Crypto/privacy ad candidate. High-risk for product trust; use only in explicit crypto/privacy surfaces.",
    sourceUrl: "https://aads.com/"
  },
  {
    key: "adex",
    name: "AdEx",
    lane: "crypto_web3_network",
    requiredEnv: ["BUILDERPERKS_ADEX_PLACEMENT_ID"],
    note: "Web3 ad-network candidate. Keep behind explicit crypto/web3 category controls.",
    sourceUrl: "https://www.adex.network/"
  },
  {
    key: "informatechtarget",
    name: "Informa TechTarget",
    lane: "b2b_intent_network",
    requiredEnv: ["BUILDERPERKS_INFORMA_TECHTARGET_ACCOUNT_ID"],
    note: "Premium B2B tech intent/audience lane for enterprise IT, cloud, security, data, and software categories.",
    sourceUrl: "https://www.informatechtarget.com/"
  },
  {
    key: "foundry",
    name: "Foundry / IDG",
    lane: "b2b_intent_network",
    requiredEnv: ["BUILDERPERKS_FOUNDRY_ACCOUNT_ID"],
    note: "Premium B2B technology buyer audience and intent-data lane for higher-value enterprise categories.",
    sourceUrl: "https://foundryco.com/"
  },
  {
    key: "technologyadvice",
    name: "TechnologyAdvice",
    lane: "b2b_intent_network",
    requiredEnv: ["BUILDERPERKS_TECHNOLOGYADVICE_ACCOUNT_ID"],
    note: "B2B tech lead-gen and content syndication lane for cybersecurity, SaaS, cloud, and IT decision-maker categories.",
    sourceUrl: "https://solutions.technologyadvice.com/"
  },
  {
    key: "madison_logic",
    name: "Madison Logic",
    lane: "b2b_intent_network",
    requiredEnv: ["BUILDERPERKS_MADISON_LOGIC_ACCOUNT_ID"],
    note: "Account-based B2B demand and intent lane for enterprise software and high-ACV advertisers.",
    sourceUrl: "https://www.madisonlogic.com/"
  },
  {
    key: "outbrain",
    name: "Outbrain",
    lane: "premium_native_network",
    requiredEnv: ["BUILDERPERKS_OUTBRAIN_WIDGET_ID"],
    note: "Large premium native network. Useful for native distribution experiments, but quality controls must stay strict.",
    sourceUrl: "https://www.outbrain.com/"
  },
  {
    key: "taboola",
    name: "Taboola",
    lane: "premium_native_network",
    requiredEnv: ["BUILDERPERKS_TABOOLA_PLACEMENT_ID"],
    note: "Large premium native/storytelling network. Candidate for app/native inventory after quality and format review.",
    sourceUrl: "https://www.taboola.com/"
  },
  {
    key: "mgid",
    name: "MGID",
    lane: "premium_native_network",
    requiredEnv: ["BUILDERPERKS_MGID_WIDGET_ID"],
    note: "Native ad-network candidate with broad reach. Use only with strict advertiser/category filters.",
    sourceUrl: "https://www.mgid.com/"
  },
  {
    key: "triplelift",
    name: "TripleLift",
    lane: "premium_native_network",
    requiredEnv: ["BUILDERPERKS_TRIPLELIFT_PLACEMENT_ID"],
    note: "Premium native/programmatic lane for high-quality native placements.",
    sourceUrl: "https://triplelift.com/"
  },
  {
    key: "revcontent",
    name: "Revcontent",
    lane: "premium_native_network",
    requiredEnv: ["BUILDERPERKS_REVCONTENT_WIDGET_ID"],
    note: "Native ad-network candidate. Evaluate cautiously for ad quality before any default use.",
    sourceUrl: "https://www.revcontent.com/"
  },
  {
    key: "sovrn",
    name: "Sovrn",
    lane: "publisher_ssp",
    requiredEnv: ["BUILDERPERKS_SOVRN_SITE_ID"],
    note: "Publisher monetization/SSP and commerce lane. Candidate for broader publisher demand and affiliate commerce connections.",
    sourceUrl: "https://www.sovrn.com/"
  },
  {
    key: "pubmatic",
    name: "PubMatic",
    lane: "publisher_ssp",
    requiredEnv: ["BUILDERPERKS_PUBMATIC_PUBLISHER_ID"],
    note: "Premium publisher SSP/exchange lane. Relevant if BuilderPerks reaches meaningful app/tool inventory scale.",
    sourceUrl: "https://pubmatic.com/"
  },
  {
    key: "magnite",
    name: "Magnite",
    lane: "publisher_ssp",
    requiredEnv: ["BUILDERPERKS_MAGNITE_PUBLISHER_ID"],
    note: "Large independent sell-side platform. Later-stage scale lane for app/tool-native inventory.",
    sourceUrl: "https://www.magnite.com/"
  },
  {
    key: "index_exchange",
    name: "Index Exchange",
    lane: "publisher_ssp",
    requiredEnv: ["BUILDERPERKS_INDEX_EXCHANGE_PUBLISHER_ID"],
    note: "Premium exchange/SSP lane for scaled publisher inventory and programmatic demand.",
    sourceUrl: "https://www.indexexchange.com/"
  },
  {
    key: "amazon_publisher_services",
    name: "Amazon Publisher Services",
    lane: "publisher_ssp",
    requiredEnv: ["BUILDERPERKS_AMAZON_PUBLISHER_SERVICES_ID"],
    note: "Publisher monetization lane for scaled app/web inventory with Amazon demand connections.",
    sourceUrl: "https://aps.amazon.com/"
  },
  {
    key: "exoclick",
    name: "ExoClick",
    lane: "adult_network",
    requiredEnv: ["BUILDERPERKS_EXOCLICK_ZONE_ID"],
    note: "High-volume adult/mainstream ad network candidate. Restricted inventory only: explicit publisher opt-in, age/geo/legal gating, and never default developer workflow.",
    sourceUrl: "https://docs.exoclick.com/docs/developer-api/"
  },
  {
    key: "trafficjunky",
    name: "TrafficJunky",
    lane: "adult_network",
    requiredEnv: ["BUILDERPERKS_TRAFFICJUNKY_ZONE_ID"],
    note: "Adult traffic marketplace candidate with strong payout potential. Restricted to explicit adult-category surfaces only.",
    sourceUrl: "https://www.trafficjunky.com/"
  },
  {
    key: "trafficstars",
    name: "TrafficStars",
    lane: "adult_network",
    requiredEnv: ["BUILDERPERKS_TRAFFICSTARS_SPOT_ID"],
    note: "Adult ad-network candidate across native/display/video/pop formats. Use only behind strict opt-in and compliance controls.",
    sourceUrl: "https://rtb-docs.trafficstars.com/"
  },
  {
    key: "juicyads",
    name: "JuicyAds",
    lane: "adult_network",
    requiredEnv: ["BUILDERPERKS_JUICYADS_ZONE_ID"],
    note: "Adult publisher ad network candidate. Keep isolated from default AI/devtool placements and require explicit category consent.",
    sourceUrl: "https://www.juicyads.com/"
  },
  {
    key: "plugrush",
    name: "PlugRush",
    lane: "adult_network",
    requiredEnv: ["BUILDERPERKS_PLUGRUSH_ZONE_ID"],
    note: "Adult/mainstream push, native, and pop traffic candidate. Restricted category only with hard blocking in developer defaults.",
    sourceUrl: "https://www.plugrush.com/support/api/"
  },
  {
    key: "adnium",
    name: "Adnium",
    lane: "adult_network",
    requiredEnv: ["BUILDERPERKS_ADNIUM_ZONE_ID"],
    note: "Adult-only CPM ad-network candidate with banner/pop inventory. Restricted XXX/adult lane only; never default developer inventory.",
    sourceUrl: "https://adnium.com/"
  },
  {
    key: "eroadvertising",
    name: "EroAdvertising",
    lane: "adult_network",
    requiredEnv: ["BUILDERPERKS_EROADVERTISING_ZONE_ID"],
    note: "Adult advertising network candidate with publisher monetization tools and multiple formats. Requires explicit adult/XXX opt-in and compliance gating.",
    sourceUrl: "https://www.eroadvertising.com/publishers/"
  },
  {
    key: "twinred",
    name: "TwinRed",
    lane: "adult_network",
    requiredEnv: ["BUILDERPERKS_TWINRED_PUBLISHER_ID"],
    note: "Adult/dating/iGaming ad-network and RTB candidate. Restricted inventory only with legal, age, geo, and category controls.",
    sourceUrl: "https://www.twinred.com/publishers/"
  },
  {
    key: "trafficfactory",
    name: "TrafficFactory",
    lane: "adult_network",
    requiredEnv: ["BUILDERPERKS_TRAFFICFACTORY_ZONE_ID"],
    note: "Premium adult traffic network candidate with large-scale RTB-style positioning. Restricted adult/XXX opt-in only.",
    sourceUrl: "https://www.trafficfactory.com/index.html"
  },
  {
    key: "trafficshop",
    name: "TrafficShop",
    lane: "adult_network",
    requiredEnv: ["BUILDERPERKS_TRAFFICSHOP_ZONE_ID"],
    note: "International traffic monetization network candidate. Treat as restricted/high-risk fill until quality, policy, and category controls are reviewed.",
    sourceUrl: "https://trafficshop.com/"
  },
  {
    key: "clickadu",
    name: "Clickadu",
    lane: "push_pop_network",
    requiredEnv: ["BUILDERPERKS_CLICKADU_SKIM_URL"],
    note: "Fast/instant approval candidate with SKIM/link-style demand. Use only as disclosed sponsored click-out demand with publisher controls.",
    sourceUrl: "https://www.clickadu.com/"
  },
  {
    key: "hilltopads",
    name: "HilltopAds",
    lane: "push_pop_network",
    requiredEnv: ["BUILDERPERKS_HILLTOPADS_DIRECT_URL"],
    note: "DirectLink-capable traffic monetization network. Use only as disclosed sponsored click-out demand behind quality filters.",
    sourceUrl: "https://hilltopads.com/publishers-help/en/articles/10939949-how-to-create-a-directlink"
  },
  {
    key: "admaven",
    name: "AdMaven",
    lane: "push_pop_network",
    requiredEnv: ["BUILDERPERKS_ADMAVEN_SMARTLINK_URL"],
    note: "Automatic/fast-approval smartlink candidate for broad fill. Use only as disclosed sponsored click-out demand with strict quality controls.",
    sourceUrl: "https://ad-maven.com/"
  },
  {
    key: "crakrevenue",
    name: "CrakRevenue",
    lane: "dating_affiliate",
    requiredEnv: ["BUILDERPERKS_CRAKREVENUE_SMARTLINK_URL"],
    note: "Dating/adult CPA Smartlink lane. Use only as disclosed sponsored/referral offers in opted-in restricted inventory.",
    sourceUrl: "https://www.crakrevenue.com/offers/dating/smartlink/"
  },
  {
    key: "cpamatica",
    name: "Cpamatica",
    lane: "dating_affiliate",
    requiredEnv: ["BUILDERPERKS_CPAMATICA_SMARTLINK_URL"],
    note: "Dating, social discovery, and performance CPA smartlink lane. Treat as restricted/explicit opt-in offer backfill, not default ad demand.",
    sourceUrl: "https://www.cpamatica.io/"
  },
  {
    key: "trafee",
    name: "Trafee",
    lane: "dating_affiliate",
    requiredEnv: ["BUILDERPERKS_TRAFEE_SMARTLINK_URL"],
    note: "Smartlink/CPA affiliate lane for dating and adjacent categories. Requires disclosure and strict category gating.",
    sourceUrl: "https://trafee.com/"
  },
  {
    key: "mobipium",
    name: "Mobipium",
    lane: "performance_cpa",
    requiredEnv: ["BUILDERPERKS_MOBIPIUM_SMARTLINK_URL"],
    note: "Mobile/performance CPA smartlink candidate. Useful for opt-in offer backfill, not default developer placements.",
    sourceUrl: "https://www.mobipium.com/"
  },
  {
    key: "clickdealer",
    name: "ClickDealer",
    lane: "performance_cpa",
    requiredEnv: ["BUILDERPERKS_CLICKDEALER_SMARTLINK_URL"],
    note: "Performance marketing smartlink lane. Use for disclosed offer backfill after advertiser/program approval.",
    sourceUrl: "https://www.clickdealer.com/smartlink/"
  },
  {
    key: "maxbounty",
    name: "MaxBounty",
    lane: "performance_cpa",
    requiredEnv: ["BUILDERPERKS_MAXBOUNTY_API_KEY"],
    note: "Large CPA affiliate network candidate for high-payout offers. Requires offer approval, disclosure, and category controls.",
    sourceUrl: "https://www.maxbounty.com/"
  },
  {
    key: "zeydoo",
    name: "Zeydoo",
    lane: "performance_cpa",
    requiredEnv: ["BUILDERPERKS_ZEYDOO_SMARTLINK_URL"],
    note: "Performance CPA smartlink candidate for broader offer fill. Keep separate from premium developer-native demand.",
    sourceUrl: "https://zeydoo.com/blog/what-is-smartlink/"
  },
  {
    key: "richads",
    name: "RichAds",
    lane: "push_pop_network",
    requiredEnv: ["BUILDERPERKS_RICHADS_DIRECT_URL"],
    note: "Push/pop/native ad-network candidate with quick-fill potential. Use only as disclosed sponsored click-out demand where format expectations match.",
    sourceUrl: "https://richads.com/"
  },
  {
    key: "propellerads",
    name: "PropellerAds",
    lane: "push_pop_network",
    requiredEnv: ["BUILDERPERKS_PROPELLERADS_SMARTLINK_URL"],
    note: "Large push/pop/native ad-network candidate with fast approvals. Use only as disclosed sponsored click-out demand where format expectations match.",
    sourceUrl: "https://propellerads.com/"
  },
  {
    key: "adsterra",
    name: "Adsterra",
    lane: "push_pop_network",
    requiredEnv: ["BUILDERPERKS_ADSTERRA_SMARTLINK_URL"],
    note: "Fast-approval SmartLink/direct-link demand lane. Use only as disclosed sponsored click-out demand with strict quality/category controls.",
    sourceUrl: "https://adsterra.com/blog/guide-for-working-with-direct-links/"
  },
  {
    key: "mondiad",
    name: "Mondiad",
    lane: "push_pop_network",
    requiredEnv: ["BUILDERPERKS_MONDIAD_ZONE_ID"],
    note: "Push/native ad-network candidate for broader fill. Use only behind quality filters and explicit publisher controls.",
    sourceUrl: "https://www.mondiad.com/"
  },
  {
    key: "xbet_partners",
    name: "1xBet Partners",
    lane: "gambling_affiliate",
    requiredEnv: ["BUILDERPERKS_XBET_PARTNERS_ID"],
    note: "iGaming affiliate lane. Restricted category only with legal geo checks, age gating, and explicit opt-in.",
    sourceUrl: "https://1xbetpartners.com/"
  },
  {
    key: "betway_partners",
    name: "Betway Partners",
    lane: "gambling_affiliate",
    requiredEnv: ["BUILDERPERKS_BETWAY_PARTNERS_ID"],
    note: "iGaming affiliate lane. Use only for legally eligible, explicitly opted-in inventory with compliance review.",
    sourceUrl: "https://betwaypartners.com/"
  },
  {
    key: "pinup_partners",
    name: "PIN-UP Partners",
    lane: "gambling_affiliate",
    requiredEnv: ["BUILDERPERKS_PINUP_PARTNERS_ID"],
    note: "iGaming affiliate lane. Restricted inventory only; never show in default developer/AI assistant placements.",
    sourceUrl: "https://pin-up.partners/"
  }
];

export function providerStatuses(): ProviderStatus[] {
  return PROVIDERS.map((provider) => {
    const configuredEnv = provider.requiredEnv.filter((name) => Boolean(env(name)));
    const credentialsConfigured = configuredEnv.length === provider.requiredEnv.length;
    const approvalEnv = `BUILDERPERKS_PROVIDER_APPROVED_${provider.key.toUpperCase()}`;
    const providerApproved = env(approvalEnv) === "1";
    const canServeNow = credentialsConfigured && providerApproved;
    const status = canServeNow ? "configured" : credentialsConfigured ? "credentials_configured" : "pending_approval";
    return {
      ...provider,
      configuredEnv,
      approvalEnv,
      credentialsConfigured,
      providerApproved,
      status,
      canServeNow
    };
  });
}

export function configuredProviderNames() {
  return providerStatuses()
    .filter((provider) => provider.canServeNow)
    .map((provider) => provider.name);
}

export function pendingProviderNames() {
  return providerStatuses()
    .filter((provider) => !provider.canServeNow)
    .map((provider) => provider.name);
}
