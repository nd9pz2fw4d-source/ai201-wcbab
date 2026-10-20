import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { Sfx } from "../components/Sfx";
import { Agenda } from "../scenes/Agenda";
import { Chorus } from "../scenes/Chorus";
import { DoneWell } from "../scenes/DoneWell";
import { Intro } from "../scenes/Intro";
import { Outro } from "../scenes/Outro";
import { Shifts } from "../scenes/Shifts";
import { Verse1 } from "../scenes/Verse1";
import { BeatContext } from "./beat";
import { agendaCues, chorusCues, doneWellCues, introCues, shiftsCues, verse1Cues } from "./sessionCues";
import { ConfidentAnswer, TheDraft, TwoSummaries } from "./scenes/Demos";
import { DecodePitch, ThreeQuestions } from "./scenes/Pitch";
import { BankAlert, NextWord, PageFour, Sting, Trip, WhyWatch } from "./scenes/Tuesday";
import { FPS, STING_SECONDS, captionCues, scheduleBeats, type Beat, type Manifest } from "./timing";

export interface ExplainerProps {
  manifest: Manifest;
  [key: string]: unknown;
}

/** The picture for each scene of the script, by scene number. Scenes 11 on are Riphay's introduction to the session. */
const scenes: Record<number, (b: Beat) => ReactNode> = {
  1: () => <WhyWatch />,
  2: () => <NextWord />,
  3: () => <BankAlert />,
  4: () => <PageFour />,
  5: () => <Trip />,
  6: () => <TwoSummaries />,
  7: () => <ConfidentAnswer />,
  8: () => <TheDraft />,
  9: () => <DecodePitch />,
  10: () => <ThreeQuestions />,
  11: (b) => <Intro cues={introCues(b)} />,
  12: (b) => <Verse1 cues={verse1Cues(b)} />,
  13: (b) => <Chorus cues={chorusCues(b)} />,
  14: (b) => <Shifts cues={shiftsCues(b)} />,
  15: (b) => <Agenda cues={agendaCues(b)} />,
  16: (b) => <DoneWell cues={doneWellCues(b)} />,
  17: () => <Outro />,
};

const frames = (s: number) => Math.round(s * FPS);

export function Explainer({ manifest }: ExplainerProps) {
  const beats = scheduleBeats(manifest);
  return (
    <AbsoluteFill style={{ background: "#0C3553" }}>
      <Sequence name="Opening card" durationInFrames={frames(STING_SECONDS)}>
        <SoftCut frames={frames(STING_SECONDS)}>
          <Sting />
        </SoftCut>
        <Sfx id="whoosh" at={0.2} />
        <Sfx id="stamp" at={1.6} />
      </Sequence>

      {beats.map((b) => {
        const scene = scenes[b.n];
        if (!scene) throw new Error(`No picture for scene ${b.n} ("${b.title}")`);
        const from = frames(b.start);
        const len = frames(b.start + b.seconds) - from;
        return (
          <Sequence key={b.n} name={`${b.n}. ${b.title}`} from={from} durationInFrames={len}>
            <BeatContext.Provider value={b}>
              <SoftCut frames={len}>{scene(b)}</SoftCut>
            </BeatContext.Provider>
          </Sequence>
        );
      })}

      {beats.flatMap((b) =>
        b.lines
          .filter((l) => !l.estimated) // lines with a voice that matches the script
          .map((l) => (
            <Sequence key={l.id} name={`voice ${l.id}`} from={frames(b.start + l.at)} layout="none">
              <Audio src={staticFile(`explainer/voice/${l.id}.mp3`)} />
            </Sequence>
          )),
      )}
      <Caption lines={captionCues(beats)} />
    </AbsoluteFill>
  );
}

/** Fades a scene in and out over a few frames so the cuts feel soft. */
function SoftCut({ frames: n, children }: { frames: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, n - 8, n], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}
