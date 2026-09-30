// Screenshot every slide from the built file over file://, and report console errors.
// Usage: node scripts/shoot.mjs [width] [height] [length] [outdir]
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const [w = 1920, h = 1080, length = "", out = "screenshots"] = process.argv.slice(2);
const file = "file://" + path.resolve("dist/index.html");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`${m.type()}: ${m.text()}`));
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

await page.goto(file + (length ? `?length=${length}` : "") + "#/1");
await page.waitForTimeout(800);
const seen = new Set();
for (let i = 0; i < 40; i++) {
  const hash = await page.evaluate(() => location.hash);
  if (seen.has(hash)) break;
  seen.add(hash);
  await page.waitForTimeout(3200);
  const n = hash.replace("#/", "").padStart(2, "0");
  await page.screenshot({ path: `${out}/${w}x${h}-${length || "def"}-slide${n}.png` });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(600);
}
console.log("visited:", [...seen].join(" "));
console.log(errors.length ? errors.join("\n") : "no console errors");
await browser.close();
