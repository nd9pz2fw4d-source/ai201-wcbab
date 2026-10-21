# Follow the claim

A browser slide deck for the WCB-Alberta Executive AI Academy. The whole session follows one injured worker's claim (a composite, fictional example) through three acts: **See it**, **Choose it**, **Govern it**.

Each act carries one learning objective: (1) recognize where AI creates value and how transformation is accomplished; (2) distinguish and evaluate AI opportunity types; (3) understand executive accountabilities for driving adoption. One thread runs through all three: AI is more than Copilot and personal productivity.

Act 1 also carries the teaching block: **How it works** (what a model does, grounding, what makes an agent, the agent loop, tools and permissions, the autonomy dial, teams of agents, testing) and **Where it's going** (five trends, the METR task-length chart, agents with their own computers, Copilot as an operating system of work, the worker's agent meeting ours, a day in 2028, what shifts for us, what doesn't change).

## Run it

Open `dist/index.html` by double-clicking it. It is one self-contained file (scripts, styles and fonts inlined), so it needs no server and no internet.

To rebuild after changes:

```bash
npm install
npm run build     # writes dist/index.html
npm run dev       # live preview while editing
```

## Presenting

| Input | Action |
|---|---|
| Click the slide background, →, ↓, Page Down, Space | Next slide |
| ←, ↑, Page Up | Previous slide |
| Home / End | First / last slide |
| `F` or the top-right button | Full screen |
| `M` or the top-left button | Slide menu (also switches 60 / 75 / 90 / 120 and the timer) |
| `S`, or "Pick slides" in the menu | Slide sorter: every slide as a thumbnail with a check mark. Only checked slides are presented. Start from a standard version (60 / 75 / 90 / 120), then tick or untick slides, or a whole act at once. Your pick is saved in this browser; choosing a length in the menu (or "Reset") goes back to the standard version |

**My mix.** The deck opens with your own mix of 38 slides (`src/data/presets.ts`, set as `defaultPreset` in `src/config.ts`). It is also a button in the slide sorter. `?length=75` in the URL, or choosing a length in the menu, shows a standard version instead.

