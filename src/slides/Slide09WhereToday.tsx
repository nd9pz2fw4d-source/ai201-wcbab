import type { Era } from "../components/ClaimJourney";
import { EraIcon } from "../components/EraBadge";
import { Headline } from "../components/Text";
import { VoteTiles } from "../components/VoteTiles";

const tiles: { era: Era; label: string }[] = [
  { era: 1, label: "Paper" },
  { era: 2, label: "Predicts" },
  { era: 3, label: "Reads and writes" },
  { era: 4, label: "Does the work" },
  { era: 5, label: "Connected" },
];

export default function Slide09WhereToday() {
  return (
    <div className="absolute inset-0 flex flex-col items-center pt-[90px]">
      <Headline>Where is our claim today?</Headline>
      <div className="mt-[70px]">
        <VoteTiles
          id="where-today"
          options={tiles.map((t) => ({
            id: `era${t.era}`,
            label: t.label,
            visual: (
              <div className="flex flex-col items-center gap-3">
                <span className="text-[22px] font-medium uppercase tracking-widest text-muted">Era {t.era}</span>
                <EraIcon era={t.era} size={76} />
              </div>
            ),
          }))}
        />
      </div>
    </div>
  );
}
