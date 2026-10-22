// Named slide mixes for the slide sorter (S). Ids from src/slides/index.ts, any order:
// the deck always plays them in deck order.

export const presets = {
  myMix: {
    label: "My mix",
    ids: [
      // Opening
      "title", "one-claim", "objectives",
      // See it
      "act-see", "era-1", "era-2", "era-3", "era-4", "era-5",
      "how-it-works", "next-word", "grounding", "anatomy", "agent-loop", "autonomy-dial", "agent-teams", "evaluations",
      "computer-agents", "copilot-os", "adapt-os", "floor-not-ceiling", "dynamo", "agent-meets-agent",
      "what-stays", "live-moment", "design-agent", "recap",
      // Choose it
      "act-choose", "opportunity-types", "sort", "place-our-five", "four-questions",
      // Govern it
      "act-govern", "govern-questions", "find-it", "supervisor", "exec-accountabilities",
      // Discussion and close
      "discussion", "close",
    ],
  },
} as const;

export type PresetId = keyof typeof presets;
