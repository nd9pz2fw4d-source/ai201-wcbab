// Generates the pre-read's audio with ElevenLabs, from src/timeline.ts:
//   song   public/audio/song.mp3     Music API, one chunk per section, so the song follows the video's timing
//   sfx    public/audio/sfx/*.mp3     Sound Effects API
//   align  public/audio/lyrics.json   Forced Alignment API: when each sung line starts, for the captions
//
//   ELEVENLABS_API_KEY=... node scripts/elevenlabs.mjs [all|song|sfx|align] [--force] [--dry-run]
//
// Existing files are kept (generation costs credits); --force regenerates them.
// --dry-run prints the requests without calling the API or needing a key.
// Needs Node 22.18 or later (it imports the TypeScript timeline directly).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { sections, sfxLibrary, song, totalSeconds } from "../src/timeline.ts";

const API = "https://api.elevenlabs.io/v1";
const root = path.resolve(import.meta.dirname, "..");
const audioDir = path.join(root, "public/audio");
const songPath = path.join(audioDir, "song.mp3");
const lyricsPath = path.join(audioDir, "lyrics.json");

const args = process.argv.slice(2);
const step = args.find((a) => !a.startsWith("--")) ?? "all";
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const key = process.env.ELEVENLABS_API_KEY;

if (!["all", "song", "sfx", "align"].includes(step)) fail(`Unknown step "${step}". Use all, song, sfx or align.`);
if (!key && !dryRun) fail("Set ELEVENLABS_API_KEY (or use --dry-run to see the requests).");
mkdirSync(path.join(audioDir, "sfx"), { recursive: true });

if (step === "all" || step === "song") await makeSong();
if (step === "all" || step === "sfx") await makeSfx();
if (step === "all" || step === "align") await alignLyrics();

// ---------- Song ----------

function compositionPlan() {
  return {
    chunks: sections.map((s) => ({
      text: [`[${s.name}]`, ...s.lines].join("\n"),
      duration_ms: s.seconds * 1000,
      positive_styles: [...song.globalStyles, ...s.styles],
      negative_styles: song.negativeGlobalStyles,
      context_adherence: "high",
    })),
  };
}

async function makeSong() {
  if (existsSync(songPath) && !force) return console.log("song: public/audio/song.mp3 exists, skipping (--force to redo)");
  const body = { model_id: "music_v2_5", composition_plan: compositionPlan() };
  if (dryRun) return console.log("POST /music\n" + JSON.stringify(body, null, 2));

  console.log(`song: composing ${totalSeconds}s across ${sections.length} sections...`);
  const audio = await post("/music?output_format=mp3_44100_128", JSON.stringify(body), { "Content-Type": "application/json" });
  writeFileSync(songPath, audio);
  writeFileSync(path.join(audioDir, "song-plan.json"), JSON.stringify(body, null, 2));
  console.log("song: wrote public/audio/song.mp3");

  const seconds = probeSeconds(songPath);
  if (seconds !== undefined && Math.abs(seconds - totalSeconds) > 1) {
    console.warn(`song: WARNING it is ${seconds.toFixed(1)}s but the video is ${totalSeconds}s. Scenes are timed to the plan; check the sync.`);
  }
  // A new song makes the old line timing wrong; the captions fall back to even timing until it is re-aligned.
  if (existsSync(lyricsPath)) unlinkSync(lyricsPath);
}

// ---------- Sound effects ----------

async function makeSfx() {
  for (const [id, { prompt, seconds }] of Object.entries(sfxLibrary)) {
    const out = path.join(audioDir, "sfx", `${id}.mp3`);
    if (existsSync(out) && !force) {
      console.log(`sfx: ${id}.mp3 exists, skipping`);
      continue;
    }
    const body = { text: prompt, duration_seconds: seconds, prompt_influence: 0.6, model_id: "eleven_text_to_sound_v2" };
    if (dryRun) {
      console.log(`POST /sound-generation ${JSON.stringify(body)}`);
      continue;
    }
    writeFileSync(out, await post("/sound-generation?output_format=mp3_44100_128", JSON.stringify(body), { "Content-Type": "application/json" }));
    console.log(`sfx: wrote ${id}.mp3`);
  }
}

// ---------- Lyric timing ----------

async function alignLyrics() {
  const lines = sections.flatMap((s) => s.lines.map((text) => ({ text })));
  const transcript = lines.map((l) => l.text).join("\n");
  if (dryRun) return console.log(`POST /forced-alignment (song.mp3 + ${lines.length} lines of lyrics)`);
  if (!existsSync(songPath)) fail("align: no public/audio/song.mp3 yet. Run the song step first.");

  const form = new FormData();
  form.append("file", new Blob([readFileSync(songPath)], { type: "audio/mpeg" }), "song.mp3");
  form.append("text", transcript);
  const result = JSON.parse((await post("/forced-alignment", form)).toString("utf8"));

  // Map each line to the aligned time of its first character. Whitespace is dropped on both
  // sides so the mapping holds however the aligner treats spaces and line breaks.
  const aligned = result.characters.filter((c) => c.text.trim() !== "");
  const expected = transcript.replace(/\s/g, "").length;
  if (aligned.length !== expected) fail(`align: got ${aligned.length} characters back, expected ${expected}. Keeping even timing.`);

  let i = 0;
  const timed = lines.map((l) => {
    const n = l.text.replace(/\s/g, "").length;
    const first = aligned[i];
    const last = aligned[i + n - 1];
    i += n;
    return { text: l.text, start: first.start, lastEnd: last.end };
  });
  // A caption stays up until the next line starts, or briefly after its last word.
  const out = timed.map((l, k) => {
    const next = timed[k + 1];
    const end = Math.min(next ? next.start : Infinity, l.lastEnd + 1.2);
    return { text: l.text, start: round(l.start), end: round(Math.max(end, l.start + 0.5)) };
  });
  writeFileSync(lyricsPath, JSON.stringify(out, null, 2));
  console.log(`align: wrote public/audio/lyrics.json (alignment loss ${result.loss?.toFixed?.(3) ?? "n/a"})`);
}

// ---------- Helpers ----------

async function post(route, body, headers = {}) {
  const res = await fetch(API + route, { method: "POST", headers: { "xi-api-key": key, ...headers }, body });
  if (!res.ok) fail(`${route}: HTTP ${res.status}\n${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

function probeSeconds(file) {
  try {
    return Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim());
  } catch {
    return undefined;
  }
}

function round(n) {
  return Math.round(n * 100) / 100;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
