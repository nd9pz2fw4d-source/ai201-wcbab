# Follow the claim: before the session

A narrated pre-read that goes out before the Executive AI Academy session, with a one-page cheat sheet. It uses Remotion for the video and ElevenLabs for the voices and sound effects. There is no song.

Finished file: `out/follow-the-claim-before-the-session.mp4`, 11:27 (render it with `npm run render`; `out/` is not committed).

It has two parts, in three voices:

**Before the session (about 8 minutes).** Two co-narrators, Ava and Sam, trade lines: witty, warm and steady, with a light Alberta touch (construction season, the forecast, the block heater). It is deliberately not a walk through the session's slides: the session is about WCB (the claim, our choices); this part is about you and the world.

| Part | What happens |
|---|---|
| Why watch | A packed week; the four parts |
| A Tuesday with AI | 7:30 am the phone finishes a text (LLM), 8:15 the bank's fraud text (predictive AI; the machine flags, a person decides), 10:00 "it's on page 4" (grounding, RAG), 1:00 pm an agent books a trip (agent, the loop, least privilege, the autonomy dial, human in the loop) |
| Watch it work, and slip | Three illustrative demos in an AI assistant window, each with a predict-then-see beat: two summaries (which would you trust?), a question it can't answer (a hallucination), a draft a person edits before sending (accountability) |
| Decode the pitch | "99% accurate, fully autonomous, learns your business, plugs into all your systems" becomes five questions to ask |
| Three questions to bring | Deloitte's 83% (nobody is far ahead), three questions about the viewer's own area, and the cheat sheet |

**The day (about 3 minutes).** Riphay Al-Hussein, who leads the session, introduces it in their own cloned voice, over the session scenes: one claim and Deloitte's eight forces, the claim's journey, Deloitte's four shifts, the three acts (See it, Choose it, Govern it), a lightning round of the eight words, the claim done well ("a person decides"), and "See you in the room" with Deloitte's readiness question and the date.

The first part follows the deck's light content-slide look (light WCB blue, WCB blue for AI and agents, WCB green for people); the session part switches to the deck's dark title look, so the handover is visible. Every spoken line is captioned with its speaker's name.

## How it fits together

- **The script is the single source:** `explainer/script.md`. `scripts/explainer.mjs` reads its spoken lines (`**Ava:**`, `**Sam:**`, `**Host:**`), delivery tags in [square brackets] (sent to the voice, never captioned) and `(pause 2.5s)` think-pauses, for the voiceover, the captions and the timing.
- **Timing follows the voice.** `public/explainer/manifest.json` holds every line's measured length; scenes are placed one after another from those lengths (`src/explainer/timing.ts`), and pictures come in on the word that names them (`useCue(line, phrase)`), so a new take of any line re-times the video by itself.
- **Pictures:** the first part is in `src/explainer/scenes/`; the session part reuses `src/scenes/` (Intro, Verse1, Chorus, Shifts, Agenda, Terms, DoneWell, Outro). The scene for each script number is listed in `src/explainer/Explainer.tsx`.
- **Sound effects** sit next to the picture they belong to (`<Sfx id at />`, `src/components/Sfx.tsx`), only in the opening card and the session part, well under the voice.
- **Words:** the 12 words, the five pitch questions and the three questions are in `src/explainer/cheatsheet.ts`, used by the video and the cheat sheet. Deloitte figures and the session date are in `src/content.ts`.
- **From the deck:** colours, logos, station names and who does what in "the claim, done well" come from `../src/theme.ts`, `../src/components/*Logo*.tsx`, `../src/data/journey.ts` and `../src/data/sortAnswer.ts`, so the video always matches it.

## Voices

ElevenLabs, model `eleven_v4` (`voices` in `scripts/explainer.mjs`):

- Ava: "Kristen", warm, neutral North American (`CvD6hF1BJzAFN428j1cO`)
- Sam: "Jay Wayne Pro", warm and grounded (`8Ln42OXYupYsag45MAUy`)
- Host: Riphay's own cloned voice (`XnhNUCoDPy1eZWeCNrON`). The voice is sent "Rifai" wherever the script says "Riphay" (`pronounce` in `scripts/explainer.mjs`), so it says the name right; captions keep "Riphay".

