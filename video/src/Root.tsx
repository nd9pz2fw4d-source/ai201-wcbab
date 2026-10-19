import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-400-italic.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "@fontsource/roboto/latin-900.css";
import { Composition, continueRender, delayRender, getStaticFiles, staticFile } from "remotion";
import { Explainer, type ExplainerProps } from "./explainer/Explainer";
import { FPS, scheduleBeats, totalSeconds, type Manifest } from "./explainer/timing";
import { CountrySong, type CountrySongProps } from "./song/CountrySong";
import { plannedTiming, type SongTiming } from "./song/timeline";

// Hold every frame until Roboto has loaded, so no frame renders in a fallback font.
const fonts = delayRender("Loading Roboto");
Promise.all(["400", "italic 400", "500", "700", "900"].map((w) => document.fonts.load(`${w} 40px Roboto`))).then(() => continueRender(fonts));

const defaults: ExplainerProps = { manifest: { scenes: [] } };
const songDefaults: CountrySongProps = { timing: plannedTiming(), hasSong: false };

const fetchJson = async <T,>(file: string): Promise<T> => (await (await fetch(staticFile(file))).json()) as T;

export function Root() {
  return (
    <>
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
          const manifest = await fetchJson<Manifest>("explainer/manifest.json");
          return { durationInFrames: Math.ceil(totalSeconds(scheduleBeats(manifest)) * FPS), props: { ...props, manifest } };
        }}
      />
      {/* The side version: the session scenes set to the country song. */}
      <Composition
        id="CountrySong"
        component={CountrySong}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={Math.ceil(songDefaults.timing.duration * FPS)}
        defaultProps={songDefaults}
        calculateMetadata={async ({ props }) => {
          // The video runs as long as the take, with every cue following its line timing (scripts/align_lyrics.py).
          const files = new Set(getStaticFiles().map((f) => f.name));
          const timing = files.has("audio/country/song-timing.json") ? await fetchJson<SongTiming>("audio/country/song-timing.json") : props.timing;
          return { durationInFrames: Math.ceil(timing.duration * FPS), props: { ...props, timing, hasSong: files.has("audio/country/song.mp3") } };
        }}
      />
    </>
  );
}
