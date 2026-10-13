// Drives the interactive futurism slides (Copilot OS, adapt, agent team, cost of waiting, readiness) and screenshots them.
import { chromium } from "playwright";
import path from "node:path";
const file = "file://" + path.resolve("dist/index.html");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on("console", (m) => m.type() === "error" && errs.push(m.text())); p.on("pageerror", (e) => errs.push(e.message));
const go = async (id) => { await p.goto(file + `?length=120#/${id}`); await p.reload(); await p.waitForTimeout(1000); return p.evaluate(() => location.hash); };
const shot = (n) => p.screenshot({ path: `screenshots/ids/${n}.png` });
let h;
h = await go("copilot-os");
await p.getByRole("button", { name: "Copilot as the OS" }).click();
await p.getByLabel("Goal for Copilot").fill("Book a return-to-work meeting");
await p.keyboard.press("Space"); // typing a space must not advance
await p.getByRole("button", { name: /Run/ }).click(); await p.waitForTimeout(3200); await shot("s-copilot-next");
console.log("copilot stays", (await p.evaluate(() => location.hash)) === h);
h = await go("adapt-os"); await p.getByRole("button", { name: /Reveal all/ }).click(); await p.waitForTimeout(800); await shot("s-adapt");
console.log("adapt stays", (await p.evaluate(() => location.hash)) === h);
h = await go("agent-team");
await p.getByRole("button", { name: "Add Payment agent" }).click();
await p.locator("button:has-text('Act')").nth(4).click(); await p.waitForTimeout(500); await shot("s-team-risky");
await p.getByRole("button", { name: "No approval" }).click();
await p.getByRole("button", { name: /Name an accountable owner/ }).click(); await p.waitForTimeout(500); await shot("s-team-clean");
console.log("team stays", (await p.evaluate(() => location.hash)) === h, await p.locator("text=Owned, approved, governed").count());
h = await go("cost-of-waiting");
await p.waitForTimeout(7500); await shot("s-wait");
console.log("wait stays", (await p.evaluate(() => location.hash)) === h);
h = await go("readiness");
for (const [d, n] of [["Clean, connected data", 2], ["Rules written down", 3], ["Agent identities and access", 1], ["Skills to direct agents", 2], ["Journey owners", 3], ["Monitoring and audit", 4]])
  await p.getByRole("button", { name: `${d}: ${n}` }).click();
const [dl] = await Promise.all([p.waitForEvent("download"), p.getByRole("button", { name: /Save the room's scores/ }).click()]);
console.log("download", dl.suggestedFilename());
await p.waitForTimeout(600); await shot("s-readiness");
console.log("readiness stays", (await p.evaluate(() => location.hash)) === h);
console.log(errs.length ? errs : "no console errors");
await b.close();
