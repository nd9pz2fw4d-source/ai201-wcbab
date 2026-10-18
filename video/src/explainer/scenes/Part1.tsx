import { BookOpenCheck, Bot, FolderOpen, MessageCircle, PenLine, Search, TrendingUp } from "lucide-react";
import { interpolate } from "remotion";
import { fadeUp, popIn, progress, useIn, useSeconds } from "../../anim";
import { DeloitteLogo, WcbLogo, groundingSources, nextWord, stations, theme } from "../../brand";
import { ClaimTrack, hops } from "../../components/ClaimTrack";
import { Stage } from "../../components/Stage";
import { useBeat, useCue } from "../beat";
import { At, Card, IconDot, Pop, Rise, SceneShell, blue } from "../ui";

// ---------- 0. The opening card, over the song's chorus ----------

export function Sting() {
  const t = useSeconds();
  const fly = useIn(0.2, 12);
  const title = useIn(1.2);
  const sub = useIn(2.2);
  const logos = useIn(3.2);
  return (
    <Stage tone="dawn">
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `translateX(${interpolate(fly, [0, 1], [-1400, 0])}px) translateY(${Math.sin(t * 3) * 6}px) rotate(${interpolate(fly, [0, 1], [-30, -4])}deg)`,
            width: 300,
            height: 210,
            borderRadius: 24,
            background: theme.paper,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            color: theme.ink,
            boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
          }}
        >
          <FolderOpen size={90} color={theme.brandSecondary} strokeWidth={1.8} />
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>CLAIM</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center" }}>
        <div style={{ ...fadeUp(title), fontSize: 140, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>
          Follow the <span style={{ color: theme.brandAccent }}>claim</span>
        </div>
        <div style={{ ...fadeUp(sub), marginTop: 26, fontSize: 56, fontWeight: 500, color: theme.brandTint }}>The fundamentals: a 10-minute pre-read</div>
      </div>
      <div style={{ ...fadeUp(logos), position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", alignItems: "center", gap: 48 }}>
        <WcbLogo height={84} on="dark" />
        <div style={{ width: 2, height: 64, background: theme.brandSky, opacity: 0.5 }} />
        <DeloitteLogo height={46} on="dark" />
      </div>
    </Stage>
  );
}

// ---------- 1. Opening ----------

export function Opening() {
  const b = useBeat();
  const t = useSeconds();
  const journeyFrom = useCue(1);
  const journeyTo = journeyFrom + b.lines[1].seconds;
  const track = useIn(journeyFrom - 0.3);
  const words = [useCue(2, '"AI"'), useCue(2, '"agent"'), useCue(2, '"human in the loop"')];
  const minutes = useCue(2, "about ten minutes");
  // While Ava says hello: what this video is, until the journey takes over.
  const welcome = useIn(0.4) * (1 - progress(t, journeyFrom - 0.6, journeyFrom - 0.1));
  return (
    <SceneShell heading="A shared vocabulary">
      <At x={0} y={330} w={1920} style={{ display: "flex", justifyContent: "center", opacity: welcome }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 28, padding: "32px 44px" }}>
          <IconDot Icon={BookOpenCheck} size={110} />
          <div>
            <div style={{ fontSize: 30, color: theme.muted }}>Before the Executive AI Academy</div>
            <div style={{ fontSize: 56, fontWeight: 700, color: theme.brandPrimary }}>The words we'll all use</div>
          </div>
        </Card>
      </At>
      <div style={{ opacity: track }}>
        <ClaimTrack tone="light" pos={hops(t, 0, stations.length - 1, journeyFrom + 0.5, journeyTo)} />
      </div>
      <At x={0} y={830} w={1920} style={{ display: "flex", justifyContent: "center", gap: 24 }}>
        {["AI", "Agent", "Human in the loop"].map((w, i) => (
          <Pop key={w} at={words[i]}>
            <span style={{ display: "inline-block", padding: "12px 30px", borderRadius: 999, background: theme.agent, color: theme.paper, fontSize: 40, fontWeight: 700 }}>
              {w}
            </span>
          </Pop>
        ))}
        <Pop at={minutes}>
          <span style={{ display: "inline-block", padding: "12px 30px", borderRadius: 999, background: theme.paper, border: `3px solid ${theme.brandSky}`, color: theme.brandPrimary, fontSize: 40, fontWeight: 500 }}>
            10 minutes · 12 ideas
          </span>
        </Pop>
      </At>
    </SceneShell>
  );
}

// ---------- 2. Three kinds of AI ----------

const kinds = [
  { verb: "Predicts", name: "Predictive AI (machine learning)", what: "Learns patterns from past data to score or forecast", example: "How complex is this claim likely to be?", Icon: TrendingUp },
  { verb: "Writes", name: "Generative AI", what: "Summarizes a file, answers questions, drafts a letter", example: "What Copilot does today", Icon: PenLine },
  { verb: "Does", name: "Agent", what: "Takes steps toward a goal, not just answers", example: "Gets a claim ready for a decision", Icon: Bot },
];

export function ThreeKinds() {
  const t = useSeconds();
  const appear = [useCue(1, "The first predicts"), useCue(2), useCue(3)];
  // "Predicts, writes, does": each card lifts as Sam names it.
  const recap = [useCue(4, "Predicts"), useCue(4, "writes"), useCue(4, "does")];
  return (
    <SceneShell>
      {kinds.map((k, i) => {
        const lift = Math.max(0, 1 - Math.abs(t - recap[i] - 0.3) / 0.5);
        return (
          <At key={k.verb} x={80 + i * 600} y={260} w={560}>
            <Pop at={appear[i]}>
              <Card style={{ height: 520, display: "flex", flexDirection: "column", gap: 18, transform: `translateY(${-24 * lift}px)`, borderColor: lift > 0.1 ? theme.brandAccent : theme.brandSky }}>
                <IconDot Icon={k.Icon} size={96} />
                <div style={{ fontSize: 72, fontWeight: 700, color: theme.brandSecondary, lineHeight: 1 }}>{k.verb}</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: theme.brandPrimary }}>{k.name}</div>
                <div style={{ fontSize: 32, color: theme.ink, lineHeight: 1.3 }}>{k.what}</div>
                <div style={{ marginTop: "auto", fontSize: 30, color: theme.muted, fontStyle: "italic" }}>{k.example}</div>
              </Card>
            </Pop>
          </At>
        );
      })}
    </SceneShell>
  );
}

