import { BookOpen, Check, CircleCheck, FileText, Search, Send, Stethoscope, UserRound } from "lucide-react";
import { interpolate } from "remotion";
import { progress, useIn, useSeconds } from "../../anim";
import { theme } from "../../brand";
import { useBeat, useCue } from "../beat";
import { AssistantWindow, At, Bubble, Card, Pop, Rise, SceneShell, Tag, blue } from "../ui";

/** "Think about it" countdown, shown during the pause written after line i in the script. */
function ThinkPause({ line, question }: { line: number; question: string }) {
  const b = useBeat();
  const t = useSeconds();
  const l = b.lines[line];
  const from = l.at + l.seconds;
  const to = from + (l.pauseAfter ?? 0);
  const on = t >= from - 0.2 && t < to + 0.3;
  const left = Math.max(1, Math.ceil(to - t));
  const ring = progress(t, from, to);
  if (!on) return null;
  return (
    <At x={0} y={0} w={1920} h={1080} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(242,250,254,0.75)" }}>
      <Card style={{ display: "flex", alignItems: "center", gap: 30, padding: "30px 44px" }}>
        <svg width={120} height={120}>
          <circle cx={60} cy={60} r={50} fill="none" stroke={theme.brandTint} strokeWidth={12} />
          <circle cx={60} cy={60} r={50} fill="none" stroke={theme.agent} strokeWidth={12} strokeDasharray={`${2 * Math.PI * 50}`} strokeDashoffset={`${2 * Math.PI * 50 * ring}`} transform="rotate(-90 60 60)" />
          <text x={60} y={74} textAnchor="middle" fontSize={44} fontWeight={700} fill={theme.brandPrimary} fontFamily="Roboto">
            {left}
          </text>
        </svg>
        <div style={{ fontSize: 52, fontWeight: 700, color: theme.brandPrimary }}>{question}</div>
      </Card>
    </At>
  );
}

// ---------- 6. Two summaries ----------

const points = ["Launch moves to May 12", "Budget stays at this year's level", "Two open risks: vendor timing, training"];
const sources = ["Message 12", "Message 27", "Message 38"];

export function TwoSummaries() {
  const prompt = useCue(0, "Here are two summaries");
  const answers = useCue(0, "Which would you trust");
  const pick = useCue(1);
  const medical = useCue(2, "picture a thick medical file");
  const picked = useIn(pick);
  return (
    <SceneShell heading="Two summaries. Which would you trust?">
      <AssistantWindow x={80} y={240} w={1760} h={560} prompt="Summarize this 40-message email thread">
        <Pop at={prompt} style={{ display: "flex", gap: 28 }}>
          {["A", "B"].map((k, i) => (
            <Card key={k} tone={i === 0 && picked > 0.5 ? "human" : "plain"} style={{ flex: 1, position: "relative" }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: theme.brandPrimary, marginBottom: 10 }}>Summary {k}</div>
              {points.map((p, j) => (
                <div key={p} style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 28 }}>• {p}</div>
                  {i === 0 && (
                    <Pop at={answers + 0.2 * j} style={{ marginLeft: 22, marginTop: 4 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 12px", borderRadius: 8, background: theme.brandTint, color: theme.brandDeep, fontSize: 20, fontWeight: 700 }}>
                        <FileText size={18} /> {sources[j]}
                      </span>
                    </Pop>
                  )}
                </div>
              ))}
              {i === 0 && (
                <div style={{ position: "absolute", right: 22, top: 18, opacity: picked, transform: `scale(${interpolate(picked, [0, 1], [1.6, 1])})` }}>
                  <CircleCheck size={60} color={theme.human} strokeWidth={2.5} />
                </div>
              )}
            </Card>
          ))}
        </Pop>
      </AssistantWindow>
      <At x={0} y={850} w={1920} style={{ display: "flex", justifyContent: "center", gap: 18 }}>
        <Pop at={pick + 0.5}>
          <Tag>
            <Search size={28} strokeWidth={2.5} /> Look for the source
          </Tag>
        </Pop>
        <Pop at={medical}>
          <Tag tone="plain">
            <Stethoscope size={28} strokeWidth={2.5} /> A medical file? Show the page.
          </Tag>
        </Pop>
      </At>
      <ThinkPause line={0} question="Which would you trust?" />
    </SceneShell>
  );
}

// ---------- 7. The confident answer ----------

const madeUp = "On Tuesday, the leadership team approved a new triage model, starting June 1, with a budget of $2.4 million.";

