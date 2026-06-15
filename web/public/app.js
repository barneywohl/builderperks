const api = {
  placements: "/api/placements",
  claims: "/api/claims",
  builders: "/api/builders",
  publishers: "/api/publishers",
  feedback: "/api/feedback",
  proofSessionNonces: "/api/proof-session-nonces",
  proofSessions: "/api/proof-sessions",
  relevance: "/api/relevance",
  stats: "/api/stats",
  track: "/api/track",
  providerStatus: "/api/provider-status",
  admin: "/api/admin"
};

const state = {
  placements: []
};

const fallbackPlacement = {
  id: "seed-neon",
  company: "Neon",
  audience: "AI app builders",
  headline: "Serverless Postgres for agents and prototypes",
  body: "A labeled devtool offer matched to database and AI app work. Dismiss it, pause it, or mark whether you need it.",
  budgetUsd: 250,
  targetTools: ["Claude", "ChatGPT"],
  clickCount: 0,
  claimCount: 0,
  relevance: { needThis: 0 },
  cta: "View offer"
};

function formData(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  data.targetTools = [...form.querySelectorAll('input[name="targetTools"]:checked')].map((input) => input.value);
  data.allowedTopics = [...form.querySelectorAll('input[name="allowedTopics"]:checked')].map((input) => input.value);
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

function commandBlock(label, command) {
  return `
    <div class="command-block">
      <div class="command-heading">
        <strong>${escapeHtml(label)}</strong>
        <button class="button copy-command" type="button" data-copy="${escapeHtml(command)}">Copy</button>
      </div>
      <pre class="code-sample mini"><code>${escapeHtml(command)}</code></pre>
    </div>
  `;
}

function shellArg(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function publisherTopicKeywords(topics = []) {
  const keywordMap = {
    hosting: "hosting,deploy",
    database: "database,postgres",
    observability: "observability,logs",
    "ai-apis": "ai,llm",
    "browser-automation": "browser,automation"
  };
  return [...new Set(topics.flatMap((topic) => (keywordMap[topic] || topic).split(",")))].join(",");
}

function placementCard(placement) {
  const claims = placement.claimCount ?? 0;
  const clicks = placement.clickCount ?? 0;
  const relevance = placement.relevance || {};
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
      <span>${relevance.needThis ?? 0} need this</span>
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
  state.placements = data.placements.length ? data.placements : [fallbackPlacement];

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
        <span>${first.relevance?.needThis ?? 0} need this</span>
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
    <div><strong>${escapeHtml(stats.needThis ?? 0)}</strong><span>need this</span></div>
    <div><strong>${escapeHtml(stats.notRelevant ?? 0)}</strong><span>not relevant</span></div>
    <div><strong>${escapeHtml(stats.hideCategory ?? 0)}</strong><span>hidden categories</span></div>
    <div><strong>${escapeHtml(stats.builderSignups ?? 0)}</strong><span>founding builders</span></div>
    <div><strong>${escapeHtml(stats.verifiedWorkflowSessions ?? 0)}</strong><span>verified workflow sessions</span></div>
    <div><strong>${escapeHtml(stats.publishers ?? 0)}</strong><span>publishers</span></div>
    <div><strong>${escapeHtml(stats.adImpressions ?? 0)}</strong><span>ad impressions</span></div>
    <div><strong>$${escapeHtml(Number(stats.estimatedPublisherEarningsUsd ?? 0).toFixed(2))}</strong><span>est. unpaid earnings</span></div>
    <div><strong>${escapeHtml(stats.feedback)}</strong><span>feedback notes</span></div>
  `;
  const builderCount = document.getElementById("builder-signup-count");
  if (builderCount) builderCount.textContent = String(stats.builderSignups ?? 0);
  const publisherCount = document.getElementById("publisher-count");
  if (publisherCount) publisherCount.textContent = String(stats.publishers ?? 0);
  const publisherEarningsCount = document.getElementById("publisher-earnings-count");
  if (publisherEarningsCount) publisherEarningsCount.textContent = `$${Number(stats.estimatedPublisherEarningsUsd ?? 0).toFixed(2)}`;
}

async function submitProofSession(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("proof-session-status");
  status.textContent = "Recording proof...";

  try {
    const payload = formData(form);
    const proofNonce = await request(api.proofSessionNonces, {
      method: "POST",
      body: JSON.stringify({
        publisherId: payload.publisherId,
        publisherToken: payload.publisherToken
      })
    });
    payload.proofSessionNonce = proofNonce.proofSession.nonce;
    payload.proofSessionExpiresAt = proofNonce.proofSession.expiresAt;
    payload.proofSessionSignature = proofNonce.proofSession.signature;
    payload.sawSponsoredLine = Boolean(form.querySelector('input[name="sawSponsoredLine"]:checked'));
    await request(api.proofSessions, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    status.textContent = "Proof session recorded for review.";
    form.reset();
    await loadStats();
  } catch (error) {
    status.textContent = error.message;
  }
}

async function loadDemandStatus() {
  const status = document.getElementById("demand-status");
  if (!status) return;

  try {
    const data = await request(api.providerStatus);
    const configured = data.summary?.configured || [];
    const pending = data.summary?.pending || [];
    status.innerHTML = `
      <strong>Demand status</strong>
      <span>Working today with BuilderPerks seed/direct approved offers. Configured providers: ${escapeHtml(configured.length ? configured.join(", ") : "none yet")}. Pending approval/API details: ${escapeHtml(pending.join(", "))}.</span>
    `;
  } catch {
    status.innerHTML = `
      <strong>Demand status</strong>
      <span>Working today with BuilderPerks seed/direct approved offers. EthicalAds and BuySellAds/Carbon are the priority provider paths for approved third-party demand.</span>
    `;
  }
}

async function submitPlacement(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("placement-status");
  status.textContent = "Submitting...";

  try {
    const data = await request(api.placements, {
      method: "POST",
      body: JSON.stringify(formData(form))
    });

    if (data.checkoutUrl) {
      status.innerHTML = `Placement submitted. Opening checkout. Placement id: <code>${data.placement.id}</code>`;
      window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
    } else {
      status.innerHTML = `Placement submitted. Invoice/manual approval needed. Placement id: <code>${data.placement.id}</code>`;
    }
    form.reset();
  } catch (error) {
    status.textContent = error.message;
  }
}

async function submitFeedback(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("feedback-status");
  status.textContent = "Sending...";

  try {
    await request(api.feedback, {
      method: "POST",
      body: JSON.stringify(formData(form))
    });
    status.textContent = "Feedback recorded.";
    form.reset();
  } catch (error) {
    status.textContent = error.message;
  }
}

async function submitBuilder(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("builder-status");
  status.textContent = "Joining...";

  try {
    const data = await request(api.builders, {
      method: "POST",
      body: JSON.stringify(formData(form))
    });
    status.textContent = data.alreadyJoined ? "Already in the founding builder pool." : "Joined. We will use this as real supply proof for advertisers.";
    form.reset();
    await loadStats();
  } catch (error) {
    status.textContent = error.message;
  }
}

async function submitPublisher(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("publisher-status");
  status.textContent = "Registering...";

  try {
    const data = await request(api.publishers, {
      method: "POST",
      body: JSON.stringify(formData(form))
    });
    const publisherId = data.publisher.id;
    const publisherToken = data.publisher.token || "";
    const publisherConfig = formData(form);
    const selectedSurface = publisherConfig.surfacePreset || publisherConfig.surface || "terminal";
    const selectedKeywords = publisherTopicKeywords(publisherConfig.allowedTopics);
    const tokenParam = publisherToken ? `&publisherToken=${encodeURIComponent(publisherToken)}` : "";
    const sampleUrl = `${window.location.origin}/api/ad-stream?publisherId=${encodeURIComponent(publisherId)}${tokenParam}&surface=${encodeURIComponent(selectedSurface)}&context=${encodeURIComponent(`${selectedSurface} builder workflow`)}&keywords=${encodeURIComponent(selectedKeywords)}&blockedKeywords=crypto,gambling&blockedCategories=adult,gambling&valueMode=relevant&format=statusline`;
    const installCommand = `curl -fsSL ${window.location.origin}/install-statusline.sh | bash -s -- ${shellArg(publisherId)} ${shellArg(publisherToken)} ${shellArg(selectedKeywords)} ${shellArg(selectedSurface)}`;
    const inspectCommand = `curl -fsS ${window.location.origin}/install-statusline.sh -o install-statusline.sh && less install-statusline.sh && bash install-statusline.sh ${shellArg(publisherId)} ${shellArg(publisherToken)} ${shellArg(selectedKeywords)} ${shellArg(selectedSurface)}`;
    const runCommand = "~/.builderperks/statusline.sh";
    const debugCommand = "BUILDERPERKS_DEBUG=1 ~/.builderperks/statusline.sh";
    const claudeStatusLine = `"statusLine": { "type": "command", "command": "~/.builderperks/statusline.sh" }`;
    const vscodeTask = `{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "BuilderPerks sponsored line",
      "type": "shell",
      "command": "~/.builderperks/statusline.sh",
      "problemMatcher": []
    }
  ]
}`;
    const rawApiCommand = `curl "${sampleUrl}"`;
    const commandOutput = `
      ${commandBlock("1. Install and save publisher config", installCommand)}
      ${commandBlock("2. Inspect first if you do not run curl | bash", inspectCommand)}
      ${commandBlock("3. Terminal test", runCommand)}
      ${commandBlock("4. Debug setup if blank", debugCommand)}
      ${commandBlock("5. Claude Code settings snippet", claudeStatusLine)}
      ${commandBlock("6. VS Code / Cursor task snippet", vscodeTask)}
      ${commandBlock("7. Raw API check", rawApiCommand)}
      <p class="fine-print">The installer writes <code>~/.builderperks/config.env</code>, including your publisher token, so the status-line command needs no inline secret after install. Send broad keywords only; never send prompts or personal data. Debug output goes to stderr and is intended only for setup verification.</p>
    `;
    status.innerHTML = data.alreadyJoined
      ? `Already registered. Publisher id: <code>${escapeHtml(publisherId)}</code>.${commandOutput}`
      : `Registered. Publisher id: <code>${escapeHtml(publisherId)}</code>.${commandOutput}`;
    status.scrollIntoView({ block: "start", behavior: "smooth" });
    form.reset();
    await loadStats();
  } catch (error) {
    status.textContent = error.message;
  }
}

async function loadAdmin() {
  const key = document.getElementById("admin-key").value.trim();
  const list = document.getElementById("admin-list");
  list.textContent = "Loading...";

  try {
    const data = await request(api.admin, {
      headers: { "x-admin-key": key }
    });
    list.replaceChildren(...data.placements.map((placement) => {
      const item = document.createElement("div");
      item.className = "admin-item";
      item.innerHTML = `
        <h3>${escapeHtml(placement.company)}: ${escapeHtml(placement.headline)}</h3>
        <div>${escapeHtml(placement.status)} · ${escapeHtml(placement.paymentStatus)} · ${escapeHtml(placement.email)}</div>
        <div>${placement.clickCount ?? 0} clicks · ${placement.claimCount ?? 0} claims · ${placement.relevance?.needThis ?? 0} need this · ${placement.relevance?.notRelevant ?? 0} not relevant · ${placement.relevance?.hideCategory ?? 0} hidden categories</div>
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

function setupShareKit() {
  const status = document.getElementById("share-status");
  document.querySelectorAll(".copy-share").forEach((button) => {
    button.addEventListener("click", async () => {
      const card = button.closest(".share-card");
      const copy = card?.querySelector("[data-share-copy]")?.textContent?.trim();
      if (!copy) return;

      try {
        await navigator.clipboard.writeText(copy);
        status.textContent = "Copied. Send only from an authenticated account and keep replies tracked.";
      } catch {
        status.textContent = copy;
      }
    });
  });
}

function setupSprintConsole() {
  const status = document.getElementById("sprint-status");
  document.querySelectorAll(".copy-sprint").forEach((button) => {
    button.addEventListener("click", async () => {
      const copy = button.dataset.sprintCopy || "";
      if (!copy) return;

      try {
        await navigator.clipboard.writeText(copy);
        status.textContent = "Copied. Log the send with target, channel, evidence path, follow-up, and next action.";
      } catch {
        status.textContent = copy;
      }
    });
  });
}

function setupCopyCommands() {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".copy-command");
    if (!button) return;

    const copy = button.dataset.copy || "";
    if (!copy) return;

    const originalText = button.textContent;
    try {
      await navigator.clipboard.writeText(copy);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select text";
    }
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1800);
  });
}

