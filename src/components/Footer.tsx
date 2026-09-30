import { DELOITTE_GREEN } from "../theme";
import { WcbLogo } from "./WcbLogo";

/** On every slide: the composite-example label, a small WCB logo and the Deloitte wordmark. */
export function Footer({ tone, showLogo }: { tone: "dark" | "light" | "dawn"; showLogo: boolean }) {
  const dark = tone !== "light";
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-12 pb-7 text-[20px]"
      style={{ color: dark ? "rgba(255,255,255,0.62)" : "rgba(22,51,74,0.6)" }}
    >
      <span>Composite example. Not a real claim or person.</span>
      <span className="flex items-center gap-4">
        {showLogo && (
          <span className={`rounded-md px-2 py-1 ${dark ? "" : "bg-[#D3F1FC]"}`}>
            <WcbLogo height={38} on={dark ? "dark" : "light"} />
          </span>
        )}
        <span className="text-[24px] font-bold tracking-tight" style={{ color: dark ? "#fff" : "#000" }}>
          Deloitte<span style={{ color: DELOITTE_GREEN }}>.</span>
        </span>
      </span>
    </div>
  );
}
