import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  CalendarClock,
  FileText,
  FolderOpen,
  Mail,
  MonitorSmartphone,
  PenLine,
  ScanText,
  Search,
  Stethoscope,
  Timer,
  Wallet,
  Zap,
} from "lucide-react";

// ---------- "It predicts the next word" ----------

// Illustrative only: a model scores every possible next word. These are made-up
// scores to show the idea, not output from a real model.
export const nextWord = {
  prompt: ["The", "worker", "hurt", "their"],
  candidates: [
    { word: "back", p: 0.41 },
    { word: "hand", p: 0.27 },
    { word: "knee", p: 0.14 },
    { word: "shoulder", p: 0.09 },
    { word: "wrist", p: 0.05 },
  ],
};

// ---------- "Give it the right sources" ----------

export const groundingSources = [
  { label: "Policy manual", icon: BookOpen },
  { label: "Claim file", icon: FolderOpen },
  { label: "Medical guideline", icon: Stethoscope },
];

// ---------- "Plan. Act. Check. Repeat." ----------

export type LoopStage = "plan" | "act" | "check" | "handover";

// One pass of an agent working the claim. The loop visual steps through these in order.
export const loopSteps: { stage: LoopStage; text: string }[] = [
  { stage: "plan", text: "Goal: file ready for a decision" },
  { stage: "act", text: "Search the claim file" },
  { stage: "check", text: "Doctor's note missing" },
  { stage: "plan", text: "Ask the clinic for it" },
  { stage: "act", text: "Draft a request to the clinic" },
  { stage: "check", text: "Sending needs approval" },
  { stage: "handover", text: "Hand to the adjudicator" },
];

// ---------- "Tools are its hands" ----------

export type Permission = "read" | "draft" | "act";

export const tools: { label: string; icon: LucideIcon; permission: Permission }[] = [
  { label: "Claim file", icon: FolderOpen, permission: "read" },
  { label: "Policy manual", icon: BookOpen, permission: "read" },
  { label: "Search", icon: Search, permission: "read" },
  { label: "Summary", icon: FileText, permission: "draft" },
  { label: "Letter to worker", icon: PenLine, permission: "draft" },
  { label: "Send email", icon: Mail, permission: "act" },
  { label: "Book appointment", icon: CalendarClock, permission: "act" },
  { label: "Schedule payment", icon: Wallet, permission: "act" },
];

export const permissionLabels: Record<Permission, string> = {
  read: "Read",
  draft: "Draft",
  act: "Act",
};

// ---------- "How much should it do alone?" ----------

export const autonomyLevels = [
  { label: "Suggests", example: "Flags a missing doctor's note", oversight: "A person decides what to do" },
  { label: "Drafts", example: "Drafts a letter to the worker", oversight: "A person edits and sends" },
  { label: "Acts with approval", example: "Requests records from a clinic", oversight: "A person approves each action" },
  { label: "Acts, then reports", example: "Updates a mailing address", oversight: "Every step recorded, spot checks" },
  { label: "Acts alone", example: "Routes mail to the right team", oversight: "Tight rules, monitoring, audit" },
];

// ---------- "Agents work in teams" ----------

export const teamAgents = ["Intake", "Evidence", "Medical", "Policy"];

// ---------- "Test before you trust" ----------

// What an evaluation scores. "needs work" shows that testing finds gaps; it is illustrative.
export const evalChecks: { label: string; status: "pass" | "work" }[] = [
  { label: "Right answer", status: "pass" },
  { label: "Shows its sources", status: "pass" },
  { label: "Fair across groups", status: "pass" },
  { label: "Protects privacy", status: "pass" },
  { label: "Knows when to ask a person", status: "work" },
];

// ---------- "Myth or reality?" (120-minute version) ----------

export const myths = [
  { myth: "It looks things up", reality: "It predicts, unless we give it sources" },
  { myth: "It sounds sure, so it's right", reality: "Confidence is not evidence" },
  { myth: "It remembers every claim", reality: "It knows what we give it, each time" },
  { myth: "More autonomy is always better", reality: "Match autonomy to the risk" },
];

// ---------- "Where it's going" ----------

export const signposts: { label: string; icon: LucideIcon }[] = [
  { label: "Longer tasks", icon: Timer },
  { label: "Uses screens like people do", icon: MonitorSmartphone },
  { label: "Reads scans, handwriting, voice", icon: ScanText },
  { label: "Thinks before answering", icon: Brain },
  { label: "Cheaper and faster", icon: Zap },
];

// ---------- "Tasks it can finish keep getting longer" ----------

// Source: METR, "Time Horizon 1.1" (29 January 2026), https://metr.org/blog/2026-1-29-time-horizon-1-1/
// 50% time horizon: the length of task (measured by how long it takes a skilled person)
// that an AI agent completes about half the time. Software and research tasks only.
// Release dates are the models' public release months.
export const timeHorizon = {
  source: "METR, Time Horizon 1.1, January 2026",
  points: [
    { model: "GPT-4", date: "2023-03", minutes: 3.5 },
    { model: "GPT-4 (Nov)", date: "2023-11", minutes: 3.6 },
    { model: "Claude 3.7 Sonnet", date: "2025-02", minutes: 60 },
    { model: "o3", date: "2025-04", minutes: 121 },
    { model: "Claude Opus 4", date: "2025-05", minutes: 101 },
    { model: "GPT-5", date: "2025-08", minutes: 214 },
    { model: "Claude Opus 4.5", date: "2025-11", minutes: 320 },
  ],
};
