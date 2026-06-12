const defaultApiUrl = "https://builderperks.netlify.app";

async function getApiUrl() {
  const stored = await chrome.storage.sync.get(["apiUrl"]);
  return stored.apiUrl || defaultApiUrl;
}

async function setApiUrl(apiUrl) {
  await chrome.storage.sync.set({ apiUrl });
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
  item.innerHTML = `
    <small>${placement.company}</small>
    <h3>${placement.headline}</h3>
    <p>${placement.body}</p>
    <a href="${placement.url}" target="_blank" rel="noreferrer">${placement.cta}</a>
  `;
  return item;
}

async function load() {
  const apiUrl = await getApiUrl();
  document.getElementById("api-url").value = apiUrl;

  const status = document.getElementById("status");
  const cards = document.getElementById("cards");
  try {
    const data = await request("/api/placements");
    cards.replaceChildren(...data.placements.slice(0, 3).map(card));
    status.textContent = `${data.placements.length} live placements`;
  } catch (error) {
    status.textContent = error.message;
  }
}

document.getElementById("save").addEventListener("click", async () => {
  await setApiUrl(document.getElementById("api-url").value.replace(/\/$/, ""));
  await load();
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
