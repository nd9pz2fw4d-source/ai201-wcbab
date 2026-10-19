import { HardHat } from "lucide-react";
import { fadeUp, popIn, useIn, useSeconds } from "../anim";
import { stations, theme } from "../brand";
import { ClaimTrack, hops } from "../components/ClaimTrack";
import { Header } from "../components/Header";
import { Sfx } from "../components/Sfx";
import { Stage } from "../components/Stage";
import { useBeat, useCue } from "../explainer/beat";

// The claim hops along the eight stations of the journey, from report to close, while Riphay
// says we'll walk it in the session; "the same care" brings in the tag.
export function Chorus() {
  const b = useBeat();
  const first = 0.8;
  const last = b.seconds - 2.4;
  const t = useSeconds();
  const title = useIn(0);
  const tag = useIn(useCue(1, "same care"));
  const home = useIn(last + 0.2);

  return (
    <Stage chip="The journey">
      <Header />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", ...fadeUp(title) }}>
        <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: -1 }}>
          Follow the <span style={{ color: theme.brandAccent }}>claim</span>
        </div>
      </div>
      <ClaimTrack pos={hops(t, 0, stations.length - 1, first, last)} />
      <BackAtWork p={home} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontSize: 64, fontWeight: 700, ...fadeUp(tag) }}>
        Same care. Better journey.
      </div>
      <Sfx id="whoosh" at={0.3} />
      <Sfx id="ding" at={last + 0.6} />
    </Stage>
  );
}

/** Green "Back at work!" badge, top right: the end of every journey. */
export function BackAtWork({ p }: { p: number }) {
  return (
    <div
      style={{
        ...popIn(p),
        position: "absolute",
        right: 80,
        top: 250,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 28px",
        borderRadius: 999,
        background: theme.brandGreen,
        color: theme.brandPrimary,
        fontSize: 36,
        fontWeight: 900,
      }}
    >
      <HardHat size={40} strokeWidth={2.5} /> Back at work!
    </div>
  );
}
