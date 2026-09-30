import type { StationId } from "./journey";

export type SortColumn = "automate" | "assist" | "human";

export const sortColumns: { id: SortColumn; label: string }[] = [
  { id: "automate", label: "Automate" },
  { id: "assist", label: "Assist" },
  { id: "human", label: "Keep human-led" },
];

// A suggested layout for comparison, not "the correct answer". Edit freely.
export const suggestedSort: Record<StationId, SortColumn> = {
  report: "assist",
  register: "automate",
  sort: "assist",
  evidence: "assist",
  medical: "assist",
  entitlement: "human",
  benefits: "assist",
  close: "human",
};
