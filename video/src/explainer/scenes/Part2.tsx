import { Brain, CircleCheck, Database, FolderOpen, Gauge, IdCard, ScrollText, Target, TriangleAlert, UserRound, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { interpolate } from "remotion";
import { progress, useIn, useSeconds } from "../../anim";
import { autonomyLevels, evalChecks, loopSteps, permissionLabels, theme, tools } from "../../brand";
import { useBeat, useCue } from "../beat";
import { At, Card, IconDot, Pop, Rise, SceneShell, blue, green } from "../ui";

// ---------- 5. What makes an agent ----------

const CX = 960;
const CY = 590;
const parts: { key: string; label: string; what: string; Icon: LucideIcon; x: number; y: number; failure: string; phrase: string; failPhrase: string }[] = [
  { key: "goal", label: "Goal", what: "What done looks like", Icon: Target, x: 520, y: 370, failure: "Vague goal", phrase: "A goal", failPhrase: "a vague goal" },
  { key: "instructions", label: "Instructions", what: "Rules and limits", Icon: ScrollText, x: 1400, y: 370, failure: "Missing rule", phrase: "Instructions:", failPhrase: "a missing rule" },
  { key: "tools", label: "Tools", what: "Systems it may use", Icon: Wrench, x: 470, y: 630, failure: "Too much access", phrase: "Tools:", failPhrase: "too much access" },
  { key: "memory", label: "Memory", what: "What it knows so far", Icon: Database, x: 1450, y: 630, failure: "Out-of-date memory", phrase: "Memory:", failPhrase: "out-of-date memory" },
  { key: "person", label: "A person", what: "Approves and decides", Icon: UserRound, x: 960, y: 815, failure: "No person at the right moment", phrase: "And a person", failPhrase: "no person" },
];

export function Anatomy() {
  const chatbot = useCue(1, "A chatbot");
  const agent = useCue(1, "An agent");
  const model = useCue(1, "The language model");
  const at = parts.map((p) => useCue(2, p.phrase));
  const fail = parts.map((p) => useCue(4, p.failPhrase));
  const shown = at.map((a) => useIn(a));
  return (
    <SceneShell heading="What makes an agent">
      <At x={80} y={205} style={{ display: "flex", gap: 20 }}>
        <Pop at={chatbot}>
          <Chip>Chatbot: answers a question</Chip>
        </Pop>
        <Pop at={agent}>
          <Chip strong>Agent: pursues a goal</Chip>
        </Pop>
      </At>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {parts.map((p, i) => (
          <line key={p.key} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={p.key === "person" ? theme.human : theme.brandSky} strokeWidth={4} opacity={shown[i]} />
        ))}
      </svg>
      <At x={CX - 120} y={CY - 120}>
        <Pop at={model}>
          <div style={{ width: 240, height: 240, borderRadius: "50%", background: theme.agent, color: theme.paper, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 0 0 14px rgba(51,153,204,0.18)" }}>
            <Brain size={84} strokeWidth={1.8} />
            <div style={{ fontSize: 34, fontWeight: 700 }}>Model</div>
            <div style={{ fontSize: 22 }}>Reasons and writes</div>
          </div>
        </Pop>
      </At>
      {parts.map((p, i) => (
        <At key={p.key} x={p.x - 190} y={p.y - 60} w={380}>
          <Pop at={at[i]}>
            <Card tone={p.key === "person" ? "human" : "agent"} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
              <IconDot Icon={p.Icon} size={64} tone={p.key === "person" ? "human" : "agent"} />
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: theme.brandPrimary }}>{p.label}</div>
                <div style={{ fontSize: 24, color: theme.muted }}>{p.what}</div>
              </div>
            </Card>
          </Pop>
          <Pop at={fail[i]} style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: theme.risk, color: theme.paper, fontSize: 24, fontWeight: 700 }}>
              <TriangleAlert size={22} strokeWidth={2.5} /> {p.failure}
            </span>
          </Pop>
        </At>
      ))}
    </SceneShell>
  );
}