| `T` | Presenter timer (turns amber 2 minutes over the act's plan) |
| `Esc` | Close menu or leave full screen |
| `Tab` / `Shift+Tab` | Move between the buttons, toggles, vote tiles, dial segments and sort cards on a slide (gold ring shows where you are). Then `Space` or `Enter` presses it, `Delete` or `Backspace` removes a vote, and on the sort board `Space` moves a card one column right and ←/→ move it either way. With nothing focused, `Space` still changes slides |

Buttons, vote tiles, drag cards and timers never advance the slide. On-slide animations play by themselves. Vote tiles: click to add a hand, right-click to remove one. The URL hash (`#/7`) keeps your place on refresh.

## Settings

`src/config.ts`: session length (60, 75, 90, 120), planned minutes per act, presenter timer default, worker name, claim type (`physical` or `psychological`). You can also add `?length=120` to the URL or use the switch in the menu. Link straight to a slide by its id, e.g. `#/autonomy-dial`.

| Slides | 60 | 75 | 90 | 120 |
|---|---|---|---|---|
| Core deck, plus three things to leave with, six questions before an agent touches a claim (opens Act 3), next word, what makes an agent, the agent loop, the autonomy dial, Copilot as an operating system of work (interactive: Today versus Next, and a goal the room types in), the cost of waiting (plays by itself: start now versus wait a year), Copilot is the floor not the ceiling, four kinds of AI opportunity, what only executives can do | shown | shown | shown | shown |
| Live moment, agents with their own computers, their agent will call our agent, how we must adapt (click to reveal), build your agent team (live governance check) | | shown | shown | shown |
| How it works (section card), give it the right sources, tools are its hands, five things to watch, what shifts for us, what doesn't change, many ideas a few patterns, where do our five sit?, four questions for any opportunity, how ready are we? (room scores six foundations, radar, CSV download), agents work in teams, test before you trust, task-length chart, the gain came from redesign, a day in 2028, agents watching agents, open discussion | | | shown | shown |
| Myth or reality? | | | | shown |
| **Slides in total** | 27 | 32 | 49 | 50 |

Planned minutes per act: 60 = 5 / 22 / 14 / 14 / 5; 75 = 5 / 30 / 18 / 17 / 5; 90 = 5 / 35 / 20 / 20 / discussion 5 / 5; 120 = 5 / 45 / 27 / 28 / discussion 10 / 5.

## Editing

- Slides, order, notes, which lengths include them: `src/slides/index.ts`
- Station names: `src/data/journey.ts`
- Suggested sort layout: `src/data/sortAnswer.ts`
- The five opportunities: `src/data/opportunities.ts`
- Agent steps (live moment and the claim that went wrong): `src/data/agentTraces.ts`
- On-screen numbers: `src/data/claimFacts.ts`
- Teaching content (next-word example, loop steps, tools, autonomy levels, myths, trends, METR data): `src/data/teaching.ts`
- Objectives, opportunity types, the suggested placement of our five, evaluation questions, executive accountabilities, the electrification source: `src/data/strategy.ts`
- Copilot as an operating system content, agent team rules, readiness foundations, the cost-of-waiting assumption: `src/data/osOfWork.ts`
- Colours: `src/theme.ts` (the only place colours are defined). Everything uses the WCB-Alberta palette: AI and agents in WCB blue `#3399CC`, people deciding in WCB green (`#98C857`, deepened to `#5F9230` where white text sits on it), the claim file in WCB dark blue `#117BBC`, key moments in WCB gold `#FBB43A`. Red is for risk only

## Before the session: items to confirm

- [ ] `workerName` in `src/config.ts` is still the `[WORKER_NAME]` placeholder
- [ ] "One claim" slide: the room now votes on a range; no number is shown. If the WCB claims team gives a typical number of roles, say it aloud (notes). `handsOnOneClaim` (12) is only used to draw the hands on "Copilot is the floor, not the ceiling" and is not shown as a figure
- [ ] "Many ideas, a few patterns" slide: "100+ ideas. About 8 patterns." comes from the brief. VERIFY against the idea inventory
- [ ] "Five stops on the journey" slide: opportunity names. Confirm with the WCB team
- [ ] Logos: the WCB logo is drawn from WCB's own SVG (dark slides) and WCB's light-background colours from their share image (light slides), with no backing box. The Deloitte logo is drawn from Deloitte's own SVG on deloitte.com (white on dark, black on light as in their print logo). Confirm co-branding use with both brand teams
- [ ] Brand: WCB blue `#3399CC`, dark blue `#117BBC`, logo blue `#80C3E2`, gold `#FBB43A`, green `#98C857` and the Roboto font were taken from wcb.ab.ca. The deep background blue `#0C3553` is derived (WCB's site has no navy). Confirm with the WCB brand team
- [ ] The human/AI split bars on the era slides are illustrative, not measured
- [ ] Task-length chart: METR, "Time Horizon 1.1" (29 January 2026), https://metr.org/blog/2026-1-29-time-horizon-1-1/. Refresh the data if METR publishes a newer update before the session
- [ ] "Where do our five sit?": the suggested placement (all five at team workflow) is a prompt for discussion. Agree it with the WCB team before showing it
- [ ] "The cost of waiting": the readiness period (2.5 years) is an illustrative assumption, and the AI line extrapolates METR's software-task trend. Replace with WCB's own estimate in `src/data/osOfWork.ts`
- [ ] The next-word scores on "It predicts the next word" are illustrative, not real model output
- [ ] Agent products (Grok Bot, Muse, Dots) and Microsoft's Copilot direction were checked on 30 September 2026, days after launch. Recheck names, availability and the Nadella quote the week of the session (sources in `src/data/teaching.ts` and the slide notes)

## Pre-read video

`video/` holds a 2 minute 20 second music video to send before the session: the agenda, the key terms and Deloitte's August 2026 view of the future of workers' compensation, set to a song. Built with Remotion; the song and sound effects come from ElevenLabs. See `video/README.md`.

## Checks

`scripts/shoot.mjs` screenshots every slide from the built file; `scripts/sorter.mjs` tests the slide sorter; `scripts/interact.mjs` tests navigation, interactive elements, drag and drop (mouse and touch), session lengths, the menu and the presenter timer. Both need Playwright and Chromium.
