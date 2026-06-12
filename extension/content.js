const defaultApiUrl = "https://builderperks.netlify.app";
let placements = [];
let insertedAt = 0;
let currentApiUrl = defaultApiUrl;
const dayKey = new Date().toISOString().slice(0, 10);
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

function buildCard(placement) {
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
  const cta = document.createElement("a");
  cta.href = link.toString();
  cta.target = "_blank";
  cta.rel = "noreferrer";
  cta.textContent = placement.cta;

  card.append(controls, headline, body, cta);
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

  const placement = placements[Math.floor(Math.random() * placements.length)];
  target.insertAdjacentElement("afterend", buildCard(placement));
  insertedAt = Date.now();
  await updateSettings({ shownToday: Number(settings.shownToday || 0) + 1, dayKey });
}

loadPlacements().then(maybeInsert);
setInterval(loadPlacements, 60000);
setInterval(maybeInsert, 2500);
