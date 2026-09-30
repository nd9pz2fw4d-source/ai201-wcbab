import type { ButtonHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode } from "react";

/** Keeps a click from reaching the stage, which would advance the slide. */
export const stopNav = (e: MouseEvent) => e.stopPropagation();

/** Wrapper for any interactive region (drag boards, tiles). Clicks inside never advance the slide. */
export function Interactive({ children, onClick, ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      data-interactive
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

type Tone = "gold" | "coral" | "teal" | "ghost" | "ghostDark";

const tones: Record<Tone, string> = {
  gold: "bg-brand-accent text-brand-primary hover:brightness-105",
  coral: "bg-human text-white hover:brightness-105",
  teal: "bg-agent text-white hover:brightness-105",
  ghost: "bg-white/70 text-brand-primary ring-2 ring-brand-primary/15 hover:bg-white",
  ghostDark: "bg-white/10 text-white ring-2 ring-white/25 hover:bg-white/20",
};

/** A presenter button on a slide. Never advances the slide. */
export function SlideButton({
  tone = "gold",
  className = "",
  onClick,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return (
    <button
      type="button"
      data-interactive
      className={`inline-flex items-center gap-3 rounded-full px-8 py-4 text-[28px] font-medium shadow-sm transition disabled:opacity-40 ${tones[tone]} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
