import type { ReactNode } from "react";
import { CalendarDays, CircleHelp, Quote } from "lucide-react";
import { fadeUp, popIn, useIn } from "../anim";
import { DeloitteLogo, WcbLogo, theme } from "../brand";
import { readinessQuestion, session } from "../content";
import { Stage } from "../components/Stage";

// 12 s. See you in the room, with Deloitte's readiness question to think about.
export function Outro() {
  const head = useIn(0.2);
  const quote = useIn(1.2);
  const ask = useIn(2.4);
  const date = useIn(3);
  const logos = useIn(4);

  return (
    <Stage tone="dawn">
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}>
        <div style={{ fontSize: 150, fontWeight: 900, letterSpacing: -2, lineHeight: 1, ...fadeUp(head) }}>
          See you in the <span style={{ color: theme.brandAccent }}>room</span>
        </div>
        <div
          style={{
            ...fadeUp(quote),
            margin: "56px auto 0",
            maxWidth: 1400,
            display: "flex",
            gap: 28,
            alignItems: "flex-start",
            textAlign: "left",
            padding: "30px 44px",
            borderRadius: 28,
            background: "rgba(255,255,255,0.1)",
            borderLeft: `8px solid ${theme.brandAccent}`,
          }}
        >
          <Quote size={56} color={theme.brandAccent} strokeWidth={2.2} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 28, color: theme.brandSky, fontWeight: 500 }}>Deloitte's question for every board</div>
            <div style={{ fontSize: 42, fontWeight: 500, lineHeight: 1.3, marginTop: 8 }}>{readinessQuestion}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 36, marginTop: 44 }}>
          <Pill p={ask} icon={<CircleHelp size={44} strokeWidth={2.2} />} text="Bring your answer" />
          <Pill p={date} icon={<CalendarDays size={44} strokeWidth={2.2} />} text={`${session.programme} · ${session.date}`} />
        </div>
      </div>
      <div
        style={{
          ...fadeUp(logos),
          position: "absolute",
          left: 0,
          right: 0,
          top: 800,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
        }}
      >
        <WcbLogo height={84} on="dark" />
        <div style={{ width: 2, height: 64, background: theme.brandSky, opacity: 0.5 }} />
        <DeloitteLogo height={46} on="dark" />
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
