import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "./components/Caption";
import { Agenda } from "./scenes/Agenda";
import { Bingo } from "./scenes/Bingo";
import { Chorus } from "./scenes/Chorus";
import { Intro } from "./scenes/Intro";
import { Levers } from "./scenes/Levers";
import { Outro } from "./scenes/Outro";
import { Terms } from "./scenes/Terms";
import { Verse1 } from "./scenes/Verse1";
import { FPS, sections, sfxCues, type LyricLine, type SectionId, type SfxId } from "./timeline";

export interface PreReadProps {
  lyrics: LyricLine[];
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
  levers: () => <Levers />,
  agenda: () => <Agenda />,
  terms: () => <Terms />,
  chorus2: () => <Bingo />,
  outro: () => <Outro />,
};

export function PreRead({ lyrics, hasSong, sfx }: PreReadProps) {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "#0C3553" }}>
      {sections.map((s) => {
        const start = from;
        from += s.seconds * FPS;
        return (
          <Sequence key={s.id} name={s.name} from={start} durationInFrames={s.seconds * FPS}>
            <SoftCut frames={s.seconds * FPS}>{scenes[s.id]()}</SoftCut>
          </Sequence>
        );
      })}
      <Caption lyrics={lyrics} />
      {hasSong && <Audio src={staticFile("audio/song.mp3")} />}
      {sfxCues
        .filter((c) => sfx.includes(c.id))
        .map((c, i) => (
          <Sequence key={`${c.id}-${i}`} name={`sfx ${c.id}`} from={Math.round(c.at * FPS)} layout="none">
            <Audio src={staticFile(`audio/sfx/${c.id}.mp3`)} volume={c.volume ?? 0.35} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
}

/** Fades a scene in and out over a few frames so the cuts feel soft. */
function SoftCut({ frames, children }: { frames: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, frames - 6, frames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}
