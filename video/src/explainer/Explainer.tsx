import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { PreRead, type PreReadProps } from "../PreRead";
import { FPS } from "../timeline";
import { BeatContext } from "./beat";
import { ConfidentAnswer, TheDraft, TwoSummaries } from "./scenes/Demos";
import { DecodePitch, ThreeQuestions } from "./scenes/Pitch";
import { BankAlert, NextWord, PageFour, Sting, Trip, WhyWatch } from "./scenes/Tuesday";
import { STING_MUSIC_SECONDS, STING_SECONDS, STING_SONG_FROM, captionCues, musicVideoStart, scheduleBeats, type Manifest } from "./timing";

export interface ExplainerProps {
  manifest: Manifest;
  /** The music video's own props (song timing, effects), for the recap at the end. */
  song: PreReadProps;
  [key: string]: unknown;
}

/** The picture for each scene of the script, by scene number. */
const scenes: Record<number, () => ReactNode> = {
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
};

const frames = (s: number) => Math.round(s * FPS);

export function Explainer({ manifest, song }: ExplainerProps) {
  const beats = scheduleBeats(manifest);
  const recapAt = musicVideoStart(beats);
  return (
    <AbsoluteFill style={{ background: "#0C3553" }}>
      <Sequence name="Opening card" durationInFrames={frames(STING_SECONDS)}>
        <SoftCut frames={frames(STING_SECONDS)}>
          <Sting />
        </SoftCut>
      </Sequence>
      {song.hasSong && (
        <Sequence name="Song sting" durationInFrames={frames(STING_MUSIC_SECONDS)}>
          <StingMusic />
        </Sequence>
      )}

      {beats.map((b) => {
        const scene = scenes[b.n];
        if (!scene) throw new Error(`No picture for scene ${b.n} ("${b.title}")`);
        const from = frames(b.start);
        const len = frames(b.start + b.seconds) - from;
        return (
          <Sequence key={b.n} name={`${b.n}. ${b.title}`} from={from} durationInFrames={len}>
            <BeatContext.Provider value={b}>
              <SoftCut frames={len}>{scene()}</SoftCut>
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

      <Sequence name="Music video" from={frames(recapAt)}>
        <PreRead {...song} />
      </Sequence>
    </AbsoluteFill>
  );
}

/** The first chorus, under the opening card, fading out as Ava starts. */
function StingMusic() {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const volume = interpolate(t, [0, STING_SECONDS - 1, STING_MUSIC_SECONDS], [0.75, 0.75, 0], { extrapolateRight: "clamp" });
  return <Audio src={staticFile("audio/song.mp3")} startFrom={frames(STING_SONG_FROM)} volume={volume} />;
}

/** Fades a scene in and out over a few frames so the cuts feel soft. */
function SoftCut({ frames: n, children }: { frames: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, n - 8, n], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}
