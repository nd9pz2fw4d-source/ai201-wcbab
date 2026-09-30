import { CountdownTimer } from "../components/CountdownTimer";
import { SortBoard } from "../components/SortBoard";
import { Headline } from "../components/Text";
import type { SlideProps } from "./types";

export default function Slide12Sort({ sessionLength }: SlideProps) {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[218px] top-[62px]">
        <Headline size={68}>Automate. Assist. Keep human-led.</Headline>
      </div>
      <div className="absolute right-[34px] top-[30px]">
        <CountdownTimer minutes={sessionLength === 60 ? 6 : sessionLength === 120 ? 10 : 8} size={150} />
      </div>
      <div className="absolute left-1/2 top-[175px] -translate-x-1/2">
        <SortBoard />
      </div>
    </div>
  );
}
