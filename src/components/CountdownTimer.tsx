import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { config } from "../config";
import { theme } from "../theme";
import { Interactive } from "./Interactive";

/** A soft two-note chime. Only plays if sound is switched on. */
function chime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [660, 880].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const t = ctx.currentTime + i * 0.35;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 1.3);
    });
  } catch {
    /* audio unavailable */
  }
}

const mmss = (seconds: number) => {
  const s = Math.ceil(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Large circular timer for exercises, started by a button. */
export function CountdownTimer({ minutes, size = 220, tone = "light" }: { minutes: number; size?: number; tone?: "light" | "dark" }) {
  const total = minutes * 60;
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(config.soundOnByDefault);
  const reduce = useReducedMotion();
  const endRef = useRef<number | null>(null);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  useEffect(() => setLeft(total), [total]);

  useEffect(() => {
    if (!running) return;
    endRef.current = Date.now() + left * 1000;
    const id = window.setInterval(() => {
      const remaining = Math.max(0, ((endRef.current ?? 0) - Date.now()) / 1000);
      setLeft(remaining);
      if (remaining <= 0) {
        setRunning(false);
        if (soundRef.current) chime();
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [running]); // `left` is read once, when the timer starts or resumes


  const done = left <= 0;
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  const frac = left / total;
  const dark = tone === "dark";
  const fg = dark ? "#fff" : theme.brandPrimary;

  const btn = "grid h-12 w-12 place-items-center rounded-full transition hover:brightness-110";

  return (
    <Interactive className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill={dark ? "rgba(255,255,255,0.06)" : "#fff"} stroke={dark ? "rgba(255,255,255,0.15)" : "#DDEBF4"} strokeWidth={14} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={theme.brandAccent}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - frac)}
            style={{ transition: "stroke-dashoffset 200ms linear" }}
          />
        </svg>
        {done && !reduce && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `0 0 0 6px ${theme.brandAccent}` }}
            animate={{ opacity: [0.9, 0.2, 0.9], scale: [1, 1.06, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-medium tabular-nums" style={{ fontSize: size * 0.24, color: fg }}>
            {mmss(left)}
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          aria-label={running ? "Pause timer" : "Start timer"}
          className={btn}
          style={{ background: theme.brandAccent, color: theme.brandPrimary }}
          onClick={(e) => {
            e.stopPropagation();
            if (done) setLeft(total);
            setRunning((v) => !v);
          }}
        >
          {running ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          type="button"
          aria-label="Reset timer"
          className={btn}
          style={{ background: dark ? "rgba(255,255,255,0.12)" : "#fff", color: fg, boxShadow: "0 1px 0 #C9DDEA" }}
          onClick={(e) => {
            e.stopPropagation();
            setRunning(false);
            setLeft(total);
          }}
        >
          <RotateCcw size={22} />
        </button>
        <button
          type="button"
          aria-label={sound ? "Sound on" : "Sound off"}
          className={btn}
          style={{ background: dark ? "rgba(255,255,255,0.12)" : "#fff", color: fg, opacity: sound ? 1 : 0.55, boxShadow: "0 1px 0 #C9DDEA" }}
          onClick={(e) => {
            e.stopPropagation();
            setSound((v) => !v);
          }}
        >
          {sound ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </button>
      </div>
    </Interactive>
  );
}
