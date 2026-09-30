import type { LucideIcon } from "lucide-react";
import {
  ClipboardPen,
  ClipboardCheck,
  Shuffle,
  FolderSearch,
  Stethoscope,
  Scale,
  Wallet,
  FolderCheck,
} from "lucide-react";

export type StationId =
  | "report"
  | "register"
  | "sort"
  | "evidence"
  | "medical"
  | "entitlement"
  | "benefits"
  | "close";

export interface Station {
  id: StationId;
  name: string;
  /** Label broken into lines for the journey graphic. */
  lines: [string] | [string, string];
  icon: LucideIcon;
}

// The eight stations of the claims journey, in order.
export const stations: Station[] = [
  { id: "report", name: "Report the injury", lines: ["Report the", "injury"], icon: ClipboardPen },
  { id: "register", name: "Register and check details", lines: ["Register and", "check details"], icon: ClipboardCheck },
  { id: "sort", name: "Sort and assign", lines: ["Sort and", "assign"], icon: Shuffle },
  { id: "evidence", name: "Gather evidence", lines: ["Gather", "evidence"], icon: FolderSearch },
  { id: "medical", name: "Medical review", lines: ["Medical", "review"], icon: Stethoscope },
  { id: "entitlement", name: "Entitlement decision", lines: ["Entitlement", "decision"], icon: Scale },
  { id: "benefits", name: "Benefits and payment", lines: ["Benefits and", "payment"], icon: Wallet },
  { id: "close", name: "Close or appeal", lines: ["Close or", "appeal"], icon: FolderCheck },
];

export const stationIndex = (id: StationId) => stations.findIndex((s) => s.id === id);
