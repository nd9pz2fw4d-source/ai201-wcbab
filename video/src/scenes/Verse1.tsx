import { ArrowRight, FolderOpen, HardHat } from "lucide-react";
import { Sequence, interpolate } from "remotion";
import type { LucideIcon } from "lucide-react";
import { fadeUp, popIn, useIn, useSeconds } from "../anim";
import { theme } from "../brand";
import { deloitteSource, forces, surveyReach } from "../content";
import { Header } from "../components/Header";
import { SourceNote } from "../components/SourceNote";
import { Stage } from "../components/Stage";
import { useSectionTiming } from "../sectionTiming";
import { FPS, forceAt } from "../timeline";

// 8 to 24 s. A worker is hurt, a claim starts; Deloitte asked Canada's WCB leaders; eight forces.
// Beats change on the sung lines: the claim (lines 1-2), the survey (3-4), the forces (5-8).
export function Verse1() {
  const s = useSectionTiming();
  const survey = Math.round((s.lines[2] - 0.2) * FPS);
  const forces = Math.round((s.lines[4] - 0.2) * FPS);
  return (
    <Stage chip="Why now">
      <Header />
      <Sequence durationInFrames={survey} layout="none">
        <ClaimStarts />
      </Sequence>
      <Sequence from={survey} durationInFrames={forces - survey} layout="none">
        <Survey />
      </Sequence>
      <Sequence from={forces} layout="none">
        <Forces />
      </Sequence>
    </Stage>
  );
}

function ClaimStarts() {
  const worker = useIn(0.1);
  const arrow = useIn(1.2);
  const claim = useIn(2);
  const t = useSeconds();
  const wobble = Math.sin(t * 18) * interpolate(t, [0.3, 1.2], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>
      <div style={{ ...popIn(worker), textAlign: "center" }}>
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: theme.human,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotate(${wobble}deg)`,
          }}
        >
          <HardHat size={150} color={theme.paper} strokeWidth={1.8} />
        </div>
        <div style={{ marginTop: 28, fontSize: 44, fontWeight: 700 }}>Monday, 7:42 am</div>
        <div style={{ fontSize: 34, color: theme.brandTint }}>A worker gets hurt</div>
      </div>
      <div style={{ opacity: arrow, transform: `translateX(${(1 - arrow) * -40}px)` }}>
        <ArrowRight size={120} color={theme.brandAccent} strokeWidth={2.5} />
      </div>
      <div style={{ ...popIn(claim), textAlign: "center" }}>
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: 40,
            background: theme.paper,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FolderOpen size={150} color={theme.brandSecondary} strokeWidth={1.8} />
        </div>
        <div style={{ marginTop: 28, fontSize: 44, fontWeight: 700 }}>A claim starts moving</div>
        <div style={{ fontSize: 34, color: theme.brandTint }}>Report, register, sort, decide, pay, close</div>
      </div>
    </div>
  );
}

function Survey() {
  const head = useIn(0.1);
  const big = useIn(0.5);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center" }}>
        <div style={{ fontSize: 40, color: theme.brandSky, fontWeight: 500, ...fadeUp(head) }}>Deloitte, August 2026</div>
        <div style={{ fontSize: 110, fontWeight: 900, lineHeight: 1.1, marginTop: 20, ...fadeUp(big) }}>
          What's next for
          <br />
          <span style={{ color: theme.brandAccent }}>workers' comp?</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", gap: 36 }}>
        {surveyReach.map((r, i) => (
          <ReachChip key={r.where} where={r.where} how={r.how} delay={1.2 + i * 0.5} />
        ))}
      </div>
      <SourceNote text={deloitteSource} />
    </>
  );
}

function ReachChip({ where, how, delay }: { where: string; how: string; delay: number }) {
  const p = useIn(delay);
  return (
    <div
      style={{
        ...popIn(p),
        padding: "18px 40px",
        borderRadius: 999,
        background: "rgba(128,195,226,0.15)",
        border: `2px solid ${theme.brandSky}`,
        fontSize: 36,
        fontWeight: 500,
      }}
    >
      <span style={{ color: theme.brandAccent, fontWeight: 900 }}>{where}</span> {how}
    </div>
  );
}

// Eight forces, in the order the verse sings them.
function Forces() {
  const s = useSectionTiming();
  const head = useIn(0);
  // This beat starts 0.2 s before line 5; card times are relative to that.
  const t0 = s.lines[4] - 0.2;
  return (
    <>
      <div style={{ position: "absolute", left: 80, top: 170, fontSize: 68, fontWeight: 900, ...fadeUp(head) }}>
        <span style={{ color: theme.brandAccent }}>Eight forces</span> reshaping workers' comp
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 290,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}
      >
        {forces.map((f, i) => (
          <ForceCard key={f.title} title={f.title} detail={f.detail} Icon={f.icon} delay={forceAt(i, s) - t0} />
        ))}
      </div>
      <SourceNote text={deloitteSource} />
    </>
  );
}

function ForceCard({ title, detail, Icon, delay }: { title: string; detail: string; Icon: LucideIcon; delay: number }) {
  const p = useIn(delay);
  return (
    <div
      style={{
        ...popIn(p),
        background: theme.paper,
        color: theme.ink,
        borderRadius: 24,
        padding: "24px 26px",
        height: 260,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <Icon size={52} color={theme.agent} strokeWidth={2} style={{ flexShrink: 0 }} />
      <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.1, color: theme.brandPrimary }}>{title}</div>
      <div style={{ fontSize: 26, lineHeight: 1.3, color: theme.muted }}>{detail}</div>
    </div>
  );
}
