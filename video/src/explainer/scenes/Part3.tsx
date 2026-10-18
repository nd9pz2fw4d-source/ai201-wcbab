import { Bot, Database, Factory, Gauge, Hand, Music, ScrollText, Search, ShieldCheck, Sparkles, UserRound, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { progress, useIn, useSeconds } from "../../anim";
import { dynamo, objectives, opportunityTypes, readinessDimensions, theme } from "../../brand";
import { useBeat, useCue } from "../beat";
import { At, Card, IconDot, Pop, Rise, SceneShell, blue, green } from "../ui";

// ---------- 10. Copilot is the floor, not the ceiling ----------

export function FloorCeiling() {
  const floor = useCue(1, "Copilot is the floor");
  const sameShape = useCue(1, "same shape");
  const better = useCue(2, "redesigning the journey");
  const history = useCue(4, "When factories");
  const stageAt = [history, useCue(4, "bolted"), useCue(4, "redesigned around")];
  const stageIcons: LucideIcon[] = [Factory, Zap, Sparkles];
  return (
    <SceneShell heading="Copilot is the floor, not the ceiling">
      <At x={80} y={240} w={860}>
        <Pop at={floor}>
          <Card style={{ height: 380 }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: theme.brandPrimary }}>Faster hands</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 24, width: 640 }}>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <IconDot Icon={Hand} size={70} tone="human" />
                  <div style={{ position: "absolute", right: -8, top: -8 }}>
                    <IconDot Icon={Sparkles} size={30} />
                  </div>
                </div>
              ))}
            </div>
            <Rise at={sameShape} style={{ marginTop: 26, fontSize: 30, color: theme.muted }}>
              Each person a bit faster. Same journey.
            </Rise>
          </Card>
        </Pop>
      </At>
      <At x={980} y={240} w={860}>
        <Pop at={better}>
          <Card style={{ height: 380 }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: theme.brandSecondary }}>A better journey</div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
              {(["agent", "agent", "human", "agent", "agent", "human"] as const).map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && <div style={{ width: 52, height: 6, background: theme.brandSky }} />}
                  <IconDot Icon={r === "human" ? UserRound : Bot} size={70} tone={r} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
              {["Time to decision", "Return to work", "Worker experience"].map((o) => (
                <span key={o} style={{ padding: "8px 18px", borderRadius: 999, background: theme.agent, color: theme.paper, fontSize: 24, fontWeight: 700 }}>
                  {o}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 22, fontSize: 30, color: theme.muted }}>Agents between people. People at the decisions.</div>
          </Card>
        </Pop>
      </At>
      <At x={80} y={650} w={1760} style={{ display: "flex", gap: 24 }}>
        {dynamo.stages.map((s, i) => (
          <Pop key={s.label} at={stageAt[i]} style={{ flex: 1 }}>
            <Card tone={i === 2 ? "human" : "plain"} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 22px" }}>
              <IconDot Icon={stageIcons[i]} size={60} tone={i === 2 ? "human" : "agent"} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: theme.muted, textTransform: "uppercase" }}>{s.when}</div>
                <div style={{ fontSize: 26, fontWeight: 500 }}>{s.label}</div>
                {s.result && <div style={{ fontSize: 26, fontWeight: 700, color: i === 2 ? theme.human : theme.brandAccent }}>{s.result}</div>}
              </div>
            </Card>
          </Pop>
        ))}
      </At>
      <At x={80} y={860}>
        <Rise at={stageAt[2] + 0.5} style={{ fontSize: 22, color: theme.muted }}>
          Source: {dynamo.source}
        </Rise>
      </At>
    </SceneShell>
  );
}

// ---------- 11. Four kinds of AI opportunity ----------

