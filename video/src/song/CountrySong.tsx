import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { FPS } from "../explainer/timing";
import { Agenda } from "../scenes/Agenda";
import { Chorus } from "../scenes/Chorus";
import { DoneWell } from "../scenes/DoneWell";
import { Intro } from "../scenes/Intro";
import { Outro } from "../scenes/Outro";
import { Shifts } from "../scenes/Shifts";
import { Terms } from "../scenes/Terms";
import { Verse1 } from "../scenes/Verse1";
import { agendaCues, chorusCues, doneWellCues, introCues, shiftsCues, termsCues, verse1Cues } from "./cues";
import { scheduleSections, sections, type SectionId, type SectionTiming, type SongTiming } from "./timeline";

export interface CountrySongProps {
  /** When each line is sung in the current take (or the plan, before one exists). */
  timing: SongTiming;
  /** public/audio/country/song.mp3 exists. */
  hasSong: boolean;
  [key: string]: unknown;
}

/** The picture for each section of the song: the session scenes of the main video. */
const scenes: Record<SectionId, (s: SectionTiming) => ReactNode> = {
  intro: (s) => <Intro cues={introCues(s)} />,
  verse1: (s) => <Verse1 cues={verse1Cues(s)} />,
  chorus1: (s) => <Chorus cues={chorusCues(s)} />,
  shifts: (s) => <Shifts cues={shiftsCues(s)} />,
  agenda: (s) => <Agenda cues={agendaCues(s)} />,
  terms: (s) => <Terms cues={termsCues(s)} />,
  chorus2: (s) => <DoneWell cues={doneWellCues(s)} />,
  outro: () => <Outro />,
};

const frame = (seconds: number) => Math.round(seconds * FPS);

// The song is mastered close to 0 dB; turning it down leaves room for the effects without clipping.
const SONG_VOLUME = 0.75;

export function CountrySong({ timing, hasSong }: CountrySongProps) {
  return (
    <AbsoluteFill style={{ background: "#0C3553" }}>
      {scheduleSections(timing).map((s, i) => {
        const from = frame(s.start);
        const frames = frame(s.start + s.seconds) - from;
        return (
          <Sequence key={s.id} name={sections[i].name} from={from} durationInFrames={frames}>
            <SoftCut frames={frames}>{scenes[s.id](s)}</SoftCut>
          </Sequence>
        );
      })}
      <Caption lines={timing.lines} />
      {hasSong && <Audio src={staticFile("audio/country/song.mp3")} volume={SONG_VOLUME} />}
    </AbsoluteFill>
  );
}

/** Fades a scene in and out over a few frames so the cuts feel soft. */
function SoftCut({ frames, children }: { frames: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, frames - 6, frames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}
