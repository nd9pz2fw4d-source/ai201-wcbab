# Follow the Claim: build plan

Spec: the build brief in the session request (sections 1 to 10).

## Plan
- [x] Scaffold Vite + React 18 + TS, Tailwind v3, Framer Motion, lucide-react, @dnd-kit/core, vite-plugin-singlefile, local Roboto (@fontsource)
- [x] Brand: pull real WCB-Alberta logo, colours, fonts from wcb.ab.ca into `theme.ts` + `components/WcbLogo.tsx`
- [x] Deck shell: ScaledStage (1920x1080 letterbox), navigation hook (keys, click, hash, session length skipping), fullscreen, idle-fading controls, progress bar split by act, slide menu, presenter timer
- [x] Data files: journey, sortAnswer, opportunities, agentTraces, handsCount (VERIFY)
- [x] Reusable components: ClaimJourney, ClaimFile, ActHeader, EraBadge, HumanAISplit, VoteTiles, SortBoard, CountdownTimer, RiskMarker, AgentTrace
- [x] Slides 1 to 20 with notes, include arrays per session length
- [x] Verify: build to one index.html, open via file:// in Playwright at 1920x1080, 1366x768, 3840x2160; screenshot every slide; check nav keys, interactive elements never advance, drag and drop (mouse + touch), 60/75/90 skipping, console errors, reduced motion
- [x] Commit and push to `claude/confident-albattani-tq1xqm`

## Review
- `npm run build` gives one 673 kB `dist/index.html` (fonts inlined as base64, no external URLs). Opened over file:// in Chromium.
- `scripts/interact.mjs`: 40/40 checks pass (click and all nav keys, Space after a button click, interactive elements never advance, vote tiles, STOP/Resume, sort board drag by mouse and by touch, suggested answer, reset, countdown, risk cards, guardrails, menu open/jump/greyed slides, Esc, T timer, amber at 2+ min over via fake clock, hash on refresh, idle fade, 60 skips 10/18/19, hidden-slide hash snaps forward). No console errors.
- Screenshots of every slide at 1920x1080 (75 and 90), 1366x768 and 3840x2160 reviewed.
- Bugs found and fixed during verification: framer-motion overriding Tailwind translate on animated labels (slides 8, 17); header/split overlap on era slides; act header text over the journey; truncated trace rows; presenter timer over the footer; menu buttons wrapping.
- Known trade-offs: slide 10's trace is paced at 1.7s per step on purpose (the room needs time to call stop); ambient loops (claim travel, agent dots) keep running.
- Open items for WCB: worker name, slide 2 hands count, slide 13 figures, opportunity names, derived deep blue. Listed in README.

---

# Round 2: teaching content (how AI and agents work, where it's going)

Decisions (from the user): grow Act 1 and add a 120-minute version; visual first, headline 8 words or fewer, diagram labels up to about 40 words, explanation in notes.

## Plan
- [x] Session lengths 60 / 75 / 90 / 120; new planned minutes (Act 1 grows); `#/<slide-id>` hashes for robust links and tests
- [x] Teaching slides, placed after Era 5 and before the vote:
  - [x] How it works (section card): all
  - [x] It predicts the next word: all
  - [x] Give it the right sources (grounding): 75+
  - [x] What makes an agent (anatomy): all
  - [x] Plan. Act. Check. Repeat. (the loop): all
  - [x] Tools are its hands (permissions): 75+
  - [x] How much should it do alone? (autonomy dial, interactive): all
  - [x] Agents work in teams: 90+
  - [x] Test before you trust (evaluations): 90+
  - [x] Myth or reality? (flip cards): 120
  - [x] Where it's going (five signposts): 75+
  - [x] Tasks it can finish keep getting longer (METR chart, sourced): 90+
  - [x] What doesn't change: 75+
- [x] Notes for every new slide; sources for every figure
- [x] Update tests to use slide ids; rerun screenshots and interaction checks at all four lengths
- [x] README and commit

