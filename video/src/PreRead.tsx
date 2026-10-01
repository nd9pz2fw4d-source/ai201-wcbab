import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "./components/Caption";
import { Agenda } from "./scenes/Agenda";
import { Bingo } from "./scenes/Bingo";
import { Chorus } from "./scenes/Chorus";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { Shifts } from "./scenes/Shifts";
import { Terms } from "./scenes/Terms";
import { Verse1 } from "./scenes/Verse1";
import { SectionTimingContext } from "./sectionTiming";
import { FPS, scheduleSections, sections, sfxCues, type SectionId, type SfxId, type SongTiming } from "./timeline";

export interface PreReadProps {
  /** When each line is sung in the current take (or the plan, before one exists). */
  timing: SongTiming;
  /** public/audio/song.mp3 exists. */
  hasSong: boolean;
  /** Sound effects found in public/audio/sfx. */
  sfx: SfxId[];
  [key: string]: unknown;
}

const scenes: Record<SectionId, () => ReactNode> = {
  intro: () => <Intro />,
  verse1: () => <Verse1 />,
  chorus1: () => <Chorus chip="The journey" tagline="Same care. Better journey." />,
  shifts: () => <Shifts />,
  agenda: () => <Agenda />,
  terms: () => <Terms />,
  chorus2: () => <Bingo />,
  outro: () => <Outro />,
};

const frame = (seconds: number) => Math.round(seconds * FPS);

// The song is mastered close to 0 dB; turning it down leaves room for the effects without clipping.
const SONG_VOLUME = 0.75;
const SFX_VOLUME = 0.8;

export function PreRead({ timing, hasSong, sfx }: PreReadProps) {
  const schedule = scheduleSections(timing);
  return (
    <AbsoluteFill style={{ background: "#0C3553" }}>
      {schedule.map((s, i) => {
        const from = frame(s.start);
        const frames = frame(s.start + s.seconds) - from;
        return (
          <Sequence key={s.id} name={sections[i].name} from={from} durationInFrames={frames}>
            <SectionTimingContext.Provider value={s}>
              <SoftCut frames={frames}>{scenes[s.id]()}</SoftCut>
            </SectionTimingContext.Provider>
          </Sequence>
        );
      })}
      <Caption lyrics={timing.lines} />
      {hasSong && <Audio src={staticFile("audio/song.mp3")} volume={SONG_VOLUME} />}
      {sfxCues
        .filter((c) => sfx.includes(c.id))
        .map((c, i) => {
          const s = schedule.find((x) => x.id === c.section)!;
          return (
            <Sequence key={`${c.id}-${i}`} name={`sfx ${c.id}`} from={frame(s.start + c.at(s))} layout="none">
              <Audio src={staticFile(`audio/sfx/${c.id}.mp3`)} volume={c.volume ?? SFX_VOLUME} />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
}

/** Fades a scene in and out over a few frames so the cuts feel soft. */
function SoftCut({ frames, children }: { frames: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, frames - 6, frames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}
