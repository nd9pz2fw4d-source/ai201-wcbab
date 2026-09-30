import type { ReactNode } from "react";
import type { Era } from "../components/ClaimJourney";
import { EraBadge } from "../components/EraBadge";
import { HumanAISplit } from "../components/HumanAISplit";
import { Headline } from "../components/Text";

/** Shared frame for the five era slides: badge and line top left, work split top right. */
export function EraLayout({
  era,
  headline,
  human,
  ai,
  children,
}: {
  era: Era;
  headline: string;
  human: number;
  ai: number;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[64px] flex flex-col items-start gap-6">
        <EraBadge era={era} />
        <Headline size={68}>{headline}</Headline>
      </div>
      <div className="absolute right-[100px] top-[68px]">
        <HumanAISplit human={human} ai={ai} width={640} />
      </div>
      {children}
    </div>
  );
}
