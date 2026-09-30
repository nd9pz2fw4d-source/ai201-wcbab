import type { ReactNode } from "react";
import { CalendarDays, CircleHelp } from "lucide-react";
import { fadeUp, popIn, useIn } from "../anim";
import { DeloitteLogo, WcbLogo, theme } from "../brand";
import { session } from "../content";
import { Stage } from "../components/Stage";

// 12 s. See you in the room.
export function Outro() {
  const head = useIn(0.2);
  const ask = useIn(1.5);
  const date = useIn(2.5);
  const logos = useIn(4);

  return (
    <Stage tone="dawn">
      <div style={{ position: "absolute", left: 0, right: 0, top: 180, textAlign: "center" }}>
        <div style={{ fontSize: 150, fontWeight: 900, letterSpacing: -2, lineHeight: 1, ...fadeUp(head) }}>
          See you in the <span style={{ color: theme.brandAccent }}>room</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 36, marginTop: 70 }}>
          <Pill p={ask} icon={<CircleHelp size={44} strokeWidth={2.2} />} text="Bring one question you want answered" />
          <Pill p={date} icon={<CalendarDays size={44} strokeWidth={2.2} />} text={`${session.programme} · ${session.date}`} />
        </div>
      </div>
      <div
        style={{
          ...fadeUp(logos),
          position: "absolute",
          left: 0,
          right: 0,
          top: 720,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
        }}
      >
        <WcbLogo height={96} on="dark" />
        <div style={{ width: 2, height: 72, background: theme.brandSky, opacity: 0.5 }} />
        <DeloitteLogo height={52} on="dark" />
      </div>
    </Stage>
  );
}

function Pill({ p, icon, text }: { p: number; icon: ReactNode; text: string }) {
  return (
    <div
      style={{
        ...popIn(p),
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "20px 36px",
        borderRadius: 999,
        background: theme.paper,
        color: theme.brandPrimary,
        fontSize: 38,
        fontWeight: 700,
      }}
    >
      {icon}
      {text}
    </div>
  );
}
