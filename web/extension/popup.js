const defaultApiUrl = "https://builderperks.netlify.app";
const dayKey = new Date().toISOString().slice(0, 10);

async function getApiUrl() {
  const stored = await chrome.storage.sync.get(["apiUrl"]);
  return stored.apiUrl || defaultApiUrl;
}

async function setApiUrl(apiUrl) {
  await chrome.storage.sync.set({ apiUrl });
}

async function getSettings() {
  const stored = await chrome.storage.sync.get(["enabled", "dailyCap", "pausedUntil", "dayKey", "shownToday"]);
  if (stored.dayKey !== dayKey) {
    await chrome.storage.sync.set({ dayKey, shownToday: 0 });
    stored.dayKey = dayKey;
    stored.shownToday = 0;
  }
  return {
    enabled: stored.enabled !== false,
    dailyCap: Number(stored.dailyCap || 3),
    pausedUntil: Number(stored.pausedUntil || 0),
    shownToday: Number(stored.shownToday || 0)
  };
}

async function request(path, options = {}) {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}${path}`, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.error || "Request failed");
  return data;
}

function card(placement) {
  const item = document.createElement("article");
  item.className = "card";
  const company = document.createElement("small");
  company.textContent = placement.company;
  const headline = document.createElement("h3");
  headline.textContent = placement.headline;
  const body = document.createElement("p");
  body.textContent = placement.body;
  const cta = document.createElement("a");
  cta.href = placement.url;
  cta.target = "_blank";
  cta.rel = "noreferrer";
  cta.textContent = placement.cta;
  item.append(company, headline, body, cta);
  return item;
}

async function load() {
  const apiUrl = await getApiUrl();
  const settings = await getSettings();
  document.getElementById("api-url").value = apiUrl;
  document.getElementById("enabled").checked = settings.enabled;
  document.getElementById("daily-cap").value = settings.dailyCap;

  const status = document.getElementById("status");
  const cards = document.getElementById("cards");
  try {
    const data = await request("/api/placements");
    cards.replaceChildren(...data.placements.slice(0, 3).map(card));
    const paused = Date.now() < settings.pausedUntil ? "Paused for today. " : "";
    status.textContent = `${paused}${data.placements.length} live placements. ${settings.shownToday}/${settings.dailyCap} shown today.`;
  } catch (error) {
    status.textContent = error.message;
  }
}

document.getElementById("save").addEventListener("click", async () => {
  await setApiUrl(document.getElementById("api-url").value.replace(/\/$/, ""));
  await chrome.storage.sync.set({
    enabled: document.getElementById("enabled").checked,
    dailyCap: Number(document.getElementById("daily-cap").value || 3)
  });
  await load();
});

document.getElementById("enabled").addEventListener("change", async (event) => {
  await chrome.storage.sync.set({ enabled: event.currentTarget.checked });
  await load();
});

document.getElementById("daily-cap").addEventListener("change", async (event) => {
  await chrome.storage.sync.set({ dailyCap: Number(event.currentTarget.value || 3) });
  await load();
});

document.getElementById("pause-today").addEventListener("click", async () => {
  await chrome.storage.sync.set({ pausedUntil: Date.now() + 24 * 60 * 60 * 1000 });
  await load();
});

document.getElementById("show-test-card").addEventListener("click", async () => {
  const status = document.getElementById("status");
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("Open Claude or ChatGPT, then try again.");
    const response = await chrome.tabs.sendMessage(tab.id, { type: "builderperks:show-test-card" });
    status.textContent = response?.ok
      ? "First card inserted. Keep using AI normally; future cards appear during active build sessions."
      : "Open Claude or ChatGPT and reload the tab, then try again.";
  } catch (error) {
    status.textContent = error.message;
  }
});

document.getElementById("feedback").addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = document.getElementById("status");
  const form = event.currentTarget;
  try {
    await request("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        role: "builder",
        rating: 5,
        email: form.email.value,
        message: form.message.value
      })
    });
    status.textContent = "Feedback sent.";
    form.reset();
  } catch (error) {
    status.textContent = error.message;
  }
});

load();
