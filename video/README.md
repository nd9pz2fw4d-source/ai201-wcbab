# Follow the claim: pre-read music video

A 2 minute 20 second music video that goes out before the Executive AI Academy session. It sets up the day and teaches the key terms, with a song. It uses Remotion for the video and ElevenLabs for the song and sound effects.

| Time | Section | On screen |
|---|---|---|
| 0:00 | Intro | A claim file flies in and gets stamped "Pre-read". Title, WCB and Deloitte logos |
| 0:08 | Verse 1 | A worker is hurt and a claim starts. Deloitte surveyed 18 organizations. Four pressures on workers' comp |
| 0:24 | Chorus | The claim hops through the eight stations of the journey. "Same care. Better journey." |
| 0:40 | Verse 2 | Deloitte's five levers get pulled one by one, then three figures and the one goal: return to work |
| 1:04 | Pre-chorus | The day: one claim, three acts (See it, Choose it, Govern it) |
| 1:20 | Verse 3 | Eight key-term flashcards: LLM, hallucination, grounding (RAG), agent, the agent loop, least privilege, the autonomy dial, evals and human in the loop |
| 1:52 | Final chorus | Buzzword bingo: mark a square each time you hear a term in the session |
| 2:08 | Outro | See you in the room. Bring one question |

The sung words are always on screen as captions, because many people will watch with the sound off.

## Make the video

```bash
cd video
npm install
npm run audio        # song, sound effects and caption timing from ElevenLabs (needs ELEVENLABS_API_KEY)
npm run render       # writes out/follow-the-claim-pre-read.mp4
npm run studio       # preview and scrub in the browser while editing
```

Without the audio files the video still renders, silent, with evenly timed captions. With them, it picks up whatever is in `public/audio` by itself.

### ElevenLabs

`scripts/elevenlabs.mjs` reads the API key from the `ELEVENLABS_API_KEY` environment variable and makes three things:

- `public/audio/song.mp3`: Music API (`music_v2_5`), one chunk per song section with its lyrics, styles and length, so the song follows the video's timing.
- `public/audio/sfx/*.mp3`: Sound Effects API: whoosh, rubber stamp, pop, lever clunk, record scratch (on "hallucination"), ding, applause.
- `public/audio/lyrics.json`: Forced Alignment API: when each sung line actually starts, so the captions follow the singer.

Steps can run on their own: `npm run audio:song`, `audio:sfx`, `audio:align`. Files that already exist are kept, because generation costs credits; add `-- --force` to redo one (for example a new take of the song: `npm run audio:song -- --force`, then `npm run audio:align`). `node scripts/elevenlabs.mjs all --dry-run` prints every request without calling the API.

After a new song, watch it through in the studio. The script warns if the song's length is off from the plan by more than a second. If a take drifts, generate another, or nudge a section's length in `src/timeline.ts`.

## Editing

- Lyrics, song style, section lengths, sound effect prompts and cue times: `src/timeline.ts` (the song and the video both read it)
- On-screen words and figures: `src/content.ts`
- Scenes: `src/scenes/`
- Colours, logos and station names come from the deck (`../src/theme.ts`, `../src/components/*Logo*.tsx`, `../src/data/journey.ts`), so the video always matches it
- `node scripts/stills.mjs [seconds...]` renders review stills to `out/stills`

## Before sending: items to confirm

- [ ] Session date: `session.date` in `src/content.ts` is the `[SESSION DATE]` placeholder
- [ ] Deloitte source: "The future of workers' compensation: How workers' compensation organizations are improving return-to-work outcomes", Deloitte Canada, published September 2020 (https://www.deloitte.com/ca/en/Industries/insurance/research/the-future-of-workers-compensation.html). Every figure on screen is from its survey of 18 organizations (Canada 7, Australia 8, United States 3): 70 to 80% low complexity (55 to 65% fully automated), 83% build a bespoke plan per case, and the Allianz / NSW behavioural insights study (27% faster to full health in the first 90 days). If a newer Deloitte paper is meant, swap it in `src/content.ts` and the verse 1 and verse 2 lyrics
- [ ] "Expect games, votes, and a claim that goes wrong on purpose" matches the deck at every session length (the sort, the vote tiles and "The claim that went wrong" are in all of them)
- [ ] Listen to the song for mispronounced terms ("L-L-M", "RAG", "R-T-W") before it goes out; regenerate if needed
- [ ] Licences: Remotion is free for individuals, non-profits and companies of up to three people; a larger for-profit company needs a Remotion company licence (https://www.remotion.dev/license). ElevenLabs music and sound effects need a plan that allows commercial use
- [ ] Co-branding: WCB and Deloitte logos appear on the first and last scenes, as in the deck. Confirm with both brand teams
