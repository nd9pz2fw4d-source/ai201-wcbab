import { Check } from "lucide-react";
import { Sequence, interpolate, useCurrentFrame } from "remotion";
import { useIn, useSeconds } from "../anim";
import { theme } from "../brand";
import { terms, type Term } from "../content";
import { Header } from "../components/Header";
import { Stage } from "../components/Stage";
import { FPS } from "../timeline";

const CARD_SECONDS = 4; // two sung lines per term

// 32 s. Eight key terms, one flashcard each, with a progress row underneath.
export function Terms() {
  const t = useSeconds();
  const current = Math.min(terms.length - 1, Math.floor(t / CARD_SECONDS));

  return (
    <Stage chip={`Key terms ${current + 1} / ${terms.length}`}>
      <Header />
      <div style={{ position: "absolute", left: 80, top: 150, fontSize: 40, color: theme.brandSky, fontWeight: 500 }}>
        Your cheat sheet for today
      </div>
      {terms.map((term, i) => (
        <Sequence key={term.term} from={i * CARD_SECONDS * FPS} durationInFrames={CARD_SECONDS * FPS} layout="none">
          <Flashcard term={term} />
        </Sequence>
      ))}
      <div style={{ position: "absolute", left: 80, right: 80, top: 830, display: "flex", gap: 14, justifyContent: "center" }}>
        {terms.map((term, i) => (
          <div
            key={term.term}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 500,
              background: i === current ? theme.brandAccent : i < current ? "rgba(31,181,168,0.25)" : "rgba(255,255,255,0.08)",
              color: i === current ? theme.brandPrimary : i < current ? theme.paper : theme.brandSky,
            }}
          >
            {i < current && <Check size={22} strokeWidth={3} />}
            {term.short}
          </div>
        ))}
      </div>
    </Stage>
  );
}

function Flashcard({ term }: { term: Term }) {
  const frame = useCurrentFrame();
  const flip = useIn(0, 13);
  const text = useIn(0.35);
  const out = interpolate(frame, [CARD_SECONDS * FPS - 8, CARD_SECONDS * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wobble = term.wobble ? Math.sin(frame * 0.9) * interpolate(frame, [4, 30], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const Icon = term.icon;

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", perspective: 2000 }}>
      <div
        style={{
          width: 1500,
          height: 560,
          borderRadius: 40,
          background: theme.paper,
          color: theme.ink,
          display: "flex",
          alignItems: "center",
          gap: 70,
          padding: "0 90px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.35)",
          opacity: 1 - out,
          transform: `rotateY(${interpolate(flip, [0, 1], [-80, 0]) + out * 40}deg) rotate(${wobble}deg) translateX(${out * -200}px)`,
        }}
      >
        <div
          style={{
            flex: "none",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: term.wobble ? "#FDE7E7" : "#DDF5F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={150} color={term.wobble ? theme.risk : theme.agent} strokeWidth={1.8} />
        </div>
        <div style={{ opacity: text }}>
          <div style={{ fontSize: term.term.length > 16 ? 80 : 104, fontWeight: 900, color: theme.brandPrimary, lineHeight: 1.05, letterSpacing: -1 }}>{term.term}</div>
          <div style={{ fontSize: 48, fontWeight: 500, marginTop: 24, lineHeight: 1.25 }}>{term.meaning}</div>
          <div style={{ fontSize: 36, color: theme.muted, marginTop: 28, fontStyle: "italic" }}>{term.example}</div>
        </div>
      </div>
    </div>
  );
}