export function Ladder() {
  const rung = [useCue(1, "Rung one"), useCue(1, "Rung two"), useCue(2, "Rung three"), useCue(2, "Rung four")];
  const execs = useCue(4, "only executives");
  const most = useCue(4, "Most organizations");
  const value = useCue(4, "The value");
  const fills = [theme.brandTint, theme.brandSky, theme.brandSecondary, theme.brandPrimary];
  return (
    <SceneShell heading="Four kinds of AI opportunity">
      {opportunityTypes.map((o, i) => {
        const h = 280 + i * 100;
        const dark = i >= 2;
        return (
          <At key={o.name} x={120 + i * 430} y={880 - h} w={400} h={h}>
            <Pop at={rung[i]} style={{ height: "100%" }}>
              <div style={{ height: "100%", borderRadius: "20px 20px 0 0", background: fills[i], color: dark ? theme.paper : theme.brandPrimary, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: dark ? theme.paper : theme.brandPrimary, color: dark ? theme.brandPrimary : theme.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.1 }}>{o.name}</div>
                <div style={{ fontSize: 26, lineHeight: 1.3 }}>{o.example}</div>
                <div style={{ marginTop: "auto" }}>
                  <span style={{ display: "inline-block", padding: "6px 16px", borderRadius: 999, background: o.executive ? theme.human : theme.paper, color: o.executive ? theme.paper : theme.brandPrimary, fontSize: 24, fontWeight: 700 }}>
                    Owner: {o.owner}
                  </span>
                </div>
              </div>
            </Pop>
          </At>
        );
      })}
      <At x={980} y={230} w={830}>
        <Pop at={execs}>
          <div style={{ border: `4px solid ${theme.human}`, borderBottom: "none", borderRadius: "16px 16px 0 0", height: 60, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, color: theme.human, fontSize: 30, fontWeight: 700, background: theme.brandLight }}>
            <UserRound size={30} strokeWidth={2.5} /> Executive-led
          </div>
        </Pop>
      </At>
      <At x={120} y={535} w={400} style={{ textAlign: "center" }}>
        <Pop at={most}>
          <span style={{ display: "inline-block", padding: "8px 20px", borderRadius: 999, background: theme.brandAccent, color: theme.brandPrimary, fontSize: 26, fontWeight: 700 }}>Most organizations stop here</span>
        </Pop>
      </At>
      <At x={980} y={900} w={830} style={{ textAlign: "center" }}>
        <Rise at={value} style={{ fontSize: 36, fontWeight: 700, color: theme.brandPrimary }}>
          The value is at {blue("three and four")}
        </Rise>
      </At>
    </SceneShell>
  );
}

// ---------- 12. Readiness ----------

const foundationIcons: LucideIcon[] = [Database, ScrollText, ShieldCheck, Users, UserRound, Search];

export function Readiness() {
  const b = useBeat();
  const t = useSeconds();
  const chartFrom = useCue(1, "the two move");
  const chartTo = chartFrom + b.lines[1].seconds * 0.8;
  const draw = progress(t, chartFrom, chartTo);
  const years = useCue(1, "Getting ready takes years");
  const phrases = ["clean, connected data", "rules that are written down", "identities and access", "skills to direct", "owners for each journey", "monitoring"];
  const tiles = phrases.map((p) => useCue(2, p));
  const late = useCue(3);
  const chartIn = useIn(chartFrom - 0.3);
  // Capability compounds; readiness grows slowly. Shapes only: illustrative, no scale.
  const W = 740;
  const H = 360;
  const n = 60;
  const capability = Array.from({ length: n + 1 }, (_, i) => {
    const x = i / n;
    return [x * W, H - (Math.pow(2, x * 6) - 1) / 63 * H] as const;
  });
  const ready = Array.from({ length: n + 1 }, (_, i) => {
    const x = i / n;
    return [x * W, H - x * 0.35 * H] as const;
  });
  const path = (pts: readonly (readonly [number, number])[]) =>
    pts.slice(0, Math.max(2, Math.round(draw * pts.length))).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <SceneShell heading="Readiness is slow. Capability is fast.">
      <At x={80} y={240} w={860}>
        <Card style={{ opacity: chartIn, height: 560 }}>
          <svg width={W + 20} height={H + 20} style={{ marginTop: 10 }}>
            <line x1={0} y1={H} x2={W} y2={H} stroke={theme.line} strokeWidth={3} />
            <path d={path(capability)} fill="none" stroke={theme.agent} strokeWidth={8} strokeLinecap="round" />
            <path d={path(ready)} fill="none" stroke={theme.human} strokeWidth={8} strokeLinecap="round" strokeDasharray="16 12" />
          </svg>
          <div style={{ display: "flex", gap: 28, marginTop: 14, fontSize: 28, fontWeight: 700 }}>
            <span style={{ color: theme.agent }}>What AI can do</span>
            <Rise at={years}>
              <span style={{ color: theme.human }}>How ready we are</span>
            </Rise>
          </div>
          <div style={{ fontSize: 20, color: theme.muted, marginTop: 10 }}>
            Illustrative. METR measures the length of task an AI agent can complete doubling about every 7 months (software and research tasks).
          </div>
        </Card>
      </At>
      <At x={980} y={240} w={860} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {readinessDimensions.map((d, i) => (
          <Pop key={d.id} at={tiles[i]}>
            <Card style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", height: 150 }}>
              <IconDot Icon={foundationIcons[i]} size={60} />
              <span style={{ fontSize: 28, fontWeight: 500 }}>{d.label}</span>
            </Card>
          </Pop>
        ))}
      </At>
      <At x={980} y={770} w={860}>
        <Rise at={late}>
          <Card tone="plain" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px" }}>
            <IconDot Icon={Gauge} size={56} tone="gold" />
            <span style={{ fontSize: 30, fontWeight: 700, color: theme.brandPrimary }}>Start late, and it costs far more than the delay</span>
          </Card>
        </Rise>
      </At>
    </SceneShell>
  );
}

