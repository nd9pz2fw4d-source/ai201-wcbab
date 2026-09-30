export type SessionLength = 60 | 75 | 90 | 120;
export const SESSION_LENGTHS: SessionLength[] = [60, 75, 90, 120];

export const config = {
  sessionLength: 75 as SessionLength, // 60 | 75 | 90 | 120
  showPresenterTimer: false,
  workerName: "[WORKER_NAME]", // composite, fictional
  claimType: "physical" as "physical" | "psychological",
  soundOnByDefault: false, // countdown chime
};

export type ActId = "opening" | "see" | "choose" | "govern" | "discussion" | "close";

export const actLabels: Record<ActId, string> = {
  opening: "Opening",
  see: "See it",
  choose: "Choose it",
  govern: "Govern it",
  discussion: "Open discussion",
  close: "Close",
};

// Planned minutes per act, for the menu, progress bar and presenter timer.
// Act 1 carries the teaching block ("How it works", "Where it's going"), so it is the longest act.
export const plannedMinutes: Record<SessionLength, Partial<Record<ActId, number>>> = {
  60: { opening: 5, see: 25, choose: 12, govern: 13, close: 5 },
  75: { opening: 5, see: 35, choose: 15, govern: 15, close: 5 },
  90: { opening: 5, see: 40, choose: 17, govern: 18, discussion: 5, close: 5 },
  120: { opening: 5, see: 50, choose: 22, govern: 28, discussion: 10, close: 5 },
};

export const actOrder: ActId[] = ["opening", "see", "choose", "govern", "discussion", "close"];
