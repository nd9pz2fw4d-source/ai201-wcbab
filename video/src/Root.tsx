import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-400-italic.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "@fontsource/roboto/latin-900.css";
import { Composition, continueRender, delayRender, staticFile } from "remotion";
import { Explainer, type ExplainerProps } from "./explainer/Explainer";
import { FPS, scheduleBeats, totalSeconds, type Manifest } from "./explainer/timing";

// Hold every frame until Roboto has loaded, so no frame renders in a fallback font.
const fonts = delayRender("Loading Roboto");
Promise.all(["400", "italic 400", "500", "700", "900"].map((w) => document.fonts.load(`${w} 40px Roboto`))).then(() => continueRender(fonts));

const defaults: ExplainerProps = { manifest: { scenes: [] } };

export function Root() {
  return (
    <Composition
      id="Explainer"
      component={Explainer}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={FPS * 60}
      defaultProps={defaults}
      calculateMetadata={async ({ props }) => {
        // The script's lines, their lengths, and which have a voice yet (scripts/explainer.mjs manifest).
        const manifest = (await (await fetch(staticFile("explainer/manifest.json"))).json()) as Manifest;
        return { durationInFrames: Math.ceil(totalSeconds(scheduleBeats(manifest)) * FPS), props: { ...props, manifest } };
      }}
    />
  );
}
