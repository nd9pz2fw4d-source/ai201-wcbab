import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  Bot,
  Brain,
  Cpu,
  Eye,
  FlaskConical,
  Gauge,
  Gavel,
  Handshake,
  HeartHandshake,
  HeartPulse,
  Hourglass,
  House,
  KeyRound,
  ListChecks,
  MessageCircleWarning,
  Repeat,
  Scale,
  ServerCog,
  ShieldCheck,
  Truck,
  Umbrella,
  Workflow,
} from "lucide-react";

// On-screen words for the pre-read. Deloitte figures and wording come from:
//   Deloitte Canada, "The Future of Workers' Compensation: Industry Perspectives and Global Signals"
//   (Zohair Masood, Jason Condon, Chris Duvinage; 26 August 2026). A survey of Canadian WCB leaders,
//   plus expert interviews in the United States, Australia and New Zealand.
//   https://www.deloitte.com/ca/en/Industries/insurance/perspectives/future-workers-compensation.html
// Key terms match the session deck (src/slides/index.ts and src/data/teaching.ts in the repo root).

export const session = {
  programme: "Executive AI Academy",
  title: "Follow the claim",
  date: "[SESSION DATE]", // VERIFY: set before sending
};

export const deloitteSource = "Source: Deloitte, The Future of Workers' Compensation (August 2026)";

export const surveyReach = [
  { where: "Canada", how: "WCB leaders surveyed" },
  { where: "U.S. · Australia · New Zealand", how: "experts interviewed" },
];

/** Deloitte's eight forces, in the order the verse sings them (two per line). */
export const forces: { title: string; detail: string; icon: LucideIcon }[] = [
  { title: "Whole-person recovery", detail: "Half of leaders rank mental health support the #1 barrier", icon: HeartPulse },
  { title: "An ageing workforce", detail: "55+ heading to 23.1% of the labour force by 2041", icon: Hourglass },
  { title: "A widening protection gap", detail: "Gig and platform work stretch coverage", icon: Umbrella },
  { title: "Evolving lifestyles", detail: "17.4% still worked from home in May 2025", icon: House },
  { title: "The future of work", detail: "Delivery, micromobility, automation: new risks", icon: Truck },
  { title: "AI and technology", detail: "Spot risks and step in before injuries happen", icon: Cpu },
  { title: "Modernization", detail: "Core systems: where leaders feel least prepared", icon: ServerCog },
  { title: "Legislative agility", detail: "Mental health, gig work, long COVID test old rules", icon: Gavel },
];

/** Deloitte's four shifts driving the future of workers' compensation. */
export const shifts: { name: string; detail: string; icon: LucideIcon }[] = [
  { name: "Product & pricing", detail: "Premium stability and risk-based pricing", icon: Scale },
  { name: "Customer engagement", detail: "Proactive, personal, recovery first", icon: HeartHandshake },
  { name: "Operations", detail: "Prevention, services and claims in one intelligence-driven model", icon: Workflow },
  { name: "Strategic partnerships", detail: "Health, rehab and community, aligned on recovery", icon: Handshake },
];

export const shiftStats: { value: string; label: string }[] = [
  { value: "83%", label: "say their AI maturity in core business is still low" },
  { value: "1", label: "leader called their board an early adopter" },
  { value: "1 in 2", label: "rank mental health support the #1 barrier" },
];

/** Deloitte's first readiness question, quoted. */
export const readinessQuestion =
  "Is AI embedded in the fabric of your business model, or do you still see it as a standalone capability?";

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
