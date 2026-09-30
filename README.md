# Follow the claim

A browser slide deck for the WCB-Alberta Executive AI Academy. The whole session follows one injured worker's claim (a composite, fictional example) through three acts: **See it**, **Choose it**, **Govern it**.

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
| `M` or the top-left button | Slide menu (also switches 60 / 75 / 90 and the timer) |
| `T` | Presenter timer (turns amber 2 minutes over the act's plan) |
| `Esc` | Close menu or leave full screen |

Buttons, vote tiles, drag cards and timers never advance the slide. On-slide animations play by themselves. Vote tiles: click to add a hand, right-click to remove one. The URL hash (`#/7`) keeps your place on refresh.

## Settings

`src/config.ts`: session length (60, 75, 90), presenter timer default, worker name, claim type (`physical` or `psychological`). You can also add `?length=60` to the URL or use the switch in the menu.

| Slide | 60 | 75 | 90 |
|---|---|---|---|
| 10 Live moment | hidden | shown | shown |
| 18 Agents watching agents | hidden | hidden | shown |
| 19 Open discussion | hidden | hidden | shown |

## Editing

- Slides, order, notes, which lengths include them: `src/slides/index.ts`
- Station names: `src/data/journey.ts`
- Suggested sort layout: `src/data/sortAnswer.ts`
- The five opportunities: `src/data/opportunities.ts`
- Agent steps (live moment and the claim that went wrong): `src/data/agentTraces.ts`
- On-screen numbers: `src/data/claimFacts.ts`
- Colours: `src/theme.ts` (the only place colours are defined)

## Before the session: items to confirm

- [ ] `workerName` in `src/config.ts` is still the `[WORKER_NAME]` placeholder
- [ ] Slide 2 "hands" count (`handsOnOneClaim`, currently 12) is a placeholder. VERIFY with the WCB claims team
- [ ] Slide 13 "100+ ideas. About 8 patterns." comes from the brief. VERIFY against the idea inventory
- [ ] Slide 14 opportunity names. Confirm with the WCB team
- [ ] Brand: WCB blue `#3399CC`, dark blue `#117BBC`, logo blue `#80C3E2`, gold `#FBB43A`, green `#98C857` and the Roboto font were taken from wcb.ab.ca. The deep background blue `#0C3553` is derived (WCB's site has no navy). Confirm with the WCB brand team
- [ ] The human/AI split bars on the era slides are illustrative, not measured

## Checks

`scripts/shoot.mjs` screenshots every slide from the built file; `scripts/interact.mjs` tests navigation, interactive elements, drag and drop (mouse and touch), session lengths, the menu and the presenter timer. Both need Playwright and Chromium.
