import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { PreRead, type PreReadProps } from "../PreRead";
import { FPS } from "../timeline";
import { BeatContext } from "./beat";
import { Anatomy, AgentLoop, AutonomyDial, Evals, Tools } from "./scenes/Part2";
import { Close, FloorCeiling, Ladder, Readiness } from "./scenes/Part3";
import { Grounding, Llm, Opening, Sting, ThreeKinds } from "./scenes/Part1";
import { STING_MUSIC_SECONDS, STING_SECONDS, STING_SONG_FROM, captionCues, musicVideoStart, scheduleBeats, type Manifest } from "./timing";

export interface ExplainerProps {
  manifest: Manifest;
  /** Voice lines whose audio exists in public/explainer/voice. */
  voiced: string[];
  /** The music video's own props (song timing, effects), for the recap at the end. */
  song: PreReadProps;
  [key: string]: unknown;
}

/** The picture for each scene of the script, by scene number. */
const scenes: Record<number, () => ReactNode> = {
  1: () => <Opening />,
  2: () => <ThreeKinds />,
  3: () => <Llm />,
  4: () => <Grounding />,
  5: () => <Anatomy />,
  6: () => <AgentLoop />,
  7: () => <Tools />,
  8: () => <AutonomyDial />,
  9: () => <Evals />,
  10: () => <FloorCeiling />,
  11: () => <Ladder />,
  12: () => <Readiness />,
  13: () => <Close />,
};

const frames = (s: number) => Math.round(s * FPS);

export function Explainer({ manifest, voiced, song }: ExplainerProps) {
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
          .filter((l) => voiced.includes(l.id))
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
