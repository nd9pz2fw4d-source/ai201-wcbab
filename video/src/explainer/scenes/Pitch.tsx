import { CalendarDays, Sparkles, UserRound } from "lucide-react";
import { Img, interpolate, staticFile } from "remotion";
import { progress, useIn, useSeconds } from "../../anim";
import { theme } from "../../brand";
import { useCue } from "../beat";
import { session } from "../../content";
import { bringQuestions, deloitte, pitchQuestions } from "../cheatsheet";
import { At, Card, Pop, Rise, SceneShell, Tag } from "../ui";

// ---------- 9. Decode the pitch ----------

/** Where Sam reads each claim (line 1) and where the narrators decode it (lines 2 to 5), as phrases in the script. */
const reads = ["ninety-nine percent accurate", "fully autonomous", "learns your business", "plugs into all your systems"];
const decodes: [number, string][] = [
  [1, "Ninety-nine"],
  [2, "Fully autonomous"],
  [2, "Learns your business"],
  [3, "Plugs into"],
  [4, "And one more"],
];

export function DecodePitch() {
  const t = useSeconds();
  const slide = useIn(0.4);
  const readAt = reads.map((r) => useCue(0, r));
  const decodeAt = decodes.map(([i, p]) => useCue(i, p));
  const answer = useCue(5);
  const keep = useCue(6);
  return (
    <SceneShell heading="Decode the pitch">
      <At x={80} y={240} w={760} h={600} style={{ opacity: slide }}>
        <div style={{ height: "100%", borderRadius: 24, background: `linear-gradient(135deg, #1b1340, #3a2a7a)`, color: "#fff", padding: "34px 38px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 24, fontWeight: 700, color: "#c9b8ff", letterSpacing: 2 }}>
            <Sparkles size={26} /> A TYPICAL PITCH
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 18 }}>Our AI agent is…</div>
          {reads.map((r, i) => {
            const lit = progress(t, readAt[i], readAt[i] + 0.3);
            const struck = progress(t, decodeAt[i], decodeAt[i] + 0.4);
            return (
              <div key={r} style={{ position: "relative", marginTop: 22, fontSize: 46, fontWeight: 900, color: lit > 0 ? "#FFE58A" : "rgba(255,255,255,0.55)", opacity: 1 - 0.5 * struck }}>
                {pitchQuestions[i].claim.toLowerCase()}
                <div style={{ position: "absolute", left: 0, top: "52%", height: 6, width: `${struck * 100}%`, maxWidth: 640, background: theme.risk, borderRadius: 3 }} />
              </div>
            );
          })}
        </div>
      </At>
      <At x={900} y={240} w={940} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {pitchQuestions.map((q, i) => (
          <Pop key={q.question} at={decodeAt[i] + 0.3}>
            <Card style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 22px" }}>
              <div style={{ flex: "none", width: 52, height: 52, borderRadius: "50%", background: theme.agent, color: theme.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ flex: 1, fontSize: 28, fontWeight: 500, lineHeight: 1.25 }}>{q.question}</div>
              <Tag tone="plain" style={{ fontSize: 20, padding: "4px 14px", flex: "none" }}>
                {q.term}
              </Tag>
            </Card>
          </Pop>
        ))}
      </At>
      <At x={0} y={870} w={1920} style={{ display: "flex", justifyContent: "center", gap: 18 }}>
        <Pop at={answer}>
          <Tag tone="gold" style={{ fontSize: 34 }}>
            If they can't answer, that is your answer.
          </Tag>
        </Pop>
        <Pop at={keep}>
          <Tag style={{ fontSize: 34 }}>Five questions for any pitch</Tag>
        </Pop>
      </At>
    </SceneShell>
  );
}

// ---------- 10. Three questions to bring ----------

export function ThreeQuestions() {
  const t = useSeconds();
  const stat = useCue(0, "Deloitte's 2026 survey");
  const ahead = useCue(0, "nobody's far ahead");
  const qAt = [useCue(1, "First:"), useCue(2, "Second:"), useCue(3, "And third:")];
  const sheet = useCue(4, "cheat sheet");
  const handover = useCue(4, "And now");
  const slide = progress(t, sheet - 0.2, sheet + 0.6);
  return (
    <SceneShell heading="Three questions to bring">
      <At x={80} y={240} w={1040} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {bringQuestions.map((q, i) => (
          <Pop key={q.question} at={qAt[i]}>
            <Card style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
              <div style={{ flex: "none", width: 64, height: 64, borderRadius: "50%", background: theme.human, color: theme.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 36, fontWeight: 700, color: theme.brandPrimary, lineHeight: 1.2 }}>{q.question}</div>
                <div style={{ fontSize: 28, color: theme.muted, marginTop: 6 }}>{q.why}</div>
              </div>
            </Card>
          </Pop>
        ))}
      </At>
      <At x={1180} y={240} w={660} style={{ opacity: 1 - slide }}>
        <Pop at={stat}>
          <div style={{ borderRadius: 24, background: theme.brandPrimary, color: theme.paper, padding: "30px 34px" }}>
            <div style={{ fontSize: 110, fontWeight: 900, color: theme.brandAccent, lineHeight: 1 }}>{deloitte.stat}</div>
            <div style={{ fontSize: 30, marginTop: 10, lineHeight: 1.3 }}>{deloitte.text}</div>
            <Rise at={ahead} style={{ fontSize: 32, fontWeight: 700, marginTop: 18 }}>
              Nobody is far ahead.
            </Rise>
            <div style={{ fontSize: 20, color: theme.brandTint, marginTop: 16 }}>{deloitte.source}</div>
          </div>
        </Pop>
      </At>
      <At x={1240} y={200} w={600} style={{ opacity: slide, transform: `translateX(${interpolate(slide, [0, 1], [400, 0])}px) rotate(${interpolate(slide, [0, 1], [8, 2])}deg)` }}>
        <Img src={staticFile("explainer/cheat-sheet.png")} style={{ width: 600, borderRadius: 12, boxShadow: "0 30px 60px rgba(12,53,83,0.3)" }} />
      </At>
      <At x={80} y={860} w={1040} style={{ display: "flex", gap: 18 }}>
        <Pop at={qAt[2] + 1}>
          <Tag tone="plain" style={{ fontSize: 34 }}>
            <CalendarDays size={32} strokeWidth={2.5} /> See you {session.date}
          </Tag>
        </Pop>
        <Pop at={handover}>
          <Tag tone="gold" style={{ fontSize: 34 }}>
            <UserRound size={32} strokeWidth={2.5} /> Next: Riphay, on the day
          </Tag>
        </Pop>
      </At>
    </SceneShell>
  );
}
