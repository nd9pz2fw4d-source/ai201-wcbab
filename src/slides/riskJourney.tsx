import type { Role } from "../components/ClaimJourney";
import type { StationId } from "../data/journey";

// The era 4 set-up shared by the "went wrong" slides.
export const riskRoles: Partial<Record<StationId, Role>> = {
  report: "assist",
  register: "automate",
  sort: "assist",
  evidence: "assist",
  medical: "assist",
  entitlement: "human",
  benefits: "assist",
  close: "human",
};

export const riskAgents = [
  { from: 0, to: 2, duration: 1.2 },
  { from: 2, to: 3, duration: 1.0, delay: 0.3 },
  { from: 3, to: 4, duration: 1.0, delay: 0.6 },
  { from: 4, to: 5, duration: 1.0, delay: 0.9 },
];
