import type { LucideIcon } from "lucide-react";
import { Database, Eye, Gauge, Gem, Route, ShieldCheck, Shuffle, UserCheck, Users } from "lucide-react";

// ---------- Learning objectives, one per act ----------

export const objectives: { act: string; icon: LucideIcon; text: string }[] = [
  { act: "See it", icon: Eye, text: "Where AI creates value, and how transformation happens" },
  { act: "Choose it", icon: Route, text: "Tell AI opportunity types apart, and weigh them" },
  { act: "Govern it", icon: ShieldCheck, text: "Your accountabilities for driving adoption" },
];

// ---------- Four kinds of AI opportunity (a ladder) ----------

export const opportunityTypes = [
  { name: "Personal productivity", example: "Copilot drafts a letter", owner: "Each of us", executive: false },
  { name: "Team workflow", example: "Medical files summarized for adjudicators", owner: "Managers", executive: false },
  { name: "End-to-end journey", example: "The claim journey redesigned with agents and people", owner: "Executives", executive: true },
  { name: "New services", example: "Early help before a claim goes long", owner: "Executive team", executive: true },
];

// "Where do our five sit?": a suggested type (index into opportunityTypes) for each priority
// opportunity, by label. A suggestion for discussion, not an assessment. Edit freely.
export const suggestedOpportunityType: Record<string, number> = {
  "Real-time help for contact centre staff": 1,
  "Service forecasting": 1,
  "Medical file assessment support": 1,
  "Claims audit review": 1,
  "Appeals review support": 1,
};

// ---------- Four questions for any opportunity ----------

export const evaluationQuestions: { word: string; icon: LucideIcon; question: string }[] = [
  { word: "Valuable", icon: Gem, question: "Does it help workers, employers or WCB in a way we can measure?" },
  { word: "Feasible", icon: Database, question: "Is the data there, and is the technology proven?" },
  { word: "Safe", icon: ShieldCheck, question: "If it is wrong, who is affected, and who checks?" },
  { word: "Ready", icon: Users, question: "Are our people and processes ready to change?" },
];

// ---------- What only executives can do ----------

export const execAccountabilities: { icon: LucideIcon; text: string }[] = [
  { icon: Route, text: "Pick journeys, not tools" },
  { icon: UserCheck, text: "Name one accountable owner" },
  { icon: Shuffle, text: "Redesign the work, not just add AI" },
  { icon: Users, text: "Bring your people with you" },
  { icon: Database, text: "Fund the foundations: data, platforms, security" },
  { icon: Gauge, text: "Measure outcomes, keep the guardrails" },
];

// ---------- The electricity lesson ----------

// Source: Paul A. David, "The Dynamo and the Computer: An Historical Perspective on the
// Modern Productivity Paradox", American Economic Review 80(2), May 1990, pp. 355-361.
// Electric power reached factories from the 1880s; the large productivity gains came in the
// 1920s, once factories were redesigned around electric motors rather than old line-shaft layouts.
export const dynamo = {
  source: "Paul A. David, The Dynamo and the Computer, American Economic Review, 1990",
  stages: [
    { when: "Before", label: "One steam engine drives every machine", result: "" },
    { when: "1880s to 1910s", label: "Electric motor bolted onto the old layout", result: "Little gain" },
    { when: "1920s", label: "Factory redesigned around many small motors", result: "Big gain" },
  ],
};
