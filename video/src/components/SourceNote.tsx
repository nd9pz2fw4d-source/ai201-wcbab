import { theme } from "../brand";

export function SourceNote({ text }: { text: string }) {
  return (
    <div style={{ position: "absolute", left: 80, bottom: 130, fontSize: 22, color: theme.brandSky, opacity: 0.85 }}>{text}</div>
  );
}
