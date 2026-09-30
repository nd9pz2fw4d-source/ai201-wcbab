import { motion } from "framer-motion";
import { FileText, MessageCircle, PenLine, UserRound } from "lucide-react";
import { ClaimJourney } from "../components/ClaimJourney";
import { RiskMarker } from "../components/RiskMarker";
import { theme } from "../theme";
import { EraLayout } from "./EraLayout";

const card = "relative h-[250px] w-[470px] rounded-3xl bg-white p-7 shadow-[0_1px_0_#C9DDEA,0_12px_32px_rgba(12,53,83,0.08)]";

/** A thick stack of pages compresses into a one-page summary. */
function StackToSummary() {
  return (
    <div className={`${card} flex items-center justify-center gap-10`}>
      <div className="relative h-[170px] w-[120px]">
        {Array.from({ length: 9 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 h-[150px] w-[112px] rounded-lg border-2 bg-white"
            style={{ borderColor: theme.line, top: 0 }}
            initial={{ x: 0, y: 10 }}
            animate={{ x: i * 4, y: 14 - i * 6 }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.03 }}
          />
        ))}
      </div>
      <motion.div className="text-[48px]" style={{ color: theme.agent }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        →
      </motion.div>
      <motion.div
        className="flex h-[150px] w-[112px] flex-col gap-2.5 rounded-lg border-[3px] bg-white p-3"
        style={{ borderColor: theme.agent }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
      >
        <FileText size={30} color={theme.agent} />
        {[80, 60, 72, 50].map((w, i) => (
          <div key={i} className="h-[7px] rounded" style={{ width: `${w}%`, background: "#CDEFEB" }} />
        ))}
      </motion.div>
    </div>
  );
}

/** A chat bubble answers a question about the claim, and says where the answer came from. */
function ChatAnswer() {
  return (
    <div className={`${card} flex flex-col justify-center gap-3`}>
      <motion.div
        className="self-end rounded-2xl rounded-br-sm px-5 py-3 text-[25px] text-white"
        style={{ background: theme.human }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        Doctor's note on file?
      </motion.div>
      <motion.div
        className="flex items-center gap-3 self-start rounded-2xl rounded-bl-sm px-5 py-3 text-[25px] text-white"
        style={{ background: theme.agent }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
      >
        <MessageCircle size={26} /> Yes. Clinic report, page 2.
      </motion.div>
      <div className="self-center">
        <RiskMarker label="Confident, but wrong." size="sm" delay={2.0} />
      </div>
    </div>
  );
}

/** A letter to the worker drafts itself; a person checks it. */
function DraftLetter() {
  return (
    <div className={`${card} flex items-center gap-7`}>
      <div className="relative flex h-[190px] w-[170px] flex-col gap-3 rounded-lg border-2 bg-white p-4" style={{ borderColor: theme.line }}>
        <PenLine size={26} color={theme.agent} />
        {[90, 75, 85, 60, 70].map((w, i) => (
          <motion.div
            key={i}
            className="h-[8px] rounded"
            style={{ background: "#CDEFEB" }}
            initial={{ width: 0 }}
            animate={{ width: `${w}%` }}
            transition={{ delay: 0.9 + i * 0.25, duration: 0.3 }}
          />
        ))}
      </div>
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2 }}
      >
        <span className="grid h-[88px] w-[88px] place-items-center rounded-full" style={{ background: theme.human }}>
          <UserRound size={48} color="#fff" />
        </span>
        <span className="text-[24px] font-medium" style={{ color: theme.human }}>
          checks
        </span>
      </motion.div>
    </div>
  );
}

export default function Slide06Era3() {
  return (
    <EraLayout era={3} headline="It reads. It drafts. You check." human={70} ai={30}>
      <div className="absolute left-[230px] top-[300px]">
        <ClaimJourney
          era={3}
          travel="once"
          position={4}
          speed="medium"
          width={1460}
          labelSize={26}
          stationRoles={{ evidence: "assist", medical: "assist", report: "assist" }}
          pages={1}
        />
      </div>
      <div className="absolute left-[100px] top-[735px] flex gap-[35px]">
        <StackToSummary />
        <ChatAnswer />
        <DraftLetter />
      </div>
    </EraLayout>
  );
}
