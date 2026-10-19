// Builds the one-page cheat sheet that goes out with the explainer, from src/explainer/cheatsheet.ts,
// in the deck's WCB colours with both logos. Letter size, prints on one page.
//
//   node scripts/cheatsheet.mjs     writes cheatsheet/follow-the-claim-cheat-sheet.pdf, a .png preview, and the
//                                   copy the explainer shows in its last scene (public/explainer/cheat-sheet.png)
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { theme } from "../../src/theme.ts";
import { WCB_LOGO_BLUE, WCB_LOGO_VIEWBOX, wcbAlberta, wcbLetters, wcbText } from "../../src/components/wcbLogoPaths.ts";
import { DELOITTE_GREEN, DELOITTE_VIEWBOX, deloitteDot, deloitteWordmark } from "../../src/components/deloitteLogoPaths.ts";
import { bringQuestions, deloitte, pitch, pitchQuestions, termGroups } from "../src/explainer/cheatsheet.ts";
import { session } from "../src/content.ts";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "cheatsheet");
const font = (w) => pathToFileURL(path.join(root, `node_modules/@fontsource/roboto/files/roboto-latin-${w}-normal.woff2`)).href;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const paths = (ds, fill) => ds.map((d) => `<path d="${d}" fill="${fill}"/>`).join("");

const wcbLogo = `<svg viewBox="${WCB_LOGO_VIEWBOX}" height="40">${paths(wcbLetters, WCB_LOGO_BLUE)}${paths(wcbText, "#fff")}${paths(wcbAlberta, "#fff")}</svg>`;
const deloitteLogo = `<svg viewBox="${DELOITTE_VIEWBOX}" height="20">${paths(deloitteWordmark, "#fff")}${paths(deloitteDot, DELOITTE_GREEN)}</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${[400, 500, 700, 900].map((w) => `@font-face{font-family:Roboto;font-weight:${w};src:url(${font(w)}) format("woff2")}`).join("\n")}
@page { size: letter; margin: 0 }
* { box-sizing: border-box; margin: 0 }
body { font-family: Roboto, sans-serif; color: ${theme.ink}; width: 8.5in; height: 11in; background: ${theme.brandLight}; font-size: 9.6pt; line-height: 1.3 }
header { background: ${theme.brandPrimary}; color: #fff; padding: 0.32in 0.45in 0.28in; display: flex; justify-content: space-between; align-items: flex-end }
header h1 { font-size: 22pt; font-weight: 700; line-height: 1.1 }
header h1 span { color: ${theme.brandAccent} }
header p { color: ${theme.brandTint}; font-size: 10.5pt; margin-top: 4px }
.logos { display: flex; align-items: center; gap: 12px }
.logos i { width: 1px; height: 26px; background: ${theme.brandSky}; opacity: .6 }
main { display: grid; grid-template-columns: 1.15fr 1fr; gap: 0.22in; padding: 0.25in 0.45in 0 }
h2 { font-size: 12.5pt; color: ${theme.brandPrimary}; font-weight: 700; margin: 0 0 6px }
h3 { font-size: 8.5pt; text-transform: uppercase; letter-spacing: .06em; color: ${theme.brandSecondary}; margin: 10px 0 4px }
.term { background: #fff; border-left: 4px solid ${theme.brandSky}; border-radius: 6px; padding: 5px 8px; margin-bottom: 4px }
.term b { color: ${theme.brandPrimary} }
.term em { display: block; color: ${theme.muted}; font-size: 8.4pt }
.card { background: #fff; border: 1.5px solid ${theme.brandSky}; border-radius: 10px; padding: 9px 11px; margin-bottom: 10px }
.pitch { font-style: italic; color: ${theme.muted}; margin-bottom: 6px }
ol { padding-left: 18px } li { margin-bottom: 5px }
li .claim { color: ${theme.brandSecondary}; font-weight: 700 }
li .tag { color: ${theme.muted}; font-size: 8.2pt }
.q { margin-bottom: 7px } .q b { color: ${theme.brandPrimary} } .q span { color: ${theme.muted}; font-size: 8.4pt }
.q span { display: block }
.q .line { border-bottom: 1px solid ${theme.line}; height: 15px; margin-top: 2px }
.stat { display: flex; gap: 10px; align-items: center; background: ${theme.brandPrimary}; color: #fff; border-radius: 10px; padding: 8px 11px }
.stat b { font-size: 22pt; color: ${theme.brandAccent} } .stat small { display: block; color: ${theme.brandTint}; font-size: 7.6pt; margin-top: 2px }
footer { position: absolute; bottom: 0.3in; left: 0.45in; right: 0.45in; display: flex; justify-content: space-between; color: ${theme.muted}; font-size: 8.2pt }
footer b { color: ${theme.human} }
</style></head><body>
<header>
  <div><p style="margin:0 0 4px">Follow the claim · ${esc(session.programme)} · ${esc(session.date)}</p><h1>Your <span>AI cheat sheet</span></h1><p>Keep it handy in the session</p></div>
  <div class="logos">${wcbLogo}<i></i>${deloitteLogo}</div>
</header>
<main>
  <section>
    <h2>The words we'll use</h2>
    ${termGroups
      .map(
        (g) => `<h3>${esc(g.title)}</h3>${g.terms
          .map((t) => `<div class="term"><b>${esc(t.term)}</b>: ${esc(t.meaning)}<em>Like: ${esc(t.seenAs)}</em></div>`)
          .join("")}`,
      )
      .join("")}
  </section>
  <section>
    <div class="card">
      <h2>Five questions for any AI pitch</h2>
      <div class="pitch">"${esc(pitch)}"</div>
      <ol>${pitchQuestions
        .map((p) => `<li>${p.claim.startsWith("(") ? "" : `<span class="claim">${esc(p.claim)}?</span> `}${esc(p.question)} <span class="tag">(${esc(p.term)})</span></li>`)
        .join("")}</ol>
      <p style="margin-top:4px">If they can't answer, that is your answer.</p>
    </div>
    <div class="card">
      <h2>Three questions to bring</h2>
      ${bringQuestions.map((q, i) => `<div class="q"><b>${i + 1}. ${esc(q.question)}</b> <span>${esc(q.why)}</span><div class="line"></div><div class="line"></div></div>`).join("")}
    </div>
    <div class="stat"><b>${esc(deloitte.stat)}</b><div>${esc(deloitte.text)}. Nobody is far ahead: what matters is where we choose to start.<small>${esc(deloitte.source)}</small></div></div>
  </section>
</main>
<footer><span>The session: <b>See it</b> · <b>Choose it</b> · <b>Govern it</b>. Same care. Better journey.</span><span>WCB-Alberta · Deloitte</span></footer>
</body></html>`;

mkdirSync(outDir, { recursive: true });
const htmlPath = path.join(outDir, "cheatsheet.html");
writeFileSync(htmlPath, html);
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(htmlPath).href);
await page.evaluate(() => document.fonts.ready);
// It must fit on one page: fail loudly if the content runs past the bottom.
const overflow = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
if (overflow > 0) throw new Error(`The cheat sheet runs ${overflow}px past one page; shorten it.`);
await page.pdf({ path: path.join(outDir, "follow-the-claim-cheat-sheet.pdf"), format: "Letter", printBackground: true });
await page.screenshot({ path: path.join(outDir, "follow-the-claim-cheat-sheet.png") });
await page.screenshot({ path: path.join(root, "public/explainer/cheat-sheet.png") });
await browser.close();
console.log("cheatsheet: wrote cheatsheet/follow-the-claim-cheat-sheet.pdf and .png");