// ---------- 3. The large language model, and hallucination ----------

export function Llm() {
  const llm = useCue(1, "large language model");
  const sentence = useCue(2);
  const scores = useCue(2, "scores");
  const picks = useCue(2, "picks");
  const halluc = useCue(4, "hallucination");
  const verified = useCue(6, "Fluent");
  const grow = progress(useSeconds(), scores, scores + 1.5);
  const picked = useIn(picks);
  const stamp = useIn(halluc + 0.3, 9);
  return (
    <SceneShell heading="It predicts the next word">
      <At x={80} y={250} w={720}>
        <Pop at={llm}>
          <Card>
            <div style={{ fontSize: 64, fontWeight: 700, color: theme.brandSecondary }}>LLM</div>
            <div style={{ fontSize: 34, fontWeight: 500, color: theme.brandPrimary, marginTop: 6 }}>Large language model</div>
            <div style={{ fontSize: 30, marginTop: 14, lineHeight: 1.35 }}>Given the words so far, it predicts a likely next word. Then again, and again.</div>
          </Card>
        </Pop>
      </At>
      <At x={80} y={560} w={720}>
        <Pop at={halluc}>
          <Card tone="risk" style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <IconDot Icon={MessageCircle} size={64} tone="risk" />
              <div style={{ fontSize: 40, fontWeight: 700, color: theme.risk }}>Hallucination</div>
            </div>
            <div style={{ fontSize: 30, marginTop: 14, lineHeight: 1.35 }}>A fluent, confident answer that isn't true.</div>
            <div
              style={{
                position: "absolute",
                right: 24,
                top: -26,
                padding: "6px 18px",
                border: `5px solid ${theme.risk}`,
                borderRadius: 10,
                color: theme.risk,
                background: theme.paper,
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: 2,
                opacity: Math.min(1, stamp * 2),
                transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`,
              }}
            >
              NOT CHECKED
            </div>
          </Card>
        </Pop>
      </At>
      <At x={880} y={250} w={960}>
        <Pop at={sentence}>
          <Card style={{ height: 560 }}>
            <div style={{ fontSize: 46, fontWeight: 500, color: theme.brandPrimary }}>
              {nextWord.prompt.join(" ")} <span style={{ color: theme.brandSecondary, borderBottom: `4px solid ${theme.brandSecondary}` }}>{picked > 0.5 ? nextWord.candidates[0].word : "…"}</span>
            </div>
            <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 18 }}>
              {nextWord.candidates.map((c, i) => (
                <div key={c.word} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 160, fontSize: 32, fontWeight: i === 0 && picked > 0.5 ? 700 : 500 }}>{c.word}</div>
                  <div style={{ height: 38, width: 560 * c.p * 2 * grow, borderRadius: 8, background: i === 0 && picked > 0.5 ? theme.brandSecondary : theme.brandSky }} />
                  <div style={{ fontSize: 28, color: theme.muted, opacity: grow }}>{Math.round(c.p * 100)}%</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 26, fontSize: 22, color: theme.muted }}>Scores are illustrative, not real model output.</div>
          </Card>
        </Pop>
      </At>
      <At x={0} y={850} w={1920} style={{ textAlign: "center" }}>
        <Rise at={verified}>
          <span style={{ fontSize: 56, fontWeight: 700, color: theme.brandPrimary }}>
            Fluent is not the same as {blue("verified")}.
          </span>
        </Rise>
      </At>
    </SceneShell>
  );
}

// ---------- 4. Grounding, and RAG ----------

const ragWords = [
  { letter: "R", word: "Retrieval", what: "Find the right documents" },
  { letter: "A", word: "Augmented", what: "Add them to the question" },
  { letter: "G", word: "Generation", what: "Write the answer from them" },
];

export function Grounding() {
  const question = useCue(0);
  const sources = [useCue(1, "policy manual"), useCue(1, "the claim file"), useCue(1, "medical guidelines")];
  const answer = useCue(1, "answers from those");
  const rag = useCue(2, "RAG");
  const words = [useCue(2, "Retrieval:"), useCue(2, "Augmented:"), useCue(2, "Generation:")];
  const citation = useCue(4, "Citations");
  const ask = useCue(4, "Ask that");
  return (
    <SceneShell heading="Give it the right sources">
      <At x={80} y={260} w={360}>
        <Pop at={question}>
          <Card tone="plain" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <IconDot Icon={Search} size={60} />
            <div style={{ fontSize: 30, fontWeight: 500 }}>What did the clinic say?</div>
          </Card>
        </Pop>
      </At>
      {groundingSources.map((s, i) => (
        <At key={s.label} x={500 + i * 300} y={260} w={270}>
          <Pop at={sources[i]}>
            <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "22px 16px" }}>
              <IconDot Icon={s.icon} size={64} />
              <div style={{ fontSize: 28, fontWeight: 500, textAlign: "center" }}>{s.label}</div>
            </Card>
          </Pop>
        </At>
      ))}
      <At x={1440} y={260} w={400}>
        <Pop at={answer}>
          <Card>
            <div style={{ fontSize: 30, fontWeight: 500 }}>An answer from those sources</div>
            <Pop at={citation} style={{ marginTop: 14 }}>
              <span style={{ display: "inline-block", padding: "6px 18px", borderRadius: 999, background: theme.brandTint, color: theme.brandDeep, fontSize: 26, fontWeight: 700 }}>
                Clinic report, page 2
              </span>
            </Pop>
          </Card>
        </Pop>
      </At>
      <At x={80} y={500} w={1760}>
        <Rise at={rag} style={{ fontSize: 36, fontWeight: 500, color: theme.brandPrimary, marginBottom: 18 }}>
          You'll hear it called {blue("RAG")}: retrieval-augmented generation
        </Rise>
        <div style={{ display: "flex", gap: 30 }}>
          {ragWords.map((r, i) => (
            <Pop key={r.letter} at={i === 0 ? rag : Math.min(words[i], rag + 0.3 * i)} style={{ flex: 1 }}>
              <Card style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ fontSize: 110, fontWeight: 900, color: theme.brandSecondary, lineHeight: 1 }}>{r.letter}</div>
                <WordReveal at={words[i]} word={r.word} what={r.what} />
              </Card>
            </Pop>
          ))}
        </div>
      </At>
      <At x={0} y={850} w={1920} style={{ textAlign: "center" }}>
        <Rise at={ask}>
          <span style={{ fontSize: 46, fontWeight: 500, color: theme.brandPrimary }}>Where did this answer come from, and can I see it?</span>
        </Rise>
      </At>
    </SceneShell>
  );
}

function WordReveal({ at, word, what }: { at: number; word: string; what: string }) {
  const p = useIn(at);
  return (
    <div style={{ ...popIn(p), transformOrigin: "left center" }}>
      <div style={{ fontSize: 40, fontWeight: 700, color: theme.brandPrimary }}>{word}</div>
      <div style={{ fontSize: 28, color: theme.muted, marginTop: 4 }}>{what}</div>
    </div>
  );
}
