import type { LucideIcon } from "lucide-react";
import { Headset, TrendingUp, Stethoscope, SearchCheck, Gavel } from "lucide-react";
import type { StationId } from "./journey";

export interface Opportunity {
  label: string;
  station: StationId;
  icon: LucideIcon;
}

// The five priority opportunities. Names and station placement are editable.
// VERIFY final names with the WCB team before the session.
export const opportunities: Opportunity[] = [
  { label: "Real-time help for contact centre staff", station: "report", icon: Headset },
  { label: "Service forecasting", station: "sort", icon: TrendingUp },
  { label: "Medical file assessment support", station: "medical", icon: Stethoscope },
  { label: "Claims audit review", station: "benefits", icon: SearchCheck },
  { label: "Appeals review support", station: "close", icon: Gavel },
];
