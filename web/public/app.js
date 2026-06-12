const api = {
  placements: "/api/placements",
  claims: "/api/claims",
  feedback: "/api/feedback",
  stats: "/api/stats",
  track: "/api/track",
  admin: "/api/admin"
};

const state = {
  placements: []
};

function formData(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  data.targetTools = [...form.querySelectorAll('input[name="targetTools"]:checked')].map((input) => input.value);
  return data;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.error || "Request failed");
  return data;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

function trackUrl(placement, source = "web") {
  return `${api.track}?placementId=${encodeURIComponent(placement.id)}&source=${encodeURIComponent(source)}`;
}

function placementCard(placement) {
  const claims = placement.claimCount ?? 0;
  const clicks = placement.clickCount ?? 0;
  const article = document.createElement("article");
  article.className = "placement-card";
  article.innerHTML = `
    <small>${escapeHtml(placement.company)} for ${escapeHtml(placement.audience)}</small>
    <h3>${escapeHtml(placement.headline)}</h3>
    <p>${escapeHtml(placement.body)}</p>
    <div class="meta">$${escapeHtml(placement.budgetUsd)} package · ${escapeHtml(placement.targetTools.join(", "))}</div>
    <div class="impact-meter" aria-label="Placement activity">
      <span>${clicks} clicks</span>
      <span>${claims} claims</span>
    </div>
    <a class="button" href="${trackUrl(placement)}" target="_blank" rel="noreferrer">${escapeHtml(placement.cta)}</a>
    <form class="claim-form">
      <input name="email" type="email" placeholder="email to claim interest" required />
      <input name="note" placeholder="optional note" />
      <button class="button primary" type="submit">Record claim</button>
      <span class="status"></span>
    </form>
  `;

  article.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = article.querySelector(".status");
    try {
      const data = formData(event.currentTarget);
      await request(api.claims, {
        method: "POST",
        body: JSON.stringify({ ...data, placementId: placement.id, source: "web" })
      });
      status.textContent = "Claim recorded.";
      event.currentTarget.reset();
    } catch (error) {
      status.textContent = error.message;
    }
  });

  return article;
}

async function loadPlacements() {
  const data = await request(api.placements);
  state.placements = data.placements;

  const list = document.getElementById("placements");
  list.replaceChildren(...state.placements.map(placementCard));

  const hero = document.getElementById("hero-card");
  const first = state.placements[0];
  if (first) {
    hero.innerHTML = `
      <small>${escapeHtml(first.company)}</small>
      <h3>${escapeHtml(first.headline)}</h3>
      <p>${escapeHtml(first.body)}</p>
      <div class="impact-meter">
        <span>${first.clickCount ?? 0} clicks</span>
        <span>${first.claimCount ?? 0} claims</span>
      </div>
      <a class="button primary" href="${trackUrl(first)}" target="_blank" rel="noreferrer">${escapeHtml(first.cta)}</a>
    `;
  }
}

async function loadStats() {
  const data = await request(api.stats);
  const stats = data.stats;
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.innerHTML = `
    <div><strong>${escapeHtml(stats.approvedPlacements)}</strong><span>approved placements</span></div>
    <div><strong>${escapeHtml(stats.clicks)}</strong><span>clicks</span></div>
    <div><strong>${escapeHtml(stats.claims)}</strong><span>claims</span></div>
    <div><strong>${escapeHtml(stats.feedback)}</strong><span>feedback notes</span></div>
  `;
}

async function submitPlacement(event) {
  event.preventDefault();
  const status = document.getElementById("placement-status");
  status.textContent = "Submitting...";

  try {
    const data = await request(api.placements, {
      method: "POST",
      body: JSON.stringify(formData(event.currentTarget))
    });

    if (data.checkoutUrl) {
      status.innerHTML = `Placement submitted. Opening checkout. Placement id: <code>${data.placement.id}</code>`;
      window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
    } else {
      status.innerHTML = `Placement submitted. Invoice/manual approval needed. Placement id: <code>${data.placement.id}</code>`;
    }
    event.currentTarget.reset();
  } catch (error) {
    status.textContent = error.message;
  }
}

async function submitFeedback(event) {
  event.preventDefault();
  const status = document.getElementById("feedback-status");
  status.textContent = "Sending...";

  try {
    await request(api.feedback, {
      method: "POST",
      body: JSON.stringify(formData(event.currentTarget))
    });
    status.textContent = "Feedback recorded.";
    event.currentTarget.reset();
  } catch (error) {
    status.textContent = error.message;
  }
}

async function loadAdmin() {
  const key = document.getElementById("admin-key").value.trim();
  const list = document.getElementById("admin-list");
  list.textContent = "Loading...";

  try {
    const data = await request(`${api.admin}?key=${encodeURIComponent(key)}`);
    list.replaceChildren(...data.placements.map((placement) => {
      const item = document.createElement("div");
      item.className = "admin-item";
      item.innerHTML = `
        <h3>${escapeHtml(placement.company)}: ${escapeHtml(placement.headline)}</h3>
        <div>${escapeHtml(placement.status)} · ${escapeHtml(placement.paymentStatus)} · ${escapeHtml(placement.email)}</div>
        <div>${placement.clickCount ?? 0} clicks · ${placement.claimCount ?? 0} claims</div>
        <p>${escapeHtml(placement.body)}</p>
        <div class="actions">
          <button class="button primary" data-status="approved">Approve</button>
          <button class="button" data-status="rejected">Reject</button>
          <button class="button" data-paid="1">Mark paid + approve</button>
        </div>
      `;
      item.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", async () => {
          await request(api.admin, {
            method: "POST",
            headers: { "x-admin-key": key },
            body: JSON.stringify({
              placementId: placement.id,
              status: button.dataset.status || "approved",
              paymentStatus: button.dataset.paid ? "paid" : undefined
            })
          });
          await loadAdmin();
          await loadPlacements();
        });
      });
      return item;
    }));
  } catch (error) {
    list.textContent = error.message;
  }
}

document.getElementById("placement-form").addEventListener("submit", submitPlacement);
document.getElementById("feedback-form").addEventListener("submit", submitFeedback);
document.getElementById("load-admin").addEventListener("click", loadAdmin);

const params = new URLSearchParams(window.location.search);
const checkoutStatus = document.getElementById("checkout-status");
if (params.get("paid") === "1") {
  checkoutStatus.textContent = "Payment received. Your placement is queued for approval.";
} else if (params.get("checkout_cancelled") === "1") {
  checkoutStatus.textContent = "Checkout was cancelled. Your placement request is still saved.";
}

loadPlacements().catch((error) => {
  document.getElementById("placements").textContent = error.message;
});

loadStats().catch(() => {});
