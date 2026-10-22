import type { LucideIcon } from "lucide-react";
import { Database, Gauge, ListChecks, MousePointerClick, ScrollText, Target, Wrench } from "lucide-react";
import type { StationId } from "./journey";

// Content for the "Design an agent" table exercise and the recap. Edit freely.

// ---------- The tasks tables can pick: one agent per step of the claims journey ----------
// Tables are dragged onto a task on the slide's "Assign" view.

export interface DesignAgent {
  id: string;
  name: string;
  /** Short label. */
  short: string;
  /** Where it sits on the claims journey (share-back view). */
  station: StationId;
  /** One sentence on the task card, so tables start from the same place. */
  job: string;
}

export const designAgents: DesignAgent[] = [
  { id: "intake", name: "Intake agent", short: "Intake", station: "register", job: "Opens each new claim and checks the worker's and employer's details are complete." },
  { id: "sorting", name: "Sorting agent", short: "Sorting", station: "sort", job: "Routes each claim to the right team and adjudicator on the day it arrives." },
  { id: "evidence", name: "Evidence agent", short: "Evidence", station: "evidence", job: "Requests the doctor's notes and employer records, and chases what's late." },
  { id: "medical", name: "Medical summary agent", short: "Medical", station: "medical", job: "Turns a thick medical file into a one-page summary with sources." },
  { id: "decision", name: "Decision support agent", short: "Decision", station: "entitlement", job: "Checks the claim against policy and recommends; a person decides." },
  { id: "letters", name: "Letters agent", short: "Letters", station: "entitlement", job: "Drafts clear, kind letters to the worker and employer for a person to send." },
  { id: "payment", name: "Payment agent", short: "Payment", station: "benefits", job: "Calculates benefits from earnings and lines up payments for approval." },
  { id: "rtw", name: "Return-to-work agent", short: "Return to work", station: "close", job: "Plans a safe return to work with the worker, employer and doctor." },
];

/** Default table assignments (agent id, or null for a table not yet on a task). Changed live on the slide. */
export const defaultTables: (string | null)[] = ["intake", "evidence", "medical", "decision", "letters", "payment"];
export const MIN_TABLES = 2;
export const MAX_TABLES = designAgents.length;

// ---------- The worksheet (from "What makes an agent") ----------

export const worksheetRows: { element: string; question: string; icon: LucideIcon }[] = [
  { element: "Goal", question: "What is this agent for?", icon: Target },
  { element: "Instructions", question: "How should it behave?", icon: ScrollText },
  { element: "Memory", question: "What should it know about the claim?", icon: Database },
  { element: "Tools", question: "What can it use?", icon: Wrench },
];

/** Optional fifth row (switch it on from the slide). */
export const autonomyRow = {
  element: "Autonomy",
  question: "Read, draft or act? When does a person approve?",
  icon: Gauge,
};

/** A worked example the facilitator can show. Uses an agent no table gets by default. */
export const workedExample: { agent: string; rows: Record<string, string[]> } = {
  agent: "Sorting agent",
  rows: {
    Goal: ["Route every new claim to the right team and adjudicator the day it arrives, so no claim waits in a queue"],
    Instructions: [
      "Follow the routing rules for injury type and region",
      "Spread work fairly across adjudicators",
      "If a claim is complex or unclear, send it to a person and say why",
      "Never change claim details",
    ],
    Memory: ["Injury type, body part and severity", "Employer, industry and region", "Today's team workloads and who is away", "Any earlier claims for this worker"],
    Tools: ["Read: the claim file and the routing rules", "Act: assign the claim in the claim system", "Draft: a note to the team lead when it's unsure"],
    Autonomy: ["Acts alone on clear claims, every step recorded", "Hands to a person: complex, disputed or psychological claims", "Each week a team lead reviews a sample of its routing"],
  },
};

/** Ingredients: ready-made pieces tables can pull from for each row. tag shows read, draft or act. */
export const ingredients: Record<string, { text: string; tag?: "read" | "draft" | "act" }[]> = {
  Goal: [
    { text: "Get the claim ready for a decision" },
    { text: "Route every claim the same day" },
    { text: "Find what's missing, early" },
    { text: "Keep the worker informed" },
    { text: "A safe, early return to work" },
  ],
  Instructions: [
    { text: "Use plain, kind language" },
    { text: "Never guess: ask a person" },
    { text: "Cite the policy it used" },
    { text: "Flag anything unusual" },
    { text: "Never change claim details" },
    { text: "Stop if facts conflict" },
  ],
  Memory: [
    { text: "Injury report" },
    { text: "Employer report" },
    { text: "Doctor's notes" },
    { text: "Earnings and pay stubs" },
    { text: "Calls and emails so far" },
    { text: "Earlier claims" },
  ],
  Tools: [
    { text: "Claim file", tag: "read" },
    { text: "Policy search", tag: "read" },
    { text: "Letter to the worker", tag: "draft" },
    { text: "Email a clinic", tag: "act" },
    { text: "Assign the claim", tag: "act" },
    { text: "Schedule a payment", tag: "act" },
  ],
  Autonomy: [
    { text: "Suggests" },
    { text: "Drafts for a person" },
    { text: "Acts with approval" },
    { text: "Acts, then reports" },
    { text: "Acts alone" },
    { text: "Letters, payments: a person approves" },
  ],
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
