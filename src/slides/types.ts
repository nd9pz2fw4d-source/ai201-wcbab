import type { ComponentType } from "react";
import type { ActId, SessionLength } from "../config";

export interface SlideProps {
  sessionLength: SessionLength;
}

export interface SlideDef {
  id: string;
  act: ActId;
  title: string;
  include: SessionLength[];
  component: ComponentType<SlideProps>;
  /** Talking points. Never shown on screen. */
  notes: string;
  /** Background tone: sets the stage colour and footer contrast. */
  tone: "dark" | "light" | "dawn";
  /** Slides that show the large logo themselves hide the small corner logo. */
  largeLogo?: boolean;
}
