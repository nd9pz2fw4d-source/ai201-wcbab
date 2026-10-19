// Sound effects for the session's introduction. Prompts for the ElevenLabs Sound Effects API
// (scripts/elevenlabs.mjs); files land in public/audio/sfx/<id>.mp3, levelled to the same peak.

export type SfxId = "whoosh" | "stamp" | "pop" | "clunk" | "ding";

export const sfxLibrary: Record<SfxId, { prompt: string; seconds: number }> = {
  whoosh: { prompt: "Quick cartoon whoosh, a paper folder flying past, clean, no music", seconds: 1 },
  stamp: { prompt: "A single rubber stamp thumping onto paper on a desk, crisp and satisfying", seconds: 1 },
  pop: { prompt: "Soft playful bubble pop for a user interface card appearing, short and clean", seconds: 0.5 },
  clunk: { prompt: "A chunky gear shift lever clicking firmly into place, a satisfying mechanical clunk", seconds: 1 },
  ding: { prompt: "Bright game show correct-answer ding, single bell chime, cheerful", seconds: 1 },
};
