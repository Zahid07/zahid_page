// Captures project screenshots into public/shots/<slug>/ with headless Edge, and copies existing images.
// Usage: node scripts/capture-screenshots.mjs        (re-run any time; overwrites)
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const root = resolve(import.meta.dirname, "..");
const out = (slug) => {
  const dir = join(root, "public", "shots", slug);
  mkdirSync(dir, { recursive: true });
  return dir;
};

// [slug, file name, URL or local file, width, height]
const captures = [
  ["studydeck", "1.png", "https://thestudydeck.com", 1440, 900],
  ["whowantswhat", "1.png", "https://whowantswhat.eu", 1440, 900],
  ["hci-lab-thesis", "1.png", "D:/hci_data/prototype/hci-lab-console-standalone.html", 1440, 900],
  ...[
    "agent-data-modelling", "agent-de-aws-glue", "duckstream-pipeline", "data-driven-pipeline",
    "email-exporter-consumer", "customer-group-evaluator", "trino-local", "spark-streaming-acme",
    "triptop", "pitb-ossp",
  ].map((slug) => [slug, "1.png", join(root, "public", "flows", `${slug}.html`), 1440, 900]),
];

// [slug, file name, source path]
const copies = [
  ["plainjoin", "1.png", "D:/self-service-bi/plainjoin-app-concept/screenshots/10-home-dark.png"],
  ["plainjoin", "2.png", "D:/self-service-bi/plainjoin-app-concept/screenshots/07-ask.png"],
  ["plainjoin", "3.png", "D:/self-service-bi/plainjoin-app-concept/screenshots/03b-schema-map.png"],
  ["plainjoin", "4.png", "D:/self-service-bi/plainjoin-app-concept/screenshots/10b-dashboard-dark.png"],
  ["ai-data-modeling-agent", "1.png", "E:/Ai Model Agent/frontend-app/test-results/phase3-evidence-preview.png"],
  ["mobile-games", "1.png", "E:/Game/Last_Light_Codex_Pack/store/feature_graphic.png"],
  ["mobile-games", "2.png", "E:/Game/skyfold/build/store/feature-graphic-1024x500.png"],
  ["mobile-games", "3.png", "E:/Game/snake-game/build/store/feature-graphic-1024x500.png"],
  ["mobile-games", "4.png", "E:/Game/snakeman/docs/feature_graphic.png"],
];

for (const [slug, name, src, w, h] of captures) {
  const url = /^https?:/.test(src) ? src : pathToFileURL(src).href;
  if (!/^https?:/.test(src) && !existsSync(src)) { console.warn(`skip ${slug}: missing ${src}`); continue; }
  const profile = mkdtempSync(join(tmpdir(), "shot-")); // own profile so a running Edge doesn't swallow the call
  try {
    execFileSync(EDGE, ["--headless", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${profile}`,
      `--window-size=${w},${h}`, "--virtual-time-budget=8000", `--screenshot=${join(out(slug), name)}`, url],
      { stdio: "ignore", timeout: 90_000 });
    console.log(`captured ${slug}/${name}`);
  } catch (e) {
    console.warn(`failed ${slug}: ${e.message}`);
  }
}

for (const [slug, name, src] of copies) {
  if (!existsSync(src)) { console.warn(`skip ${slug}: missing ${src}`); continue; }
  copyFileSync(src, join(out(slug), name));
  console.log(`copied ${slug}/${name}`);
}
