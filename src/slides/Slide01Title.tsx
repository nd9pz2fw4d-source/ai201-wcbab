import { motion } from "framer-motion";
import { ClaimJourney } from "../components/ClaimJourney";
import { WcbLogo } from "../components/WcbLogo";
import { theme } from "../theme";

export default function Slide01Title() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dawn sky */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${theme.brandPrimary} 0%, #12476D 45%, #2F6F95 70%, #E9A85A 100%)`,
        }}
      />
      <motion.div
        className="absolute left-1/2 rounded-full"
        style={{
          width: 900,
          height: 900,
          marginLeft: -450,
          bottom: -620,
          background: `radial-gradient(circle, ${theme.brandAccent} 0%, rgba(251,180,58,0.55) 30%, rgba(251,180,58,0) 70%)`,
        }}
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
      />

      <motion.div
        className="absolute left-[120px] top-[90px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <WcbLogo height={120} on="dark" />
      </motion.div>

      <div className="absolute left-[120px] top-[290px]">
        <motion.h1
          className="text-[150px] font-bold leading-none tracking-[-0.02em] text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Follow the claim
        </motion.h1>
        <motion.p
          className="mt-8 text-[52px] font-light text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          What AI means for how we serve Albertans
        </motion.p>
      </div>

      <div className="absolute left-[80px] top-[560px]">
        <ClaimJourney tone="dark" drawIn showClaim={false} labels={false} marks={false} delay={0.4} />
      </div>
    </div>
  );
}
