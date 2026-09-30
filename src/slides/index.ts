import type { SlideDef } from "./types";
import Slide01Title from "./Slide01Title";
import Slide02OneClaim from "./Slide02OneClaim";
import Slide03ActSee from "./Slide03ActSee";
import Slide04Era1 from "./Slide04Era1";
import Slide05Era2 from "./Slide05Era2";
import Slide06Era3 from "./Slide06Era3";
import Slide07Era4 from "./Slide07Era4";
import Slide08Era5 from "./Slide08Era5";
import Slide09WhereToday from "./Slide09WhereToday";
import Slide10LiveMoment from "./Slide10LiveMoment";
import Slide11ActChoose from "./Slide11ActChoose";
import Slide12Sort from "./Slide12Sort";
import Slide13Patterns from "./Slide13Patterns";
import Slide14WhereWeStart from "./Slide14WhereWeStart";
import Slide15ActGovern from "./Slide15ActGovern";
import Slide16WentWrong from "./Slide16WentWrong";
import Slide17FindIt from "./Slide17FindIt";
import Slide18Supervisor from "./Slide18Supervisor";
import Slide19Discussion from "./Slide19Discussion";
import Slide20Close from "./Slide20Close";

const ALL: SlideDef["include"] = [60, 75, 90];

// The deck, in order. Add, remove or reorder slides here only.
export const slides: SlideDef[] = [
  // ---------- Opening (5 min) ----------
  {
    id: "title",
    act: "opening",
    title: "Follow the claim",
    include: ALL,
    component: Slide01Title,
    tone: "dawn",
    largeLogo: true,
    notes:
      "Welcome. For the next stretch we follow one injured worker's claim from the day it is reported to the day it closes. The claim is the main character. Everything we learn about AI, we learn by watching what happens to it. The worker and claim are a composite example, not a real person.",
  },
  {
    id: "one-claim",
    act: "opening",
    title: "One claim",
    include: ALL,
    component: Slide02OneClaim,
    tone: "light",
    notes:
      "Ask the room first: how many hands touch this claim? Take a few guesses, then click Reveal. The pages are the injury report, employer report, doctor's note, pay stubs, emails and phone notes. Every hand is a person doing careful work. The number shown is a placeholder // VERIFY with WCB claims team (src/data/claimFacts.ts). Do not present it as a real figure until confirmed.",
  },

  // ---------- Act 1: See it ----------
  {
    id: "act-see",
    act: "see",
    title: "Act 1: See it",
    include: ALL,
    component: Slide03ActSee,
    tone: "dark",
    notes: "Act 1 is about what AI can do now. We will watch the same claim move through five eras.",
  },
  {
    id: "era-1",
    act: "see",
    title: "Era 1: the paper years",
    include: ALL,
    component: Slide04Era1,
    tone: "light",
    notes:
      "Paper, phones and people at every station. The claim crawls because every step waits on a person to find, read and pass along information. All coral: people do all of it. The work split bar is illustrative, not measured.",
  },
  {
    id: "era-2",
    act: "see",
    title: "Era 2: AI that predicts",
    include: ALL,
    component: Slide05Era2,
    tone: "light",
    notes:
      "Machine learning arrives at Sort and assign: a complexity score helps route the claim, and a forecast of incoming volume helps plan staffing. WCB already has a machine learning team, so this era is familiar. It could predict. It could not read the file or act on it.",
  },
  {
    id: "era-3",
    act: "see",
    title: "Era 3: AI that reads and writes",
    include: ALL,
    component: Slide06Era3,
    tone: "light",
    notes:
      "Generative AI reads a thick file and writes a one-page summary, answers questions about the claim, and drafts a letter. A person checks. Everyone at WCB has basic Copilot today, so this is the era most staff are in. Risk: it can be confident, but wrong. That is why every answer must show where it came from, like 'Clinic report, page 2'.",
  },
  {
    id: "era-4",
    act: "see",
    title: "Era 4: AI that does the work",
    include: ALL,
    component: Slide07Era4,
    tone: "light",
    notes:
      "Agents take steps, not just answer questions. One gathers evidence from several systems, one checks it against policy, one prepares a recommendation with a confidence level. The adjudicator (the coral person at Entitlement decision) makes the decision. Notice the claim moves faster, and the coral side still says 'decides'.",
  },
  {
    id: "era-5",
    act: "see",
    title: "Era 5: connected work",
    include: ALL,
    component: Slide08Era5,
    tone: "light",
    notes:
      "Zoom out. Many claims at once. The contact centre, claims, medical review, audit and appeals share one flow of information instead of handing paper over walls. People stay at the decision points. The point is not faster steps. It is a better journey for the worker.",
  },
  {
    id: "where-today",
    act: "see",
    title: "Where is our claim today?",
    include: ALL,
    component: Slide09WhereToday,
    tone: "light",
    notes:
      "Show of hands for each era; click a tile once per hand (right-click removes one). Expect answers split between eras 2 and 3. Use the gap between today and era 4 to set up Act 2: if agents can take steps, which steps should they take?",
  },
  {
    id: "live-moment",
    act: "see",
    title: "Live moment: an agent works the claim",
    include: [75, 90],
    component: Slide10LiveMoment,
    tone: "light",
    notes:
      "The trace plays one step at a time. Ask the room to call 'stop' where a person should step in, and click STOP to pause and mark that step. Resume to continue. Natural places to stop: before it sends anything outside WCB (request to clinic), before a recommendation on entitlement, before a payment is scheduled, before a decision letter goes to the worker. You can replace this slide with a live demo; keep this trace as the backup in case the live tool fails.",
  },

  // ---------- Act 2: Choose it ----------
  {
    id: "act-choose",
    act: "choose",
    title: "Act 2: Choose it",
    include: ALL,
    component: Slide11ActChoose,
    tone: "dark",
    notes: "Act 2: where should AI help on this claim, and where shouldn't it?",
  },
  {
    id: "sort",
    act: "choose",
    title: "The sort",
    include: ALL,
    component: Slide12Sort,
    tone: "light",
    notes:
      "Start the timer (8 minutes, 6 in the 60-minute version). Tables discuss each station; drag the cards live as the room answers. Then click 'Show a suggested answer' to compare. It is a suggestion, not the correct answer. Low-risk, high-confidence tasks can be automated with rules and checks. Decisions that affect a person's benefits keep a person accountable. The suggested layout lives in src/data/sortAnswer.ts.",
  },
  {
    id: "patterns",
    act: "choose",
    title: "Many ideas, a few patterns",
    include: ALL,
    component: Slide13Patterns,
    tone: "light",
    notes:
      "The ideas collected across WCB gather into a small number of reusable patterns. Build once, reuse many times. That is why picking the right first projects matters. The gold clusters are where the five priorities sit. Figures on screen ('100+ ideas', 'about 8 patterns') come from the build brief // VERIFY against the final idea inventory.",
  },
  {
    id: "where-we-start",
    act: "choose",
    title: "Five stops on the journey",
    include: ALL,
    component: Slide14WhereWeStart,
    tone: "light",
    notes:
      "The five priority opportunities, placed where they help the claim: real-time help for contact centre staff, service forecasting, medical file assessment support, claims audit review, appeals review support. Labels and stations are editable in src/data/opportunities.ts. Confirm final names with the WCB team before the session.",
  },

  // ---------- Act 3: Govern it ----------
  {
    id: "act-govern",
    act: "govern",
    title: "Act 3: Govern it",
    include: ALL,
    component: Slide15ActGovern,
    tone: "dark",
    notes: "Act 3: what happens when it goes wrong, and who owns that?",
  },
  {
    id: "went-wrong",
    act: "govern",
    title: "The claim that went wrong",
    include: ALL,
    component: Slide16WentWrong,
    tone: "light",
    notes:
      "Same era 4 journey. One agent read an old doctor's note as current. The next agent built on it, and the error carried forward station by station. By Entitlement decision the recommendation looks confident and clean. Everything looked right. Ask: where would you have caught it? Then click 'Show the hidden step'.",
  },
  {
    id: "find-it",
    act: "govern",
    title: "Find it, own it",
    include: ALL,
    component: Slide17FindIt,
    tone: "light",
    notes:
      "Start the 5-minute timer. Tables find where it went wrong and name who is accountable. Click each numbered card to reveal a risk; its steps light up red in the trace: error that carried forward, drifted from the goal, can't rebuild the decision, worker information shared too widely. Then click Guardrails: a person decides, every step is recorded, the worker can ask for a human review. Alberta's privacy and access laws apply (Protection of Privacy Act, Access to Information Act, Health Information Act). Every AI-supported decision must be possible to explain, rebuild and defend. Match the level of human oversight to how independently the AI acts.",
  },
  {
    id: "supervisor",
    act: "govern",
    title: "Agents watching agents",
    include: [90],
    component: Slide18Supervisor,
    tone: "light",
    notes:
      "A supervisor agent watches the other agents and catches the old doctor's note at Gather evidence, before it carries forward, and flags it to a person. Oversight that never sleeps, with a person still deciding. Hand off to the live demo here; keep this slide simple so the demo carries the detail.",
  },
  {
    id: "discussion",
    act: "discussion",
    title: "Open discussion",
    include: [90],
    component: Slide19Discussion,
    tone: "dark",
    notes: "Open the floor: what would you need to trust this? Listen for evidence, explanation, audit, the worker's voice, and who is accountable.",
  },

  // ---------- Close (5 min) ----------
  {
    id: "close",
    act: "close",
    title: "The claim, done well",
    include: ALL,
    component: Slide20Close,
    tone: "dawn",
    largeLogo: true,
    notes:
      "The same worker's claim in 2028 (an illustrative year). Coral people at the decision points, teal agents doing the busywork. The claim ends where it should: the worker back at work. Same care, better journey. Close with a round: one word, what will you watch for?",
  },
];
