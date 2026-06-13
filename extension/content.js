const defaultApiUrl = "https://builderperks.netlify.app";
let placements = [];
let insertedAt = 0;
let currentApiUrl = defaultApiUrl;
const dayKey = new Date().toISOString().slice(0, 10);
const hiddenReasonKey = "hiddenReasonLabels";
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
  const stored = await chrome.storage.sync.get(["enabled", "pausedUntil", "dailyCap", "dayKey", "shownToday", hiddenReasonKey]);
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

function hiddenReasonLabels(settings) {
  return Array.isArray(settings[hiddenReasonKey]) ? settings[hiddenReasonKey] : [];
}

function categoryFromReason(reason) {
  const label = String(reason || "")
    .replace(/^Matched locally to\s+/i, "")
    .split(" + ")
    .map((item) => item.trim())
    .filter(Boolean)[0];
  return (label || "general AI-builder perk").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

async function sendRelevanceEvent(placement, action, reason) {
  const category = categoryFromReason(reason);
  try {
    await fetch(`${currentApiUrl}/api/relevance`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        placementId: placement.id,
        action,
        matchReason: reason,
        category,
        categoryHint: category,
        source: "extension"
      })
    });
  } catch {
    // Relevance reporting should never break the user's AI workflow.
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

function choosePlacement(settings = {}) {
  const contextText = pageContextText();
  const hiddenLabels = hiddenReasonLabels(settings);
  const ranked = placements
    .map((placement) => ({ placement, match: scorePlacement(placement, contextText) }))
    .filter((item) => !item.match.reasons.some((label) => hiddenLabels.includes(label)))
    .sort((a, b) => b.match.score - a.match.score);
  const best = ranked[0];
  if (!ranked.length) return null;
  if (!best || best.match.score <= 0) {
    return {
      placement: ranked[Math.floor(Math.random() * ranked.length)].placement,
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

  const feedback = document.createElement("div");
  feedback.className = "builderperks-feedback";
  const needThis = document.createElement("button");
  needThis.type = "button";
  needThis.textContent = "Need this";
  needThis.addEventListener("click", async () => {
    await sendRelevanceEvent(placement, "need_this", reason);
    needThis.textContent = "Saved";
    needThis.disabled = true;
  });
  const notRelevant = document.createElement("button");
  notRelevant.type = "button";
  notRelevant.textContent = "Not relevant";
  notRelevant.addEventListener("click", async () => {
    await sendRelevanceEvent(placement, "not_relevant", reason);
    card.remove();
  });
  const hideSimilar = document.createElement("button");
  hideSimilar.type = "button";
  hideSimilar.textContent = "Hide category";
  hideSimilar.addEventListener("click", async () => {
    await sendRelevanceEvent(placement, "hide_category", reason);
    const labels = reason
      .replace(/^Matched locally to\s+/i, "")
      .split(" + ")
      .map((label) => label.trim())
      .filter(Boolean);
    const stored = await chrome.storage.sync.get([hiddenReasonKey]);
    await updateSettings({
      [hiddenReasonKey]: [...new Set([...hiddenReasonLabels(stored), ...labels])].slice(0, 20)
    });
    card.remove();
  });
  feedback.append(needThis, notRelevant, hideSimilar);

  card.append(controls, headline, body, why, cta, feedback);
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

  const choice = choosePlacement(settings);
  if (!choice) return;
  const { placement, reason } = choice;
  target.insertAdjacentElement("afterend", buildCard(placement, reason));
  insertedAt = Date.now();
  await updateSettings({ shownToday: Number(settings.shownToday || 0) + 1, dayKey });
}

loadPlacements().then(maybeInsert);
setInterval(loadPlacements, 60000);
setInterval(maybeInsert, 2500);
