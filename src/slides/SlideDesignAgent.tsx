import { DndContext, PointerSensor, pointerWithin, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, RotateCcw, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";
import { CountdownTimer } from "../components/CountdownTimer";
import { Interactive } from "../components/Interactive";
import { useStageScale } from "../components/ScaledStage";
import { Headline } from "../components/Text";
import {
  autonomyRow,
  defaultTables,
  designAgents,
  ingredients,
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

type Phase = "assign" | "design" | "share";
type Mode = "write" | "ingredients" | "example";
type Tables = (string | null)[]; // agent id per table, or null if the table has no task yet

const agentById = (id: string) => designAgents.find((a) => a.id === id) as DesignAgent;
const cardShadow = "0 1px 0 #C9DDEA, 0 14px 36px rgba(12,53,83,0.08)";
const phases: { id: Phase; label: string }[] = [
  { id: "assign", label: "1 Assign tables" },
  { id: "design", label: "2 Design · 5 min" },
  { id: "share", label: "3 Share back" },
];
const headlines: Record<Phase, string> = {
  assign: "Each table takes one task",
  design: "Design an agent for our claim",
  share: "Our claims agent team",
};

/** Table exercise: tables take a task, design one agent for it on paper, then see the agent team the room built. */
export default function SlideDesignAgent() {
  const [phase, setPhase] = useSlideState<Phase>("design:phase", "assign");
  const [tables, setTables] = useSlideState<Tables>("design:tables2", defaultTables);
  const [mode, setMode] = useSlideState<Mode>("design:mode", "write");
  const [autonomy, setAutonomy] = useSlideState("design:autonomy", false);
  const [shared, setShared] = useSlideState<number[]>("design:shared", []);

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[70px]">
        <Headline size={64}>{headlines[phase]}</Headline>
      </div>

      {/* Steps */}
      <Interactive className="absolute right-[100px] top-[80px] z-10 flex rounded-full bg-white p-1.5" style={{ boxShadow: cardShadow }}>
        {phases.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={phase === p.id}
            onClick={() => setPhase(p.id)}
            className="rounded-full px-5 py-2.5 text-[22px] font-medium transition"
            style={phase === p.id ? { background: theme.agent, color: "#fff" } : { color: theme.brandPrimary }}
          >
            {p.label}
          </button>
        ))}
      </Interactive>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={phase} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {phase === "assign" && <Assign tables={tables} setTables={setTables} />}
          {phase === "design" && (
            <>
              <Worksheet mode={mode} autonomy={autonomy} onMode={setMode} onAutonomy={() => setAutonomy(!autonomy)} />
              <Rights />
              <div className="absolute left-[1220px] top-[648px] flex w-[600px] items-center gap-6">
                <CountdownTimer minutes={5} size={170} />
                <div className="text-[24px] leading-snug" style={{ color: theme.ink }}>
                  One agent per table.
                  <br />
                  On paper. <b>Then 30 seconds each</b> to share.
                </div>
              </div>
            </>
          )}
          {phase === "share" && (
            <ShareBack
              tables={tables}
              shared={shared}
              onToggle={(t) => setShared((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---------- 1. Assign: drag each table onto a task ----------

function Assign({ tables, setTables }: { tables: Tables; setTables: (t: Tables | ((p: Tables) => Tables)) => void }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [selected, setSelected] = useState<number | null>(null); // click (or Enter) a table, then a task

  // Put table t on a task (or back in the tray). A table already there swaps to t's old place.
  const place = (t: number, task: string | null) =>
    setTables((prev) => {
      const next = [...prev];
      const other = task ? next.findIndex((id, i) => id === task && i !== t) : -1;
      if (other >= 0) next[other] = next[t];
      next[t] = task;
      return next;
    });
  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over) return;
    place(Number(String(e.active.id).slice(6)), e.over.id === "tray" ? null : String(e.over.id));
    setSelected(null);
  };
  const tap = (task: string | null) => {
    if (selected === null) return;
    place(selected, task);
    setSelected(null);
  };
  const add = () => tables.length < MAX_TABLES && setTables([...tables, null]);
  const remove = () => tables.length > MIN_TABLES && setTables(tables.slice(0, -1));
  const token = (t: number) => <TableToken key={t} t={t} selected={selected === t} onSelect={() => setSelected(selected === t ? null : t)} />;
  const unassigned = tables.map((id, t) => (id ? -1 : t)).filter((t) => t >= 0);

  return (
    <Interactive>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragEnd={onDragEnd}
        accessibility={{ screenReaderInstructions: { draggable: "Drag a table onto a task, or press Enter on a table and then on a task." } }}
      >
        <div className="absolute left-[100px] top-[190px] grid w-[1720px] grid-cols-4 gap-6">
          {designAgents.map((a, i) => {
            const t = tables.indexOf(a.id);
            return (
              <TaskCard key={a.id} agent={a} delay={0.1 + i * 0.05} armed={selected !== null} onTap={() => tap(a.id)}>
                {t >= 0 ? token(t) : <span className="text-[19px]" style={{ color: "#9FB3C4" }}>Drop a table here</span>}
              </TaskCard>
            );
          })}
        </div>
        <Tray armed={selected !== null} onTap={() => tap(null)}>
          <span className="text-[22px] font-medium uppercase tracking-[0.12em]" style={{ color: theme.muted }}>
            Tables
          </span>
          <RoundButton label="Remove a table" disabled={tables.length <= MIN_TABLES} onClick={remove}>
            <Minus size={22} />
          </RoundButton>
          <RoundButton label="Add a table" disabled={tables.length >= MAX_TABLES} onClick={add}>
            <Plus size={22} />
          </RoundButton>
          {unassigned.map(token)}
          <span className="ml-auto flex items-center gap-4 text-[21px]" style={{ color: theme.muted }}>
            {unassigned.length ? "Drag each table onto a task" : "Every table has a task"}
            <button type="button" onClick={() => setTables(tables.map(() => null))} className="flex items-center gap-1.5 underline">
              <RotateCcw size={18} /> Clear
            </button>
          </span>
        </Tray>
      </DndContext>
    </Interactive>
  );
}

function TaskCard({ agent, delay, armed, onTap, children }: { agent: DesignAgent; delay: number; armed: boolean; onTap: () => void; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: agent.id });
  const Icon = stations[stationIndex(agent.station)].icon;
  return (
    <motion.div
      ref={setNodeRef}
      role="button"
      tabIndex={armed ? 0 : -1}
      aria-label={`Task: ${agent.name}`}
      onClick={onTap}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        onTap();
      }}
      className="flex h-[250px] flex-col rounded-3xl bg-white px-6 py-5"
      style={{ boxShadow: isOver || armed ? `0 0 0 4px ${theme.brandAccent}, ${cardShadow}` : cardShadow, cursor: armed ? "pointer" : undefined }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: theme.brandDeep }}>
          <Icon size={26} color="#fff" />
        </span>
        <span className="text-[27px] font-bold leading-tight" style={{ color: theme.brandPrimary }}>
          {agent.name}
        </span>
      </div>
      <p className="mt-2 text-[21px] leading-snug" style={{ color: theme.ink }}>
        {agent.job}
      </p>
      <div className="mt-auto flex h-[60px] items-center justify-center rounded-2xl" style={{ border: `2px dashed ${isOver ? theme.brandAccent : "#D5E3EE"}` }}>
        {children}
      </div>
    </motion.div>
  );
}

