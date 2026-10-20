import { motion } from "framer-motion";
import { Building2, Calculator, FileText, Hand, Mail, Phone, RotateCcw, Stethoscope } from "lucide-react";
import { ClaimFile } from "../components/ClaimFile";
import { Interactive } from "../components/Interactive";
import { Headline } from "../components/Text";
import { claimPages, handRanges } from "../data/claimFacts";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";

const pageIcons = [FileText, Building2, Stethoscope, Calculator, Mail, Phone];
const CX = 820;
const CY = 610;

export default function Slide02OneClaim() {
  const [votes, setVotes] = useSlideState<Record<string, number>>("s2:votes", {});
  const vote = (r: string, d: number) => setVotes((v) => ({ ...v, [r]: Math.max(0, (v[r] ?? 0) + d) }));

  return (
    <div className="absolute inset-0">
      <div className="absolute left-[120px] top-[90px]">
        <Headline>One worker. One claim. Many hands.</Headline>
      </div>

      <svg className="absolute inset-0" width={1920} height={1080}>
        {/* Pages fan out above the file */}
        {claimPages.map((label, i) => {
          const Icon = pageIcons[i];
          const angle = -165 + (i * 150) / (claimPages.length - 1);
          const rad = (angle * Math.PI) / 180;
          const x = CX + 440 * Math.cos(rad);
          const y = CY + 10 + 300 * Math.sin(rad);
          return (
            <motion.g
              key={label}
              initial={{ x: CX, y: CY, opacity: 0, scale: 0.4 }}
              animate={{ x, y, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.9 + i * 0.1 }}
            >
              <g transform={`rotate(${(angle + 90) * 0.2})`}>
                <rect x={-95} y={-58} width={190} height={116} rx={10} fill="#fff" stroke={theme.line} strokeWidth={2.5} />
                <Icon x={-18} y={-44} width={36} height={36} color={theme.brandDeep} />
                <text y={22} textAnchor="middle" fontSize={20} fontWeight={500} fill={theme.ink}>
                  {label}
                </text>
                <rect x={-50} y={34} width={100} height={5} rx={2.5} fill="#E4EEF5" />
              </g>
            </motion.g>
          );
        })}

        {/* The file drops in */}
        <motion.g
          initial={{ x: CX, y: -200, rotate: -8 }}
          animate={{ x: CX, y: CY, rotate: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 14, delay: 0.2 }}
        >
          <g transform="scale(1.8)">
            <ClaimFile pages={6} />
          </g>
        </motion.g>

      </svg>

      {/* Quick vote: how many hands touch this claim? */}
      <Interactive className="absolute right-[90px] top-[280px] flex w-[440px] flex-col gap-4 rounded-3xl bg-white p-8" style={{ boxShadow: "0 1px 0 #C9DDEA, 0 16px 40px rgba(12,53,83,0.1)" }}>
        <div className="flex items-center gap-3 text-[34px] font-bold leading-tight" style={{ color: theme.brandPrimary }}>
          <Hand size={38} color={theme.human} className="shrink-0" /> How many hands touch this claim?
        </div>
        {handRanges.map((r) => {
          const n = votes[r] ?? 0;
          const max = Math.max(1, ...handRanges.map((x) => votes[x] ?? 0));
          return (
            <button
              key={r}
              type="button"
              data-interactive
              aria-label={`Vote: ${r}`}
              onClick={(e) => {
                e.stopPropagation();
                vote(r, 1);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                vote(r, -1);
              }}
              onKeyDown={(e) => {
                // Keyboard twin of right-click: Delete or Backspace removes a vote.
                if (e.key !== "Delete" && e.key !== "Backspace") return;
                e.preventDefault();
                vote(r, -1);
              }}
              className="relative flex h-[70px] items-center overflow-hidden rounded-2xl px-5 text-left"
              style={{ background: "#F2F7FA" }}
            >
              <motion.span className="absolute inset-y-0 left-0" style={{ background: theme.humanLight, opacity: 0.45 }} animate={{ width: `${(n / max) * 100}%` }} />
              <span className="relative flex-1 text-[30px] font-medium" style={{ color: theme.ink }}>
                {r}
              </span>
              <span className="relative text-[34px] font-bold tabular-nums" style={{ color: n ? theme.human : "#C9D6E0" }}>
                {n}
              </span>
            </button>
          );
        })}
        <div className="flex items-center justify-between text-[19px]" style={{ color: theme.muted }}>
          <span>Click to add a vote, right-click to remove</span>
          <button type="button" data-interactive className="flex items-center gap-1 underline" onClick={(e) => { e.stopPropagation(); setVotes({}); }}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </Interactive>
    </div>
  );
}
