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
