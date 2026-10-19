// The country version of "Follow the claim": a side version of the pre-read, set to an upbeat country song.
// The lyrics and sections here are what was sent to ElevenLabs Music (flow "Follow the claim: country
// version"); the scenes (src/scenes/) are the session scenes of the main video, timed from the sung lines
// instead of Riphay's (src/song/cues.ts).

export type SectionId = "intro" | "verse1" | "chorus1" | "shifts" | "agenda" | "terms" | "chorus2" | "outro";

export interface Section {
  id: SectionId;
  /** Section name, as tagged in the lyrics sent to ElevenLabs. */
  name: string;
  /** Planned length, used until the take's line timing exists. */
  seconds: number;
  /** Sung lines, in order. */
  lines: string[];
}

/** The prompt the take was generated from (eleven_music_v2_5, custom lyrics, 150 s). */
export const song = {
  title: "Follow the Claim (country)",
  prompt:
    "Upbeat modern country anthem in the style of big-sky prairie country radio hits: a driving two-step groove at 120 bpm, fiddle and banjo hooks, twangy Telecaster, pedal steel, stomp-and-clap percussion, and a warm male lead vocal with a friendly twang and crisp, clear diction. Opens with a fiddle-and-banjo hoedown lick and a shout, big gang-vocal singalong choruses, a quick patter-style third verse, then a triumphant final chorus and a clean fiddle tag to end. Feel-good, light-hearted and corporate-friendly.",
};

export const sections: Section[] = [
  {
    id: "intro",
    name: "Intro",
    seconds: 16,
    lines: ["Yahoo, WCB!", "Grab a coffee, here we go!"],
  },
  {
    id: "verse1",
    name: "Verse 1",
    seconds: 16,
    lines: [
      "A worker gets hurt on a Monday shift,",
      "a claim starts moving, it needs a lift.",
      "Deloitte asked Canada's comp leaders what's ahead:",
      "eight big forces, here's what they said.",
      "Minds need care, and the workforce is going grey,",
      "gig jobs, home jobs, cover stretched every day,",
      "new risks on the road, and AI on the rise,",
      "old systems, old rules: time to modernize!",
    ],
  },
  {
    id: "chorus1",
    name: "Chorus 1",
    seconds: 16,
    lines: [
      "Follow the claim, follow the claim,",
      "from the first report to back in the game.",
      "Same care, better journey, that's the aim,",
      "follow, follow, follow the claim!",
    ],
  },
  {
    id: "shifts",
    name: "Verse 2",
    seconds: 24,
    lines: [
      "Shift one: pricing, steady and fair,",
      "premiums that match the risk that's there.",
      "Shift two: engagement, proactive and kind,",
      "recovery first, with the care aligned.",
      "Shift three: operations, one smart flow,",
      "prevention, service and claims in a row.",
      "Shift four: partners, health and rehab too,",
      "the whole ecosystem pulling through.",
      "But eighty-three percent say AI maturity's low,",
      "just one leader said: we're early, let's go!",
      "So the tech and the people work in tandem, you see:",
      "human in the loop! That's the key!",
    ],
  },
  {
    id: "agenda",
    name: "Pre-Chorus",
    seconds: 16,
    lines: [
      "So here's the day, three acts in store:",
      "Act one: See it, what AI is for.",
      "Act two: Choose it, where it should play,",
      "Act three: Govern it, who owns the way.",
    ],
  },
  {
    id: "terms",
    name: "Verse 3",
    seconds: 32,
    lines: [
      "L-L-M: it predicts the next word,",
      "sounds so sure, so check what you heard.",
      "Hallucination: confident, but wrong,",
      "fluent isn't verified, it's just a song!",
      "Grounding, or RAG, looks before it speaks,",
      "it cites the page and the file you seek.",
      "An agent's got a goal and tools in hand,",
      "memory, instructions, and a person in command.",
      "The agent loop: plan, act, check, repeat,",
      "it stops for a person when the stakes are steep.",
      "Read, draft, act: keep permissions tight,",
      "least privilege: just the access that's right.",
      "Turn the autonomy dial with care:",
      "the more it does alone, the more oversight's there.",
      "Evals test it before we trust,",
      "a human in the loop? That's a must!",
    ],
  },
  {
    id: "chorus2",
    name: "Final Chorus",
    seconds: 16,
    lines: [
      "Follow the claim, follow the claim,",
      "from the first report to back in the game.",
      "A person decides, and that stays the same,",
      "follow, follow, follow the claim!",
    ],
  },
  {
    id: "outro",
    name: "Outro",
    seconds: 12,
    lines: ["See you in the room, bring your answer too,", "follow the claim, we'll see it through!"],
  },
];

export const totalSeconds = sections.reduce((sum, s) => sum + s.seconds, 0);

// ---------- Song timing ----------
//
// A generated take never lands on the plan, so the video follows the take: every scene cut and cue is
// keyed to the moment a sung line starts. public/audio/country/song-timing.json holds those moments
// (scripts/align_lyrics.py); without it, the plan is used.

export interface LyricLine {
  text: string;
  /** Seconds from the start of the song. */
  start: number;
  end: number;
}

export interface SongTiming {
  /** Length of the song in seconds; the video is exactly as long. */
  duration: number;
  /** Every sung line, in the order of `sections`. */
  lines: LyricLine[];
}

/** The plan: each section's lines spread evenly across it. */
export const plannedTiming = (): SongTiming => {
  const lines: LyricLine[] = [];
  let t0 = 0;
  for (const s of sections) {
    const step = s.seconds / Math.max(1, s.lines.length);
    s.lines.forEach((text, i) => lines.push({ text, start: t0 + i * step, end: t0 + (i + 1) * step }));
    t0 += s.seconds;
  }
  return { duration: t0, lines };
};

export interface SectionTiming {
  id: SectionId;
  /** Seconds from the start of the video. */
  start: number;
  seconds: number;
  /** When each of the section's lines starts, in seconds from the section's start. */
  lines: number[];
}

/** Scenes cut this long before their section's first sung line, so the picture arrives with the word. */
const LEAD = 0.3;

export const scheduleSections = (timing: SongTiming): SectionTiming[] => {
  const first: number[] = [];
  let k = 0;
  for (const s of sections) {
    first.push(k);
    k += s.lines.length;
  }
  if (timing.lines.length !== k) throw new Error(`Song timing has ${timing.lines.length} lines; the lyrics have ${k}.`);
  const starts = sections.map((_, i) => (i === 0 ? 0 : Math.max(0, timing.lines[first[i]].start - LEAD)));
  return sections.map((s, i) => {
    const start = starts[i];
    const end = i + 1 < sections.length ? starts[i + 1] : timing.duration;
    const lines = timing.lines.slice(first[i], first[i] + s.lines.length).map((l) => l.start - start);
    return { id: s.id, start, seconds: end - start, lines };
  });
};
