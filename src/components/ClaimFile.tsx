import { Brain, Hand } from "lucide-react";
import { config } from "../config";
import { theme } from "../theme";

export const CARD_W = 180;
export const CARD_H = 112;

interface Props {
  /** Pages stacked behind the card. Grows as evidence is added. */
  pages?: number;
  /** Show the worker's first name in the header strip. */
  named?: boolean;
  /** Tint for the header strip. */
  color?: string;
}

/**
 * The claim file: a small, friendly card with the worker's first name, an
 * injury icon, and a stack of pages behind it. An SVG <g> drawn centred on
 * (0, 0), so it can sit inside the journey or any other SVG.
 */
export function ClaimFile({ pages = 2, named = true, color = theme.brandSecondary }: Props) {
  const x = -CARD_W / 2;
  const y = -CARD_H / 2;
  const stack = Math.min(pages, 8);
  const Icon = config.claimType === "psychological" ? Brain : Hand;
  const name = config.workerName;
  const nameSize = name.length > 11 ? 16 : 20;

  return (
    <g>
      {Array.from({ length: stack }, (_, i) => {
        const k = stack - i;
        return (
          <rect
            key={i}
            x={x + k * 4}
            y={y - k * 5}
            width={CARD_W}
            height={CARD_H}
            rx={12}
            fill="#fff"
            stroke={theme.line}
            strokeWidth={2}
          />
        );
      })}
      <rect x={x} y={y} width={CARD_W} height={CARD_H} rx={12} fill="#fff" stroke={color} strokeWidth={3} />
      <path
        d={`M${x} ${y + 12} a12 12 0 0 1 12 -12 h${CARD_W - 24} a12 12 0 0 1 12 12 v18 h-${CARD_W} z`}
        fill={color}
      />
      {named && (
        <text x={0} y={y + 22} textAnchor="middle" fontSize={nameSize} fontWeight={500} fill="#fff">
          {name}
        </text>
      )}
      <g transform={`translate(${-26}, ${y + 40})`}>
        <Icon width={52} height={52} color={theme.ink} strokeWidth={1.8} />
        {config.claimType === "physical" && (
          // A small bandage across the palm.
          <g transform="translate(26 32) rotate(-32)">
            <rect x={-17} y={-6} width={34} height={12} rx={6} fill="#F2C5A0" stroke="#C98E6A" strokeWidth={1.5} />
            <rect x={-6} y={-6} width={12} height={12} fill="#E9AF85" />
          </g>
        )}
      </g>
    </g>
  );
}
