import { ChartColumn, FileText, MessageCircle, Network } from "lucide-react";
import type { Era } from "./ClaimJourney";
import { theme } from "../theme";

export const eraNames: Record<Era, string> = {
  1: "The paper years",
  2: "AI that predicts",
  3: "AI that reads and writes",
  4: "AI that does the work",
  5: "Connected work",
};

/** A small picture for each era: paper, charts, chat, agents, network. */
export function EraIcon({ era, size = 64 }: { era: Era; size?: number }) {
  const s = size;
  if (era === 4) {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64">
        <path d="M10 44 Q32 8 54 44" fill="none" stroke={theme.agent} strokeWidth={3} strokeDasharray="4 5" />
        <circle cx={10} cy={44} r={7} fill={theme.agent} />
        <circle cx={32} cy={20} r={7} fill={theme.agent} />
        <circle cx={54} cy={44} r={7} fill={theme.agent} />
        <circle cx={32} cy={52} r={7} fill={theme.human} />
      </svg>
    );
  }
  const Icon = era === 1 ? FileText : era === 2 ? ChartColumn : era === 3 ? MessageCircle : Network;
  const color = era === 1 ? theme.human : era === 2 ? theme.brandSecondary : theme.agent;
  return <Icon width={s} height={s} color={color} strokeWidth={1.8} />;
}

/** Consistent era label: number and name. */
export function EraBadge({ era, tone = "light" }: { era: Era; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div
      className="inline-flex items-center gap-4 rounded-full py-2 pl-2 pr-7"
      style={{ background: dark ? "rgba(255,255,255,0.1)" : "#fff", boxShadow: dark ? undefined : "0 1px 0 #C9DDEA" }}
    >
      <span
        className="grid h-14 w-14 place-items-center rounded-full text-[28px] font-bold"
        style={{ background: theme.brandPrimary, color: theme.brandAccent }}
      >
        {era}
      </span>
      <span className="text-[26px] font-medium" style={{ color: dark ? "#fff" : theme.brandPrimary }}>
        Era {era} · {eraNames[era]}
      </span>
    </div>
  );
}
