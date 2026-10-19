// Renders a still of every scene to out/stills for review:
//   node scripts/stills.mjs [seconds...]
// By default, one still of the opening card and one per scene, just before it ends, when everything on screen has arrived.
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { readFileSync } from "node:fs";
import { renderStill, selectComposition } from "@remotion/renderer";
import { scheduleBeats } from "../src/explainer/timing.ts";

const root = path.resolve(import.meta.dirname, "..");
const beats = scheduleBeats(JSON.parse(readFileSync(path.join(root, "public/explainer/manifest.json"), "utf8")));
const defaults = [4, ...beats.map((b) => Math.round((b.start + b.seconds - 0.8) * 10) / 10)];
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
const composition = await selectComposition({ serveUrl, id: "Explainer" });
for (const s of seconds) {
  const frame = Math.round(s * composition.fps);
  const output = path.join(root, "out/stills", `t${String(s).padStart(5, "0")}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 80 });
  console.log(output);
}
