// Interaction checks against the built file over file://.
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const file = "file://" + path.resolve("dist/index.html");
const out = "screenshots/interact";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const results = [];
const check = (name, ok, extra = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  (" + extra + ")" : ""}`);
const errors = [];

async function open(opts = {}, query = "", hash = "#/1") {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, ...opts });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(file + query + hash);
  await page.waitForTimeout(700);
  return page;
}
const hash = (p) => p.evaluate(() => location.hash);

// ---- Keyboard and click navigation (75) ----
let page = await open({}, "?length=75");
await page.mouse.click(960, 540);
await page.waitForTimeout(300);
check("click on background advances", (await hash(page)) === "#/2");
for (const [key, want] of [["ArrowRight", "#/3"], ["PageDown", "#/4"], [" ", "#/5"], ["ArrowLeft", "#/4"], ["PageUp", "#/3"], ["End", "#/20"], ["Home", "#/1"]]) {
  await page.keyboard.press(key === " " ? "Space" : key);
  await page.waitForTimeout(250);
  check(`key ${key === " " ? "Space" : key}`, (await hash(page)) === want, await hash(page));
}

// Slide 2 reveal button does not advance
await page.goto(file + "?length=75#/2");
await page.reload();
await page.waitForTimeout(900);
await page.getByRole("button", { name: "Reveal" }).click();
await page.waitForTimeout(2600);
check("Reveal button does not advance", (await hash(page)) === "#/2");
await page.screenshot({ path: `${out}/s02-revealed.png` });
// Space after a button click navigates instead of pressing the button again
await page.keyboard.press("Space");
await page.waitForTimeout(300);
check("Space after button click navigates", (await hash(page)) === "#/3", await hash(page));

// Slide 9 vote tiles
await page.goto(file + "?length=75#/9");
await page.reload();
await page.waitForTimeout(1200);
const tile = page.getByRole("button", { name: /Reads and writes/ });
for (let i = 0; i < 3; i++) await tile.click();
await page.getByRole("button", { name: /Predicts/ }).click();
check("vote tiles do not advance", (await hash(page)) === "#/9");
const tileText = await tile.innerText();
check("vote tile counts clicks", /\b3\s*$/.test(tileText.trim()), tileText.replace(/\n/g, " | "));
await page.screenshot({ path: `${out}/s09-votes.png` });
await page.getByRole("button", { name: /Reset/ }).click();
check("vote reset", /\b0\s*$/.test((await tile.innerText()).trim()));

// Slide 10 STOP / resume
await page.goto(file + "?length=75#/10");
await page.reload();
await page.waitForTimeout(5500);
await page.locator("button:has-text('STOP')").click();
await page.waitForTimeout(400);
check("STOP does not advance", (await hash(page)) === "#/10");
const resumeVisible = await page.getByRole("button", { name: /Resume/ }).isVisible();
check("STOP pauses and shows Resume", resumeVisible);
await page.screenshot({ path: `${out}/s10-stopped.png` });
await page.getByRole("button", { name: /Resume/ }).click();
check("Resume does not advance", (await hash(page)) === "#/10");

