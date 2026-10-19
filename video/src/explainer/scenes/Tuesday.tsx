import { BookOpen, Bot, Brain, CalendarCheck, Check, CreditCard, FileText, Hotel, Lock, Plane, Search, TrendingUp, UserRound } from "lucide-react";
import { interpolate } from "remotion";
import { fadeUp, progress, useIn, useSeconds } from "../../anim";
import { DeloitteLogo, WcbLogo, theme } from "../../brand";
import { Stage } from "../../components/Stage";
import { useBeat, useCue } from "../beat";
import { At, Bubble, Card, IconDot, Phone, Pop, Rise, SceneShell, Tag, blue } from "../ui";

// ---------- 0. The opening card, with a whoosh and a stamp ----------

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
          <FileText size={90} color={theme.brandSecondary} strokeWidth={1.8} />
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>PRE-READ</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center" }}>
        <div style={{ ...fadeUp(title), fontSize: 140, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>
          Follow the <span style={{ color: theme.brandAccent }}>claim</span>
        </div>
        <div style={{ ...fadeUp(sub), marginTop: 26, fontSize: 56, fontWeight: 500, color: theme.brandTint }}>Before the session: AI in your day</div>
      </div>
      <div style={{ ...fadeUp(logos), position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", alignItems: "center", gap: 48 }}>
        <WcbLogo height={84} on="dark" />
        <div style={{ width: 2, height: 64, background: theme.brandSky, opacity: 0.5 }} />
        <DeloitteLogo height={46} on="dark" />
      </div>
    </Stage>
  );
}

// ---------- 1. Why watch ----------

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
// A packed week: which hour blocks are booked, per day (illustrative).
const booked = [
  [0, 1, 2, 4, 5, 6],
  [0, 1, 3, 4, 6, 7],
  [1, 2, 3, 5, 6],
  [0, 2, 3, 4, 5, 7],
  [0, 1, 4, 5, 6],
];
const chapters = [
  { n: 1, title: "A Tuesday with AI", phrase: "a day with AI" },
  { n: 2, title: "Watch it work, and slip", phrase: "watch it work" },
  { n: 3, title: "Decode the pitch", phrase: "see through a sales pitch" },
  { n: 4, title: "Three questions to bring", phrase: "three questions" },
];

export function WhyWatch() {
  const week = useIn(0.3);
  const chapterAt = chapters.map((c) => useCue(2, c.phrase));
  const shrink = progress(useSeconds(), chapterAt[0] - 0.6, chapterAt[0]);
  return (
    <SceneShell heading="Why watch this?">
      <At x={80} y={240} w={1000} style={{ opacity: week * (1 - 0.65 * shrink) }}>
        <Card tone="plain">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {days.map((d, i) => (
              <div key={d}>
                <div style={{ fontSize: 26, fontWeight: 700, color: theme.brandPrimary, marginBottom: 8 }}>{d}</div>
                {Array.from({ length: 8 }, (_, h) => (
                  <div key={h} style={{ height: 52, marginBottom: 6, borderRadius: 8, background: booked[i].includes(h) ? theme.brandSky : theme.brandLight }} />
                ))}
              </div>
            ))}
          </div>
        </Card>
      </At>
      <At x={1140} y={240} w={700} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {chapters.map((c, i) => (
          <Pop key={c.n} at={chapterAt[i]}>
            <Card style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 26px" }}>
              <div style={{ flex: "none", width: 64, height: 64, borderRadius: "50%", background: theme.agent, color: theme.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700 }}>{c.n}</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: theme.brandPrimary }}>{c.title}</div>
            </Card>
          </Pop>
        ))}
      </At>
    </SceneShell>
  );
}

// ---------- 2. 7:30 am: the next word ----------

const typed = "Running late, be there in";