export function ConfidentAnswer() {
  const t = useSeconds();
  const b = useBeat();
  const notRoom = useCue(0, "It wasn't in the room");
  const guess = useCue(1);
  const answerFrom = useCue(2, "it gives");
  const answerTo = answerFrom + b.lines[2].seconds * 0.45;
  const typed = madeUp.slice(0, Math.round(madeUp.length * progress(t, answerFrom, answerTo)));
  const stamp = useIn(useCue(2, "none of it happened"), 9);
  const halluc = useCue(2, "hallucination");
  const fixes = [useCue(4, "ground it"), useCue(4, "ask where"), useCue(4, "have a person check")];
  const fluent = useCue(4, "Fluent");
  return (
    <SceneShell heading="A question it can't answer">
      <AssistantWindow x={80} y={240} w={1100} h={560} prompt="What did the leadership team decide last Tuesday?">
        <Pop at={notRoom} style={{ display: "flex", gap: 12 }}>
          <Tag tone="plain" style={{ fontSize: 22 }}>
            It wasn't in the room
          </Tag>
          <Tag tone="plain" style={{ fontSize: 22 }}>
            No one gave it the notes
          </Tag>
        </Pop>
        {typed && (
          <div style={{ position: "relative" }}>
            <Bubble style={{ fontSize: 30, maxWidth: "100%" }}>{typed}</Bubble>
            <div
              style={{
                position: "absolute",
                right: 30,
                bottom: -64,
                padding: "6px 20px",
                border: `6px solid ${theme.risk}`,
                borderRadius: 12,
                color: theme.risk,
                background: theme.paper,
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: 3,
                opacity: Math.min(1, stamp * 2),
                transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`,
              }}
            >
              MADE UP
            </div>
          </div>
        )}
      </AssistantWindow>
      <At x={1240} y={240} w={600} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Pop at={guess}>
          <Card tone="plain">
            <div style={{ fontSize: 24, color: theme.muted }}>You might expect</div>
            <div style={{ fontSize: 32, fontWeight: 500 }}>"I don't know."</div>
          </Card>
        </Pop>
        <Pop at={halluc}>
          <Card tone="risk">
            <div style={{ fontSize: 44, fontWeight: 700, color: theme.risk }}>Hallucination</div>
            <div style={{ fontSize: 28, marginTop: 6 }}>A fluent, confident answer that isn't true</div>
          </Card>
        </Pop>
        {[
          { s: "Ground it in the right sources", Icon: BookOpen },
          { s: "Ask where the answer came from", Icon: Search },
          { s: "A person checks what matters", Icon: UserRound },
        ].map((f, i) => (
          <Pop key={f.s} at={fixes[i]}>
            <Tag tone={i === 2 ? "human" : "agent"} style={{ fontSize: 26 }}>
              <f.Icon size={26} strokeWidth={2.5} /> {f.s}
            </Tag>
          </Pop>
        ))}
      </At>
      <At x={0} y={860} w={1920} style={{ textAlign: "center" }}>
        <Rise at={fluent}>
          <span style={{ fontSize: 52, fontWeight: 700, color: theme.brandPrimary }}>Fluent is not the same as {blue("verified")}.</span>
        </Rise>
      </At>
      <ThinkPause line={0} question="What do you think happens?" />
    </SceneShell>
  );
}

// ---------- 8. The draft ----------

const before = "We apologize for any inconvenience this may have caused.";
const after = "I'm sorry this has taken so long, and I want to explain what happens next.";

export function TheDraft() {
  const draft = useCue(0, "It drafts a reply");
  const edit = useCue(0, "changes one sentence");
  const send = useCue(0, "only then sends it");
  const edited = useIn(edit);
  const sent = useIn(send);
  const owns = useCue(2, "owns it");
  const helps = useCue(2, "AI can draft");
  const stays = useCue(2, "a person stays in the loop");
  return (
    <SceneShell heading="A draft, and a person">
      <AssistantWindow x={80} y={240} w={1100} h={600} prompt="Draft a reply to a worker upset about a delay">
        <Pop at={draft}>
          <Card tone="plain" style={{ fontSize: 28, lineHeight: 1.45 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <Tag style={{ fontSize: 20, padding: "4px 14px" }}>AI draft</Tag>
              {edited > 0.5 && (
                <Tag tone="human" style={{ fontSize: 20, padding: "4px 14px" }}>
                  Edited by a person
                </Tag>
              )}
            </div>
            <div>Hello,</div>
            <div style={{ marginTop: 8 }}>Thank you for your message about your claim.</div>
            <div style={{ marginTop: 8 }}>
              {edited < 0.5 ? (
                <span style={{ background: edited > 0.05 ? "#FDE7E7" : "transparent" }}>{before}</span>
              ) : (
                <span style={{ background: "#E6F2DA", color: theme.human, fontWeight: 500 }}>{after}</span>
              )}
            </div>
            <div style={{ marginTop: 8 }}>Your file is with the medical review team, and you'll hear from us by Friday.</div>
          </Card>
        </Pop>
        <Pop at={send} style={{ alignSelf: "flex-end" }}>
          <Tag tone="human" style={{ fontSize: 30, transform: `scale(${1 + 0.1 * Math.max(0, 1 - sent)})` }}>
            <Send size={28} strokeWidth={2.5} /> Sent by a person <Check size={28} strokeWidth={3} />
          </Tag>
        </Pop>
      </AssistantWindow>
      <At x={1240} y={240} w={600} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Pop at={owns}>
          <Card tone="human">
            <div style={{ fontSize: 26, color: theme.muted }}>If it had gone out wrong?</div>
            <div style={{ fontSize: 38, fontWeight: 700, color: theme.human, marginTop: 4 }}>The person who sent it owns it</div>
          </Card>
        </Pop>
        <Pop at={helps}>
          <Card>
            <div style={{ fontSize: 30, fontWeight: 700, color: theme.brandSecondary }}>AI drafts, sorts and fetches</div>
            <div style={{ fontSize: 28, marginTop: 6 }}>Accountability doesn't move to the machine</div>
          </Card>
        </Pop>
        <Pop at={stays}>
          <Tag tone="human" style={{ fontSize: 26 }}>
            <UserRound size={26} strokeWidth={2.5} /> Reaches a worker or decides benefits: a person stays in the loop
          </Tag>
        </Pop>
      </At>
    </SceneShell>
  );
}
