import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("public/index.html", "utf8");
const js = await readFile("public/app.js", "utf8");
const css = await readFile("public/styles.css", "utf8");
const installer = await readFile("public/install-statusline.sh", "utf8");
const statusLineHelper = await readFile("public/builderperks-statusline.sh", "utf8");
const extensionContent = await readFile("../extension/content.js", "utf8");

assert.match(html, /BuilderPerks/);
assert.match(html, /Advertiser/);
assert.match(js, /submitPlacement/);
assert.match(js, /loadPlacements/);
assert.match(js, /submitFeedback/);
assert.match(js, /submitBuilder/);
assert.match(js, /submitPublisher/);
assert.match(js, /escapeHtml/);
assert.match(js, /trackUrl/);
assert.match(js, /loadStats/);
assert.match(html, /install-statusline\.sh/);
assert.match(html, /statusline\.sh/);
assert.match(js, /install-statusline\.sh/);
assert.match(installer, /statusline\.sh/);
assert.match(installer, /does not send prompts or personal data/);
assert.match(statusLineHelper, /BUILDERPERKS_PUBLISHER_ID/);
assert.match(statusLineHelper, /urlopen\(url, timeout=2\)/);
assert.match(await readFile("netlify/functions/placements.mts", "utf8"), /paymentStatus = "checkout_ready"/);
assert.match(await readFile("netlify/functions/placements.mts", "utf8"), /checkoutError/);
assert.match(await readFile("netlify/functions/builders.mts", "utf8"), /BuilderSignup/);
assert.match(await readFile("netlify/functions/publishers.mts", "utf8"), /Publisher/);
assert.match(await readFile("netlify/functions/ad-stream.mts", "utf8"), /estimatedPublisherEarningsUsd/);
assert.match(css, /placement-card/);
assert.match(css, /impact-meter/);
assert.match(css, /score-grid/);
assert.match(extensionContent, /choosePlacement/);
assert.match(extensionContent, /Matched locally/);

console.log("smoke ok: static app includes advertiser, placement, feedback, tracking, scoreboard, safe rendering, and local contextual matching workflows");
