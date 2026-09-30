import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ClaimFile } from "../components/ClaimFile";
import { ClaimJourney } from "../components/ClaimJourney";
import { WcbLogo } from "../components/WcbLogo";
import { futureYear } from "../data/claimFacts";
import { theme } from "../theme";
import { riskRoles } from "./riskJourney";

export default function Slide20Close() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${theme.brandPrimary} 0%, #12476D 50%, #2F6F95 78%, #E9A85A 100%)` }}
      />

      <div className="absolute left-[100px] top-[60px]">
        <WcbLogo height={96} on="dark" />
      </div>

      <motion.h1
        className="absolute left-[100px] top-[210px] text-[104px] font-bold leading-none text-white"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Same care. Better journey.
      </motion.h1>

      <div className="absolute left-[40px] top-[400px]">
        <div
          className="absolute left-[40px] top-[-10px] rounded-full px-5 py-1.5 text-[26px] font-medium"
          style={{ background: "rgba(255,255,255,0.14)", color: theme.brandAccent }}
        >
          {futureYear}
        </div>
        <ClaimJourney
          era={5}
          tone="dark"
          width={1320}
          labelSize={30}
          travel="once"
          position={7}
          stationRoles={riskRoles}
          humanCheckpoints={["entitlement", "close"]}
          agents={[
            { from: 0, to: 2, duration: 1.1 },
            { from: 2, to: 4, duration: 1.1, delay: 0.3 },
            { from: 4, to: 6, duration: 1.1, delay: 0.6 },
          ]}
          pages={3}
        />
      </div>

      {/* Back at work */}
      <motion.div
        className="absolute left-[1430px] top-[360px] flex w-[400px] flex-col items-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.9, duration: 0.5 }}
      >
        <div className="relative h-[380px] w-[400px]">
          <div
            className="absolute bottom-[40px] left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full"
            style={{ background: `radial-gradient(circle, ${theme.brandAccent} 0%, rgba(251,180,58,0.4) 45%, rgba(251,180,58,0) 70%)` }}
          />
          <svg className="absolute inset-0" width={400} height={380}>
            <g transform="translate(200 210) scale(1.5)">
              <ClaimFile pages={3} />
            </g>
            <g transform="translate(320 270)">
              <circle r={42} fill={theme.brandGreen} stroke="#fff" strokeWidth={5} />
              <Check x={-26} y={-26} width={52} height={52} color="#fff" strokeWidth={3.5} />
            </g>
          </svg>
        </div>
        <div className="text-[44px] font-medium text-white">Back at work</div>
      </motion.div>

      <motion.p
        className="absolute left-[100px] top-[880px] text-[56px] font-medium"
        style={{ color: theme.brandAccent }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.4 }}
      >
        One word: what will you watch for?
      </motion.p>
    </div>
  );
}