export function NextWord() {
  const t = useSeconds();
  const b = useBeat();
  const typeFrom = useCue(0, "You're texting");
  const typeTo = typeFrom + b.lines[0].seconds * 0.45;
  const shown = typed.slice(0, Math.round(typed.length * progress(t, typeFrom, typeTo)));
  const suggest = useCue(0, "finishes the sentence");
  const llm = useCue(1, "A large language model");
  const fluent = useCue(3, "fluently");
  const wrong = useCue(3, "can be wrong");
  const alone = useCue(3, "On its own");
  return (
    <SceneShell heading="7:30 am · The next word">
      <Phone x={200} y={230} title="Team">
        <Bubble me>
          {shown}
          <span style={{ opacity: Math.round(t * 2) % 2 }}>|</span>
        </Bubble>
        <Pop at={suggest} style={{ display: "flex", gap: 10, justifyContent: "center", borderTop: `2px solid ${theme.line}`, paddingTop: 14 }}>
          {["10", "five", "a minute"].map((w, i) => (
            <span key={w} style={{ padding: "8px 18px", borderRadius: 12, background: i === 0 ? theme.agent : theme.brandLight, color: i === 0 ? theme.paper : theme.brandPrimary, fontSize: 26, fontWeight: 700 }}>
              {w}
            </span>
          ))}
        </Pop>
      </Phone>
      <At x={820} y={250} w={1020}>
        <Pop at={llm}>
          <Card style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <IconDot Icon={Brain} size={100} />
            <div>
              <div style={{ fontSize: 48, fontWeight: 700, color: theme.brandSecondary }}>Large language model (LLM)</div>
              <div style={{ fontSize: 32, marginTop: 6 }}>Predicts a likely next word, again and again</div>
            </div>
          </Card>
        </Pop>
      </At>
      <At x={820} y={500} w={1020} style={{ display: "flex", gap: 20 }}>
        <Pop at={fluent} style={{ flex: 1 }}>
          <Card style={{ height: 180 }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: theme.brandSecondary }}>Fluent</div>
            <div style={{ fontSize: 28, marginTop: 8 }}>Trained on a huge amount of text</div>
          </Card>
        </Pop>
        <Pop at={wrong} style={{ flex: 1 }}>
          <Card tone="risk" style={{ height: 180 }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: theme.risk }}>Not checked</div>
            <div style={{ fontSize: 28, marginTop: 8 }}>What sounds likely, not what's true</div>
          </Card>
        </Pop>
      </At>
      <At x={820} y={720} w={1020} style={{ display: "flex", gap: 16 }}>
        <Pop at={alone}>
          <Tag tone="plain">On its own: no fact check</Tag>
        </Pop>
        <Pop at={alone + 0.6}>
          <Tag tone="plain">No access to our files</Tag>
        </Pop>
      </At>
    </SceneShell>
  );
}

// ---------- 3. 8:15 am: the bank alert ----------

export function BankAlert() {
  const t = useSeconds();
  const text = useCue(0, "Your bank texts you");
  const predictive = useCue(1, "Predictive AI");
  const scores = useCue(1, "scores how unusual");
  const meter = progress(t, scores, scores + 1.2);
  const wcb = useCue(1, "WCB already");
  const reply = useCue(2, "It asks you");
  const flags = useCue(2, "the machine flags");
  const decides = useCue(2, "a person decides");
  return (
    <SceneShell heading="8:15 am · A text from the bank">
      <Phone x={200} y={230} title="Your bank">
        <Pop at={text}>
          <Bubble>Did you just spend $1,240 in another city? Reply YES or NO.</Bubble>
        </Pop>
        <Pop at={reply}>
          <Bubble me>NO</Bubble>
        </Pop>
      </Phone>
      <At x={820} y={250} w={1020}>
        <Pop at={predictive}>
          <Card style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <IconDot Icon={TrendingUp} size={100} />
            <div>
              <div style={{ fontSize: 48, fontWeight: 700, color: theme.brandSecondary }}>Predictive AI</div>
              <div style={{ fontSize: 32, marginTop: 6 }}>Machine learning: learns from past data, then scores or forecasts</div>
            </div>
          </Card>
        </Pop>
      </At>
      <At x={820} y={480} w={1020}>
        <Pop at={scores}>
          <Card tone="plain">
            <div style={{ fontSize: 28, fontWeight: 500, color: theme.brandPrimary }}>How unusual is this purchase?</div>
            <div style={{ marginTop: 14, height: 34, borderRadius: 17, background: theme.brandLight, overflow: "hidden" }}>
              <div style={{ width: `${meter * 92}%`, height: "100%", background: `linear-gradient(90deg, ${theme.brandSky}, ${theme.risk})` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: theme.muted, marginTop: 6 }}>
              <span>Usual</span>
              <span>Very unusual</span>
            </div>
          </Card>
        </Pop>
      </At>
      <At x={820} y={680} w={1020} style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Pop at={wcb}>
          <Tag tone="plain">WCB uses this to forecast and to sort</Tag>
        </Pop>
      </At>
      <At x={820} y={780} w={1020} style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Pop at={flags}>
          <Tag>
            <CreditCard size={28} strokeWidth={2.5} /> The machine flags
          </Tag>
        </Pop>
        <Pop at={decides}>
          <Tag tone="human">
            <UserRound size={28} strokeWidth={2.5} /> A person decides
          </Tag>
        </Pop>
      </At>
    </SceneShell>
  );
}

