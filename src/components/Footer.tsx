import { DeloitteLogo } from "./DeloitteLogo";
import { WcbLogo } from "./WcbLogo";

/** On every slide: the composite-example label, a small WCB logo and the Deloitte logo. */
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
          <>
            <WcbLogo height={40} on={dark ? "dark" : "light"} />
            <span className="h-[30px] w-[2px]" style={{ background: dark ? "rgba(255,255,255,0.3)" : "rgba(22,51,74,0.2)" }} />
          </>
        )}
        <DeloitteLogo height={22} on={dark ? "dark" : "light"} />
      </span>
    </div>
  );
}
