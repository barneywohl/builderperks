const defaultApiUrl = "https://builderperks.netlify.app";
let placements = [];
let insertedAt = 0;
let currentApiUrl = defaultApiUrl;

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
  const apiUrl = new URL(currentApiUrl);
  const link = new URL("/api/track", apiUrl);
  link.searchParams.set("placementId", placement.id);
  link.searchParams.set("source", "extension");

  const label = document.createElement("small");
  label.textContent = `BuilderPerks - ${placement.company}`;
  const headline = document.createElement("strong");
  headline.textContent = placement.headline;
  const body = document.createElement("p");
  body.textContent = placement.body;
  const cta = document.createElement("a");
  cta.href = link.toString();
  cta.target = "_blank";
  cta.rel = "noreferrer";
  cta.textContent = placement.cta;

  card.append(label, headline, body, cta);
  return card;
}

function maybeInsert() {
  if (!placements.length || Date.now() - insertedAt < 15000) return;
  if (document.querySelector(".builderperks-inline")) return;

  const nodes = [...document.querySelectorAll("div, p, span")].filter(likelyWaitingNode);
  const target = nodes.at(-1);
  if (!target) return;

  const placement = placements[Math.floor(Math.random() * placements.length)];
  target.insertAdjacentElement("afterend", buildCard(placement));
  insertedAt = Date.now();
}

loadPlacements().then(maybeInsert);
setInterval(loadPlacements, 60000);
setInterval(maybeInsert, 2500);