// ---------- 4. 10:00 am: "page four" ----------

export function PageFour() {
  const ask = useCue(0, "You ask a colleague");
  const page = useCue(0, "page four");
  const grounding = useCue(1, "That's grounding");
  const maybe = useCue(2);
  const rag = useCue(3, "RAG");
  const steps = [useCue(3, "Retrieve"), useCue(3, "add them"), useCue(3, "generate the answer")];
  const onlyAsGood = useCue(3, "only as good");
  return (
    <SceneShell heading={'10:00 am · "It\'s on page 4"'}>
      <Phone x={200} y={230} title="Chat with a colleague">
        <Pop at={ask}>
          <Bubble me>Does the policy cover this case?</Bubble>
        </Pop>
        <Pop at={page}>
          <Bubble>
            Yes. Section 3.2, page 4 of the policy.
            <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 10, background: theme.paper, color: theme.brandDeep, fontSize: 22, fontWeight: 700 }}>
              <BookOpen size={22} /> Policy manual, p. 4
            </div>
          </Bubble>
        </Pop>
        <Pop at={maybe}>
          <Bubble style={{ background: theme.paper, border: `3px dashed ${theme.risk}`, color: theme.risk }}>I think so?</Bubble>
        </Pop>
      </Phone>
      <At x={820} y={250} w={1020}>
        <Pop at={grounding}>
          <Card style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <IconDot Icon={BookOpen} size={100} />
            <div>
              <div style={{ fontSize: 48, fontWeight: 700, color: theme.brandSecondary }}>Grounding</div>
              <div style={{ fontSize: 32, marginTop: 6 }}>Look things up in trusted sources, answer from them, and show where</div>
            </div>
          </Card>
        </Pop>
      </At>
      <At x={820} y={480} w={1020}>
        <Rise at={rag} style={{ fontSize: 34, fontWeight: 500, color: theme.brandPrimary, marginBottom: 14 }}>
          Also called {blue("RAG")}: retrieval-augmented generation
        </Rise>
        <div style={{ display: "flex", gap: 18 }}>
          {[
            { l: "R", w: "Retrieve", d: "the right documents", Icon: Search },
            { l: "A", w: "Augment", d: "the question with them", Icon: FileText },
            { l: "G", w: "Generate", d: "the answer from them", Icon: Bot },
          ].map((r, i) => (
            <Pop key={r.l} at={steps[i]} style={{ flex: 1 }}>
              <Card style={{ height: 190 }}>
                <div style={{ fontSize: 64, fontWeight: 900, color: theme.brandSecondary, lineHeight: 1 }}>{r.l}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: theme.brandPrimary, marginTop: 6 }}>{r.w}</div>
                <div style={{ fontSize: 26, color: theme.muted }}>{r.d}</div>
              </Card>
            </Pop>
          ))}
        </div>
      </At>
      <At x={820} y={780} w={1020}>
        <Pop at={onlyAsGood}>
          <Tag tone="gold">Only as good as the documents we give it</Tag>
        </Pop>
      </At>
    </SceneShell>
  );
}

// ---------- 5. 1:00 pm: the trip ----------

const flights = ["7:05 am · direct · $412", "9:40 am · direct · $455", "12:15 pm · 1 stop · $389"];

