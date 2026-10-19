import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { SfxId } from "../sfxLibrary";

// Effects sit well under the voice: pops and dings are frequent, so they are quieter still.
const VOLUME: Record<SfxId, number> = { whoosh: 0.35, stamp: 0.4, pop: 0.2, clunk: 0.35, ding: 0.25 };

/** A sound effect, `at` seconds into the scene, next to the picture it belongs to. */
export function Sfx({ id, at }: { id: SfxId; at: number }) {
  const { fps } = useVideoConfig();
  return (
    <Sequence name={`sfx ${id}`} from={Math.round(at * fps)} layout="none">
      <Audio src={staticFile(`audio/sfx/${id}.mp3`)} volume={VOLUME[id]} />
    </Sequence>
  );
}
