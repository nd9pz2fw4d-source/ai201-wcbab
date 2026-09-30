// Renders a still of every scene to out/stills for review: node scripts/stills.mjs [seconds...]
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const root = path.resolve(import.meta.dirname, "..");
// Seconds chosen near the end of each beat, when everything on screen has arrived.
const defaults = [7, 10, 14, 23, 39, 53, 63, 79, 81, 85.5, 110, 127, 136];
const seconds = process.argv.length > 2 ? process.argv.slice(2).map(Number) : defaults;

const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  // Same webpack override as remotion.config.ts: resolve packages from this folder first.
  webpackOverride: (config) => ({
    ...config,
    resolve: { ...config.resolve, modules: [path.join(root, "node_modules"), "node_modules"] },
  }),
});
const composition = await selectComposition({ serveUrl, id: "PreRead" });
for (const s of seconds) {
  const frame = Math.round(s * composition.fps);
  const output = path.join(root, "out/stills", `t${String(s).padStart(5, "0")}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 80 });
  console.log(output);
}
