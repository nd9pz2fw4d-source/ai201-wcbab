import { session } from "../content";
import type { AgendaCues } from "../scenes/Agenda";
import type { ChorusCues } from "../scenes/Chorus";
import type { DoneWellCues } from "../scenes/DoneWell";
import type { IntroCues } from "../scenes/Intro";
import type { ShiftsCues } from "../scenes/Shifts";
import type { TermsCues } from "../scenes/Terms";
import type { Verse1Cues } from "../scenes/Verse1";
import type { SectionTiming } from "./timeline";

// When things happen in the session scenes (src/scenes/), from the sung lines of the country version.
// `s.lines[n]` is when line n of the section starts (src/song/timeline.ts). The main video times the same
// scenes from Riphay's lines instead (src/explainer/sessionCues.ts).

/** The teaser chips pop in during the instrumental lead-in, after the title has landed. */
export const introCues = (s: SectionTiming): IntroCues => {
  const from = Math.min(8, s.seconds - 5);
  return {
    stamp: "PRE-READ",
    subtitle: `${session.programme}: the country version. Sound on!`,
    teasers: ["One claim", "Three acts", "Eight key terms", "One song"].map((label, i) => ({ label, at: from + i * 1.2 })),
  };
};

/** The claim on line 2, the survey on line 3, then the force cards two per line (lines 5 to 8), half a second apart. */
export const verse1Cues = (s: SectionTiming): Verse1Cues => ({
  claimAt: s.lines[1],
  surveyAt: s.lines[2] - 0.2,
  forcesAt: s.lines[4] - 0.2,
  forceAt: Array.from({ length: 8 }, (_, i) => s.lines[4 + Math.floor(i / 2)] + (i % 2) * 0.5),
});

export const chorusCues = (s: SectionTiming): ChorusCues => ({ first: 0.8, last: s.seconds - 2.4, tagAt: s.lines[2] });

/** "Shift one" to "Shift four" on lines 1, 3, 5 and 7; the numbers on "eighty-three percent"; the header on "tech and the people". */
export const shiftsCues = (s: SectionTiming): ShiftsCues => ({
  shiftAt: [0, 2, 4, 6].map((n) => s.lines[n]),
  statsAt: s.lines[8],
  goalAt: s.lines[10],
});

export const agendaCues = (s: SectionTiming): AgendaCues => ({ actAt: [1, 2, 3].map((n) => s.lines[n]), footAt: s.lines[3] + 1 });

/** One card per two sung lines, a beat early. */
export const termsCues = (s: SectionTiming): TermsCues => ({
  cardStart: Array.from({ length: 8 }, (_, i) => (i === 0 ? 0 : s.lines[2 * i] - 0.2)),
  seconds: s.seconds,
});

/** The claim stops on "A person decides" (line 3) and moves on with the last line. */
export const doneWellCues = (s: SectionTiming): DoneWellCues => ({
  depart: 0.6,
  decide: s.lines[2] - 0.2,
  resume: s.lines[3] - 0.2,
  home: Math.min(s.lines[3] + 1.6, s.seconds - 1.6),
});