export function Trip() {
  const t = useSeconds();
  const chatbot = useCue(1, "A chatbot");
  const agent = useCue(1, "An agent books");
  const parts = [useCue(1, "a goal"), useCue(1, "tools"), useCue(1, "memory"), useCue(1, "instructions")];
  const loop = [useCue(1, "plans a step"), useCue(1, "acts,"), useCue(1, "checks the result")];
  const access = [useCue(2, "search flights"), useCue(2, "hold a hotel"), useCue(2, "can't spend")];
  const least = useCue(2, "least privilege");
  const pay = useCue(3, "stops before it pays");
  const dial = [useCue(3, "just suggesting"), useCue(3, "to drafting"), useCue(3, "acting with approval"), useCue(3, "acting alone")];
  const hitl = useCue(3, "human in the loop");
  const kinds = [useCue(4, "predicts"), useCue(4, "writes"), useCue(4, "does")];
  // The needle follows Ava through the settings, then rests where this agent sits: it acted, but asked first.
  const dialPos = t >= hitl ? 2 : [0, 1, 2, 4][Math.max(0, dial.filter((d) => t >= d).length - 1)];
  // The right panel moves through three moments: the agent at work, its access, the payment.
  const phase = t >= pay ? 2 : t >= access[0] - 0.3 ? 1 : 0;
  return (
    <SceneShell heading="1:00 pm · A trip to Calgary">
      <At x={80} y={240} w={560}>
        <Pop at={chatbot}>
          <Card tone="plain" style={{ height: 560 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <IconDot Icon={Bot} size={60} />
              <div style={{ fontSize: 36, fontWeight: 700, color: theme.brandPrimary }}>A chatbot lists</div>
            </div>
            {flights.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22, fontSize: 28 }}>
                <Plane size={28} color={theme.brandSecondary} /> {f}
              </div>
            ))}
            <div style={{ marginTop: 30, fontSize: 26, color: theme.muted }}>Then it's up to you.</div>
          </Card>
        </Pop>
      </At>
      <At x={680} y={240} w={1160}>
        <Pop at={agent}>
          <Card style={{ height: 560, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <IconDot Icon={Bot} size={60} />
              <div style={{ fontSize: 36, fontWeight: 700, color: theme.brandSecondary }}>An agent books the trip</div>
            </div>
            {phase === 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {["Goal: Calgary, Thursday", "Tools: booking sites", "Memory: aisle seat", "Instructions: travel policy"].map((p, i) => (
                    <Pop key={p} at={parts[i]}>
                      <Tag tone="plain" style={{ fontSize: 24 }}>
                        {p}
                      </Tag>
                    </Pop>
                  ))}
                </div>
                {[
                  { Icon: Plane, s: "Plan: find a morning flight" },
                  { Icon: Hotel, s: "Act: hold a hotel near the office" },
                  { Icon: CalendarCheck, s: "Check: it fits the calendar" },
                ].map((st, i) => (
                  <Pop key={st.s} at={loop[i]} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, fontSize: 30 }}>
                    <IconDot Icon={st.Icon} size={52} /> {st.s} <Check size={32} color={theme.human} strokeWidth={3} />
                  </Pop>
                ))}
              </div>
            )}
            {phase === 1 && (
              <div style={{ marginTop: 26 }}>
                {[
                  { s: "Search flights", ok: true },
                  { s: "Hold a hotel", ok: true },
                  { s: "Spend from the company account", ok: false },
                ].map((a, i) => (
                  <Pop key={a.s} at={access[i]} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, fontSize: 32 }}>
                    {a.ok ? <Check size={40} color={theme.human} strokeWidth={3} /> : <Lock size={40} color={theme.risk} strokeWidth={2.5} />}
                    <span style={{ color: a.ok ? theme.ink : theme.risk }}>{a.s}</span>
                  </Pop>
                ))}
                <Pop at={least} style={{ marginTop: 30 }}>
                  <Tag>Least privilege: only the access the job needs</Tag>
                </Pop>
              </div>
            )}
            {phase === 2 && (
              <div style={{ marginTop: 22, display: "flex", gap: 30, alignItems: "flex-start" }}>
                <Card tone="human" style={{ width: 420, textAlign: "center" }}>
                  <div style={{ fontSize: 40, fontWeight: 700, color: theme.brandPrimary }}>Pay $1,860?</div>
                  <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 20 }}>
                    <Tag tone="human">Approve</Tag>
                    <Tag tone="plain">Decline</Tag>
                  </div>
                </Card>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: theme.brandPrimary }}>The autonomy dial</div>
                  {["Suggests", "Drafts", "Acts with approval", "Acts, then reports", "Acts alone"].map((l, i) => (
                    <div key={l} style={{ marginTop: 8, padding: "6px 16px", borderRadius: 10, fontSize: 26, fontWeight: 700, background: i === dialPos && t >= dial[0] ? theme.agent : theme.brandLight, color: i === dialPos && t >= dial[0] ? theme.paper : theme.brandPrimary }}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {phase === 2 && (
              <Pop at={hitl} style={{ position: "absolute", left: 28, bottom: 26 }}>
                <Tag tone="human">
                  <UserRound size={28} strokeWidth={2.5} /> You, approving: the human in the loop
                </Tag>
              </Pop>
            )}
          </Card>
        </Pop>
      </At>
      <At x={0} y={835} w={1920} style={{ display: "flex", justifyContent: "center", gap: 18 }}>
        {["Predicts", "Writes", "Does"].map((k, i) => (
          <Pop key={k} at={kinds[i]}>
            <Tag style={{ fontSize: 34 }}>
              {k}
            </Tag>
          </Pop>
        ))}
      </At>
    </SceneShell>
  );
}
