import { fadeUp, popIn, useIn } from "../anim";
import { theme } from "../brand";
import { acts } from "../content";
import { Header } from "../components/Header";
import { Stage } from "../components/Stage";
import { useSectionTiming } from "../sectionTiming";

// The day: one claim, three acts. Each act lands on its sung line.
export function Agenda() {
  const s = useSectionTiming();
  const head = useIn(0);
  const foot = useIn(s.lines[3] + 1);

  return (
    <Stage chip="The day ahead">
      <Header />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", ...fadeUp(head) }}>
        <div style={{ fontSize: 40, color: theme.brandSky, fontWeight: 500 }}>Today</div>
        <div style={{ fontSize: 96, fontWeight: 900 }}>
          One claim. <span style={{ color: theme.brandAccent }}>Three acts.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 420, display: "flex", gap: 40 }}>
        {acts.map((a, i) => (
          <ActCard key={a.name} n={a.n} name={a.name} detail={a.detail} Icon={a.icon} delay={s.lines[i + 1]} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, textAlign: "center", fontSize: 38, color: theme.brandTint, ...fadeUp(foot) }}>
        Expect games, votes, and a claim that goes wrong on purpose.
      </div>
    </Stage>
  );
}

function ActCard({ n, name, detail, Icon, delay }: { n: number; name: string; detail: string; Icon: (typeof acts)[number]["icon"]; delay: number }) {
  const p = useIn(delay);
  return (
    <div
      style={{
        ...popIn(p),
        flex: 1,
        height: 380,
        borderRadius: 32,
        background: theme.paper,
        color: theme.ink,
        padding: "34px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: theme.brandDeep, letterSpacing: 1 }}>ACT {n}</div>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: theme.brandTint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={56} color={theme.brandDeep} strokeWidth={2} />
        </div>
      </div>
      <div style={{ fontSize: 80, fontWeight: 900, color: theme.brandPrimary, lineHeight: 1 }}>{name}</div>
      <div style={{ fontSize: 34, lineHeight: 1.3, color: theme.muted }}>{detail}</div>
    </div>
  );
}
