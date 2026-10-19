// Renders a still of every scene to out/stills for review:
//   node scripts/stills.mjs [--country] [seconds...]
// By default, one still per scene, just before it ends, when everything on screen has arrived (plus the opening
// card of the main video). --country does the same for the country song version.
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { readFileSync } from "node:fs";
import { renderStill, selectComposition } from "@remotion/renderer";
import { scheduleBeats } from "../src/explainer/timing.ts";
import { scheduleSections } from "../src/song/timeline.ts";

const root = path.resolve(import.meta.dirname, "..");
const json = (file) => JSON.parse(readFileSync(path.join(root, file), "utf8"));
const country = process.argv.includes("--country");
const id = country ? "CountrySong" : "Explainer";
const scenes = country ? scheduleSections(json("public/audio/country/song-timing.json")) : scheduleBeats(json("public/explainer/manifest.json"));
const defaults = [...(country ? [] : [4]), ...scenes.map((s) => Math.round((s.start + s.seconds - 0.8) * 10) / 10)];
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
  const output = path.join(root, country ? "out/stills-country" : "out/stills", `t${s.toFixed(1).padStart(6, "0")}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 80 });
  console.log(output);
}
