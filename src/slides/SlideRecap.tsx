import { motion } from "framer-motion";
import { Brain, CircleCheck, Database, Eye, FileText, ListChecks, Play, ScrollText, Target, UserRound, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { recap } from "../data/designAgent";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

const W = 520;
const H = 380; // drawing area in each card (drawings are laid out on a 520 x 300 grid, padded)

/** Recap of the core ideas: what an agent is, how it works, how we trust it. */
export default function SlideRecap() {
  return (
    <TeachLayout strand="how" headline="What to remember">
      <div className="absolute left-[100px] right-[100px] top-[270px] grid grid-cols-3 gap-10">
        <Card i={0} n={1} {...recap.what}>
          <WhatItIs />
        </Card>
        <Card i={1} n={2} {...recap.how}>
          <HowItWorks />
        </Card>
        <Card i={2} n={3} {...recap.trust}>
          <HowWeTrust />
        </Card>
      </div>
    </TeachLayout>
  );
}

function Card({ i, n, title, text, children }: { i: number; n: number; title: string; text: string; children: ReactNode }) {
  return (
    <motion.div
      className="flex flex-col overflow-hidden rounded-3xl bg-white"
      style={{ boxShadow: "0 1px 0 #C9DDEA, 0 14px 36px rgba(12,53,83,0.08)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + i * 0.25 }}
    >
      <svg width={W} height={H} viewBox={`0 -40 ${W} ${H}`} className="self-center" style={{ background: "#F2FAFE" }}>
        {children}
      </svg>
      <div className="flex gap-4 px-8 py-6">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[26px] font-bold" style={{ background: theme.brandAccent, color: theme.brandPrimary }}>
          {n}
        </span>
        <div>
          <div className="text-[36px] font-bold leading-tight" style={{ color: theme.brandPrimary }}>
            {title}
          </div>
          <div className="mt-1 text-[25px] leading-snug" style={{ color: theme.ink }}>
            {text}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Chip({ x, y, icon: Icon, label, color = theme.agent }: { x: number; y: number; icon: typeof Brain; label: string; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-78} y={-24} width={156} height={48} rx={24} fill="#fff" stroke={color} strokeWidth={3} />
      <Icon x={-64} y={-12} width={24} height={24} color={color} />
      <text x={-32} y={7} fontSize={19} fontWeight={600} fill={theme.brandPrimary}>
        {label}
      </text>
    </g>
  );
}

function WhatItIs() {
  const cx = W / 2;
  const cy = 140;
  const chips = [
    { x: 105, y: 60, icon: Target, label: "Goal" },
    { x: 415, y: 60, icon: ScrollText, label: "Instructions" },
    { x: 105, y: 220, icon: Database, label: "Memory" },
    { x: 415, y: 220, icon: Wrench, label: "Tools" },
  ];
  return (
    <>
      {chips.map((c) => (
        <line key={c.label} x1={cx} y1={cy} x2={c.x} y2={c.y} stroke={theme.agent} strokeWidth={3} strokeDasharray="6 6" opacity={0.6} />
      ))}
      <circle cx={cx} cy={cy} r={62} fill={theme.agent} />
      <Brain x={cx - 24} y={cy - 38} width={48} height={48} color="#fff" />
      <text x={cx} y={cy + 34} textAnchor="middle" fontSize={20} fontWeight={700} fill="#fff">
        Model
      </text>
      {chips.map((c) => (
        <Chip key={c.label} {...c} />
      ))}
      <g transform={`translate(${cx} 272)`}>
        <rect x={-110} y={-20} width={220} height={40} rx={20} fill={theme.human} />
        <UserRound x={-96} y={-11} width={22} height={22} color="#fff" />
        <text x={12} y={7} textAnchor="middle" fontSize={18} fontWeight={600} fill="#fff">
          A person approves
        </text>
      </g>
    </>
  );
}

function HowItWorks() {
  const cx = 200;
  const cy = 150;
  const r = 92;
  const nodes = [
    { label: "Plan", icon: ListChecks, a: -90 },
    { label: "Act", icon: Play, a: 30 },
    { label: "Check", icon: Eye, a: 150 },
  ];
  const at = (a: number, rr = r) => ({ x: cx + rr * Math.cos((a * Math.PI) / 180), y: cy + rr * Math.sin((a * Math.PI) / 180) });
  return (
    <>
      <defs>
        <marker id="recap-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={theme.agent} />
        </marker>
      </defs>
      {nodes.map((n, i) => {
        const a0 = n.a + 24;
        const a1 = nodes[(i + 1) % 3].a - 24 + (i === 2 ? 360 : 0);
        const p0 = at(a0);
        const p1 = at(a1);
        return <path key={n.label} d={`M${p0.x} ${p0.y} A${r} ${r} 0 0 1 ${p1.x} ${p1.y}`} fill="none" stroke={theme.agent} strokeWidth={4} markerEnd="url(#recap-arrow)" />;
      })}
      {nodes.map((n) => {
        const p = at(n.a);
        const Icon = n.icon;
        return (
          <g key={n.label} transform={`translate(${p.x} ${p.y})`}>
            <circle r={34} fill={theme.agent} />
            <Icon x={-14} y={-20} width={28} height={28} color="#fff" />
            <text y={22} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">
              {n.label}
            </text>
          </g>
        );
      })}
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize={20} fontWeight={600} fill={theme.muted}>
        repeat
      </text>
      <path d={`M${cx + 120} ${cy + 20} C 340 ${cy + 20}, 360 ${cy + 60}, 380 ${cy + 60}`} fill="none" stroke={theme.human} strokeWidth={4} strokeDasharray="6 6" />
      <g transform={`translate(430 ${cy + 60})`}>
        <circle r={44} fill={theme.human} />
        <UserRound x={-22} y={-26} width={44} height={44} color="#fff" />
        <text y={74} textAnchor="middle" fontSize={18} fontWeight={600} fill={theme.human}>
          Our call
        </text>
      </g>
    </>
  );
}

function HowWeTrust() {
  return (
    <>
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} x={50 + i * 8} y={70 - i * 8} width={110} height={140} rx={10} fill="#fff" stroke={theme.line} strokeWidth={2} />
      ))}
      <FileText x={95} y={95} width={48} height={48} color={theme.brandDeep} />
      <text x={110} y={250} textAnchor="middle" fontSize={18} fontWeight={600} fill={theme.ink}>
        Real past cases
      </text>
      <path d="M190 135 H250" stroke={theme.agent} strokeWidth={4} markerEnd="url(#trust-arrow)" />
      <defs>
        <marker id="trust-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={theme.agent} />
        </marker>
      </defs>
      {["Right answer", "Shows sources", "Asks a person"].map((l, i) => (
        <g key={l} transform={`translate(270 ${80 + i * 50})`}>
          <CircleCheck x={0} y={-14} width={28} height={28} color={theme.human} />
          <text x={38} y={7} fontSize={19} fontWeight={600} fill={theme.ink}>
            {l}
          </text>
        </g>
      ))}
      <g transform="translate(270 250)">
        <rect x={-10} y={-22} width={226} height={44} rx={22} fill={theme.brandAccent} />
        <Eye x={4} y={-12} width={24} height={24} color={theme.brandPrimary} />
        <text x={36} y={7} fontSize={18} fontWeight={700} fill={theme.brandPrimary}>
          Keep watching after
        </text>
      </g>
    </>
  );
}