## Review (round 2)
- 13 teaching slides added to Act 1 after Era 5; deck is now 33 slides (22 / 27 / 32 / 33 for 60 / 75 / 90 / 120).
- Content in `src/data/teaching.ts`; talking points and sources in each slide's notes.
- Chart data verified against METR's own page (Time Horizon 1.1, 29 Jan 2026); only METR's published points are plotted, no fitted line of my own. Next-word scores are labelled illustrative in data and notes.
- `#/<slide-id>` links added; tests rewritten to use ids so they survive reordering. 48/48 interaction checks pass, no console errors; all 33 slides screenshotted at 1920x1080 and fixed slides re-checked.
- Fixed during review: bars near the edge, wrapped source chips, crowded footer, loop line overlap, muddy dial colours and a clipped label, empty agent circles, duplicate heading.

---

# Round 3: futurism (computer-using agents, Copilot as the operating system of work)
- [x] Verified Grok Bot (xAI, beta 11 Aug 2026), Muse (Meta, 8 Sept 2026), Dots (OpenAI, 29 Sept 2026) and Nadella's 25 Sept 2026 "new OS for work" post from primary or reputable sources
- [x] Five slides after the task-length chart: Agents now have their own computers (75+), Copilot becomes the operating system of work (all), Their agent will call our agent (75+), A day in 2028 (90+), What shifts for us (75+)
- [x] Sources and VERIFY notes in slide notes and `src/data/teaching.ts`
- [x] Tests updated (23 / 31 / 37 / 38 slides); 48/48 pass, no console errors; new slides screenshotted and fixed

---

# Round 4: pre-read music video (Remotion + ElevenLabs)

Goal: a short, light-hearted music video sent before the session. It sets up the day's agenda, teaches the key terms, and uses Deloitte's "The future of workers' compensation" (Deloitte Canada, 2020, survey of 18 WCOs) for context.

## Plan
- [x] Source: Deloitte report PDF read in full; figures used: 18 WCOs (CA 7, AU 8, US 3), five levers, 70 to 80% low complexity (55 to 65% fully automated), 94% say multi-variable triage is the top segmentation priority, 83% build bespoke plans today, standardized plans 11% to 39%, Allianz/NSW nudging study 27% faster to full health
- [x] Song structure at 120 BPM, sections in whole bars so visuals lock to the music: intro 8s, verse 1 16s, chorus 16s, verse 2 (five levers) 24s, agenda 16s, key terms 32s, chorus 16s, outro 12s = 140s
- [x] Lyrics and timeline as one data file (`video/src/timeline.ts`), shared by the video and the audio script
- [x] Remotion project in `video/` (own package.json, 1920x1080, 30 fps), reusing the deck's brand tokens and logo paths from `src/`
- [x] Scenes: title, "a claim starts" + Deloitte survey, the claim journey, five levers, agenda (three acts), key-term flashcards, buzzword bingo, see you in the room
- [x] `video/scripts/elevenlabs.mjs`: song (Music API, composition plan with section durations), sound effects (Sound Effects API), lyric timing (Forced Alignment API); reads `ELEVENLABS_API_KEY`
- [x] Video renders without audio files (silent preview) and picks audio up when present
- [x] Verify: typecheck, render stills of every scene, render the full MP4, review frames
- [ ] Blocked: ElevenLabs key is not in this environment. Generate audio once it is added, then re-render

