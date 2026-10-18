// Renders a still of every scene to out/stills for review:
//   node scripts/stills.mjs [--explainer] [seconds...]
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { existsSync, readFileSync } from "node:fs";
import { renderStill, selectComposition } from "@remotion/renderer";
import { plannedTiming, scheduleSections } from "../src/timeline.ts";
import { scheduleBeats } from "../src/explainer/timing.ts";

const root = path.resolve(import.meta.dirname, "..");
// By default, one still per section, just before it ends, when everything on screen has arrived.
const timingFile = path.join(root, "public/audio/song-timing.json");
const timing = existsSync(timingFile) ? JSON.parse(readFileSync(timingFile, "utf8")) : plannedTiming();
const explainer = process.argv.includes("--explainer");
const id = explainer ? "Explainer" : "PreRead";
const sections = explainer
  ? scheduleBeats(JSON.parse(readFileSync(path.join(root, "public/explainer/manifest.json"), "utf8")))
  : scheduleSections(timing);
const defaults = [...(explainer ? [5] : []), ...sections.map((s) => Math.round((s.start + s.seconds - 0.8) * 10) / 10)];
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const seconds = args.length ? args.map(Number) : defaults;

const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  // Same webpack override as remotion.config.ts: resolve packages from this folder first.
  webpackOverride: (config) => ({
    ...config,
    resolve: { ...config.resolve, modules: [path.join(root, "node_modules"), "node_modules"] },
  }),
});
const composition = await selectComposition({ serveUrl, id });
for (const s of seconds) {
  const frame = Math.round(s * composition.fps);
  const output = path.join(root, "out/stills", `t${String(s).padStart(5, "0")}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 80 });
  console.log(output);
}