// ---------- 13. What stays human, and the day ahead ----------

export function Close() {
  const words = [useCue(1, "Judgment"), useCue(1, "Empathy"), useCue(1, "Accountability"), useCue(1, "the worker's voice")];
  const acts = [useCue(2, "See it:"), useCue(2, "Choose it:"), useCue(2, "Govern it:")];
  const bring = useCue(3);
  const music = useCue(3, "And now");
  return (
    <SceneShell heading="What stays human">
      <At x={80} y={240} w={1760} style={{ display: "flex", gap: 20 }}>
        {["Judgment", "Empathy", "Accountability", "The worker's voice"].map((w, i) => (
          <Pop key={w} at={words[i]} style={{ flex: 1 }}>
            <div style={{ borderRadius: 20, background: theme.human, color: theme.paper, padding: "28px 24px", fontSize: 40, fontWeight: 700, textAlign: "center" }}>{w}</div>
          </Pop>
        ))}
      </At>
      <At x={80} y={430} w={1760} style={{ display: "flex", gap: 24 }}>
        {objectives.map((o, i) => (
          <Pop key={o.act} at={acts[i]} style={{ flex: 1 }}>
            <Card style={{ height: 260 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <IconDot Icon={o.icon} size={64} />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: theme.muted }}>ACT {i + 1}</div>
                  <div style={{ fontSize: 44, fontWeight: 700, color: theme.brandPrimary }}>{o.act}</div>
                </div>
              </div>
              <div style={{ fontSize: 30, marginTop: 18, lineHeight: 1.3 }}>{o.text}</div>
            </Card>
          </Pop>
        ))}
      </At>
      <At x={0} y={760} w={1920} style={{ display: "flex", justifyContent: "center", gap: 24 }}>
        <Pop at={bring}>
          <span style={{ display: "inline-block", padding: "14px 34px", borderRadius: 999, background: theme.paper, border: `3px solid ${theme.brandSky}`, fontSize: 40, fontWeight: 700, color: theme.brandPrimary }}>
            Bring one question you want answered
          </span>
        </Pop>
        <Pop at={music}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 34px", borderRadius: 999, background: theme.brandAccent, fontSize: 40, fontWeight: 700, color: theme.brandPrimary }}>
            <Music size={36} strokeWidth={2.5} /> Next: the song
          </span>
        </Pop>
      </At>
      <At x={0} y={880} w={1920} style={{ textAlign: "center" }}>
        <Rise at={words[3] + 1} style={{ fontSize: 30, color: theme.muted }}>
          Including the right to ask for a {green("human review")}.
        </Rise>
      </At>
    </SceneShell>
  );
}
