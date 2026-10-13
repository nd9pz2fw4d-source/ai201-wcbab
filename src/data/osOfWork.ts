// Content for the "Copilot as the operating system of work" slides. Edit freely.

// "Give it a goal": what each agent does when the presenter runs a goal.
export const goalSteps = [
  { app: "Email", step: "Gathers the messages" },
  { app: "Teams", step: "Asks the right colleague" },
  { app: "Claim system", step: "Updates the file" },
  { app: "Excel", step: "Checks the numbers" },
  { app: "Policy site", step: "Finds the rule, with source" },
];

export const goalExamples = [
  "Get this claim ready for a decision",
  "Book a return-to-work meeting",
  "Find every claim waiting on a doctor's note",
];

// "How we must adapt": click each row to turn "from" into "to".
export const adaptations = [
  { area: "Where work starts", from: "Opening an app", to: "Stating an outcome" },
  { area: "Jobs", from: "Doing the steps", to: "Directing, checking, deciding" },
  { area: "The org chart", from: "People only", to: "People plus agents, each with an owner" },
  { area: "Access", from: "Staff accounts", to: "Agent identities, least privilege" },
  { area: "Knowledge", from: "In heads and shared drives", to: "Current, permissioned sources agents cite" },
  { area: "Oversight", from: "Periodic review", to: "Continuous monitoring of agent actions" },
];

// "Build your agent team".
export type Access = "read" | "draft" | "act";
export const teamCandidates = [
  { id: "intake", name: "Intake agent", acts: "Opens and checks new claims", sensitive: false },
  { id: "evidence", name: "Evidence agent", acts: "Requests records from clinics", sensitive: false },
  { id: "medical", name: "Medical agent", acts: "Summarizes medical files", sensitive: true },
  { id: "letters", name: "Letters agent", acts: "Writes to the worker", sensitive: true },
  { id: "payment", name: "Payment agent", acts: "Schedules payments", sensitive: true },
] as const;

// "How ready are we?": six foundations, scored 1 to 5 by the room.
export const readinessDimensions = [
  { id: "data", label: "Clean, connected data", short: "Data" },
  { id: "rules", label: "Rules written down", short: "Rules" },
  { id: "identity", label: "Agent identities and access", short: "Agent identities" },
  { id: "skills", label: "Skills to direct agents", short: "Skills" },
  { id: "owners", label: "Journey owners", short: "Journey owners" },
  { id: "monitoring", label: "Monitoring and audit", short: "Monitoring" },
];

// "The cost of waiting": illustrative only. Capability compounds (METR: task length doubling
// about every 4 to 7 months); readiness (data, rules, identities, skills) takes years to build.
// READINESS_YEARS is an assumption for illustration. VERIFY or adjust with WCB's own plans.
export const READINESS_YEARS = 2.5;
