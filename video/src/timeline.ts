// The song and the video share this file. Section lengths drive both the ElevenLabs
// composition plan (scripts/elevenlabs.mjs) and the scene timing, so the pictures
// land on the music. At 120 BPM one bar is 2 seconds; every section is whole bars.

export const FPS = 30;
export const BPM = 120;

export type SectionId = "intro" | "verse1" | "chorus1" | "levers" | "agenda" | "terms" | "chorus2" | "outro";

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
      "Deloitte asked eighteen comp orgs, far and wide,",
      "Canada, Australia, the U.S. side.",
      "Folks want service as fast as their phone,",
      "gig jobs, new jobs, small shops have grown,",
      "mental health claims are on the rise,",
      "so the future of comp needs a fresh set of eyes.",
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
    id: "levers",
    name: "Verse 2",
    seconds: 24,
    styles: ["punchy rhythmic verse", "staccato horn stabs", "confident vocal"],
    lines: [
      "Lever one: sort by risk, not just the sprain,",
      "risk-based segmentation, triage with a brain.",
      "Lever two: standardized plans,",
      "a recovery blueprint in everybody's hands.",
      "Lever three: build the team around the case,",
      "specialists together when it's tough to face.",
      "Lever four: prevention, stop the harm before,",
      "lever five: a friendly nudge opens the door.",
      "Seventy to eighty percent are simple and quick,",
      "so the experts are free for the cases that stick.",
      "And every single lever has one goal in view:",
      "return to work! R-T-W!",
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
    lines: ["See you in the room, bring your questions too,", "follow the claim, we'll see it through!"],
  },
];

export const totalSeconds = sections.reduce((sum, s) => sum + s.seconds, 0);
export const totalFrames = totalSeconds * FPS;

export const sectionStart = (id: SectionId): number => {
  let t = 0;
  for (const s of sections) {
    if (s.id === id) return t;
    t += s.seconds;
  }
  throw new Error(`Unknown section ${id}`);
};

export const getSection = (id: SectionId): Section => {
  const s = sections.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown section ${id}`);
  return s;
};

// ---------- Lyric timing ----------

export interface LyricLine {
  text: string;
  /** Seconds from the start of the video. */
  start: number;
  end: number;
}

/** Even split of each section across its lines: the fallback when no aligned timing exists. */
export const evenLyricTiming = (): LyricLine[] => {
  const out: LyricLine[] = [];
  for (const s of sections) {
    const t0 = sectionStart(s.id);
    const step = s.seconds / Math.max(1, s.lines.length);
    s.lines.forEach((text, i) => out.push({ text, start: t0 + i * step, end: t0 + (i + 1) * step }));
  }
  return out;
};

// ---------- Sound effects ----------

export type SfxId = "whoosh" | "stamp" | "pop" | "clunk" | "scratch" | "ding" | "applause";

/** Prompts for the ElevenLabs Sound Effects API. Files land in public/audio/sfx/<id>.mp3. */
export const sfxLibrary: Record<SfxId, { prompt: string; seconds: number }> = {
  whoosh: { prompt: "Quick cartoon whoosh, a paper folder flying past, clean, no music", seconds: 1 },
  stamp: { prompt: "A single rubber stamp thumping onto paper on a desk, crisp and satisfying", seconds: 1 },
  pop: { prompt: "Soft playful bubble pop for a user interface card appearing, short and clean", seconds: 0.5 },
  clunk: { prompt: "A chunky mechanical lever being pulled down with a satisfying clunk and click", seconds: 1 },
  scratch: { prompt: "Short comedic vinyl record scratch, a funny 'wait, what?' moment", seconds: 1 },
  ding: { prompt: "Bright game show correct-answer ding, single bell chime, cheerful", seconds: 1 },
  applause: { prompt: "Small office team clapping and cheering warmly, short, indoor", seconds: 4 },
};

export interface SfxCue {
  id: SfxId;
  /** Seconds from the start of the video. */
  at: number;
  volume?: number;
}

const at = (id: SectionId, offset: number) => sectionStart(id) + offset;

// Sound effects sit under the song, so keep them short and quiet.
export const sfxCues: SfxCue[] = [
  { id: "whoosh", at: 0.3 },
  { id: "stamp", at: 2.6 },
  { id: "pop", at: at("verse1", 0.4) },
  { id: "pop", at: at("verse1", 4.2) },
  { id: "pop", at: at("verse1", 8) },
  { id: "pop", at: at("verse1", 10) },
  { id: "pop", at: at("verse1", 12) },
  { id: "pop", at: at("verse1", 14) },
  { id: "whoosh", at: at("chorus1", 0) },
  { id: "ding", at: at("chorus1", 14.2) },
  ...[0, 4, 8, 12, 14].map((t) => ({ id: "clunk" as const, at: at("levers", t) })),
  { id: "ding", at: at("levers", 22) },
  ...[4, 8, 12].map((t) => ({ id: "pop" as const, at: at("agenda", t) })),
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
    i === 1 ? { id: "scratch" as const, at: at("terms", 4.1), volume: 0.5 } : { id: "whoosh" as const, at: at("terms", i * 4), volume: 0.25 },
  ),
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ id: "ding" as const, at: at("chorus2", 2 + i * 1.5), volume: 0.3 })),
  { id: "applause", at: at("outro", 0.5), volume: 0.4 },
];
