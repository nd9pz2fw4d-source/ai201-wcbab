import { ClaimJourney } from "../components/ClaimJourney";
import { Headline } from "../components/Text";
import { riskRoles } from "./riskJourney";

export default function Slide19Discussion() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-x-0 top-[170px] flex justify-center text-center">
        <Headline tone="dark" size={96}>
          What would you need to trust this?
        </Headline>
      </div>
      <div className="absolute left-[80px] top-[430px] opacity-90">
        <ClaimJourney
          era={5}
          tone="dark"
          travel="loop"
          speed="slow"
          stationRoles={riskRoles}
          humanCheckpoints={["entitlement", "close"]}
          pages={3}
        />
      </div>
    </div>
  );
}
