# Follow the claim: pre-read music video

A 2 minute 20 second music video that goes out before the Executive AI Academy session. It sets up the day and teaches the key terms, with a song, using Deloitte's August 2026 view of the future of workers' compensation in Canada for context. It uses Remotion for the video and ElevenLabs for the song and sound effects.

Finished file: `out/follow-the-claim-pre-read.mp4` (render it with `npm run render`; `out/` is not committed).

| Time | Section | On screen |
|---|---|---|
| 0:00 | Intro | A claim file flies in and gets stamped "Pre-read". Title, WCB and Deloitte logos, then "One claim · Three acts · Eight key terms · One song" |
| 0:16 | Verse 1 | A worker is hurt and a claim starts. Deloitte asked Canada's WCB leaders what's next. Deloitte's eight forces reshaping workers' comp |
| 0:32 | Chorus | The claim hops through the eight stations of the journey. "Same care. Better journey." |
| 0:48 | Verse 2 | Deloitte's four shifts click into place, then the survey figures and "human in the loop" |
| 1:12 | Pre-chorus | The day: one claim, three acts (See it, Choose it, Govern it) |
| 1:24 | Verse 3 | Eight key-term flashcards: LLM, hallucination, grounding (RAG), agent, the agent loop, least privilege, the autonomy dial, evals and human in the loop |
| 1:57 | Final chorus | Buzzword bingo: mark a square each time you hear a term in the session |
| 2:10 | Outro | See you in the room, with Deloitte's readiness question to bring an answer to |

The sung words are always on screen as captions, because many people will watch with the sound off.

## How the timing works

`src/timeline.ts` holds the lyrics and a plan for each section's length (whole bars at 120 BPM). ElevenLabs never lands exactly on the plan, so the video follows the take instead: `public/audio/song-timing.json` records when each of the 52 sung lines starts, and every scene cut, card, sound effect and caption is keyed to those moments (see `scheduleSections` and the cue helpers in `src/timeline.ts`). The video is as long as the song. Without a timing file the plan is used, so the video still renders, silent, with the same structure.

## Make the video

```bash
cd video
npm install
npm run render       # writes out/follow-the-claim-pre-read.mp4 from the audio in public/audio
npm run studio       # preview and scrub in the browser while editing
```

The current audio is committed: `public/audio/song.mp3` (take 1 of 2, chosen because every line is sung and intelligible; take 2 dropped three lines), seven sound effects in `public/audio/sfx/`, and `public/audio/song-timing.json`.

### Making new audio

There are two routes; both write the same files.

**ElevenLabs API key** (`ELEVENLABS_API_KEY`): `npm run audio` makes the song (Music API, one chunk per section with its lyrics and length), the sound effects, and the line timing (Forced Alignment API). Single steps: `npm run audio:song`, `audio:sfx`, `audio:align`. Existing files are kept because generation costs credits; add `-- --force` to redo one, then re-run `audio:align`. `node scripts/elevenlabs.mjs all --dry-run` prints every request without calling the API.

**ElevenLabs connector** (how the current audio was made, in the flow "Follow the Claim: pre-read song and SFX"): generate the song on a music node (`eleven_music_v2_5`, custom lyrics from `src/timeline.ts`, 140 s) and the effects on sfx nodes (prompts in `sfxLibrary`), save them into `public/audio/`, then:

```bash
node scripts/elevenlabs.mjs normalize                        # evens out effect levels (no key needed)
python3 -m venv .venv && .venv/bin/pip install faster-whisper
.venv/bin/python scripts/align_lyrics.py                     # writes song-timing.json from the audio
```

`align_lyrics.py` transcribes the song locally with word timestamps and matches the words to the lyrics; it prints each line's time and flags any line it had to place between its neighbours. On the current take it heard all 52.

Credits used for the current audio: two song takes 4,200, seven effects 95, two Scribe transcripts to compare the takes about 3,900 (about $0.82 in all).

## Editing

- Lyrics, song style, planned section lengths, sound effect prompts, cue times: `src/timeline.ts` (change lyrics and you need a new take and new timing)
- On-screen words and Deloitte figures: `src/content.ts`
- Scenes: `src/scenes/`; song and effect volume: `src/PreRead.tsx`
- Colours, logos and station names come from the deck (`../src/theme.ts`, `../src/components/*Logo*.tsx`, `../src/data/journey.ts`), so the video always matches it
- `node scripts/stills.mjs [seconds...]` renders review stills to `out/stills`

## Before sending: items to confirm

- [ ] Session date: `session.date` in `src/content.ts` is the `[SESSION DATE]` placeholder
- [ ] Deloitte source: "The Future of Workers' Compensation: Industry Perspectives and Global Signals", Deloitte Canada, 26 August 2026 (Zohair Masood, Jason Condon, Chris Duvinage), https://www.deloitte.com/ca/en/Industries/insurance/perspectives/future-workers-compensation.html. On screen, as the page words them: the eight forces; the four shifts; 83% of surveyed Canadian WCB leaders say AI maturity in core business functions remains low, with one respondent an early adopter; half rank mental health and wellness support the number one barrier; 55+ expected to reach 23.1% of the labour force by 2041; 17.4% of employed Canadians worked from home in May 2025; "human-in-the-loop"; and the first readiness question, quoted in the outro. The page does not give the survey's size, so the video doesn't either
- [ ] Listen through once: the singer's "L-L-M", "RAG" and "read, draft, act" are clear on take 1, but the final call is a human ear
- [ ] "Expect games, votes, and a claim that goes wrong on purpose" matches the deck at every session length (the sort, the vote tiles and "The claim that went wrong" are in all of them)
- [ ] Licences: Remotion is free for individuals, non-profits and companies of up to three people; a larger for-profit company needs a Remotion company licence (https://www.remotion.dev/license). ElevenLabs music and sound effects need a plan that allows commercial use
- [ ] Co-branding: WCB and Deloitte logos appear on the first and last scenes, as in the deck. Confirm with both brand teams
