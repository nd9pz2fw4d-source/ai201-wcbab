import { createContext, useContext } from "react";
import { cue, type Beat } from "./timing";

export const BeatContext = createContext<Beat | null>(null);

/** The current scene: its length and when each of its lines is spoken. */
export const useBeat = (): Beat => {
  const b = useContext(BeatContext);
  if (!b) throw new Error("useBeat must be used inside an explainer scene");
  return b;
};

/** Seconds into the scene when line i (0-based) starts, or when `phrase` in it is spoken. */
export const useCue = (i: number, phrase?: string): number => cue(useBeat(), i, phrase);
