// One-page printed worksheet for the "Design an agent" table exercise.
// Content comes from src/data/designAgent.ts (the same data as the slide), so the two stay in step.
// Writes handout/design-an-agent-worksheet.pdf (US Letter, portrait, one page).
//   node scripts/worksheet.mjs
import { chromium } from "playwright";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import createJiti from "jiti";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { pathToFileURL } from "node:url";

const jiti = createJiti(import.meta.url);
const { designAgents, worksheetRows, autonomyRow, ingredients, threeRights, workedExample } = jiti("../src/data/designAgent.ts");
const { stations } = jiti("../src/data/journey.ts");
const { theme } = jiti("../src/theme.ts");
const wcb = jiti("../src/components/wcbLogoPaths.ts");
const dt = jiti("../src/components/deloitteLogoPaths.ts");

const icon = (Icon, size, color) => renderToStaticMarkup(createElement(Icon, { size, color, strokeWidth: 2 }));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const font = (w) => pathToFileURL(path.resolve(`node_modules/@fontsource/roboto/files/roboto-latin-${w}-normal.woff2`)).href;

const wcbLogo = `<svg viewBox="${wcb.WCB_LOGO_VIEWBOX}" height="30" width="${(30 * 266) / 73}">${[
  ...wcb.wcbLetters.map((d) => `<path d="${d}" fill="#64B0E0"/>`),
  ...wcb.wcbText.map((d) => `<path d="${d}" fill="${wcb.WCB_LOGO_TEXT}"/>`),
  ...wcb.wcbAlberta.map((d) => `<path d="${d}" fill="#C8C8CB"/>`),
].join("")}</svg>`;
const deloitteLogo = `<svg viewBox="${dt.DELOITTE_VIEWBOX}" height="16" width="${(16 * 182) / 34}">${[
  ...dt.deloitteWordmark.map((d) => `<path d="${d}" fill="#000"/>`),
  ...dt.deloitteDot.map((d) => `<path d="${d}" fill="${dt.DELOITTE_GREEN}"/>`),
].join("")}</svg>`;

const tag = { read: [theme.brandTint, theme.brandDeep], draft: ["#FFF1D6", "#8A5A00"], act: [theme.brandPrimary, "#fff"] };
const chip = (g) =>
  `<span class="chip">${g.tag ? `<b class="tag" style="background:${tag[g.tag][0]};color:${tag[g.tag][1]}">${g.tag}</b>` : ""}${esc(g.text)}</span>`;

const rows = [...worksheetRows, autonomyRow]
  .map((r) => {
    const optional = r === autonomyRow;
    return `<tr class="${optional ? "optional" : ""}">
      <td class="label"><div class="lab"><span class="ic" style="background:${optional ? theme.brandSky : theme.agent}">${icon(r.icon, 15, "#fff")}</span>
        <div><div class="el">${r.element}${optional ? ' <small>optional</small>' : ""}</div><div class="q">${esc(r.question)}</div></div></div></td>
      <td class="write"></td>
      <td class="ingr">${ingredients[r.element].map(chip).join("")}</td>
    </tr>`;
  })
  .join("");

const tasks = designAgents
  .map((a) => {
    const st = stations.find((s) => s.id === a.station);
    return `<div class="task"><span class="tic">${icon(st.icon, 12, "#fff")}</span><div><b>${a.name}</b> ${esc(a.job)}</div></div>`;
  })
  .join("");

const example = Object.entries(workedExample.rows)
  .map(([k, lines]) => `<div class="exrow"><b>${k}</b><span>${lines.map(esc).join(" · ")}</span></div>`)
  .join("");

const rights = threeRights
  .map((r) => `<div class="right"><span class="ric">${icon(r.icon, 14, theme.brandPrimary)}</span><div><b>${r.title}</b><br/>${esc(r.text)}</div></div>`)
  .join("");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Design an agent: worksheet</title>