document.getElementById("placement-form").addEventListener("submit", submitPlacement);
document.getElementById("builder-form").addEventListener("submit", submitBuilder);
document.getElementById("publisher-form").addEventListener("submit", submitPublisher);
document.getElementById("feedback-form").addEventListener("submit", submitFeedback);
document.getElementById("proof-session-form").addEventListener("submit", submitProofSession);
document.getElementById("load-admin").addEventListener("click", loadAdmin);
setupShareKit();
setupSprintConsole();
setupCopyCommands();

const params = new URLSearchParams(window.location.search);
const checkoutStatus = document.getElementById("checkout-status");
if (params.get("paid") === "1") {
  checkoutStatus.textContent = "Payment received. Your placement is queued for approval.";
} else if (params.get("checkout_cancelled") === "1") {
  checkoutStatus.textContent = "Checkout was cancelled. Your placement request is still saved.";
}

loadPlacements().catch((error) => {
  state.placements = [fallbackPlacement];
  const list = document.getElementById("placements");
  list.replaceChildren(placementCard(fallbackPlacement));
  const hero = document.getElementById("hero-card");
  hero.innerHTML = `
    <small>${escapeHtml(fallbackPlacement.company)}</small>
    <h3>${escapeHtml(fallbackPlacement.headline)}</h3>
    <p>${escapeHtml(fallbackPlacement.body)}</p>
    <div class="impact-meter">
      <span>0 clicks</span>
      <span>0 claims</span>
      <span>0 need this</span>
    </div>
    <a class="button primary" href="${trackUrl(fallbackPlacement)}" target="_blank" rel="noreferrer">${escapeHtml(fallbackPlacement.cta)}</a>
  `;
  const status = document.createElement("p");
  status.className = "status";
  status.textContent = `Live placement API unavailable: ${error.message}`;
  list.prepend(status);
});

loadStats().catch(() => {});
loadDemandStatus().catch(() => {});
