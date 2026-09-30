import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Calculator, FileText, Hand, Mail, Phone, Stethoscope, Building2 } from "lucide-react";
import { useEffect } from "react";
import { ClaimFile } from "../components/ClaimFile";
import { SlideButton } from "../components/Interactive";
import { Headline } from "../components/Text";
import { claimPages, handsOnOneClaim } from "../data/claimFacts";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";

const pageIcons = [FileText, Building2, Stethoscope, Calculator, Mail, Phone];
const CX = 820;
const CY = 610;

function Counter({ to }: { to: number }) {
  const n = useMotionValue(0);
  const text = useTransform(n, (v) => Math.round(v).toString());
  useEffect(() => {
    const c = animate(n, to, { duration: 2, ease: "easeOut" });
    return () => c.stop();
  }, [n, to]);
  return <motion.span>{text}</motion.span>;
}

export default function Slide02OneClaim() {
  const [revealed, setRevealed] = useSlideState("s2:revealed", false);

  // Hands on an arc round the file's sides and underneath, clear of the pages fanned above.
  const hands = Array.from({ length: handsOnOneClaim }, (_, i) => {
    const deg = 8 + (164 * i) / Math.max(1, handsOnOneClaim - 1);
    const rad = (deg * Math.PI) / 180;
    return { x: CX + 580 * Math.cos(rad), y: CY + 30 + 320 * Math.sin(rad), d: 0.1 + i * (1.6 / handsOnOneClaim) };
  });

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
                <Icon x={-18} y={-44} width={36} height={36} color={theme.brandSecondary} />
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

        {/* Hands: one per person who touches the claim */}
        <AnimatePresence>
          {revealed &&
            hands.map((h, i) => (
              <motion.g
                key={i}
                initial={{ x: CX, y: CY, opacity: 0, scale: 0.2 }}
                animate={{ x: h.x, y: h.y, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 15, delay: h.d }}
              >
                <circle r={34} fill={theme.human} />
                <Hand x={-19} y={-19} width={38} height={38} color="#fff" strokeWidth={2} />
              </motion.g>
            ))}
        </AnimatePresence>
      </svg>

      {/* Counter */}
      <div className="absolute right-[150px] top-[330px] flex flex-col items-center gap-8">
        <div
          className="grid h-[300px] w-[300px] place-items-center rounded-full bg-white text-[150px] font-bold tabular-nums"
          style={{ color: revealed ? theme.human : "#C9DDEA", boxShadow: "0 1px 0 #C9DDEA, 0 16px 40px rgba(12,53,83,0.1)" }}
        >
          {revealed ? <Counter to={handsOnOneClaim} /> : "?"}
        </div>
        {!revealed ? (
          <SlideButton tone="coral" onClick={() => setRevealed(true)}>
            <Hand size={30} /> Reveal
          </SlideButton>
        ) : (
          <SlideButton tone="ghost" className="!px-6 !py-2 !text-[22px]" onClick={() => setRevealed(false)}>
            Hide
          </SlideButton>
        )}
      </div>
    </div>
  );
}
