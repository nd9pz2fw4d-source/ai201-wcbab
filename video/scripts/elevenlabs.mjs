// Generates the pre-read's audio with ElevenLabs, from src/timeline.ts:
//   song   public/audio/song.mp3          Music API, one chunk per section of the plan in src/timeline.ts
//   sfx    public/audio/sfx/*.mp3          Sound Effects API
//   align  public/audio/song-timing.json   Forced Alignment API: when each sung line starts. The video's
//          scenes, cues and captions follow it, so re-run it after every new take.
//          (No API key? scripts/align_lyrics.py does the same locally.)
//
//   ELEVENLABS_API_KEY=... node scripts/elevenlabs.mjs [all|song|sfx|align|normalize] [--force] [--dry-run]
//
// normalize (no key needed) brings every sound effect to the same peak level, so the volumes in
// src/timeline.ts mean the same for each; the sfx step runs it by itself.
//
// Existing files are kept (generation costs credits); --force regenerates them.
// --dry-run prints the requests without calling the API or needing a key.
// Needs Node 22.18 or later (it imports the TypeScript timeline directly).
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { sections, sfxLibrary, song, totalSeconds } from "../src/timeline.ts";

const API = "https://api.elevenlabs.io/v1";
const root = path.resolve(import.meta.dirname, "..");
const audioDir = path.join(root, "public/audio");
const songPath = path.join(audioDir, "song.mp3");
const timingPath = path.join(audioDir, "song-timing.json");
const SFX_PEAK_DB = -3;

const args = process.argv.slice(2);
const step = args.find((a) => !a.startsWith("--")) ?? "all";
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const key = process.env.ELEVENLABS_API_KEY;

if (!["all", "song", "sfx", "align", "normalize"].includes(step)) fail(`Unknown step "${step}". Use all, song, sfx, align or normalize.`);
if (!key && !dryRun && step !== "normalize") fail("Set ELEVENLABS_API_KEY (or use --dry-run to see the requests).");
mkdirSync(path.join(audioDir, "sfx"), { recursive: true });

if (step === "all" || step === "song") await makeSong();
if (step === "all" || step === "sfx") await makeSfx();
if (step === "all" || step === "align") await alignLyrics();
if (step === "normalize") normalizeSfx();

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

  console.log(`song: the take is ${probeSeconds(songPath)?.toFixed(1) ?? "?"}s. Run the align step so the video follows it.`);
  // A new song makes the old line timing wrong; the captions fall back to even timing until it is re-aligned.
  if (existsSync(timingPath)) unlinkSync(timingPath);
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
  if (!dryRun) normalizeSfx();
}

/** Peak-normalize every effect to SFX_PEAK_DB. Generated effects come out anywhere from -19 to 0 dB. */
function normalizeSfx() {
  for (const id of Object.keys(sfxLibrary)) {
    const file = path.join(audioDir, "sfx", `${id}.mp3`);
    if (!existsSync(file)) continue;
    const probe = spawnSync("ffmpeg", ["-v", "info", "-i", file, "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" });
    const peak = Number(/max_volume: (-?[\d.]+) dB/.exec(probe.stderr)?.[1]);
    const gain = SFX_PEAK_DB - peak;
    if (!Number.isFinite(gain) || Math.abs(gain) < 1) continue; // within 1 dB: leave it (re-encoding moves peaks slightly)
    const tmp = file.replace(/\.mp3$/, ".tmp.mp3");
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", file, "-af", `volume=${gain.toFixed(1)}dB`, "-b:a", "128k", tmp]);
    execFileSync("mv", [tmp, file]);
    console.log(`normalize: ${id}.mp3 ${gain > 0 ? "+" : ""}${gain.toFixed(1)} dB`);
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
  const duration = probeSeconds(songPath) ?? totalSeconds;
  writeFileSync(timingPath, JSON.stringify({ duration: round(duration), lines: out }, null, 2) + "\n");
  console.log(`align: wrote public/audio/song-timing.json (alignment loss ${result.loss?.toFixed?.(3) ?? "n/a"})`);
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
