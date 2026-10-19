// Generates the session introduction's sound effects with ElevenLabs, from src/sfxLibrary.ts:
//   sfx        public/audio/sfx/*.mp3   Sound Effects API
//   normalize  (no key needed) brings every effect to the same peak level, so the volumes in
//              src/components/Sfx.tsx mean the same for each; the sfx step runs it by itself.
//
//   ELEVENLABS_API_KEY=... node scripts/elevenlabs.mjs [sfx|normalize] [--force] [--dry-run]
//
// Existing files are kept (generation costs credits); --force regenerates them.
// --dry-run prints the requests without calling the API or needing a key.
// The voiceover is generated line by line from the script: see scripts/explainer.mjs.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { sfxLibrary } from "../src/sfxLibrary.ts";

const API = "https://api.elevenlabs.io/v1";
const root = path.resolve(import.meta.dirname, "..");
const audioDir = path.join(root, "public/audio");
const SFX_PEAK_DB = -3;

const args = process.argv.slice(2);
const step = args.find((a) => !a.startsWith("--")) ?? "sfx";
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const key = process.env.ELEVENLABS_API_KEY;

if (!["sfx", "normalize"].includes(step)) fail(`Unknown step "${step}". Use sfx or normalize.`);
if (!key && !dryRun && step !== "normalize") fail("Set ELEVENLABS_API_KEY (or use --dry-run to see the requests).");
mkdirSync(path.join(audioDir, "sfx"), { recursive: true });

if (step === "sfx") await makeSfx();
if (step === "normalize") normalizeSfx();

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

// ---------- Helpers ----------

async function post(route, body, headers = {}) {
  const res = await fetch(API + route, { method: "POST", headers: { "xi-api-key": key, ...headers }, body });
  if (!res.ok) fail(`${route}: HTTP ${res.status}\n${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
