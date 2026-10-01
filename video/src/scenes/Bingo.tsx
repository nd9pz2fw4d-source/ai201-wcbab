import { Check } from "lucide-react";
import { fadeUp, useIn } from "../anim";
import { theme } from "../brand";
import { bingoFree, terms } from "../content";
import { Header } from "../components/Header";
import { Stage } from "../components/Stage";
import { useSectionTiming } from "../sectionTiming";
import { bingoMarkAt } from "../timeline";

// The eight terms around a free centre square, in a 3 x 3 grid.
const squares = [...terms.slice(0, 4).map((t) => t.short), bingoFree, ...terms.slice(4).map((t) => t.short)];
const FREE = 4;
/** Order the squares get marked in; the centre square is free. */
const markOrder = [0, 4, 8, 2, 6, 1, 7, 3, 5].filter((i) => i !== FREE);

// Final chorus. Buzzword bingo: the terms get marked as the chorus plays.
export function Bingo() {
  const s = useSectionTiming();
  const head = useIn(0);
  const rules = useIn(1);
  const win = useIn(s.seconds - 2);

  return (
    <Stage chip="Game on">
      <Header />
      <div style={{ position: "absolute", left: 80, top: 190, width: 700 }}>
        <div style={{ fontSize: 100, fontWeight: 900, lineHeight: 1, ...fadeUp(head) }}>
          Buzzword <span style={{ color: theme.brandAccent }}>bingo</span>
        </div>
        <div style={{ fontSize: 42, lineHeight: 1.35, marginTop: 40, color: theme.brandTint, ...fadeUp(rules) }}>
          Mark a square each time you hear a term today.
          <br />
          <br />
          First full line wins bragging rights.
        </div>
        <div
          style={{
            ...fadeUp(win),
            marginTop: 50,
            display: "inline-block",
            padding: "14px 30px",
            borderRadius: 999,
            background: theme.brandGreen,
            color: theme.brandPrimary,
            fontSize: 40,
            fontWeight: 900,
          }}
        >
          BINGO!
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 190,
          width: 960,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {squares.map((label, i) => (
          <Square key={label} label={label} free={i === FREE} markAt={i === FREE ? 0 : bingoMarkAt(markOrder.indexOf(i), s)} />
        ))}
      </div>
    </Stage>
  );
}

function Square({ label, free, markAt }: { label: string; free: boolean; markAt: number }) {
  const mark = useIn(markAt, 10);
  const marked = mark > 0.4;
  return (
    <div
      style={{
        position: "relative",
        height: 190,
        borderRadius: 24,
        background: free ? theme.brandAccent : theme.paper,
        color: theme.brandPrimary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "30px 20px 0",
        fontSize: 40,
        fontWeight: 900,
        lineHeight: 1.1,
      }}
    >
      {label}
      {!free && (
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: theme.agent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: marked ? 1 : 0,
            transform: `scale(${0.4 + mark * 0.6}) rotate(${(1 - mark) * -90}deg)`,
          }}
        >
          <Check size={32} color={theme.paper} strokeWidth={4} />
        </div>
      )}
    </div>
  );
}