// Slide 12 sort board: mouse drag
await page.goto(file + "?length=75#/12");
await page.reload();
await page.waitForTimeout(1200);
const card = page.locator("[data-interactive]").filter({ hasText: /^Register and check details$/ }).first();
const colAutomate = page.locator("div").filter({ hasText: /^Automate$/ }).last();
const cb = await card.boundingBox();
const ab = await colAutomate.boundingBox();
await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2);
await page.mouse.down();
await page.mouse.move(cb.x + cb.width / 2 + 20, cb.y + cb.height / 2 + 10, { steps: 5 });
await page.mouse.move(ab.x + ab.width / 2, ab.y + 200, { steps: 15 });
await page.mouse.up();
await page.waitForTimeout(900);
const cb2 = await card.boundingBox();
check("mouse drag moves card into Automate", Math.abs(cb2.x + cb2.width / 2 - (ab.x + ab.width / 2)) < 40, `card x ${Math.round(cb2.x)} col x ${Math.round(ab.x)}`);
check("drag does not advance", (await hash(page)) === "#/12");
await page.getByRole("button", { name: /Show a suggested answer/ }).click();
await page.waitForTimeout(1200);
check("suggested answer does not advance", (await hash(page)) === "#/12");
await page.screenshot({ path: `${out}/s12-suggested.png` });
await page.getByRole("button", { name: /^Reset$/ }).click();
await page.waitForTimeout(1000);
const cb3 = await card.boundingBox();
check("sort reset returns card to tray", cb3.x < cb.x + 20, `x ${Math.round(cb3.x)}`);
// Timer start does not advance
await page.getByRole("button", { name: "Start timer" }).click();
await page.waitForTimeout(1300);
check("countdown start does not advance", (await hash(page)) === "#/12");
const t = await page.locator("text=/^7:5\\d$/").count();
check("countdown runs", t > 0);

// Slide 17 cards + guardrails
await page.goto(file + "?length=75#/17");
await page.reload();
await page.waitForTimeout(1200);
for (const n of ["1", "2", "3", "4"]) await page.locator(`button:has-text("${n}")`).filter({ hasText: new RegExp(`^${n}$`) }).first().click();
await page.getByRole("button", { name: /Guardrails/ }).click();
await page.waitForTimeout(1500);
check("risk cards and guardrails do not advance", (await hash(page)) === "#/17");
await page.screenshot({ path: `${out}/s17-revealed.png` });

// Slide 16 reveal
await page.goto(file + "?length=75#/16");
await page.reload();
await page.waitForTimeout(3000);
await page.getByRole("button", { name: /Show the hidden step/ }).click();
await page.waitForTimeout(800);
check("hidden step reveal does not advance", (await hash(page)) === "#/16");
await page.screenshot({ path: `${out}/s16-revealed.png` });

// Menu, timer
await page.keyboard.press("m");
await page.waitForTimeout(500);
check("M opens menu", await page.getByRole("navigation", { name: "Slides" }).isVisible());
const greyed = await page.locator("nav button:has-text('not in this version')").count();
check("menu greys slides hidden in 75 (18, 19)", greyed === 2, `greyed ${greyed}`);
await page.screenshot({ path: `${out}/menu-75.png` });
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(300);
check("keyboard nav works with menu open", (await hash(page)) === "#/17");
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
check("Esc closes menu", !(await page.getByRole("navigation", { name: "Slides" }).isVisible()));
await page.keyboard.press("t");
await page.waitForTimeout(1200);
check("T shows presenter timer", (await page.locator("text=/Govern it/").count()) > 0);
await page.keyboard.press("t");
await page.waitForTimeout(200);
check("T hides presenter timer", (await page.getByRole("button", { name: "Reset presenter timer" }).count()) === 0);

// Hash survives reload
await page.goto(file + "?length=75#/7");
await page.reload();
await page.waitForTimeout(600);
check("refresh keeps place", (await hash(page)) === "#/7");

// Idle controls fade
await page.mouse.move(100, 100);
await page.waitForTimeout(300);
const visibleOp = await page.locator("button[aria-label^='Open slide menu']").evaluate((el) => getComputedStyle(el.parentElement).opacity);
await page.waitForTimeout(2600);
const idleOp = await page.locator("button[aria-label^='Open slide menu']").evaluate((el) => getComputedStyle(el.parentElement).opacity);
check("controls fade after 2s idle", visibleOp === "1" && idleOp === "0", `${visibleOp} -> ${idleOp}`);

// Menu button click opens menu, does not advance
await page.mouse.move(30, 30);
await page.waitForTimeout(200);
await page.getByRole("button", { name: /Open slide menu/ }).click();
await page.waitForTimeout(400);
check("hamburger opens menu without advancing", (await hash(page)) === "#/7");
await page.locator("nav").getByRole("button", { name: /Five stops on the journey/ }).click();
await page.waitForTimeout(500);
check("menu jump", (await hash(page)) === "#/14");
await page.context().close();

