// Drives "Design an agent" (assign, design, share back) and the recap, and screenshots them.
import { chromium } from "playwright";
import path from "node:path";
const file = "file://" + path.resolve("dist/index.html");
const out = "screenshots/interact";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
const go = async (id) => { await p.goto(file + `?length=120#/${id}`); await p.reload(); await p.waitForTimeout(1600); return p.evaluate(() => location.hash); };
const ok = (name, cond, extra = "") => console.log(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? "  (" + extra + ")" : ""}`);
const taskOf = (n) => p.evaluate((n) => {
  const tok = [...document.querySelectorAll("[aria-label]")].find((e) => e.getAttribute("aria-label") === `Table ${n}`);
  return tok?.closest("[aria-label^='Task: ']")?.getAttribute("aria-label")?.slice(6) ?? "tray";
}, n);
async function drag(from, to) {
  const a = await from.boundingBox();
  const c = await to.boundingBox();
  await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await p.mouse.down();
  await p.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2 + 10, { steps: 3 });
  await p.mouse.move(c.x + c.width / 2, c.y + c.height / 2, { steps: 12 });
  await p.mouse.up();
  await p.waitForTimeout(400);
}

let h = await go("design-agent");
await p.screenshot({ path: `${out}/design-assign.png` });
ok("starts on Assign with 6 tables placed", (await taskOf(1)) === "Intake agent" && (await taskOf(6)) === "Payment agent");
await p.getByRole("button", { name: "Add a table" }).click();
ok("new table waits in the tray", (await taskOf(7)) === "tray");
await drag(p.getByLabel("Table 7", { exact: true }), p.getByLabel("Task: Sorting agent"));
ok("drag a table onto a task", (await taskOf(7)) === "Sorting agent", await taskOf(7));
await drag(p.getByLabel("Table 7", { exact: true }), p.getByLabel("Task: Intake agent"));
ok("drop on a taken task swaps", (await taskOf(7)) === "Intake agent" && (await taskOf(1)) === "Sorting agent", `${await taskOf(7)} / ${await taskOf(1)}`);
await p.getByLabel("Table 2", { exact: true }).click();
await p.getByLabel("Task: Return-to-work agent").click();
ok("click a table then a task", (await taskOf(2)) === "Return-to-work agent", await taskOf(2));
ok("assign never advances", (await p.evaluate(() => location.hash)) === h);
await p.screenshot({ path: `${out}/design-assign-moved.png` });

await p.getByRole("button", { name: "2 Design · 5 min" }).click();
await p.waitForTimeout(900);
await p.screenshot({ path: `${out}/design-agent.png` });
await p.getByRole("button", { name: "Ingredients" }).click();
await p.getByRole("button", { name: "+ Autonomy" }).click();
await p.waitForTimeout(700);
ok("ingredients show", (await p.locator("text=Never guess: ask a person").count()) === 1);
await p.screenshot({ path: `${out}/design-ingredients.png` });
await p.getByRole("button", { name: "Example" }).click();
await p.waitForTimeout(700);
ok("detailed example shows", (await p.locator("text=Never change claim details").count()) === 1 && (await p.locator("text=Example: Sorting agent").count()) === 1);
await p.screenshot({ path: `${out}/design-agent-example.png` });

await p.getByRole("button", { name: "3 Share back" }).click();
await p.waitForTimeout(1800);
await p.getByRole("button", { name: /^Table 1 shared/ }).click();
await p.getByRole("button", { name: /^Table 3 shared/ }).click();
await p.waitForTimeout(400);
await p.screenshot({ path: `${out}/design-agent-share.png` });
ok("share back shows 7 tables", (await p.getByRole("button", { name: /^Table \d shared/ }).count()) === 7);
ok("share-back marks tables", (await p.locator("[aria-pressed='true'][aria-label^='Table']").count()) === 2);
ok("design-agent never advances", (await p.evaluate(() => location.hash)) === h);

await go("recap"); await p.waitForTimeout(800); await p.screenshot({ path: `${out}/recap.png` });
console.log(errors.length ? errors : "no console errors");
await b.close();
