const defaultApiUrl = "https://builderperks.netlify.app";
let placements = [];
let insertedAt = 0;
let currentApiUrl = defaultApiUrl;
const dayKey = new Date().toISOString().slice(0, 10);
const contextRules = [
  { label: "database work", terms: ["postgres", "database", "sql", "schema", "migration", "supabase", "neon", "prisma"] },
  { label: "deployment work", terms: ["deploy", "deployment", "hosting", "server", "infra", "docker", "railway", "render", "fly.io"] },
  { label: "observability work", terms: ["logs", "trace", "observability", "monitoring", "debug", "error", "latency", "helicone"] },
  { label: "browser automation", terms: ["browser", "scrape", "crawl", "playwright", "puppeteer", "firecrawl", "automation"] },
  { label: "AI app work", terms: ["agent", "llm", "openai", "claude", "chatgpt", "prompt", "embedding", "rag", "cursor"] },
  { label: "code review", terms: ["pull request", "github", "review", "lint", "test", "ci", "coderabbit"] }
];
const defaultSettings = {
  enabled: true,
  pausedUntil: 0,
  dailyCap: 3,
  dayKey,
  shownToday: 0
};

async function getSettings() {
  const stored = await chrome.storage.sync.get(["enabled", "pausedUntil", "dailyCap", "dayKey", "shownToday"]);
  const settings = { ...defaultSettings, ...stored };
  if (settings.dayKey !== dayKey) {
    settings.dayKey = dayKey;
    settings.shownToday = 0;
    await chrome.storage.sync.set({ dayKey, shownToday: 0 });
  }
  return settings;
}

async function updateSettings(changes) {
  await chrome.storage.sync.set(changes);
}

async function getApiUrl() {
  const stored = await chrome.storage.sync.get(["apiUrl"]);
  return stored.apiUrl || defaultApiUrl;
}

async function loadPlacements() {
  try {
    const apiUrl = await getApiUrl();
    currentApiUrl = apiUrl;
    const response = await fetch(`${apiUrl}/api/placements`);
    const data = await response.json();
    placements = data.placements || [];
  } catch {
    placements = [];
  }
}

function likelyWaitingNode(node) {
  const text = node.textContent?.toLowerCase() || "";
  return text.includes("thinking") || text.includes("generating") || text.includes("working") || text.includes("running");
}

function pageContextText() {
  const title = document.title || "";
  const bodyText = document.body?.innerText || "";
  return `${location.hostname} ${title} ${bodyText}`.toLowerCase().slice(-12000);
}

function scorePlacement(placement, contextText) {
  const offerText = [
    placement.company,
    placement.headline,
    placement.body,
    placement.audience,
    ...(placement.targetTools || [])
  ].join(" ").toLowerCase();
  let score = 0;
  const reasons = [];

  for (const rule of contextRules) {
    const pageHits = rule.terms.filter((term) => contextText.includes(term));
    if (!pageHits.length) continue;
    const offerHits = rule.terms.filter((term) => offerText.includes(term));
    if (!offerHits.length) continue;
    score += pageHits.length + offerHits.length * 2;
    reasons.push(rule.label);
  }

  for (const tool of placement.targetTools || []) {
    const normalized = String(tool).toLowerCase();
    if (normalized && contextText.includes(normalized)) {
      score += 3;
      reasons.push(`${tool} workflow`);
    }
  }

  return { score, reasons: [...new Set(reasons)] };
}

function choosePlacement() {
  const contextText = pageContextText();
  const ranked = placements
    .map((placement) => ({ placement, match: scorePlacement(placement, contextText) }))
    .sort((a, b) => b.match.score - a.match.score);
  const best = ranked[0];
  if (!best || best.match.score <= 0) {
    return {
      placement: placements[Math.floor(Math.random() * placements.length)],
      reason: "Shown as a general AI-builder perk"
    };
  }
  return {
    placement: best.placement,
    reason: `Matched locally to ${best.match.reasons.slice(0, 2).join(" + ")}`
  };
}

function buildCard(placement, reason) {
  const card = document.createElement("div");
  card.className = "builderperks-inline";
  card.setAttribute("role", "complementary");
  card.setAttribute("aria-label", "BuilderPerks sponsored devtool offer");
  const apiUrl = new URL(currentApiUrl);
  const link = new URL("/api/track", apiUrl);
  link.searchParams.set("placementId", placement.id);
  link.searchParams.set("source", "extension");

  const controls = document.createElement("div");
  controls.className = "builderperks-controls";
  const label = document.createElement("small");
  label.textContent = `Sponsored BuilderPerks - ${placement.company}`;
  const close = document.createElement("button");
  close.type = "button";
  close.className = "builderperks-close";
  close.textContent = "Dismiss";
  close.addEventListener("click", () => card.remove());
  const pause = document.createElement("button");
  pause.type = "button";
  pause.className = "builderperks-pause";
  pause.textContent = "Pause today";
  pause.addEventListener("click", async () => {
    await updateSettings({ pausedUntil: Date.now() + 24 * 60 * 60 * 1000 });
    card.remove();
  });
  controls.append(label, close, pause);

  const headline = document.createElement("strong");
  headline.textContent = placement.headline;
  const body = document.createElement("p");
  body.textContent = placement.body;
  const why = document.createElement("p");
  why.className = "builderperks-why";
  why.textContent = reason;
  const cta = document.createElement("a");
  cta.href = link.toString();
  cta.target = "_blank";
  cta.rel = "noreferrer";
  cta.textContent = placement.cta;

  card.append(controls, headline, body, why, cta);
  return card;
}

async function maybeInsert() {
  const settings = await getSettings();
  if (!settings.enabled || Date.now() < Number(settings.pausedUntil || 0)) return;
  if (Number(settings.shownToday || 0) >= Number(settings.dailyCap || 3)) return;
  if (!placements.length || Date.now() - insertedAt < 15000) return;
  if (document.querySelector(".builderperks-inline")) return;

  const nodes = [...document.querySelectorAll("div, p, span")].filter(likelyWaitingNode);
  const target = nodes.at(-1);
  if (!target) return;

  const { placement, reason } = choosePlacement();
  target.insertAdjacentElement("afterend", buildCard(placement, reason));
  insertedAt = Date.now();
  await updateSettings({ shownToday: Number(settings.shownToday || 0) + 1, dayKey });
}

loadPlacements().then(maybeInsert);
setInterval(loadPlacements, 60000);
setInterval(maybeInsert, 2500);
