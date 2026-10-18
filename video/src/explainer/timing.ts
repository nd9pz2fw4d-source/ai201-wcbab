// Timing for the fundamentals explainer. The script (explainer/script.md) is parsed into
// public/explainer/manifest.json (scripts/explainer.mjs), one entry per spoken line with its
// length. Everything on screen is placed from those lengths, so a new take of any line
// re-times the video by itself.

export type Speaker = "Ava" | "Sam";

export interface VoiceLine {
  id: string;
  speaker: Speaker;
  text: string;
  /** Length of the line's audio, or an estimate until it exists. */
  seconds: number;
  estimated?: boolean;
}

export interface ScriptScene {
  n: number;
  title: string;
  lines: VoiceLine[];
}

export interface Manifest {
  scenes: ScriptScene[];
}

/** Opening song sting, and how long the chorus keeps playing under the first scene. */
export const STING_SECONDS = 8;
export const STING_MUSIC_SECONDS = 11;
/** Where the sting starts in the song: the first chorus ("Follow the claim, follow the claim"). */
export const STING_SONG_FROM = 31.9;

/** Pauses that set the pace: before a scene's first line, between lines, and after the last. */
const SCENE_LEAD = 0.6;
const LINE_GAP = 0.6;
const SCENE_TAIL = 1.2;

export interface PlacedLine extends VoiceLine {
  /** Seconds from the start of the scene. */
  at: number;
}

export interface Beat {
  n: number;
  title: string;
  /** Seconds from the start of the video. */
  start: number;
  seconds: number;
  lines: PlacedLine[];
}

/** Scenes 1 to 13, placed one after another after the sting. */
export const scheduleBeats = (manifest: Manifest): Beat[] => {
  const beats: Beat[] = [];
  let t = STING_SECONDS;
  for (const scene of manifest.scenes) {
    if (scene.lines.length === 0) continue; // the sting and the music video are placed separately
    let at = SCENE_LEAD;
    const lines = scene.lines.map((l) => {
      const placed = { ...l, at };
      at += l.seconds + LINE_GAP;
      return placed;
    });
    const seconds = at - LINE_GAP + SCENE_TAIL;
    beats.push({ n: scene.n, title: scene.title, start: t, seconds, lines });
    t += seconds;
  }
  return beats;
};

/** When the music video starts: right after the last scene. */
export const musicVideoStart = (beats: Beat[]) => {
  const last = beats.at(-1);
  return last ? last.start + last.seconds : STING_SECONDS;
};

/**
 * Seconds into the scene when `phrase` is spoken in line `i`, estimated from where it sits in the
 * line's text. Used to bring a picture in on the word that names it.
 */
export const cue = (beat: Beat, i: number, phrase?: string): number => {
  const line = beat.lines[i];
  if (!line) throw new Error(`Scene ${beat.n} has no line ${i + 1}`);
  if (!phrase) return line.at;
  const k = line.text.indexOf(phrase);
  if (k < 0) throw new Error(`"${phrase}" is not in line ${line.id}`);
  return line.at + (line.seconds * k) / line.text.length;
};

// ---------- Captions ----------

export interface CaptionCue {
  text: string;
  speaker?: Speaker;
  /** Seconds from the start of the video. */
  start: number;
  end: number;
}

const MAX_CHARS = 90;

/** Splits a line into caption-sized pieces at sentence, then clause, boundaries. */
const chunk = (text: string): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]+["”']?|[^.!?]+$/g)?.map((s) => s.trim()) ?? [text];
  const out: string[] = [];
  for (const s of sentences) {
    if (s.length <= MAX_CHARS) {
      out.push(s);
      continue;
    }
    let cur = "";
    for (const part of s.split(/(?<=[,:;])\s+/)) {
      if (cur && (cur + " " + part).length > MAX_CHARS) {
        out.push(cur);
        cur = part;
      } else cur = cur ? `${cur} ${part}` : part;
    }
    if (cur) out.push(cur);
  }
  // Merge very short pieces into the one before, so captions don't flash.
  return out.reduce<string[]>((acc, piece) => {
    if (acc.length && piece.length < 18 && (acc.at(-1)! + " " + piece).length <= MAX_CHARS + 20) acc[acc.length - 1] += ` ${piece}`;
    else acc.push(piece);
    return acc;
  }, []);
};

/** Every line, split into captions timed in proportion to their length. */
export const captionCues = (beats: Beat[]): CaptionCue[] =>
  beats.flatMap((b) =>
    b.lines.flatMap((l) => {
      const pieces = chunk(l.text);
      const total = pieces.reduce((n, p) => n + p.length, 0);
      let t = b.start + l.at;
      return pieces.map((text) => {
        const len = (l.seconds * text.length) / total;
        const c = { text, speaker: l.speaker, start: t, end: t + len };
        t += len;
        return c;
      });
    }),
  );