function Tray({ armed, onTap, children }: { armed: boolean; onTap: () => void; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: "tray" });
  return (
    <div
      ref={setNodeRef}
      onClick={(e) => e.target === e.currentTarget && onTap()}
      className="absolute left-[100px] top-[760px] flex h-[120px] w-[1720px] items-center gap-3 rounded-3xl px-7"
      style={{ background: isOver ? "#FFF6E6" : "rgba(255,255,255,0.55)", border: `2px dashed ${isOver || armed ? theme.brandAccent : "#C9DDEA"}` }}
    >
      {children}
    </div>
  );
}

function TableToken({ t, selected, onSelect }: { t: number; selected: boolean; onSelect: () => void }) {
  const scale = useStageScale();
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({ id: `table-${t}` });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      data-interactive
      aria-label={`Table ${t + 1}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
      className="relative flex h-[52px] cursor-grab items-center gap-2 rounded-full px-5 text-[22px] font-bold text-white active:cursor-grabbing"
      style={{
        background: theme.agent,
        zIndex: isDragging ? 50 : 1,
        transform: transform ? `translate(${transform.x / scale}px, ${transform.y / scale}px) scale(1.06)` : undefined,
        boxShadow: selected ? `0 0 0 4px ${theme.brandAccent}` : isDragging ? "0 14px 30px rgba(12,53,83,0.3)" : "0 2px 6px rgba(12,53,83,0.15)",
        touchAction: "none",
      }}
    >
      Table {t + 1}
    </div>
  );
}

function RoundButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white disabled:opacity-30" style={{ boxShadow: cardShadow, color: theme.brandPrimary }}>
      {children}
    </button>
  );
}

// ---------- 2. Design: the worksheet, with ingredients and a worked example ----------

const modes: { id: Mode; label: string }[] = [
  { id: "write", label: "Worksheet" },
  { id: "ingredients", label: "Ingredients" },
  { id: "example", label: "Example" },
];
const tagStyle: Record<"read" | "draft" | "act", { bg: string; fg: string }> = {
  read: { bg: theme.brandTint, fg: theme.brandDeep },
  draft: { bg: "#FFF1D6", fg: "#8A5A00" },
  act: { bg: theme.brandPrimary, fg: "#fff" },
};

function Worksheet({ mode, autonomy, onMode, onAutonomy }: { mode: Mode; autonomy: boolean; onMode: (m: Mode) => void; onAutonomy: () => void }) {
  const rows = autonomy ? [...worksheetRows, autonomyRow] : worksheetRows;
  return (
    <div className="absolute left-[100px] top-[180px] w-[1070px] overflow-hidden rounded-3xl bg-white" style={{ boxShadow: cardShadow }}>
      <div className="flex items-center gap-4 px-7 py-3.5" style={{ background: theme.brandPrimary }}>
        <span className="text-[28px] font-bold text-white">{mode === "example" ? `Example: ${workedExample.agent}` : "Our agent:"}</span>
        {mode !== "example" && <span className="h-[3px] w-[160px] translate-y-3 bg-white/40" />}
        <Interactive className="ml-auto flex items-center gap-2">
          <div className="flex rounded-full bg-white/10 p-1">
            {modes.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={mode === m.id}
                onClick={() => onMode(m.id)}
                className="rounded-full px-4 py-1 text-[20px] font-medium transition"
                style={mode === m.id ? { background: theme.brandAccent, color: theme.brandPrimary } : { color: "#fff" }}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={autonomy}
            onClick={onAutonomy}
            className="rounded-full px-4 py-1.5 text-[20px] font-medium transition"
            style={autonomy ? { background: theme.brandAccent, color: theme.brandPrimary } : { background: "rgba(255,255,255,0.14)", color: "#fff" }}
          >
            + Autonomy
          </button>
        </Interactive>
      </div>
      {rows.map((r, i) => {
        const Icon = r.icon;
        const optional = r === autonomyRow;
        return (
          <motion.div
            key={r.element}
            className="flex min-h-[96px] items-center gap-5 px-7 py-2.5"
            style={{ borderTop: i ? `2px ${optional ? "dashed" : "solid"} #E4EEF5` : undefined }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: optional ? 0 : 0.2 + i * 0.1 }}
          >
            <span className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full" style={{ background: optional ? theme.brandSky : theme.agent }}>
              <Icon size={30} color="#fff" />
            </span>
            <div className="w-[260px] shrink-0">
              <div className="text-[28px] font-bold leading-tight" style={{ color: theme.brandPrimary }}>
                {r.element}
                {optional && <span className="ml-2 text-[18px] font-medium" style={{ color: theme.muted }}>optional</span>}
              </div>
              <div className="text-[20px] leading-snug" style={{ color: theme.muted }}>
                {r.question}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              {mode === "write" && <div className="h-[2px] translate-y-5" style={{ background: "repeating-linear-gradient(90deg, #C9DDEA 0 10px, transparent 10px 18px)" }} />}
              {mode === "ingredients" && (
                <div className="flex flex-wrap gap-1.5">
                  {ingredients[r.element].map((g) => (
                    <span key={g.text} className="flex items-center gap-2 rounded-full px-3 py-0.5 text-[19px]" style={{ background: "#EEF5FA", color: theme.ink }}>
                      {g.tag && (
                        <span className="rounded-full px-2 text-[14px] font-bold uppercase tracking-wide" style={{ background: tagStyle[g.tag].bg, color: tagStyle[g.tag].fg }}>
                          {g.tag}
                        </span>
                      )}
                      {g.text}
                    </span>
                  ))}
                </div>
              )}
              {mode === "example" && (
                <ul className="flex flex-col gap-0.5 text-[20px] leading-snug" style={{ color: theme.ink }}>
                  {workedExample.rows[r.element].map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: theme.agent }} />
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
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

// Share back: the claims journey with each table's agent on its step.
const LX0 = 190;
const LX1 = 1730;
const LY = 590;
const sx = (i: number) => LX0 + (i * (LX1 - LX0)) / (stations.length - 1);
const CARD_W = 208;
const CARD_H = 92;

function ShareBack({ tables, shared, onToggle }: { tables: Tables; shared: number[]; onToggle: (t: number) => void }) {
  // Place each table's agent above or below its station; two at one station take both sides.
  const assigned = tables.flatMap((id, t) => (id ? [{ t, a: agentById(id) }] : []));
  const atStation = (st: string) => assigned.filter((p) => p.a.station === st);
  const placed = assigned.map(({ t, a }) => {
    const si = stationIndex(a.station);
    const others = atStation(a.station);
    const above = others.length > 1 ? others[0].t === t : si % 2 === 0;
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
