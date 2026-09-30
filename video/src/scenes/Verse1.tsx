import { ArrowRight, FolderOpen, HardHat } from "lucide-react";
import { Sequence, interpolate } from "remotion";
import { fadeUp, popIn, useIn, useSeconds } from "../anim";
import { theme } from "../brand";
import { deloitteSource, pressures, surveyCountries } from "../content";
import { Header } from "../components/Header";
import { SourceNote } from "../components/SourceNote";
import { Stage } from "../components/Stage";
import { FPS } from "../timeline";

// 8 to 24 s. A worker is hurt, a claim starts; Deloitte asked 18 WCOs; four pressures.
export function Verse1() {
  return (
    <Stage chip="Why now">
      <Header />
      <Sequence durationInFrames={4 * FPS} layout="none">
        <ClaimStarts />
      </Sequence>
      <Sequence from={4 * FPS} durationInFrames={4 * FPS} layout="none">
        <Survey />
      </Sequence>
      <Sequence from={8 * FPS} layout="none">
        <Pressures />
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
  const t = useSeconds();
  const count = Math.round(interpolate(t, [0.2, 1.6], [0, 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", ...fadeUp(head) }}>
        <div style={{ fontSize: 40, color: theme.brandSky, fontWeight: 500 }}>Deloitte asked workers' comp organizations about the future</div>
        <div style={{ fontSize: 260, fontWeight: 900, color: theme.brandAccent, lineHeight: 1.05 }}>{count}</div>
        <div style={{ fontSize: 44, fontWeight: 500 }}>organizations, three countries</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", gap: 36 }}>
        {surveyCountries.map((c, i) => (
          <CountryChip key={c.name} name={c.name} count={c.count} delay={1 + i * 0.4} />
        ))}
      </div>
      <SourceNote text={deloitteSource} />
    </>
  );
}

function CountryChip({ name, count, delay }: { name: string; count: number; delay: number }) {
  const p = useIn(delay);
  return (
    <div
      style={{
        ...popIn(p),
        padding: "18px 40px",
        borderRadius: 999,
        background: "rgba(128,195,226,0.15)",
        border: `2px solid ${theme.brandSky}`,
        fontSize: 38,
        fontWeight: 500,
      }}
    >
      {name} <span style={{ color: theme.brandAccent, fontWeight: 900 }}>{count}</span>
    </div>
  );
}

function Pressures() {
  const head = useIn(0);
  return (
    <>
      <div style={{ position: "absolute", left: 80, top: 190, fontSize: 72, fontWeight: 900, ...fadeUp(head) }}>
        The pressure is on workers' comp <span style={{ color: theme.brandAccent }}>everywhere</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 330,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
        }}
      >
        {pressures.map((p, i) => (
          <PressureCard key={p.title} n={i + 1} title={p.title} detail={p.detail} delay={i * 2} />
        ))}
      </div>
      <SourceNote text={deloitteSource} />
    </>
  );
}

function PressureCard({ n, title, detail, delay }: { n: number; title: string; detail: string; delay: number }) {
  const p = useIn(delay);
  return (
    <div
      style={{
        ...popIn(p),
        background: theme.paper,
        color: theme.ink,
        borderRadius: 28,
        padding: "30px 40px",
        display: "flex",
        gap: 30,
        alignItems: "center",
        minHeight: 190,
      }}
    >
      <div
        style={{
          flex: "none",
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: theme.brandAccent,
          color: theme.brandPrimary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50,
          fontWeight: 900,
        }}
      >
        {n}
      </div>
      <div>
        <div style={{ fontSize: 48, fontWeight: 700, color: theme.brandPrimary }}>{title}</div>
        <div style={{ fontSize: 34, color: theme.muted, marginTop: 6 }}>{detail}</div>
      </div>
    </div>
  );
}
