// The words, the five pitch questions and the three questions to bring. One source for the explainer's
// scenes and for the one-page cheat sheet that goes out with it (scripts/cheatsheet.mjs), so they always
// say the same thing. Definitions follow the script's plain words and everyday examples.

export interface Term {
  term: string;
  meaning: string;
  /** Where the viewer met it in the video. */
  seenAs: string;
}

export const termGroups: { title: string; terms: Term[] }[] = [
  {
    title: "Three kinds of AI",
    terms: [
      { term: "Predictive AI (machine learning)", meaning: "Learns patterns from past data to score or forecast", seenAs: "The bank's unusual-purchase alert" },
      { term: "Generative AI", meaning: "Reads and writes: summarizes, answers, drafts", seenAs: "Copilot drafting a reply" },
      { term: "Agent", meaning: "Pursues a goal by taking steps, using tools, memory and instructions", seenAs: "An assistant that books the whole trip" },
    ],
  },
  {
    title: "How it works",
    terms: [
      { term: "Large language model (LLM)", meaning: "Predicts a likely next word, again and again; fluent, but has no built-in fact check", seenAs: "Your phone finishing your sentence" },
      { term: "Hallucination", meaning: "A fluent, confident answer that isn't true", seenAs: "The made-up leadership decision" },
      { term: "Grounding", meaning: "Answering from trusted sources, and showing them", seenAs: '"It\'s on page 4 of the policy"' },
      { term: "RAG", meaning: "Retrieval-augmented generation: retrieve the right documents, add them to the question, generate the answer from them", seenAs: "A summary with a source under each point" },
    ],
  },
  {
    title: "Keeping control",
    terms: [
      { term: "Agent loop", meaning: "Plan a step, act, check the result, repeat; stop when done, unsure, or approval is needed", seenAs: "Flight, hotel, calendar, then a pause" },
      { term: "Least privilege", meaning: "Only the access the job needs", seenAs: "It can hold a hotel, but can't spend from the company account" },
      { term: "Autonomy dial", meaning: "How much it may do alone: suggests, drafts, acts with approval, acts then reports, acts alone", seenAs: '"Pay $1,860?" Approve or decline' },
      { term: "Human in the loop", meaning: "A person reviews or approves at the moments that matter, and stays accountable", seenAs: "A person edits the draft, then sends it" },
      { term: "Evals", meaning: "Tests of an AI system, on cases like ours, before and after launch", seenAs: '"99% accurate": on what tests?' },
    ],
  },
];

/** The pitch Sam reads, broken into its claims, each turned into a question to ask. */
export const pitch = "Our AI agent is 99% accurate, fully autonomous, learns your business, and plugs into all your systems.";

export const pitchQuestions: { claim: string; question: string; term: string }[] = [
  { claim: "99% accurate", question: "On what tests, and on cases like ours? Show me the evals.", term: "Evals" },
  { claim: "Fully autonomous", question: "For which tasks, and where does a person approve?", term: "Autonomy dial" },
  { claim: "Learns your business", question: "From what data, and can it show where an answer came from?", term: "Grounding" },
  { claim: "Plugs into all your systems", question: "What can it read, draft and do? Only what the job needs?", term: "Least privilege" },
  { claim: "(not in the pitch)", question: "When it's wrong, who notices, and can we see what it did?", term: "Human in the loop" },
];

export const bringQuestions: { question: string; why: string }[] = [
  { question: "Where does work wait the longest in your area?", why: "Waiting is where AI usually helps first." },
  { question: "Which decision would you never hand to a machine, and why?", why: "Your answer shows where a person must stay." },
  { question: "What would you need to see before you trusted an AI's answer?", why: "A source, a test result, a person who checked?" },
];

/** Deloitte's survey line, quoted in the last scene and on the cheat sheet. */
export const deloitte = {
  stat: "83%",
  text: "of Canadian workers' compensation leaders surveyed say their maturity for integrating AI into core business functions is still low",
  source: "Deloitte, The Future of Workers' Compensation (August 2026)",
};
