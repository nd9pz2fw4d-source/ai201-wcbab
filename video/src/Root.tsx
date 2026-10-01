import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-400-italic.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "@fontsource/roboto/latin-900.css";
import { Composition, continueRender, delayRender, getStaticFiles, staticFile } from "remotion";
import { PreRead, type PreReadProps } from "./PreRead";
import { FPS, plannedTiming, sfxLibrary, type SfxId, type SongTiming } from "./timeline";

// Hold every frame until Roboto has loaded, so no frame renders in a fallback font.
const fonts = delayRender("Loading Roboto");
Promise.all(["400", "italic 400", "500", "700", "900"].map((w) => document.fonts.load(`${w} 40px Roboto`))).then(() => continueRender(fonts));

const defaults: PreReadProps = { timing: plannedTiming(), hasSong: false, sfx: [] };

export function Root() {
  return (
    <Composition
      id="PreRead"
      component={PreRead}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={Math.ceil(defaults.timing.duration * FPS)}
      defaultProps={defaults}
      calculateMetadata={async ({ props }) => {
        // Use whatever audio has been generated (npm run audio); the video still renders without it.
        const files = new Set(getStaticFiles().map((f) => f.name));
        const sfx = (Object.keys(sfxLibrary) as SfxId[]).filter((id) => files.has(`audio/sfx/${id}.mp3`));
        // The video runs as long as the song, with every cue following the take's line timing.
        let timing = props.timing;
        if (files.has("audio/song-timing.json")) {
          timing = (await (await fetch(staticFile("audio/song-timing.json"))).json()) as SongTiming;
        }
        return {
          durationInFrames: Math.ceil(timing.duration * FPS),
          props: { ...props, timing, sfx, hasSong: files.has("audio/song.mp3") },
        };
      }}
    />
  );
}
