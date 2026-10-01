import { createContext, useContext } from "react";
import type { SectionTiming } from "./timeline";

export const SectionTimingContext = createContext<SectionTiming | null>(null);

/** The current scene's section: its length and when each of its lines is sung. */
export const useSectionTiming = (): SectionTiming => {
  const s = useContext(SectionTimingContext);
  if (!s) throw new Error("useSectionTiming must be used inside a scene");
  return s;
};
