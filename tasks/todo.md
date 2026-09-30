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
