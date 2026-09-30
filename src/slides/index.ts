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
import SlideHowItWorks from "./SlideHowItWorks";
import SlideNextWord from "./SlideNextWord";
import SlideGrounding from "./SlideGrounding";
import SlideAnatomy from "./SlideAnatomy";
import SlideAgentLoop from "./SlideAgentLoop";
import SlideTools from "./SlideTools";
import SlideAutonomyDial from "./SlideAutonomyDial";
import SlideAgentTeams from "./SlideAgentTeams";
import SlideEvaluations from "./SlideEvaluations";
import SlideMyths from "./SlideMyths";
import SlideWhereGoing from "./SlideWhereGoing";
import SlideTimeHorizon from "./SlideTimeHorizon";
import SlideWhatStays from "./SlideWhatStays";
import SlideComputerAgents from "./SlideComputerAgents";
import SlideCopilotOS from "./SlideCopilotOS";
import SlideAgentMeetsAgent from "./SlideAgentMeetsAgent";
import SlideDayIn2028 from "./SlideDayIn2028";
import SlideWhatShifts from "./SlideWhatShifts";

const ALL: SlideDef["include"] = [60, 75, 90, 120];
const FROM_75: SlideDef["include"] = [75, 90, 120];
const FROM_90: SlideDef["include"] = [90, 120];
const ONLY_120: SlideDef["include"] = [120];

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

  // ---------- Act 1, part 2: How it works / Where it's going ----------
  {
    id: "how-it-works",
    act: "see",
    title: "How it works",
    include: ALL,
    component: SlideHowItWorks,
    tone: "dark",
    notes:
      "We have seen what AI can do on the claim. Now we look inside: what a model actually does, what turns a model into an agent, and how much we let it do alone. No code, no maths. The goal is that every leader here can ask a vendor or a project team the right questions.",
  },
  {
    id: "next-word",
    act: "see",
    title: "It predicts the next word",
    include: ALL,
    component: SlideNextWord,
    tone: "light",
    notes:
      "At its core, a large language model does one thing: given the words so far, it scores every possible next word and picks a likely one, then repeats. It learned those patterns from vast amounts of text during training. That is why it writes so fluently. It is also why it can be confidently wrong: it produces what sounds likely, not what it has checked. It has no built-in fact check and, on its own, no access to our files. The scores on screen are illustrative, not real model output. Newer 'reasoning' models write out working steps before answering, which improves harder problems, but the same rule holds: fluent is not the same as verified.",
  },
  {
    id: "grounding",
    act: "see",
    title: "Give it the right sources",
    include: FROM_75,
    component: SlideGrounding,
    tone: "light",
    notes:
      "The fix for guessing is grounding: before answering, the system searches trusted sources (our policy manual, the claim file, medical guidelines) and answers from them, with citations you can click. You may hear this called retrieval-augmented generation, or RAG. For WCB this matters twice: answers are only as good as the sources we connect, and a cited answer is one a person can check in seconds. Ask any vendor: where does the answer come from, and can I see it?",
  },
  {
    id: "anatomy",
    act: "see",
    title: "What makes an agent",
    include: ALL,
    component: SlideAnatomy,
    tone: "light",
    notes:
      "A chatbot answers a question. An agent pursues a goal. The model is the reasoning engine in the middle. Around it: a goal (what done looks like), instructions (the rules and limits it must follow), tools (the systems it can use: claim file, email, scheduling), memory (what it knows about this claim so far), and a person who approves and decides. When something goes wrong with an agent, it is usually one of these parts: a vague goal, a missing rule, a tool with too much access, stale memory, or no person at the right moment.",
  },
  {
    id: "agent-loop",
    act: "see",
    title: "The agent loop",
    include: ALL,
    component: SlideAgentLoop,
    tone: "light",
    notes:
      "This is how an agent actually works: a loop. Plan the next step toward the goal. Act, usually by using a tool. Check the result. Then decide: carry on, try something else, or stop. It stops when the goal is met, when a rule says a person must approve, or when it is unsure. Watch the right side: the agent finds the doctor's note is missing, plans to request it, drafts the request, and then hands to a person because sending outside WCB needs approval. The loop is what makes agents powerful, and it is also why one early mistake can carry forward. We will come back to that in Act 3.",
  },
  {
    id: "tools",
    act: "see",
    title: "Tools are its hands",
    include: FROM_75,
    component: SlideTools,
    tone: "light",
    notes:
      "An agent can only touch what we connect it to. Think in three permission levels. Read: look things up. Draft: prepare something for a person. Act: change something in the world, like sending an email or scheduling a payment. Most value comes from read and draft; act needs the strongest controls, with a person approving. The principle is least privilege: give each agent only the access its job needs. Industry is converging on open standards for connecting AI to tools and data (for example the Model Context Protocol, MCP), which makes connecting easier. That makes the permission decision more important, not less.",
  },
  {
    id: "autonomy-dial",
    act: "see",
    title: "The autonomy dial",
    include: ALL,
    component: SlideAutonomyDial,
    tone: "light",
    notes:
      "Click the dial to move it (it never advances the slide). Autonomy is a setting we choose per task, not a property of the technology. Suggests, drafts, acts with approval, acts then reports, acts alone. The rule: the more independently it acts, the stronger the oversight must be. Most of WCB's claim work belongs in the first three positions. Acting alone fits only low-risk, reversible, rule-based tasks, like routing mail. Ask the room: where on this dial is anything we use today? This sets up the sort exercise in Act 2.",
  },
  {
    id: "agent-teams",
    act: "see",
    title: "Agents work in teams",
    include: FROM_90,
    component: SlideAgentTeams,
    tone: "light",
    notes:
      "Complex work is increasingly split across several agents: a coordinator breaks the goal down and hands pieces to specialists (intake, evidence, medical, policy), who write to a shared case file. A person decides. This is powerful because each agent can be simpler and tested on its own. The weak point is the handoff: an error or a misunderstanding passes from one agent to the next and looks more certain each time. Keep this picture in mind for Act 3.",
  },
  {
    id: "evaluations",
    act: "see",
    title: "Test before you trust",
    include: FROM_90,
    component: SlideEvaluations,
    tone: "light",
    notes:
      "How do we know an AI system is good enough? We test it, like any other control. Build a set of past claims (de-identified), run the system over them, and score it: right answer, shows its sources, fair across groups of workers, protects privacy, knows when to hand to a person. These tests are called evaluations, or evals. Testing will find gaps (shown here as 'needs work'); that is the point. Then keep testing after launch, because models, data and policies change. Ask any project: what is your test set, who wrote it, and what score is good enough?",
  },
  {
    id: "myths",
    act: "see",
    title: "Myth or reality?",
    include: ONLY_120,
    component: SlideMyths,
    tone: "light",
    notes:
      "Read each myth and ask the room to vote myth or reality before clicking the card. It looks things up: no, it predicts unless we connect sources. It sounds sure, so it's right: confidence is not evidence. It remembers every claim: it only knows what is in front of it for this task, plus whatever memory we deliberately give it. More autonomy is always better: autonomy should match the risk of the task.",
  },
  {
    id: "where-going",
    act: "see",
    title: "Five things to watch",
    include: FROM_75,
    component: SlideWhereGoing,
    tone: "light",
    notes:
      "Five directions to watch. Longer tasks: agents can now work on multi-hour tasks without help (next slide in the 90 and 120 versions). Uses screens like people do: 'computer use' agents operate ordinary software through the screen, which can reach older systems without new integrations, and also raises new control questions. Reads scans, handwriting and voice: multimodal models read scanned forms, handwritten notes, images and phone calls, which matters for a paper-heavy claim file. Thinks before answering: reasoning models work through steps first, better on complex cases but slower and costlier. Cheaper and faster: cost per task keeps falling, and smaller models can run inside our own environment, which helps with privacy. None of these change who is accountable.",
  },
  {
    id: "time-horizon",
    act: "see",
    title: "Tasks it can finish keep getting longer",
    include: FROM_90,
    component: SlideTimeHorizon,
    tone: "light",
    notes:
      "Source: METR (an independent AI evaluation group), 'Time Horizon 1.1', 29 January 2026, metr.org/blog/2026-1-29-time-horizon-1-1. The measure: how long a task takes a skilled person, for tasks that an AI agent completes about half the time. Data (50% time horizon, TH1.1): GPT-4 (Mar 2023) 3.5 min; GPT-4 Nov 2023 3.6 min; Claude 3.7 Sonnet (Feb 2025) 60 min; o3 (Apr 2025) 121 min; Claude Opus 4 (May 2025) 101 min; GPT-5 (Aug 2025) 214 min; Claude Opus 4.5 (Nov 2025) 320 min, about 5 hours. METR estimates the long-run doubling time at about 7 months (196 days), and about 4 months (131 days) since 2023. Caveats to say out loud: these are software and research tasks, not claims work; 'half the time' is not good enough for decisions about people; and METR notes the measure depends on the tasks chosen. Release months are public release dates. Hover a dot for its value. The point for leaders: plan for capability that keeps growing, and build the oversight now.",
  },
  {
    id: "computer-agents",
    act: "see",
    title: "Agents now have their own computers",
    include: FROM_75,
    component: SlideComputerAgents,
    tone: "light",
    notes:
      "The newest wave, all launched in the last two months: agents that get their own computer in the cloud, stay on around the clock, sign in to websites and apps the way a person does (no special integration needed), remember how you work, and come back to you before sensitive steps. xAI's Grok Bot went into beta on 11 August 2026 for paid subscribers; a group of bots can coordinate and return to the user for decisions. Meta's Muse launched 8 September 2026: it runs on its own dedicated cloud computer, works through WhatsApp and a Mac app, checks with the person before sensitive actions like sending an email or making a purchase, and has a separate 'Sentinel' agent watching its actions plus a full audit trail. OpenAI announced Dots on 29 September 2026: always-on agents with their own cloud computer that you message through Slack or Teams, which can be given their own identities, credentials and tools, and which OpenAI says it is integrating with Microsoft's Agent 365 security controls. Point for WCB: these are consumer and business products today, so our workers, employers and staff will meet them before we formally adopt anything. Sources: about.fb.com/news/2026/09/introducing-muse-personal-ai-agent; infoq.com/news/2026/08/grok-bot-agent; techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar. Details were days old when this deck was built. VERIFY before the session.",
  },
  {
    id: "copilot-os",
    act: "see",
    title: "Copilot becomes the operating system of work",
    include: ALL,
    component: SlideCopilotOS,
    tone: "light",
    notes:
      "Today, an adjudicator is the integration layer: they open email, Teams, the claim system, Excel, the policy site, and stitch it together themselves. Microsoft's direction is that Copilot becomes the place you work from: you state an outcome ('get this claim ready for a decision'), and Copilot and its agents work across the apps, within permissions the organization sets. On 25 September 2026 Satya Nadella wrote: 'We're building Copilot as a new OS for work that spans every model, every form factor, and every task.' Microsoft is pairing this with governance: Agent 365 for controlling agents' permissions, auditing and oversight, and Copilot Cowork for handing off multi-step tasks. Because everyone at WCB already has Copilot, this is the most likely way agents arrive here: not as a separate project, but as a feature switch in tools we already own. That makes the governance decisions in Act 3 urgent. Sources: Windows Latest, 26 Sept 2026 (windowslatest.com/2026/09/26/...); Microsoft Build 2026 coverage (visualstudiomagazine.com/articles/2026/06/02/...). VERIFY product names and licensing with WCB IT before the session.",
  },
  {
    id: "agent-meets-agent",
    act: "see",
    title: "Their agent will call our agent",
    include: FROM_75,
    component: SlideAgentMeetsAgent,
    tone: "light",
    notes:
      "Futurism, but close: when personal agents like Muse can make calls, send messages and fill in forms, the worker may send their agent to report an injury or chase a claim status, and the employer may send theirs to file the employer report. WCB's agent will be talking to other agents. New questions: how do we know the agent is really acting for this worker? Is their consent on file, and for what? What can we share with an agent versus a person? How do we keep the worker's voice when a machine is speaking for them? And a person at WCB still decides. This is a scenario to plan for, not a current WCB capability.",
  },
  {
    id: "day-in-2028",
    act: "see",
    title: "A day in 2028",
    include: FROM_90,
    component: SlideDayIn2028,
    tone: "light",
    notes:
      "A scenario, not a plan: one adjudicator's day in 2028. Overnight, agents prepared files and flagged gaps. The adjudicator starts with decisions, not paperwork. Mid-morning, WCB's agent answers a worker's agent, with sources. After lunch, the adjudicator calls the worker: more time to listen, because the chasing is done. Mid-afternoon, a supervisor agent flags an unusual pattern for a person to look at. At the end of the day, the adjudicator signs decisions, and every step is recorded. Ask the room: what would have to be true for this day to be safe? What would you want to measure?",
  },
  {
    id: "what-shifts",
    act: "see",
    title: "What shifts for us",
    include: FROM_75,
    component: SlideWhatShifts,
    tone: "light",
    notes:
      "Four shifts for leaders. From opening apps to asking for outcomes: work starts with a goal, not a screen. From doing every step to supervising agents: the skill becomes setting goals, checking work and making the call. From staff accounts only to agent identities and permissions: every agent needs an identity, a manager, and only the access its job needs, like a new hire. From yearly reviews to always-on monitoring: agents act around the clock, so oversight has to as well. None of these shifts moves accountability away from people.",
  },
  {
    id: "what-stays",
    act: "see",
    title: "What doesn't change",
    include: FROM_75,
    component: SlideWhatStays,
    tone: "light",
    notes:
      "Whatever the technology does next, four things stay with people at WCB: judgment on decisions that affect a worker's life, empathy for someone who is hurt and worried, accountability for every decision (Alberta's Protection of Privacy Act, in force since June 11, 2025, includes duties when public bodies use automated systems with personal information), and the worker's voice, including the right to ask for a human review. Then ask: so where is our claim today?",
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
    include: FROM_75,
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
    include: FROM_90,
    component: Slide18Supervisor,
    tone: "light",
    notes:
      "A supervisor agent watches the other agents and catches the old doctor's note at Gather evidence, before it carries forward, and flags it to a person. Oversight that never sleeps, with a person still deciding. Hand off to the live demo here; keep this slide simple so the demo carries the detail.",
  },
  {
    id: "discussion",
    act: "discussion",
    title: "Open discussion",
    include: FROM_90,
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
