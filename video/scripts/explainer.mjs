// The explainer's script (explainer/script.md) is the single source for its voiceover, captions and timing.
//
//   node scripts/explainer.mjs lines      print every spoken line with its id, speaker, voice, and the text to send
//                                         to ElevenLabs ("say": delivery tags kept, names spelt for the voice) (JSON)
//   node scripts/explainer.mjs fetch <id> <url>
//                                         download a generated line to public/explainer/voice-raw/<id>.mp3, with
//                                         <id>.txt beside it holding the exact text it was generated from. Audio whose
//                                         text no longer matches the script is ignored, so an edited line can never
//                                         play its old words.
//
//   node scripts/explainer.mjs voice      prepare each downloaded line: public/explainer/voice-raw/<id>.mp3 is slowed
//                                         a little (pitch kept) and levelled, into public/explainer/voice/<id>.mp3
//   node scripts/explainer.mjs manifest   measure public/explainer/voice/<id>.mp3 and write public/explainer/manifest.json
//                                         (a line with no voice file yet gets an estimated length, marked "estimated")
//
// Script format: "## <n>. <title>" starts a scene; "**Ava:** ...", "**Sam:** ..." or "**Host:** ..." is a spoken
// line; [square brackets] direct the delivery (sent to the voice, never captioned); lines starting "On screen"
// describe the picture and are not spoken; "(pause 2.5s)" after a line holds the picture that long before the
// next line, so the viewer can think.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const scriptPath = path.join(root, "explainer/script.md");
const voiceDir = path.join(root, "public/explainer/voice");
const rawDir = path.join(root, "public/explainer/voice-raw");

// Generated speech runs about 165 words a minute; slowing it to 92% (pitch kept) and pausing
// between lines (src/explainer/timing.ts) brings the whole explainer to about 130.
const TEMPO = 0.92;
// Both voices are levelled to the same loudness, so neither jumps out.
const LOUDNESS = "loudnorm=I=-16:TP=-1.5:LRA=11";
const manifestPath = path.join(root, "public/explainer/manifest.json");

/** ElevenLabs voice for each speaker. Ava and Sam are library voices; the host is Riphay's own cloned voice. */
export const voices = { Ava: "CvD6hF1BJzAFN428j1cO", Sam: "8Ln42OXYupYsag45MAUy", Host: "XnhNUCoDPy1eZWeCNrON" };
/** Words the voice needs spelt differently to say them right; captions keep the real spelling. */
const pronounce = { Riphay: "Rifai" };

const spoken = (raw) => raw.replace(/\[[^\]]*\]\s*/g, "").replace(/\s+/g, " ").trim();
const forVoice = (raw) => Object.entries(pronounce).reduce((t, [word, said]) => t.replaceAll(word, said), raw);

export function parseScript(text = readFileSync(scriptPath, "utf8")) {
  const scenes = [];
  for (const raw of text.split("\n")) {
    const scene = /^## (\d+)\. (.+)$/.exec(raw);
    if (scene) {
      scenes.push({ n: Number(scene[1]), title: scene[2].trim(), lines: [] });
      continue;
    }
    const pause = /^\(pause (\d+(?:\.\d+)?)s\)$/.exec(raw.trim());
    if (pause && scenes.at(-1)?.lines.length) {
      scenes.at(-1).lines.at(-1).pauseAfter = Number(pause[1]);
      continue;
    }
    const line = /^\*\*(Ava|Sam|Host):\*\* (.+)$/.exec(raw);
    if (line && scenes.length) {
      const s = scenes.at(-1);
      const id = `s${String(s.n).padStart(2, "0")}-${String(s.lines.length + 1).padStart(2, "0")}`;
      s.lines.push({ id, speaker: line[1], text: spoken(line[2]), say: forVoice(line[2].trim()) });
    }
  }
  return scenes;
}

/** True when the line's downloaded audio was generated from its current text. */
const matchesScript = (l) => {
  const txt = path.join(rawDir, `${l.id}.txt`);
  return existsSync(txt) && readFileSync(txt, "utf8").trim() === l.say;
};

const seconds = (file) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim());

const step = process.argv[2];
if (step === "voice") {
  mkdirSync(voiceDir, { recursive: true });
  let n = 0;
  for (const l of parseScript().flatMap((sc) => sc.lines)) {
    const raw = path.join(rawDir, `${l.id}.mp3`);
    if (!existsSync(raw) || !matchesScript(l)) continue;
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-af", `atempo=${TEMPO},${LOUDNESS}`, "-ar", "44100", "-b:a", "160k", path.join(voiceDir, `${l.id}.mp3`)]);
    n++;
  }
  console.log(`voice: prepared ${n} lines`);
} else if (step === "lines") {
  console.log(JSON.stringify(parseScript().flatMap((s) => s.lines.map((l) => ({ ...l, voice: voices[l.speaker] }))), null, 2));
} else if (step === "fetch") {
  const [id, url] = process.argv.slice(3);
  const l = parseScript().flatMap((s) => s.lines).find((x) => x.id === id);
  if (!l || !url) {
    console.error(l ? "Usage: fetch <id> <url>" : `No line ${id} in the script.`);
    process.exit(1);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${id}: download failed (${res.status})`);
  mkdirSync(rawDir, { recursive: true });
  writeFileSync(path.join(rawDir, `${id}.mp3`), Buffer.from(await res.arrayBuffer()));
  writeFileSync(path.join(rawDir, `${id}.txt`), l.say + "\n");
  console.log(`fetch: ${id} (${seconds(path.join(rawDir, `${id}.mp3`)).toFixed(1)} s)`);
} else if (step === "manifest") {
  const scenes = parseScript().map((s) => ({
    ...s,
    lines: s.lines.map((line) => {
      const { say, ...l } = line; // the manifest keeps the caption text only
      const file = path.join(voiceDir, `${l.id}.mp3`);
      if (existsSync(file) && matchesScript(line)) return { ...l, seconds: Math.round(seconds(file) * 100) / 100 };
      // Until the voice exists: the length it would take at a steady 150 words a minute.
      return { ...l, seconds: Math.round((l.text.split(/\s+/).length / 2.5 + 0.3) * 100) / 100, estimated: true };
    }),
  }));
  writeFileSync(manifestPath, JSON.stringify({ scenes }, null, 2) + "\n");
  const lines = scenes.flatMap((s) => s.lines);
  const words = lines.reduce((n, l) => n + l.text.split(/\s+/).length, 0);
  const total = lines.reduce((n, l) => n + l.seconds, 0);
  const missing = lines.filter((l) => l.estimated).length;
  console.log(`manifest: ${lines.length} lines (${missing} estimated), ${total.toFixed(1)} s of speech, ${Math.round((words / total) * 60)} words a minute`);
} else if (step !== undefined) {
  console.error('Use "lines", "fetch", "voice" or "manifest".');
  process.exit(1);
}
