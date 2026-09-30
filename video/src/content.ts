import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  Bot,
  Brain,
  ClipboardList,
  Eye,
  FlaskConical,
  Gauge,
  HandHelping,
  KeyRound,
  ListChecks,
  MessageCircleWarning,
  Repeat,
  ShieldCheck,
  ShieldPlus,
  Shuffle,
  Users,
} from "lucide-react";

// On-screen words for the pre-read. Figures come from:
//   Deloitte Canada, "The future of workers' compensation: How workers' compensation
//   organizations are improving return-to-work outcomes" (2020), survey of 18 WCOs.
//   https://www.deloitte.com/ca/en/Industries/insurance/research/the-future-of-workers-compensation.html
// Key terms match the session deck (src/slides/index.ts and src/data/teaching.ts in the repo root).

export const session = {
  programme: "Executive AI Academy",
  title: "Follow the claim",
  date: "[SESSION DATE]", // VERIFY: set before sending
};

export const deloitteSource = "Source: Deloitte, The future of workers' compensation (2020), survey of 18 WCOs";

export const surveyCountries = [
  { name: "Canada", count: 7 },
  { name: "Australia", count: 8 },
  { name: "United States", count: 3 },
];

export const pressures: { title: string; detail: string }[] = [
  { title: "Rising expectations", detail: "Service as fast and digital as the apps on their phone" },
  { title: "Work is changing", detail: "Gig roles and more small and medium-sized employers" },
  { title: "Harder injuries", detail: "More complex claims, including mental health" },
  { title: "A shifting world", detail: "Ageing workforce, economic risk, new laws" },
];

export const levers: { name: string; detail: string; icon: LucideIcon }[] = [
  { name: "Risk-based segmentation", detail: "Triage by the risk of not getting back to work, not just the injury", icon: Shuffle },
  { name: "Standardized plans", detail: "Proven recovery and return-to-work blueprints", icon: ClipboardList },
  { name: "Teams matched to the case", detail: "Generalists for simple cases, specialists for complex ones", icon: Users },
  { name: "Focus on prevention", detail: "Stop injuries before they happen, with employers", icon: ShieldPlus },
  { name: "Behavioural economics", detail: "Nudges: reminders, goals, recovery-first language", icon: HandHelping },
];

export const leverStats: { value: string; label: string }[] = [
  { value: "70–80%", label: "of claims are simple; 55–65% could be fully automated" },
  { value: "83%", label: "build a bespoke plan for every case today" },
  { value: "27%", label: "faster back to full health with nudges (Allianz / NSW study)" },
];

export const acts: { n: number; name: string; detail: string; icon: LucideIcon }[] = [
  { n: 1, name: "See it", detail: "What AI can do now, how it works, where it's going", icon: Eye },
  { n: 2, name: "Choose it", detail: "Where AI should help on the claim, and where it shouldn't", icon: ListChecks },
  { n: 3, name: "Govern it", detail: "When it goes wrong: how we catch it, who owns it", icon: ShieldCheck },
];

export interface Term {
  term: string;
  short: string;
  meaning: string;
  example: string;
  icon: LucideIcon;
  /** Comic beat: the card shakes. */
  wobble?: boolean;
}

// One card per two sung lines (4 seconds each), in the order of verse 3.
export const terms: Term[] = [
  { term: "LLM", short: "LLM", meaning: "Large language model: predicts the next word, again and again", example: "The worker hurt their … back? hand? knee?", icon: Brain },
  {
    term: "Hallucination",
    short: "Hallucination",
    meaning: "A fluent answer that is confident, but wrong",
    example: "Fluent is not the same as verified",
    icon: MessageCircleWarning,
    wobble: true,
  },
  { term: "Grounding (RAG)", short: "Grounding", meaning: "Answers from trusted sources, and shows you where", example: "“Clinic report, page 2”", icon: BookOpenCheck },
  { term: "Agent", short: "Agent", meaning: "Pursues a goal with tools, memory and instructions. A person decides", example: "A chatbot answers. An agent does.", icon: Bot },
  { term: "The agent loop", short: "Agent loop", meaning: "Plan. Act. Check. Repeat.", example: "Stops when done, unsure, or approval is needed", icon: Repeat },
  { term: "Least privilege", short: "Least privilege", meaning: "Read, draft, act: only the access the job needs", example: "“Act” needs the strongest controls", icon: KeyRound },
  { term: "Autonomy dial", short: "Autonomy dial", meaning: "How much it does alone is a setting we choose", example: "More autonomy, more oversight", icon: Gauge },
  { term: "Evals + human in the loop", short: "Evals", meaning: "Test before you trust. A person decides.", example: "Right answer, sources shown, fair, private", icon: FlaskConical },
];

export const bingoFree = "Follow the claim";