```bash
node scripts/explainer.mjs lines      # every line's id, speaker, voice and the exact text to send
# Generate each line with ElevenLabs (flow "Follow the claim: narration"), then download it:
node scripts/explainer.mjs fetch <id> <url>   # saves voice-raw/<id>.mp3 and <id>.txt (the text it was made from)
npm run voice                         # levels all voices to -16 LUFS, re-measures every line
npm run render                        # writes out/follow-the-claim-before-the-session.mp4
npm run stills                        # review stills, one per scene, to out/stills
```

Audio whose `.txt` no longer matches the script is ignored, so an edited line can never play its old words. Lines without a voice render silent with their captions, at an estimated length. To change a line: edit the script, regenerate just that line, `fetch` it, `npm run voice`.

The voiceover used about 9,000 credits (65 lines); the auditions about 3,000.

## Side version: the country song (2:30)

A separate, upbeat country remake of the original "Follow the claim" song, over the session scenes: composition `CountrySong`, rendered with `npm run render:country` to `out/follow-the-claim-country.mp4`. Same lyrics as the original, with a Stampede "Yahoo!" up top; fiddle, banjo, twangy Telecaster, pedal steel, stomp-and-clap two-step and a warm male lead with a friendly twang. The prompt describes the sound, not any artist (`src/song/timeline.ts`).

- The scenes are the same components as the session part of the main video (`src/scenes/`). Each takes its timing as a `cues` prop: the main video works them out from Riphay's lines (`src/explainer/sessionCues.ts`), the song from its sung lines (`src/song/cues.ts`).
- The take: `public/audio/country/song.mp3`, take 2 of 2 from ElevenLabs Music (`eleven_music_v2_5`, flow "Follow the claim: country version"), chosen because it sings the intro shout; take 1 skipped it. 4,500 credits for the two takes.
- Timing: `npm run audio:align` (`scripts/align_lyrics.py`) transcribes the take locally with faster-whisper and matches the words to the lyrics, writing `public/audio/country/song-timing.json`; a second pass listens again to the stretch around any line the first pass missed. It hears all 52 lines on the current take. `--song other.mp3 --dry-run` compares a different take without writing anything.
- `npm run stills -- --country` renders review stills to `out/stills-country`.

## The cheat sheet

`npm run cheatsheet` builds `cheatsheet/follow-the-claim-cheat-sheet.pdf`: one letter-size page with the 12 words (each with the everyday example from the video), the five pitch questions and the three questions to bring, with space to write. It fails if the content runs past one page. It needs Playwright's Chromium (`npx playwright install chromium`, or set `CHROMIUM_PATH`).

## Sound effects

Five effects in `public/audio/sfx/` (prompts in `src/sfxLibrary.ts`). `ELEVENLABS_API_KEY=... npm run audio:sfx` regenerates missing ones (`-- --force` to redo); `node scripts/elevenlabs.mjs normalize` levels them to the same peak.

## Before sending: items to confirm

- [ ] Listen through once: "LLM", "RAG", "evals", "WCB", "QE2" and "Rifai Al-Hussein"; in the country song, "L-L-M", "RAG" and "read, draft, act"
- [ ] The demos, the bank text, the trip and the pitch are made-up examples, labelled "Illustrative" where they appear as screens
- [ ] Deloitte's 83% is quoted as the paper words it ("organizational maturity for integrating AI into core business functions remains low")
- [x] Session date: Monday, October 26 (`session.date` in `src/content.ts` and the last line of the script), shown on the explainer's last scenes and the cheat sheet
- [ ] Deloitte source: "The Future of Workers' Compensation: Industry Perspectives and Global Signals", Deloitte Canada, 26 August 2026 (Zohair Masood, Jason Condon, Chris Duvinage), https://www.deloitte.com/ca/en/Industries/insurance/perspectives/future-workers-compensation.html. On screen, as the page words them: the eight forces; the four shifts; 83% of surveyed Canadian WCB leaders say AI maturity in core business functions remains low, with one respondent an early adopter; half rank mental health and wellness support the number one barrier; 55+ expected to reach 23.1% of the labour force by 2041; 17.4% of employed Canadians worked from home in May 2025; "human-in-the-loop"; and the first readiness question, quoted at the end. The page does not give the survey's size, so the video doesn't either
- [ ] "Expect games, votes, and a claim that goes wrong on purpose" matches the deck at every session length
- [ ] Licences: Remotion is free for individuals, non-profits and companies of up to three people; a larger for-profit company needs a Remotion company licence (https://www.remotion.dev/license). ElevenLabs voices, music and effects need a plan that allows commercial use
- [ ] Co-branding: WCB and Deloitte logos appear throughout, as in the deck. Confirm with both brand teams
