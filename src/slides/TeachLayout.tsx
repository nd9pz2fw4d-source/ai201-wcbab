import { Compass, Cpu } from "lucide-react";
import type { ReactNode } from "react";
import { Headline } from "../components/Text";
import { theme } from "../theme";

export type Strand = "how" | "where";

const strands: Record<Strand, { label: string; icon: typeof Cpu }> = {
  how: { label: "How it works", icon: Cpu },
  where: { label: "Where it's going", icon: Compass },
};

/** Shared frame for the teaching slides: a strand label and one headline, top left. */
export function TeachLayout({ strand, headline, children }: { strand: Strand; headline: string; children: ReactNode }) {
  const { label, icon: Icon } = strands[strand];
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[100px] top-[64px] flex flex-col items-start gap-5">
        <div className="inline-flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-6 shadow-[0_1px_0_#C9DDEA]">
          <span className="grid h-11 w-11 place-items-center rounded-full" style={{ background: theme.agent }}>
            <Icon size={24} color="#fff" />
          </span>
          <span className="text-[24px] font-medium" style={{ color: theme.brandPrimary }}>
            {label}
          </span>
        </div>
        <Headline size={70}>{headline}</Headline>
      </div>
      {children}
    </div>
  );
}
