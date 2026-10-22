import { AnimatePresence, motion } from "framer-motion";
import { Check, Lightbulb, Minus, Plus, Printer, UserRound } from "lucide-react";
import { CountdownTimer } from "../components/CountdownTimer";
import { Interactive } from "../components/Interactive";
import { Headline } from "../components/Text";
import {
  autonomyRow,
  defaultTables,
  designAgents,
  MAX_TABLES,
  MIN_TABLES,
  threeRights,
  workedExample,
  worksheetRows,
  type DesignAgent,
} from "../data/designAgent";
import { stationIndex, stations } from "../data/journey";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";

type Phase = "design" | "share";

const agentById = (id: string) => designAgents.find((a) => a.id === id) as DesignAgent;
const cardShadow = "0 1px 0 #C9DDEA, 0 14px 36px rgba(12,53,83,0.08)";

/** Table exercise: each table designs one agent for one step of the claim, then the room sees the team they built. */
export default function SlideDesignAgent() {
  const [phase, setPhase] = useSlideState<Phase>("design:phase", "design");
  const [tables, setTables] = useSlideState<string[]>("design:tables", defaultTables);
  const [example, setExample] = useSlideState("design:example", false);
  const [autonomy, setAutonomy] = useSlideState("design:autonomy", false);
  const [shared, setShared] = useSlideState<number[]>("design:shared", []);

  const unused = () => designAgents.filter((a) => !tables.includes(a.id));
  const addTable = () => tables.length < MAX_TABLES && setTables([...tables, unused()[0].id]);
  const removeTable = () => {
    if (tables.length <= MIN_TABLES) return;
    setTables(tables.slice(0, -1));
    setShared((s) => s.filter((i) => i < tables.length - 1));
  };
  // Click a table to give it the next agent no other table has, in journey order.
  const cycle = (t: number) => {
    const free = designAgents.filter((a) => a.id === tables[t] || !tables.includes(a.id));
    const next = free[(free.findIndex((a) => a.id === tables[t]) + 1) % free.length];
    setTables(tables.map((id, i) => (i === t ? next.id : id)));
  };

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[70px]">
        <Headline size={68}>{phase === "design" ? "Design an agent for our claim" : "Together, we designed a claims agent team"}</Headline>
      </div>

      {/* Phase switch */}
      <Interactive className="absolute right-[100px] top-[84px] z-10 flex rounded-full bg-white p-1.5" style={{ boxShadow: cardShadow }}>
        {(["design", "share"] as Phase[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPhase(p)}
            className="rounded-full px-6 py-2.5 text-[24px] font-medium transition"
            style={phase === p ? { background: theme.agent, color: "#fff" } : { color: theme.brandPrimary }}
          >
            {p === "design" ? "Design · 5 min" : "Share back"}
          </button>
        ))}
      </Interactive>

      <AnimatePresence mode="wait" initial={false}>
        {phase === "design" ? (
          <motion.div key="design" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Worksheet example={example} autonomy={autonomy} onExample={() => setExample(!example)} onAutonomy={() => setAutonomy(!autonomy)} />
            <Rights />
            <div className="absolute left-[1220px] top-[648px] flex w-[600px] items-center gap-6">
              <CountdownTimer minutes={5} size={170} />
              <div className="text-[24px] leading-snug" style={{ color: theme.ink }}>
                One agent per table.
                <br />
                On paper. <b>Then 30 seconds each</b> to share.
              </div>
            </div>
            <TablesStrip tables={tables} onCycle={cycle} onAdd={addTable} onRemove={removeTable} />
          </motion.div>
        ) : (
          <motion.div key="share" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ShareBack tables={tables} shared={shared} onToggle={(t) => setShared((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Worksheet({ example, autonomy, onExample, onAutonomy }: { example: boolean; autonomy: boolean; onExample: () => void; onAutonomy: () => void }) {
  const rows = autonomy ? [...worksheetRows, autonomyRow] : worksheetRows;
  return (
    <div className="absolute left-[100px] top-[190px] w-[1070px] overflow-hidden rounded-3xl bg-white" style={{ boxShadow: cardShadow }}>
      <div className="flex items-center gap-4 px-8 py-4" style={{ background: theme.brandPrimary }}>
        <span className="text-[30px] font-bold text-white">{example ? `Example: ${workedExample.agent}` : "Our agent:"}</span>
        {!example && <span className="h-[3px] w-[220px] translate-y-3 bg-white/40" />}
        <Interactive className="ml-auto flex gap-2">
          <ToggleChip on={example} onClick={onExample}>
            <Lightbulb size={20} /> Example
          </ToggleChip>
          <ToggleChip on={autonomy} onClick={onAutonomy}>
            + Autonomy
          </ToggleChip>
          <ToggleChip on={false} onClick={() => window.print()} label="Print handouts">
            <Printer size={20} />
          </ToggleChip>
        </Interactive>
      </div>
      {rows.map((r, i) => {
        const Icon = r.icon;
        const optional = r === autonomyRow;
        return (
          <motion.div
            key={r.element}
            className="flex h-[104px] items-center gap-6 px-8"
            style={{ borderTop: i ? `2px ${optional ? "dashed" : "solid"} #E4EEF5` : undefined }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: optional ? 0 : 0.3 + i * 0.12 }}
          >
            <span className="grid h-[64px] w-[64px] shrink-0 place-items-center rounded-full" style={{ background: optional ? theme.brandSky : theme.agent }}>
              <Icon size={32} color="#fff" />
            </span>
            <div className="w-[400px] shrink-0">
              <div className="text-[30px] font-bold leading-tight" style={{ color: theme.brandPrimary }}>
                {r.element}
                {optional && <span className="ml-2 text-[20px] font-medium" style={{ color: theme.muted }}>optional</span>}
              </div>
              <div className="text-[23px] leading-snug" style={{ color: theme.muted }}>
                {r.question}
              </div>
            </div>
            {example ? (
              <div className="flex-1 text-[23px] italic leading-snug" style={{ color: theme.ink }}>
                {workedExample.rows[r.element]}
              </div>
            ) : (
              <div className="h-[2px] flex-1 translate-y-5" style={{ background: "repeating-linear-gradient(90deg, #C9DDEA 0 10px, transparent 10px 18px)" }} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function ToggleChip({ on, onClick, label, children }: { on: boolean; onClick: () => void; label?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={label ? undefined : on}
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex items-center gap-2 rounded-full px-4 py-1.5 text-[20px] font-medium transition"
      style={on ? { background: theme.brandAccent, color: theme.brandPrimary } : { background: "rgba(255,255,255,0.14)", color: "#fff" }}
    >
      {children}
    </button>
  );
}

function Rights() {
  return (
    <div className="absolute left-[1220px] top-[190px] w-[600px] rounded-3xl bg-white px-8 py-6" style={{ boxShadow: cardShadow }}>
      <div className="text-[22px] font-medium uppercase tracking-[0.12em]" style={{ color: theme.muted }}>
        Good instructions give it
      </div>
      <div className="mt-3 flex flex-col gap-4">
        {threeRights.map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.div key={r.title} className="flex items-center gap-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.15 }}>
              <span className="grid h-[60px] w-[60px] shrink-0 place-items-center rounded-full" style={{ background: theme.brandAccent }}>
                <Icon size={30} color={theme.brandPrimary} />
              </span>
              <span className="flex flex-col">
                <span className="text-[28px] font-bold leading-tight" style={{ color: theme.brandPrimary }}>
                  {r.title}
                </span>
                <span className="text-[22px] leading-snug" style={{ color: theme.ink }}>
                  {r.text}
                </span>
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TablesStrip({ tables, onCycle, onAdd, onRemove }: { tables: string[]; onCycle: (t: number) => void; onAdd: () => void; onRemove: () => void }) {
  return (
    <Interactive className="absolute left-[100px] top-[880px] flex w-[1720px] items-center gap-3">
      <span className="mr-1 text-[22px] font-medium uppercase tracking-[0.12em]" style={{ color: theme.muted }}>
        Tables
      </span>
      <button type="button" aria-label="Remove a table" onClick={onRemove} disabled={tables.length <= MIN_TABLES} className="grid h-11 w-11 place-items-center rounded-full bg-white disabled:opacity-30" style={{ boxShadow: cardShadow, color: theme.brandPrimary }}>
        <Minus size={22} />
      </button>
      <button type="button" aria-label="Add a table" onClick={onAdd} disabled={tables.length >= MAX_TABLES} className="grid h-11 w-11 place-items-center rounded-full bg-white disabled:opacity-30" style={{ boxShadow: cardShadow, color: theme.brandPrimary }}>
        <Plus size={22} />
      </button>
      {tables.map((id, t) => (
        <motion.button
          key={t}
          layout
          type="button"
          aria-label={`Table ${t + 1}: ${agentById(id).name}. Click to change`}
          title="Click to give this table a different step"
          onClick={() => onCycle(t)}
          className="flex h-[58px] min-w-0 flex-1 items-center gap-2 rounded-2xl bg-white px-3 text-left"
          style={{ boxShadow: `0 0 0 2px ${theme.agent}` }}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[18px] font-bold text-white" style={{ background: theme.agent }}>
            {t + 1}
          </span>
          <span className="truncate text-[21px] font-medium" style={{ color: theme.brandPrimary }}>
            {agentById(id).short}
          </span>
        </motion.button>
      ))}
    </Interactive>
  );
}

// Share back: the claims journey with each table's agent on its step.
const LX0 = 190;
const LX1 = 1730;
const LY = 590;
const sx = (i: number) => LX0 + (i * (LX1 - LX0)) / (stations.length - 1);
const CARD_W = 208;
const CARD_H = 92;

function ShareBack({ tables, shared, onToggle }: { tables: string[]; shared: number[]; onToggle: (t: number) => void }) {
  // Place each table's agent above or below its station; two at one station take both sides.
  const placed = tables.map((id, t) => {
    const a = agentById(id);
    const si = stationIndex(a.station);
    const before = tables.slice(0, t).filter((x) => agentById(x).station === a.station).length;
    const above = before === 0 ? si % 2 === 0 || tables.filter((x) => agentById(x).station === a.station).length > 1 : false;
    return { t, a, x: sx(si), above };
  });

  return (
    <>
      <svg className="absolute inset-0" width={1920} height={1080}>
        <line x1={LX0} x2={LX1} y1={LY} y2={LY} stroke="#C9DDEA" strokeWidth={8} strokeLinecap="round" />
        {placed.map((p) => (
          <motion.line
            key={p.t}
            x1={p.x}
            x2={p.x}
            y1={p.above ? LY - 40 : LY + 110}
            y2={p.above ? 300 + CARD_H : 760}
            stroke={shared.includes(p.t) ? theme.agent : "#C9DDEA"}
            strokeWidth={4}
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + p.t * 0.12 }}
          />
        ))}
        {stations.map((s, i) => {
          const Icon = s.icon;
          const used = placed.some((p) => p.a.station === s.id);
          return (
            <g key={s.id} transform={`translate(${sx(i)} ${LY})`} opacity={used ? 1 : 0.45}>
              <circle r={40} fill="#fff" stroke={used ? theme.agent : "#C9DDEA"} strokeWidth={4} />
              <Icon x={-20} y={-20} width={40} height={40} color={theme.brandDeep} />
              {s.lines.map((l, k) => (
                <text key={k} y={72 + k * 26} textAnchor="middle" fontSize={21} fontWeight={500} fill={theme.ink}>
                  {l}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      <Interactive>
        {placed.map((p) => {
          const on = shared.includes(p.t);
          return (
            <motion.button
              key={p.t}
              type="button"
              aria-pressed={on}
              aria-label={`Table ${p.t + 1} shared: ${p.a.name}`}
              onClick={() => onToggle(p.t)}
              className="absolute flex flex-col justify-center rounded-2xl px-4 text-left"
              style={{
                left: p.x - CARD_W / 2,
                top: p.above ? 300 : 760,
                width: CARD_W,
                height: CARD_H,
                background: on ? theme.agent : "#fff",
                boxShadow: `0 0 0 3px ${theme.agent}, 0 10px 26px rgba(12,53,83,0.1)`,
              }}
              initial={{ opacity: 0, y: p.above ? -16 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + p.t * 0.12 }}
            >
              <span className="flex items-center gap-2 text-[17px] font-medium uppercase tracking-[0.08em]" style={{ color: on ? "rgba(255,255,255,0.85)" : theme.muted }}>
                Table {p.t + 1} {on && <Check size={18} strokeWidth={3} />}
              </span>
              <span className="text-[23px] font-bold leading-tight" style={{ color: on ? "#fff" : theme.brandPrimary }}>
                {p.a.name}
              </span>
            </motion.button>
          );
        })}
      </Interactive>

      <motion.div
        className="absolute left-1/2 top-[905px] flex items-center gap-3 whitespace-nowrap rounded-full px-7 py-3 text-[26px] font-medium text-white"
        style={{ x: "-50%", background: theme.human }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <UserRound size={28} /> People still decide: entitlement, letters to the worker, payments
      </motion.div>
    </>
  );
}
