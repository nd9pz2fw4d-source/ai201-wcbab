// Screenshot chosen slides by id: node scripts/shoot-ids.mjs id1 id2 ...
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
const file = "file://" + path.resolve("dist/index.html");
fs.mkdirSync("screenshots/ids", { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
for (const id of process.argv.slice(2)) {
  await page.goto(file + `?length=120#/${id}`);
  await page.reload();
  await page.waitForTimeout(3200);
  await page.screenshot({ path: `screenshots/ids/${id}.png` });
}
console.log(errors.length ? errors.join("\n") : "no console errors");
await browser.close();
