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
// Acts 2 and 3 carry objectives 2 (opportunity types) and 3 (executive accountabilities).
export const plannedMinutes: Record<SessionLength, Partial<Record<ActId, number>>> = {
  60: { opening: 5, see: 22, choose: 14, govern: 14, close: 5 },
  75: { opening: 5, see: 30, choose: 18, govern: 17, close: 5 },
  90: { opening: 5, see: 35, choose: 20, govern: 20, discussion: 5, close: 5 },
  120: { opening: 5, see: 45, choose: 27, govern: 28, discussion: 10, close: 5 },
};

export const actOrder: ActId[] = ["opening", "see", "choose", "govern", "discussion", "close"];
