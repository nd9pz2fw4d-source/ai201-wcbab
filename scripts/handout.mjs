// Prints the "Design an agent" handout from the built deck to handout/design-an-agent.pdf.
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const file = "file://" + path.resolve("dist/index.html");
fs.mkdirSync("handout", { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage();
await p.goto(file + "?length=75#/1");
await p.waitForTimeout(800);
await p.emulateMedia({ media: "print" });
await p.pdf({ path: "handout/design-an-agent.pdf", format: "Letter", landscape: true, printBackground: true, preferCSSPageSize: true });
await p.setViewportSize({ width: 1100, height: 850 });
await p.screenshot({ path: "screenshots/interact/handout-page1.png", fullPage: false });
await b.close();
console.log("wrote handout/design-an-agent.pdf");