function Chip({ children, strong }: { children: ReactNode; strong?: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "10px 26px",
        borderRadius: 999,
        background: strong ? theme.agent : theme.paper,
        color: strong ? theme.paper : theme.brandPrimary,
        border: `3px solid ${theme.brandSky}`,
        fontSize: 32,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

// ---------- 6. The agent loop ----------

const stages = ["plan", "act", "check"] as const;
const stageLabel = { plan: "Plan", act: "Act", check: "Check" };

export function AgentLoop() {
  const b = useBeat();
  const t = useSeconds();
  const stageCue = [useCue(1, "Plan the next step"), useCue(1, "Act,"), useCue(1, "Check the result"), useCue(1, "Then repeat")];
  // Line 2 walks through the deck's example, one step at a time.
  const exFrom = useCue(2);
  const exStep = b.lines[2].seconds / loopSteps.length;
  const stepAt = (k: number) => exFrom + k * exStep;
  const step = loopSteps.filter((_, k) => t >= stepAt(k)).length - 1;
  const activeStage = (() => {
    if (step >= 0) return loopSteps[step].stage;
    if (t >= stageCue[3]) return stages[Math.floor((t - stageCue[3]) / 0.6) % 3];
    if (t >= stageCue[2]) return "check";
    if (t >= stageCue[1]) return "act";
    if (t >= stageCue[0]) return "plan";
    return undefined;
  })();
  const stops = [useCue(4, "the goal is met"), useCue(4, "a rule says"), useCue(4, "it's unsure")];
  const carry = useCue(4, "one early mistake");
  const loopIn = useIn(stageCue[0] - 0.4);
  const R = 190;
  const pos = { plan: [0, -R], act: [R * 0.87, R * 0.5], check: [-R * 0.87, R * 0.5] } as const;
  return (
    <SceneShell heading="Plan. Act. Check. Repeat.">
      <At x={140} y={300} w={640} h={560} style={{ opacity: loopIn }}>
        <svg width={640} height={560} style={{ position: "absolute", inset: 0 }}>
          <circle cx={320} cy={270} r={R} fill="none" stroke={theme.brandSky} strokeWidth={6} strokeDasharray="14 12" />
        </svg>
        {stages.map((s) => {
          const on = activeStage === s || (activeStage === "handover" && s === "check");
          return (
            <div
              key={s}
              style={{
                position: "absolute",
                left: 320 + pos[s][0] - 85,
                top: 270 + pos[s][1] - 85,
                width: 170,
                height: 170,
                borderRadius: "50%",
                background: on ? theme.agent : theme.paper,
                border: `5px solid ${theme.brandSky}`,
                color: on ? theme.paper : theme.brandPrimary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 700,
                transform: `scale(${on ? 1.1 : 1})`,
              }}
            >
              {stageLabel[s]}
            </div>
          );
        })}
      </At>
      <At x={880} y={250} w={960} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loopSteps.map((s, k) => {
          const handover = s.stage === "handover";
          return (
            <Pop key={k} at={stepAt(k)}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "12px 22px",
                  borderRadius: 16,
                  background: theme.paper,
                  border: `3px solid ${handover ? theme.human : k === step ? theme.agent : theme.line}`,
                }}
              >
                <span style={{ width: 120, fontSize: 24, fontWeight: 700, color: handover ? theme.human : theme.brandSecondary, textTransform: "uppercase" }}>
                  {handover ? "Person" : s.stage}
                </span>
                <span style={{ fontSize: 30, fontWeight: 500 }}>{s.text}</span>
              </div>
            </Pop>
          );
        })}
      </At>
      <At x={80} y={870} w={1760} style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <Rise at={stops[0] - 0.3} style={{ fontSize: 30, fontWeight: 500, color: theme.brandPrimary }}>
          It stops when:
        </Rise>
        {["The goal is met", "A person must approve", "It's unsure"].map((label, i) => (
          <Pop key={label} at={stops[i]}>
            <span style={{ display: "inline-block", padding: "8px 22px", borderRadius: 999, background: theme.paper, border: `3px solid ${theme.human}`, color: theme.human, fontSize: 28, fontWeight: 700 }}>{label}</span>
          </Pop>
        ))}
        <Pop at={carry} style={{ marginLeft: "auto" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 22px", borderRadius: 999, background: theme.risk, color: theme.paper, fontSize: 28, fontWeight: 700 }}>
            <TriangleAlert size={26} strokeWidth={2.5} /> One early mistake can carry forward
          </span>
        </Pop>
      </At>
    </SceneShell>
  );
}

// ---------- 7. Tools and permissions ----------

const levels = ["read", "draft", "act"] as const;
const levelWhat = { read: "Look things up", draft: "Prepare something for a person", act: "Change something in the world" };

export function Tools() {
  const col = [useCue(1, "read, to look"), useCue(1, "draft, to prepare"), useCue(1, "and act,")];
  const least = useCue(2, "least privilege");
  const identity = useCue(2, "its own identity");
  const leadership = useCue(4, "leadership decision");
  return (
    <SceneShell heading="Tools are its hands">
      {levels.map((lv, i) => (
        <At key={lv} x={80 + i * 400} y={300} w={370}>
          <Pop at={col[i]}>
            <Card tone={lv === "act" ? "risk" : "agent"} style={{ height: 470 }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: lv === "act" ? theme.risk : theme.brandSecondary }}>{permissionLabels[lv]}</div>
              <div style={{ fontSize: 26, color: theme.muted, marginBottom: 18 }}>{levelWhat[lv]}</div>
              {tools
                .filter((tl) => tl.permission === lv)
                .map((tl) => (
                  <div key={tl.label} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
                    <IconDot Icon={tl.icon} size={48} tone={lv === "act" ? "risk" : "agent"} />
                    <span style={{ fontSize: 28, fontWeight: 500 }}>{tl.label}</span>
                  </div>
                ))}
            </Card>
          </Pop>
        </At>
      ))}
      <At x={80} y={230}>
        <Rise at={least} style={{ fontSize: 34, fontWeight: 500, color: theme.brandPrimary }}>
          {blue("Least privilege")}: only the access the job needs
        </Rise>
      </At>
      <At x={1300} y={300} w={540}>
        <Pop at={identity}>
          <Card style={{ height: 470 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <IconDot Icon={IdCard} size={72} />
              <div style={{ fontSize: 36, fontWeight: 700, color: theme.brandPrimary }}>Evidence agent</div>
            </div>
            <Row label="Identity" value="Its own agent ID" />
            <Row label="Access" value="Read, Draft" />
            <Row label="Owner" value={green("A named person")} />
            <div style={{ marginTop: 22, fontSize: 26, color: theme.muted }}>Like a new hire: an identity, a manager, and only the access its job needs.</div>
          </Card>
        </Pop>
      </At>
      <At x={0} y={850} w={1920} style={{ textAlign: "center" }}>
        <Rise at={leadership}>
          <span style={{ fontSize: 48, fontWeight: 700, color: theme.brandPrimary }}>What agents may do for WCB is a {green("leadership decision")}.</span>
        </Rise>
      </At>
    </SceneShell>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, marginTop: 22, fontSize: 30 }}>
      <span style={{ width: 130, color: theme.muted }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

// ---------- 8. The autonomy dial, and human in the loop ----------

const DIAL_X = 640;
const DIAL_Y = 760;
const DIAL_R = 400;
/** Angle in degrees for dial position k (0 = suggests, on the left; 4 = acts alone, on the right). */
const angleOf = (k: number) => 180 - k * 45;

export function AutonomyDial() {
  const t = useSeconds();
  const positions = [useCue(1, "only suggests"), useCue(1, "drafts for a person"), useCue(1, "acts with approval"), useCue(1, "acts and reports"), useCue(1, "acts alone")];
  const k = positions.filter((p) => t >= p).length - 1;
  // The needle swings smoothly to each position as it is named.
  const target = k < 0 ? 0 : k;
  const prevAt = k < 0 ? 0 : positions[k];
  const swing = progress(t, prevAt, prevAt + 0.5);
  const angle = interpolate(swing, [0, 1], [angleOf(Math.max(0, target - 1)), angleOf(target)]);
  const rule = useCue(2, "The rule");
  const hitl = useCue(4, "A person reviews");
  const benefits = useCue(4, "for decisions about");
  const dialIn = useIn(positions[0] - 0.5);
  const level = autonomyLevels[Math.max(0, k)];
  const rad = (a: number) => (a * Math.PI) / 180;
  return (
    <SceneShell heading="How much should it do alone?">
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: dialIn }}>
        <path d={`M ${DIAL_X - DIAL_R} ${DIAL_Y} A ${DIAL_R} ${DIAL_R} 0 0 1 ${DIAL_X + DIAL_R} ${DIAL_Y}`} fill="none" stroke={theme.brandTint} strokeWidth={60} />
        <line
          x1={DIAL_X}
          y1={DIAL_Y}
          x2={DIAL_X + Math.cos(rad(angle)) * (DIAL_R - 60)}
          y2={DIAL_Y - Math.sin(rad(angle)) * (DIAL_R - 60)}
          stroke={theme.brandPrimary}
          strokeWidth={14}
          strokeLinecap="round"
        />
        <circle cx={DIAL_X} cy={DIAL_Y} r={30} fill={theme.brandPrimary} />
      </svg>
      {autonomyLevels.map((lv, i) => {
        const a = rad(angleOf(i));
        const x = DIAL_X + Math.cos(a) * (DIAL_R + 20);
        const y = DIAL_Y - Math.sin(a) * (DIAL_R + 20);
        return (
          <At key={lv.label} x={x - 130} y={y - 60} w={260} style={{ textAlign: "center", opacity: dialIn }}>
            <span
              style={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: 999,
                background: i === k ? theme.agent : theme.paper,
                color: i === k ? theme.paper : theme.brandPrimary,
                border: `3px solid ${theme.brandSky}`,
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {lv.label}
            </span>
          </At>
        );
      })}
      <At x={1180} y={300} w={660}>
        <Pop at={positions[0]}>
          <Card style={{ minHeight: 230 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <IconDot Icon={Gauge} size={60} />
              <div style={{ fontSize: 40, fontWeight: 700, color: theme.brandSecondary }}>{level.label}</div>
            </div>
            <div style={{ fontSize: 30, marginTop: 14 }}>{level.example}</div>
            <div style={{ fontSize: 26, color: theme.muted, marginTop: 8 }}>{level.oversight}</div>
          </Card>
        </Pop>
      </At>
      <At x={1180} y={560} w={660}>
        <Rise at={rule}>
          <div style={{ fontSize: 30, fontWeight: 500, color: theme.brandPrimary, marginBottom: 10 }}>More autonomy, stronger oversight</div>
          <div style={{ height: 22, borderRadius: 11, background: `linear-gradient(90deg, ${theme.brandTint}, ${theme.brandPrimary})` }} />
        </Rise>
      </At>
      <At x={1180} y={680} w={660}>
        <Pop at={hitl}>
          <Card tone="human" style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <IconDot Icon={UserRound} size={68} tone="human" />
            <div>
              <div style={{ fontSize: 36, fontWeight: 700, color: theme.human }}>Human in the loop</div>
              <Rise at={benefits} style={{ fontSize: 26, marginTop: 4 }}>
                A worker's benefits: a person decides
              </Rise>
            </div>
          </Card>
        </Pop>
      </At>
    </SceneShell>
  );
}

// ---------- 9. Evals ----------

export function Evals() {
  const claims = useCue(1, "past claims");
  const checkPhrases = ["right answer", "sources shown", "fair", "private", "knows when to hand over"];
  const checks = checkPhrases.map((p) => useCue(1, p));
  const evals = useCue(1, "evals");
  const keep = useCue(2, "keep testing");
  const trust = useCue(2, "Test before you trust");
  return (
    <SceneShell heading="Test before you trust">
      <At x={80} y={250}>
        <Rise at={evals} style={{ fontSize: 36, fontWeight: 500, color: theme.brandPrimary }}>
          {blue("Evals")}: tests, like any other control
        </Rise>
      </At>
      <At x={120} y={360} w={560} h={420}>
        {[0, 1, 2, 3].map((i) => (
          <Pop key={i} at={claims + i * 0.15} style={{ position: "absolute", left: i * 34, top: i * 30 }}>
            <Card style={{ width: 420, height: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <FolderOpen size={90} color={theme.brandSecondary} strokeWidth={1.6} />
              {i === 3 && <div style={{ fontSize: 26, fontWeight: 500, textAlign: "center" }}>Past claims, personal details removed</div>}
            </Card>
          </Pop>
        ))}
      </At>
      <At x={900} y={340} w={940} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {evalChecks.map((c, i) => (
          <Pop key={c.label} at={checks[i]}>
            <Card tone={c.status === "pass" ? "agent" : "plain"} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 24px" }}>
              {c.status === "pass" ? <CircleCheck size={44} color={theme.human} strokeWidth={2.5} /> : <TriangleAlert size={44} color={theme.brandAccent} strokeWidth={2.5} />}
              <span style={{ fontSize: 32, fontWeight: 500 }}>{c.label}</span>
              {c.status === "work" && <span style={{ marginLeft: "auto", fontSize: 24, fontWeight: 700, color: theme.brandAccent }}>NEEDS WORK</span>}
            </Card>
          </Pop>
        ))}
      </At>
      <At x={900} y={812} w={940}>
        <Rise at={keep} style={{ fontSize: 30, color: theme.muted }}>
          And keep testing after launch: models, data and policies change.
        </Rise>
      </At>
      <At x={0} y={880} w={1920} style={{ textAlign: "center" }}>
        <Pop at={trust}>
          <span style={{ fontSize: 52, fontWeight: 700, color: theme.brandPrimary }}>Test before you {blue("trust")}.</span>
        </Pop>
      </At>
    </SceneShell>
  );
}