// ---- 60-minute version skips 10, 18, 19 ----
page = await open({}, "?length=60");
const seen = [];
for (let i = 0; i < 20; i++) {
  seen.push(await hash(page));
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(120);
}
const uniq = [...new Set(seen)];
check("60 skips 10, 18, 19", !uniq.includes("#/10") && !uniq.includes("#/18") && !uniq.includes("#/19") && uniq.length === 17, uniq.join(" "));
await page.goto(file + "?length=60#/12");
await page.reload();
await page.waitForTimeout(800);
check("60 sort timer is 6 minutes", (await page.locator("text=/^6:00$/").count()) > 0);
await page.goto(file + "?length=60#/10");
await page.reload();
await page.waitForTimeout(500);
check("hash to hidden slide snaps forward", (await hash(page)) === "#/11", await hash(page));
await page.context().close();

// ---- Touch drag (mobile emulation) ----
page = await open({ hasTouch: true, isMobile: false, viewport: { width: 1366, height: 768 } }, "?length=75", "#/12");
await page.waitForTimeout(1000);
const tcard = page.locator("[data-interactive]").filter({ hasText: /^Close or appeal$/ }).first();
const tcol = page.locator("div").filter({ hasText: /^Keep human-led$/ }).last();
const tb = await tcard.boundingBox();
const hb = await tcol.boundingBox();
const cdp = await page.context().newCDPSession(page);
const touch = (type, x, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
let x = tb.x + tb.width / 2, y = tb.y + tb.height / 2;
await touch("touchStart", x, y);
const tx = hb.x + hb.width / 2, ty = hb.y + 150;
for (let i = 1; i <= 15; i++) {
  await touch("touchMove", x + ((tx - x) * i) / 15, y + ((ty - y) * i) / 15);
  await page.waitForTimeout(16);
}
await touch("touchEnd", tx, ty);
await page.waitForTimeout(900);
const tb2 = await tcard.boundingBox();
check("touch drag moves card into Keep human-led", Math.abs(tb2.x + tb2.width / 2 - tx) < 40, `card cx ${Math.round(tb2.x + tb2.width / 2)} target ${Math.round(tx)}`);
check("touch drag does not advance", (await hash(page)) === "#/12");
await page.screenshot({ path: `${out}/s12-touch-1366.png` });
await page.context().close();

// ---- Presenter timer turns amber 2 minutes over (fake clock) ----
{
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const p2 = await ctx.newPage();
  await p2.clock.install();
  await p2.goto(file + "?length=75#/1");
  await p2.waitForTimeout(300);
  await p2.keyboard.press("t");
  await p2.clock.runFor(6 * 60 * 1000); // opening planned 5, so 1 minute over
  const before = await p2.locator("button[aria-label='Reset presenter timer']").evaluate((b) => getComputedStyle(b.parentElement).boxShadow);
  await p2.clock.runFor(90 * 1000); // now 2.5 minutes over
  const after = await p2.locator("button[aria-label='Reset presenter timer']").evaluate((b) => getComputedStyle(b.parentElement).boxShadow);
  const txt = await p2.locator("button[aria-label='Reset presenter timer']").evaluate((b) => b.parentElement.innerText);
  check("presenter timer amber only when 2+ min over", before === "none" && after.includes("251, 180, 58"), txt.replace(/\n/g, " "));
  await p2.screenshot({ path: `${out}/timer-amber.png` });
  await ctx.close();
}

// ---- Reduced motion ----
page = await open({ reducedMotion: "reduce" }, "?length=75", "#/4");
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/s04-reduced.png` });
await page.goto(file + "?length=75#/8");
await page.reload();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/s08-reduced.png` });
await page.context().close();

console.log(results.join("\n"));
console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "no console errors");
await browser.close();
