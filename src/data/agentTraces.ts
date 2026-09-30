import type { StationId } from "./journey";

export type TraceActor = "agent" | "person";

export interface TraceStep {
  time: string;
  actor: TraceActor;
  who: string;
  text: string;
  station: StationId;
  /** Slide 10: a natural place for a person to step in (notes only, never shown as "the answer"). */
  stepInHint?: boolean;
  /** Slides 16 and 17: which risk this step carries. */
  risk?: RiskId;
  /** Slide 16: the faulty step, hidden until the reveal. */
  faulty?: boolean;
}

export type RiskId = "carried" | "drift" | "rebuild" | "privacy";

export const riskLabels: Record<RiskId, string> = {
  carried: "Error that carried forward",
  drift: "Drifted from the goal",
  rebuild: "Can't rebuild the decision",
  privacy: "Worker information shared too widely",
};

export const riskOrder: RiskId[] = ["carried", "drift", "rebuild", "privacy"];

// Slide 10: an agent works a sample claim, one step at a time.
export const liveTrace: TraceStep[] = [
  { time: "09:02", actor: "agent", who: "Intake agent", text: "Opened claim", station: "report" },
  { time: "09:02", actor: "agent", who: "Intake agent", text: "Checked worker and employer details", station: "register" },
  { time: "09:03", actor: "agent", who: "Evidence agent", text: "Pulled employer report", station: "evidence" },
  { time: "09:03", actor: "agent", who: "Evidence agent", text: "Found missing doctor's note", station: "evidence" },
  { time: "09:04", actor: "agent", who: "Evidence agent", text: "Drafted request to clinic", station: "evidence" },
  { time: "09:04", actor: "agent", who: "Evidence agent", text: "Sent request to clinic", station: "evidence", stepInHint: true },
  { time: "11:40", actor: "agent", who: "Medical agent", text: "Summarized doctor's note", station: "medical" },
  { time: "11:41", actor: "agent", who: "Policy agent", text: "Checked claim against policy", station: "entitlement" },
  { time: "11:41", actor: "agent", who: "Policy agent", text: "Recommended: accept claim", station: "entitlement", stepInHint: true },
  { time: "11:42", actor: "agent", who: "Payment agent", text: "Scheduled first payment", station: "benefits", stepInHint: true },
  { time: "11:42", actor: "agent", who: "Intake agent", text: "Emailed worker a decision letter", station: "benefits", stepInHint: true },
];

// Slides 16 to 18: the claim that went wrong.
export const riskTrace: TraceStep[] = [
  { time: "10:14", actor: "agent", who: "Intake agent", text: "Opened claim", station: "report" },
  { time: "10:14", actor: "agent", who: "Evidence agent", text: "Pulled two doctor's notes", station: "evidence" },
  { time: "10:15", actor: "agent", who: "Evidence agent", text: "Used the old note as current", station: "evidence", risk: "carried", faulty: true },
  { time: "10:15", actor: "agent", who: "Medical agent", text: "Summary: injury is healed", station: "medical", risk: "carried" },
  { time: "10:16", actor: "agent", who: "Medical agent", text: "Sent medical file to employer", station: "medical", risk: "privacy" },
  { time: "10:16", actor: "agent", who: "Policy agent", text: "Aimed for fastest closure", station: "entitlement", risk: "drift" },
  { time: "10:17", actor: "agent", who: "Policy agent", text: "Reasons not saved", station: "entitlement", risk: "rebuild" },
  { time: "10:17", actor: "agent", who: "Policy agent", text: "Recommended: end benefits", station: "entitlement" },
];
