import { fadeUp, progress, useIn, useSeconds } from "../anim";
import { futureYear, stations, suggestedSort, theme } from "../brand";
import { ClaimTrack, hops, type Role } from "../components/ClaimTrack";
import { Header } from "../components/Header";
import { Stage } from "../components/Stage";
import { useSectionTiming } from "../sectionTiming";
import { doneWellTravel } from "../timeline";
import { BackAtWork } from "./Chorus";

// Who does the work at each station: the deck's suggested sort (src/data/sortAnswer.ts),
// where "Keep human-led" stations are a person's and the rest are agent-assisted.
const roles: Role[] = stations.map((st) => (suggestedSort[st.id] === "human" ? "person" : "agent"));
const DECIDE = stations.findIndex((st) => st.id === "entitlement");

// Final chorus. The same claim in the future: agents carry it to the decision, everything
// pauses on "A person decides", then it finishes the journey and the worker is back at work.
export function DoneWell() {
  const s = useSectionTiming();
  const { depart, decide, resume, home } = doneWellTravel(s);
  const t = useSeconds();
  const pos = t < resume ? hops(t, 0, DECIDE, depart, decide) : hops(t, DECIDE, stations.length - 1, resume, home);
  // The rest of the journey dims while the person decides.
  const dim = Math.min(progress(t, decide, decide + 0.4), 1 - progress(t, resume, resume + 0.4));
  const swap = progress(t, decide - 0.2, decide + 0.2);
  const title = useIn(0);
  const decides = useIn(decide);
  const tagline = useIn(resume);
  const back = useIn(home + 0.2);

  return (
    <Stage chip={`The claim in ${futureYear}`}>
      <Header />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, height: 150, textAlign: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, fontSize: 120, fontWeight: 900, letterSpacing: -1, ...fadeUp(title), opacity: Math.min(1, title) * (1 - swap) }}>
          The claim, <span style={{ color: theme.brandAccent }}>done well</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, fontSize: 120, fontWeight: 900, letterSpacing: -1, ...fadeUp(decides) }}>
          A <span style={{ color: theme.human }}>person</span> decides.
        </div>
      </div>
      <ClaimTrack pos={pos} roles={roles} dim={dim} focus={DECIDE} />
      <BackAtWork p={back} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontSize: 56, fontWeight: 700, ...fadeUp(tagline) }}>
        Agents do the legwork. <span style={{ color: theme.human }}>People make the call.</span>
      </div>
    </Stage>
  );
}