<style>
@font-face{font-family:Roboto;font-weight:400;src:url(${font(400)})}
@font-face{font-family:Roboto;font-weight:500;src:url(${font(500)})}
@font-face{font-family:Roboto;font-weight:700;src:url(${font(700)})}
@page{size:letter portrait;margin:0.35in 0.4in}
*{box-sizing:border-box}
body{margin:0;font-family:Roboto,Arial,sans-serif;color:${theme.ink};font-size:8.6pt;line-height:1.3;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.top{display:flex;align-items:center;justify-content:space-between;padding-bottom:5pt;border-bottom:2pt solid ${theme.agent}}
.logos{display:flex;align-items:center;gap:9pt}.logos i{width:1pt;height:18pt;background:#C9DDEA}
.kicker{font-size:7.5pt;letter-spacing:.12em;text-transform:uppercase;color:${theme.muted}}
h1{margin:1pt 0 0;font-size:21pt;line-height:1.1;color:${theme.brandPrimary}}
.fields{display:flex;gap:14pt;margin:6pt 0 5pt;font-size:10pt;font-weight:500;color:${theme.brandPrimary}}
.fields span{flex:1;border-bottom:1pt solid #9FB3C4;padding-bottom:2pt}.fields span.small{flex:0 0 1.1in}
.steps{display:flex;gap:6pt;margin-bottom:5pt}
.step{flex:1;display:flex;gap:6pt;align-items:flex-start;background:${theme.brandLight};border:1pt solid ${theme.line};border-radius:6pt;padding:4pt 7pt}
.step .n{flex:0 0 auto;width:17pt;height:17pt;border-radius:50%;background:${theme.agent};color:#fff;font-weight:700;display:grid;place-items:center;font-size:9pt}
.step b{color:${theme.brandPrimary};font-size:9.2pt}
h2{margin:0 0 3pt;font-size:7.8pt;letter-spacing:.12em;text-transform:uppercase;color:${theme.muted}}
.tasks{display:grid;grid-template-columns:1fr 1fr;gap:2pt 12pt;margin-bottom:6pt}
.task{display:flex;gap:5pt;align-items:flex-start;font-size:8pt}.task b{color:${theme.brandPrimary}}
.tic{flex:0 0 auto;width:14pt;height:14pt;border-radius:50%;background:${theme.brandDeep};display:grid;place-items:center;margin-top:.5pt}
table{width:100%;border-collapse:collapse;border:1.2pt solid ${theme.line};border-radius:6pt}
th{background:${theme.brandPrimary};color:#fff;text-align:left;font-size:8pt;font-weight:500;letter-spacing:.06em;text-transform:uppercase;padding:4pt 7pt}
td{border-top:1pt solid ${theme.line};vertical-align:top;padding:4pt 7pt}
tr.optional td{border-top:1.2pt dashed ${theme.line}}
table{table-layout:fixed}td.label{width:1.62in}.lab{display:flex;gap:6pt}th:first-child{width:1.62in}th:last-child{width:2.85in}
.ic{flex:0 0 auto;width:24pt;height:24pt;border-radius:50%;display:grid;place-items:center}
.el{font-size:11pt;font-weight:700;color:${theme.brandPrimary};line-height:1.1}.el small{font-size:7pt;font-weight:500;color:${theme.muted}}
.q{color:${theme.muted};font-size:8pt}
td.write{height:0.8in;background:repeating-linear-gradient(transparent 0 17pt,#DCE7EF 17pt 18pt);border-left:1pt solid ${theme.line};border-right:1pt solid ${theme.line}}
tr.optional td.write{height:0.55in}
td.ingr{background:#FAFCFE}
.chip{display:inline-flex;align-items:center;gap:3pt;background:#EEF5FA;border-radius:8pt;padding:0.8pt 5pt;margin:0 1.5pt 2.5pt 0;font-size:7.4pt;white-space:nowrap}
.tag{font-size:6pt;letter-spacing:.06em;text-transform:uppercase;border-radius:6pt;padding:0 3pt}
.bottom{display:flex;gap:8pt;margin-top:6pt}
.box{border:1.2pt solid ${theme.line};border-radius:6pt;padding:6pt 8pt}
.rights{flex:0 0 2.35in;border-color:${theme.brandAccent}}
.right{display:flex;gap:5pt;margin-top:3.5pt;font-size:8pt}.right b{color:${theme.brandPrimary};font-size:8.6pt}
.ric{flex:0 0 auto;width:18pt;height:18pt;border-radius:50%;background:${theme.brandAccent};display:grid;place-items:center}
.ex{flex:1}.exrow{display:flex;gap:6pt;font-size:7.5pt;line-height:1.25;margin-top:2pt}.exrow b{flex:0 0 0.72in;color:${theme.brandPrimary}}
.foot{display:flex;justify-content:space-between;margin-top:6pt;font-size:7.5pt;color:${theme.muted}}
.person{color:#fff;background:${theme.human};border-radius:8pt;padding:1.5pt 7pt;font-weight:500}
</style></head><body>
<div class="top">
  <div><div class="kicker">Follow the claim · Executive AI Academy</div><h1>Design an agent</h1></div>
  <div class="logos">${wcbLogo}<i></i>${deloitteLogo}</div>
</div>
<div class="fields"><span class="small">Table</span><span>Our task</span><span>Our agent's name</span></div>

<div class="steps">
  <div class="step"><span class="n">1</span><div><b>Take a task</b><br/>One step of the claim, below. Your facilitator assigns it.</div></div>
  <div class="step"><span class="n">2</span><div><b>Design it · 5 min</b><br/>Fill in the four parts. Pull from the ingredients, or write your own.</div></div>
  <div class="step"><span class="n">3</span><div><b>Share back · 30 sec</b><br/>Its name and goal, one instruction, and one check.</div></div>
</div>

<h2>The tasks: one agent per step of the claim</h2>
<div class="tasks">${tasks}</div>

<table>
  <thead><tr><th>What makes an agent</th><th>Your design</th><th>Ingredients to pull from</th></tr></thead>
  <tbody>${rows}</tbody>
</table>

<div class="bottom">
  <div class="box rights"><h2>Good instructions give it</h2>${rights}</div>
  <div class="box ex"><h2>Example: ${workedExample.agent}</h2>${example}</div>
</div>
<div class="foot">
  <span><span class="person">A person approves</span>&nbsp; anything that reaches the worker or moves money: letters and payments.</span>
  <span>Composite example. Not a real claim or person.</span>
</div>
</body></html>`;

fs.mkdirSync("handout", { recursive: true });
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "worksheet-")), "worksheet.html");
fs.writeFileSync(tmp, html);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage();
await p.goto(pathToFileURL(tmp).href);
await p.waitForTimeout(300);
await p.pdf({ path: "handout/design-an-agent-worksheet.pdf", format: "Letter", printBackground: true, preferCSSPageSize: true });
// Preview image of the page, at print size, for checking.
await p.setViewportSize({ width: 816, height: 1056 });
await p.emulateMedia({ media: "print" });
await p.addStyleTag({ content: "body{padding:0.35in 0.4in}" });
await p.screenshot({ path: "screenshots/interact/worksheet.png", fullPage: true });
await b.close();
const pages = (fs.readFileSync("handout/design-an-agent-worksheet.pdf", "latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`wrote handout/design-an-agent-worksheet.pdf (${pages} page${pages === 1 ? "" : "s"})`);
if (pages !== 1) process.exitCode = 1;
