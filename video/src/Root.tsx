import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-400-italic.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "@fontsource/roboto/latin-900.css";
import { Composition, continueRender, delayRender, getStaticFiles, staticFile } from "remotion";
import { Explainer, type ExplainerProps } from "./explainer/Explainer";
import { musicVideoStart, scheduleBeats, type Manifest } from "./explainer/timing";
import { PreRead, type PreReadProps } from "./PreRead";
import { FPS, plannedTiming, sfxLibrary, type SfxId, type SongTiming } from "./timeline";

// Hold every frame until Roboto has loaded, so no frame renders in a fallback font.
const fonts = delayRender("Loading Roboto");
Promise.all(["400", "italic 400", "500", "700", "900"].map((w) => document.fonts.load(`${w} 40px Roboto`))).then(() => continueRender(fonts));

const songDefaults: PreReadProps = { timing: plannedTiming(), hasSong: false, sfx: [] };

const fetchJson = async <T,>(file: string): Promise<T> => (await (await fetch(staticFile(file))).json()) as T;

/** The music video's props from whatever audio has been generated; it still renders without any. */
async function loadSong(props: PreReadProps): Promise<PreReadProps> {
  const files = new Set(getStaticFiles().map((f) => f.name));
  const sfx = (Object.keys(sfxLibrary) as SfxId[]).filter((id) => files.has(`audio/sfx/${id}.mp3`));
  // The video runs as long as the song, with every cue following the take's line timing.
  const timing = files.has("audio/song-timing.json") ? await fetchJson<SongTiming>("audio/song-timing.json") : props.timing;
  return { ...props, timing, sfx, hasSong: files.has("audio/song.mp3") };
}

const explainerDefaults: ExplainerProps = { manifest: { scenes: [] }, song: songDefaults };

export function Root() {
  return (
    <>
      <Composition
        id="PreRead"
        component={PreRead}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={Math.ceil(songDefaults.timing.duration * FPS)}
        defaultProps={songDefaults}
        calculateMetadata={async ({ props }) => {
          const song = await loadSong(props);
          return { durationInFrames: Math.ceil(song.timing.duration * FPS), props: song };
        }}
      />
      <Composition
        id="Explainer"
        component={Explainer}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={FPS * 60}
        defaultProps={explainerDefaults}
        calculateMetadata={async ({ props }) => {
          // The script's lines, their lengths, and which have a voice yet (scripts/explainer.mjs manifest).
          const manifest = await fetchJson<Manifest>("explainer/manifest.json");
          const song = await loadSong(props.song);
          const seconds = musicVideoStart(scheduleBeats(manifest)) + song.timing.duration;
          return { durationInFrames: Math.ceil(seconds * FPS), props: { ...props, manifest, song } };
        }}
      />
    </>
  );
}
