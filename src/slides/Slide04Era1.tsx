import { ClaimJourney } from "../components/ClaimJourney";
import { EraLayout } from "./EraLayout";

export default function Slide04Era1() {
  return (
    <EraLayout era={1} headline="Every step, by hand" human={100} ai={0}>
      <div className="absolute left-[80px] top-[300px]">
        <ClaimJourney era={1} travel="loop" speed="slow" pages={3} />
      </div>
    </EraLayout>
  );
}
