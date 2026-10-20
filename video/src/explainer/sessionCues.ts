import type { AgendaCues } from "../scenes/Agenda";
import type { ChorusCues } from "../scenes/Chorus";
import type { DoneWellCues } from "../scenes/DoneWell";
import type { IntroCues } from "../scenes/Intro";
import type { ShiftsCues } from "../scenes/Shifts";
import type { Verse1Cues } from "../scenes/Verse1";
import { session } from "../content";
import { cue, type Beat } from "./timing";

// When things happen in the session scenes (src/scenes/), from Riphay's lines in the script: each picture
// comes in on the word that names it. The country song version times the same scenes from its lyrics
// instead (src/song/cues.ts).

export const introCues = (b: Beat): IntroCues => ({
  stamp: "THE DAY",
  subtitle: `${session.programme} · ${session.date}`,
  teasers: [
    { label: "One claim", at: cue(b, 1, "one claim") },
    { label: "Three acts", at: cue(b, 1, "three acts") },
    { label: "Eight words", at: cue(b, 1, "eight words") },
    { label: "Your questions", at: cue(b, 1, "your questions") },
  ],
});

/** Deloitte's eight forces as Riphay names them (line 3), in the order of `forces` in src/content.ts. */
const forcesSaid = ["Whole-person recovery", "An ageing workforce", "Gig work", "Working from home", "New kinds of risk", "Artificial intelligence", "Ageing core systems", "legislation"];

export const verse1Cues = (b: Beat): Verse1Cues => ({
  claimAt: cue(b, 0, "a claim starts moving"),
  surveyAt: cue(b, 1) - 0.2,
  forcesAt: cue(b, 2) - 0.2,
  forceAt: forcesSaid.map((phrase) => cue(b, 2, phrase)),
});

export const chorusCues = (b: Beat): ChorusCues => ({ first: 0.8, last: b.seconds - 2.4, tagAt: cue(b, 1, "same care") });

export const shiftsCues = (b: Beat): ShiftsCues => ({
  shiftAt: ["in pricing", "in how we engage", "in operations", "in partnerships"].map((phrase) => cue(b, 0, phrase)),
  statsAt: cue(b, 1, "Eighty-three percent"),
  goalAt: cue(b, 2),
});

export const agendaCues = (b: Beat): AgendaCues => ({
  actAt: ["Act one", "Act two", "Act three"].map((phrase) => cue(b, 1, phrase)),
  footAt: cue(b, 2),
});

export const doneWellCues = (b: Beat): DoneWellCues => {
  const resume = cue(b, 2) - 0.2;
  return { depart: 0.6, decide: cue(b, 1, "a person decides") - 0.2, resume, home: Math.min(resume + 2.4, b.seconds - 1.6) };
};
