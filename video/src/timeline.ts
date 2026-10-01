// The song and the video share this file. Section lengths drive both the ElevenLabs
// composition plan (scripts/elevenlabs.mjs) and the scene timing, so the pictures
// land on the music. At 120 BPM one bar is 2 seconds; every section is whole bars.

export const FPS = 30;
export const BPM = 120;

export type SectionId = "intro" | "verse1" | "chorus1" | "shifts" | "agenda" | "terms" | "chorus2" | "outro";

export interface Section {
  id: SectionId;
  /** Section name sent to ElevenLabs. */
  name: string;
  seconds: number;
  /** Local music direction for this section. */
  styles: string[];
  /** Sung lines, in order. Each line is sung over an equal share of the section unless lyric timing is generated. */
  lines: string[];
}

export const song = {
  title: "Follow the Claim",
  globalStyles: [
    "upbeat feel-good pop",
    "120 bpm",
    "bright horns",
    "handclaps",
    "funky bass",
    "clear, friendly lead vocal with crisp diction",
    "playful and light-hearted",
    "corporate-friendly",
  ],
  negativeGlobalStyles: ["explicit lyrics", "heavy distortion", "screaming", "mumbled vocals", "sad", "dark"],
};

export const sections: Section[] = [
  {
    id: "intro",
    name: "Intro",
    seconds: 8,
    styles: ["horn fanfare", "building drums", "call-out vocal"],
    lines: ["Hey, WCB!", "Grab a coffee, here we go!"],
  },
  {
    id: "verse1",
    name: "Verse 1",
    seconds: 16,
    styles: ["groovy verse", "light drums", "storytelling vocal"],
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
    styles: ["big catchy chorus", "full band", "gang vocals", "handclaps"],
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
    styles: ["punchy rhythmic verse", "staccato horn stabs", "confident vocal"],
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
    styles: ["rising pre-chorus", "building energy", "drum fills"],
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
    styles: ["fast playful rap-sung verse", "tight drums", "call and response", "clear enunciation"],
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
    styles: ["triumphant final chorus", "full band", "gang vocals", "horns"],
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
    styles: ["feel-good outro", "horn tag", "clean ending"],
    lines: ["See you in the room, bring your answer too,", "follow the claim, we'll see it through!"],
  },
];

export const totalSeconds = sections.reduce((sum, s) => sum + s.seconds, 0);

// ---------- Song timing ----------
//
// Section lengths above are the plan sent to ElevenLabs. A generated take never lands exactly on
// it, so the video follows the take instead: every scene cut and on-screen cue is keyed to the
// moment a sung line starts. public/audio/song-timing.json holds those moments for the current
// take (see scripts/); without it, the plan is used.

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

// ---------- Cue times shared by scenes and sound effects (seconds into a section) ----------

/** Intro: the teaser chips pop in during the instrumental lead-in, after the title has landed. */
export const teaserAt = (i: number) => 8 + i * 1.2;

/** Verse 1: the eight force cards pop in two per sung line (lines 5 to 8), half a second apart. */
export const forceAt = (i: number, s: SectionTiming) => s.lines[4 + Math.floor(i / 2)] + (i % 2) * 0.5;

/** Chorus: the claim leaves the first station and reaches the last. */
export const claimTravel = (s: SectionTiming) => ({ first: 0.8, last: s.seconds - 2.4 });

/** Final chorus: bingo square k (of 8) gets marked, spread across the chorus. */
export const bingoMarkAt = (k: number, s: SectionTiming) => 2 + (k * (s.seconds - 5)) / 7;

// ---------- Sound effects ----------

export type SfxId = "whoosh" | "stamp" | "pop" | "clunk" | "scratch" | "ding" | "applause";

/** Prompts for the ElevenLabs Sound Effects API. Files land in public/audio/sfx/<id>.mp3. */
export const sfxLibrary: Record<SfxId, { prompt: string; seconds: number }> = {
  whoosh: { prompt: "Quick cartoon whoosh, a paper folder flying past, clean, no music", seconds: 1 },
  stamp: { prompt: "A single rubber stamp thumping onto paper on a desk, crisp and satisfying", seconds: 1 },
  pop: { prompt: "Soft playful bubble pop for a user interface card appearing, short and clean", seconds: 0.5 },
  clunk: { prompt: "A chunky gear shift lever clicking firmly into place, a satisfying mechanical clunk", seconds: 1 },
  scratch: { prompt: "Short comedic vinyl record scratch, a funny 'wait, what?' moment", seconds: 1 },
  ding: { prompt: "Bright game show correct-answer ding, single bell chime, cheerful", seconds: 1 },
  applause: { prompt: "Small office team clapping and cheering warmly, short, indoor", seconds: 4 },
};

export interface SfxCue {
  id: SfxId;
  section: SectionId;
  /** Seconds into the section. */
  at: (s: SectionTiming) => number;
  volume?: number;
}

const line = (n: number, offset = 0) => (s: SectionTiming) => s.lines[n] + offset;
const fixed = (t: number) => () => t;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// Default effect volume is set in PreRead.tsx; frequent ones (pops, dings) sit a little lower.
export const sfxCues: SfxCue[] = [
  { id: "whoosh", section: "intro", at: fixed(0.3) },
  { id: "stamp", section: "intro", at: fixed(2.6) },
  ...range(4).map((i): SfxCue => ({ id: "pop", section: "intro", at: fixed(teaserAt(i)), volume: 0.45 })),
  { id: "pop", section: "verse1", at: line(0, 0.4) },
  { id: "pop", section: "verse1", at: line(2, 0.2) },
  ...range(8).map((i): SfxCue => ({ id: "pop", section: "verse1", at: (s) => forceAt(i, s), volume: 0.45 })),
  { id: "whoosh", section: "chorus1", at: fixed(0.3) },
  { id: "ding", section: "chorus1", at: (s) => claimTravel(s).last + 0.6 },
  ...[0, 2, 4, 6].map((n): SfxCue => ({ id: "clunk", section: "shifts", at: line(n) })),
  { id: "ding", section: "shifts", at: line(11) },
  ...[1, 2, 3].map((n): SfxCue => ({ id: "pop", section: "agenda", at: line(n) })),
  ...range(8).map((i): SfxCue =>
    i === 1
      ? { id: "scratch", section: "terms", at: line(2, 0.1), volume: 0.7 }
      : { id: "whoosh", section: "terms", at: line(2 * i), volume: 0.45 },
  ),
  ...range(8).map((k): SfxCue => ({ id: "ding", section: "chorus2", at: (s) => bingoMarkAt(k, s), volume: 0.45 })),
  { id: "applause", section: "outro", at: fixed(0.5) },
];
