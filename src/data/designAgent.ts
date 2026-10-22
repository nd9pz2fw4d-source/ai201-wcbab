import type { LucideIcon } from "lucide-react";
import { Database, Gauge, ListChecks, MousePointerClick, ScrollText, Target, Wrench } from "lucide-react";
import type { StationId } from "./journey";

// Content for the "Design an agent" table exercise, its handout, the recap and the quiz. Edit freely.

// ---------- The agents tables can design: one per step of the claims journey ----------

export interface DesignAgent {
  id: string;
  name: string;
  /** For the tables strip. */
  short: string;
  /** Where it sits on the claims journey (share-back view). */
  station: StationId;
  /** One line on the handout: the job, so tables start from the same place. */
  job: string;
}

export const designAgents: DesignAgent[] = [
  { id: "intake", name: "Intake agent", short: "Intake", station: "register", job: "Opens new claims and checks the details are complete" },
  { id: "sorting", name: "Sorting agent", short: "Sorting", station: "sort", job: "Routes each claim to the right team and adjudicator" },
  { id: "evidence", name: "Evidence agent", short: "Evidence", station: "evidence", job: "Requests and chases records from clinics and employers" },
  { id: "medical", name: "Medical summary agent", short: "Medical", station: "medical", job: "Summarizes medical files for the adjudicator" },
  { id: "decision", name: "Decision support agent", short: "Decision", station: "entitlement", job: "Checks the policy and recommends; a person decides" },
  { id: "letters", name: "Letters agent", short: "Letters", station: "entitlement", job: "Writes clear letters to the worker and employer" },
  { id: "payment", name: "Payment agent", short: "Payment", station: "benefits", job: "Calculates benefits and schedules payments" },
  { id: "rtw", name: "Return-to-work agent", short: "Return to work", station: "close", job: "Plans the return to work with the worker and employer" },
];

/** Default table assignments, by agent id. The presenter changes the count and each table live. */
export const defaultTables = ["intake", "evidence", "medical", "decision", "letters", "payment"];
export const MIN_TABLES = 2;
export const MAX_TABLES = designAgents.length;

// ---------- The worksheet (from "What makes an agent") ----------

export const worksheetRows: { element: string; question: string; icon: LucideIcon }[] = [
  { element: "Goal", question: "What is this agent for?", icon: Target },
  { element: "Instructions", question: "How should it behave?", icon: ScrollText },
  { element: "Memory", question: "What should it know about the claim?", icon: Database },
  { element: "Tools", question: "What can it use?", icon: Wrench },
];

/** Optional fifth row (switch it on from the slide; always on the handout, marked optional). */
export const autonomyRow = {
  element: "Autonomy",
  question: "Read, draft or act? When does a person approve?",
  icon: Gauge,
};

/** A worked example the facilitator can show. Uses an agent no table gets by default. */
export const workedExample = {
  agent: "Sorting agent",
  rows: {
    Goal: "Every new claim reaches the right team the same day",
    Instructions: "Use the routing rules. If unsure, send it to a person; never guess",
    Memory: "Injury type, employer, region, today's team workloads",
    Tools: "Read the claim; assign it in the claim system",
    Autonomy: "Acts alone, every step recorded; a person reviews anything it flags",
  } as Record<string, string>,
};

// ---------- Good instructions, a light touch (not a prompt-writing workshop) ----------

export const threeRights: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "The right instructions", text: "Say what good looks like, the rules, and the tone", icon: ScrollText },
  { title: "The right actions", text: "Name what it may do on its own, and what it may not", icon: MousePointerClick },
  { title: "The right checks", text: "When it stops and asks a person, and how we test it", icon: ListChecks },
];

// ---------- "What to remember" (recap) ----------

export const recap = {
  what: { title: "What an agent is", text: "A model with a goal, instructions, memory and tools" },
  how: { title: "How it works", text: "Plan, act, check, repeat. It hands to a person when the call is ours" },
  trust: { title: "How we trust it", text: "Test on real cases before it goes live. Keep watching after" },
};

// ---------- Quick quiz (optional) ----------

export const quiz: { q: string; options: string[]; answer: number; why: string }[] = [
  {
    q: "What turns a model into an agent?",
    options: ["A bigger, smarter model", "A goal, instructions, memory and tools", "A chat window"],
    answer: 1,
    why: "The model reasons. The rest lets it work on our claim.",
  },
  {
    q: "An agent works in a loop: plan, act, ... ?",
    options: ["Send", "Check", "Stop"],
    answer: 1,
    why: "Plan, act, check, repeat. Checking is where it catches its own gaps.",
  },
  {
    q: "On our claim, which needs a person to approve?",
    options: ["Requesting records from a clinic", "Summarizing a medical file", "Sending the worker a decision letter"],
    answer: 2,
    why: "Anything that reaches the worker or moves money.",
  },
  {
    q: "What is an eval?",
    options: ["A one-time demo", "Testing on real cases before we trust it, and watching after", "The vendor's accuracy claim"],
    answer: 1,
    why: "Test before you trust, then keep watching.",
  },
];