## Review (round 4)
- `video/`: Remotion project, 1920x1080, 30 fps, 140 s. Eight scenes timed to eight song sections (whole bars at 120 BPM). Lyrics, section lengths, SFX prompts and cues live in `video/src/timeline.ts`; on-screen words and Deloitte figures in `video/src/content.ts`. Brand, logos and station names are imported from the deck, not copied.
- Deloitte source is "The future of workers' compensation" (Deloitte Canada, Sept 2020), the only one on Deloitte's site; read in full, every on-screen figure checked against the PDF.
- Verified: typecheck clean; stills of every scene reviewed at 1920x1080; full 140.0 s MP4 rendered (silent preview) and frames checked, including mid-animation. Audio path tested with stand-in tones: song and SFX mux in at the cue times; forced-alignment mapping tested with a mocked API response; stand-ins removed.
- Fixed during review: lever 3 icon squeezed out by a 3-line title, 4-line stat, 2-line term title, bingo checks crowding labels, "WCO" jargon in a headline, hallucination wobble clipping the header, stale lyric timing kept after a new song.
- Blocked: no ElevenLabs key or connector in this environment, so no audio generated yet. `npm run audio` then `npm run render` once `ELEVENLABS_API_KEY` is set.

## Round 4b: the 2026 Deloitte paper, and real audio
- [x] Swap the source to "The Future of Workers' Compensation: Industry Perspectives and Global Signals" (Deloitte Canada, 26 Aug 2026); read the page itself and quote its figures as written (eight forces, four shifts, 83% low AI maturity, one early adopter, half rank mental health support the #1 barrier, 23.1% by 2041, 17.4% worked from home, human-in-the-loop, the readiness question)
- [x] Rewrite verse 1 (eight forces) and verse 2 (four shifts) lyrics and scenes; outro carries Deloitte's readiness question
- [x] Generate through the ElevenLabs connector: two song takes, seven effects; transcribe both takes to pick one (take 1: every line heard)
- [x] Make the video follow the take: scene cuts, cards, effects and captions keyed to when each line is sung (`song-timing.json`); local alignment script (faster-whisper) for the connector route; API route writes the same file
- [x] Normalize effect levels; balance song and effects without clipping
- [x] Verify: typecheck, stills at the take's times, full render with audio, frames and levels checked

### Review (round 4b)
- Source verified from the page HTML, not a summary. The survey's size isn't published, so the video doesn't state one.
- The take ran longer than the plan in places (16 s intro, instrumental breaks after the choruses and agenda). Rather than force the song to the plan, every cue now keys off sung lines, so any future take syncs by re-running alignment. Added an intro teaser beat to fill the longer lead-in.
- Alignment: priming Whisper with the lyrics made it skip verse 1; without the prompt it heard all 52 lines. Kept that finding as a comment in the script.
- Mix: song mastered near 0 dB and effects came out between -19 and 0 dB peak. Effects are peak-normalized to -3 dB, song at 75%, effects at 80%: every effect measurably above the song at its cue, final peak about -0.5 dB.
- Credits: about 8,200 (about $0.82).

---

# Round 5: anchor to the learning objectives; AI is more than Copilot
Objectives: (1) recognize where AI creates value and how transformation is accomplished; (2) distinguish and evaluate AI opportunity types; (3) understand executive accountabilities for driving adoption.

## Plan
- [x] Opening: "Three things to leave with", mapping each objective to an act (all lengths)
- [x] Act 1: "Copilot is the floor, not the ceiling" (faster hands versus a better journey) right after the Copilot slide (all)
- [x] Act 1: "The gain came from redesign" (Paul David, 1990, electrification) (90+)
- [x] Act 2: "Four kinds of AI opportunity" ladder with owner per rung (all)
- [x] Act 2: "Four questions for any opportunity" (value, feasible, safe, ready) (all)
- [x] Act 2: "Where do our five sit?" interactive matrix with a suggested placement (75+)
- [x] Act 3: "What only executives can do" (all)
- [x] Rebalance planned minutes; update tests and README; verify and commit

## Review (round 5)
- 7 slides added; 28 / 37 / 44 / 45 slides for 60 / 75 / 90 / 120. Planned minutes rebalanced toward Acts 2 and 3.
- Electrification lesson verified (Paul A. David, AER 80(2), 1990); source on slide and in notes.
- 49/49 interaction checks pass, no console errors; new slides screenshotted and spacing fixed.
