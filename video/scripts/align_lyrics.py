"""Times every sung line in public/audio/song.mp3 and writes public/audio/song-timing.json.

The video's scenes and captions follow that file, so run this after every new take of the song.
It transcribes the song locally with faster-whisper (word timestamps), then matches the heard
words to the lyrics in src/timeline.ts. Lines it cannot hear are placed between their neighbours.

    python3 -m venv .venv && .venv/bin/pip install faster-whisper
    .venv/bin/python scripts/align_lyrics.py [--model small.en]

(With an ElevenLabs API key, `npm run audio:align` does the same through the Forced Alignment API.)
"""

import argparse
import difflib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SONG = ROOT / "public/audio/song.mp3"
OUT = ROOT / "public/audio/song-timing.json"

# Spoken forms the transcriber may write differently from the lyrics.
SAME = {"83": "eightythree", "gray": "grey", "rag": "rag", "wcbb": "wcb"}


def tokens(text):
    out = []
    for raw in text.split():
        t = re.sub(r"[^a-z0-9]", "", raw.lower())
        if t:
            out.append(SAME.get(t, t))
    return out


def lyric_lines():
    script = 'import("./src/timeline.ts").then((m) => console.log(JSON.stringify(m.sections.flatMap((s) => s.lines))))'
    return json.loads(subprocess.check_output(["node", "-e", script], cwd=ROOT))


def song_seconds():
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(SONG)])
    return float(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="small.en")
    args = ap.parse_args()

    from faster_whisper import WhisperModel

    lines = lyric_lines()
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    # No lyrics prompt: priming the model with them made it skip a verse.
    segments, _ = model.transcribe(str(SONG), word_timestamps=True, beam_size=5)
    heard = []  # (token, start, end)
    for seg in segments:
        for w in seg.words:
            for t in tokens(w.word):
                heard.append((t, w.start, w.end))

    # Lyric tokens, remembering which line each belongs to and its position in the line.
    lyric = []
    for li, text in enumerate(lines):
        for pos, t in enumerate(tokens(text)):
            lyric.append((t, li, pos))

    match = {}  # lyric token index -> heard index
    sm = difflib.SequenceMatcher(None, [t for t, _, _ in lyric], [t for t, _, _ in heard], autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            match[a + k] = b + k

    # A line starts at its first heard word, minus a quarter second for each earlier word that was missed.
    starts = [None] * len(lines)
    last_end = [None] * len(lines)
    for i, (_, li, pos) in enumerate(lyric):
        if i in match:
            _, s, e = heard[match[i]]
            if starts[li] is None:
                starts[li] = max(0.0, s - 0.25 * pos)
            last_end[li] = e

    found = sum(s is not None for s in starts)
    duration = song_seconds()
    # Fill unheard lines between their neighbours, and keep the order strictly increasing.
    known = [(i, s) for i, s in enumerate(starts) if s is not None]
    for i in range(len(starts)):
        if starts[i] is None:
            before = max((k for k in known if k[0] < i), default=(-1, 0.0), key=lambda k: k[0])
            after = min((k for k in known if k[0] > i), default=(len(lines), duration), key=lambda k: k[0])
            frac = (i - before[0]) / (after[0] - before[0])
            starts[i] = before[1] + frac * (after[1] - before[1])
    for i in range(1, len(starts)):
        starts[i] = max(starts[i], starts[i - 1] + 0.3)

    out = []
    for i, text in enumerate(lines):
        nxt = starts[i + 1] if i + 1 < len(lines) else duration
        end = min(nxt, (last_end[i] or starts[i] + 2.0) + 0.8)
        out.append({"text": text, "start": round(starts[i], 2), "end": round(max(end, starts[i] + 0.5), 2)})
    OUT.write_text(json.dumps({"duration": round(duration, 2), "lines": out}, indent=2) + "\n")
    print(f"Timed {found} of {len(lines)} lines from the audio; placed {len(lines) - found} between neighbours. Wrote {OUT.relative_to(ROOT)}")
    for i, l in enumerate(out):
        print(f"{l['start']:7.2f}  {l['text']}{'' if last_end[i] is not None else '  (placed)'}")


if __name__ == "__main__":
    main()
