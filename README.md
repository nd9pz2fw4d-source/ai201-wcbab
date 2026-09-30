# Follow the claim

A browser slide deck for the WCB-Alberta Executive AI Academy. The whole session follows one injured worker's claim (a composite, fictional example) through three acts: **See it**, **Choose it**, **Govern it**.

Act 1 also carries the teaching block: **How it works** (what a model does, grounding, what makes an agent, the agent loop, tools and permissions, the autonomy dial, teams of agents, testing) and **Where it's going** (five trends, the METR task-length chart, agents with their own computers, Copilot as the operating system of work, the worker's agent meeting ours, a day in 2028, what shifts for us, what doesn't change).

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
| Click the slide background, →, Page Down, Space | Next slide |
| ←, Page Up | Previous slide |
| Home / End | First / last slide |
| `F` or the top-right button | Full screen |
| `M` or the top-left button | Slide menu (also switches 60 / 75 / 90 / 120 and the timer) |
| `T` | Presenter timer (turns amber 2 minutes over the act's plan) |
| `Esc` | Close menu or leave full screen |

Buttons, vote tiles, drag cards and timers never advance the slide. On-slide animations play by themselves. Vote tiles: click to add a hand, right-click to remove one. The URL hash (`#/7`) keeps your place on refresh.

## Settings

`src/config.ts`: session length (60, 75, 90, 120), planned minutes per act, presenter timer default, worker name, claim type (`physical` or `psychological`). You can also add `?length=120` to the URL or use the switch in the menu. Link straight to a slide by its id, e.g. `#/autonomy-dial`.

| Slides | 60 | 75 | 90 | 120 |
|---|---|---|---|---|
| Core deck, plus How it works, next word, what makes an agent, the agent loop, the autonomy dial, Copilot as the operating system of work | shown | shown | shown | shown |
| Live moment, grounding, tools, five things to watch, agents with their own computers, their agent will call our agent, what shifts for us, what doesn't change | | shown | shown | shown |
| Agents work in teams, test before you trust, task-length chart, a day in 2028, agents watching agents, open discussion | | | shown | shown |
| Myth or reality? | | | | shown |
| **Slides in total** | 23 | 31 | 37 | 38 |

Planned minutes per act: 60 = 5 / 25 / 12 / 13 / 5; 75 = 5 / 35 / 15 / 15 / 5; 90 = 5 / 40 / 17 / 18 / discussion 5 / 5; 120 = 5 / 50 / 22 / 28 / discussion 10 / 5.

## Editing

- Slides, order, notes, which lengths include them: `src/slides/index.ts`
- Station names: `src/data/journey.ts`
- Suggested sort layout: `src/data/sortAnswer.ts`
- The five opportunities: `src/data/opportunities.ts`
- Agent steps (live moment and the claim that went wrong): `src/data/agentTraces.ts`
- On-screen numbers: `src/data/claimFacts.ts`
- Teaching content (next-word example, loop steps, tools, autonomy levels, myths, trends, METR data): `src/data/teaching.ts`
- Colours: `src/theme.ts` (the only place colours are defined)

## Before the session: items to confirm

- [ ] `workerName` in `src/config.ts` is still the `[WORKER_NAME]` placeholder
- [ ] "One claim" slide: the hands count (`handsOnOneClaim`, currently 12) is a placeholder. VERIFY with the WCB claims team
- [ ] "Many ideas, a few patterns" slide: "100+ ideas. About 8 patterns." comes from the brief. VERIFY against the idea inventory
- [ ] "Five stops on the journey" slide: opportunity names. Confirm with the WCB team
- [ ] Brand: WCB blue `#3399CC`, dark blue `#117BBC`, logo blue `#80C3E2`, gold `#FBB43A`, green `#98C857` and the Roboto font were taken from wcb.ab.ca. The deep background blue `#0C3553` is derived (WCB's site has no navy). Confirm with the WCB brand team
- [ ] The human/AI split bars on the era slides are illustrative, not measured
- [ ] Task-length chart: METR, "Time Horizon 1.1" (29 January 2026), https://metr.org/blog/2026-1-29-time-horizon-1-1/. Refresh the data if METR publishes a newer update before the session
- [ ] The next-word scores on "It predicts the next word" are illustrative, not real model output
- [ ] Agent products (Grok Bot, Muse, Dots) and Microsoft's Copilot direction were checked on 30 September 2026, days after launch. Recheck names, availability and the Nadella quote the week of the session (sources in `src/data/teaching.ts` and the slide notes)

## Checks

`scripts/shoot.mjs` screenshots every slide from the built file; `scripts/interact.mjs` tests navigation, interactive elements, drag and drop (mouse and touch), session lengths, the menu and the presenter timer. Both need Playwright and Chromium.
