# Follow the claim: the fundamentals

A pre-read for the Executive AI Academy. About 10 minutes of conversation, then the 2:20 music video as a recap.

**Ava** (a woman; her voice matched to the song's singer) guides. **Sam** (a man) asks the questions an executive would ask. Both are narrators, not real people.

Pace: slow, about 130 words a minute, with a short pause between scenes. Every spoken line is captioned. Lines marked **Ava:** or **Sam:** are spoken; lines starting "On screen" describe the picture and are not spoken.

---

## 0. Song sting

On screen: the "Follow the claim" title, the claim file stamped "Pre-read". The chorus plays for about 10 seconds and fades under Ava's first line.

## 1. Opening

On screen: one claim file, then the eight stations of the claim journey.

**Ava:** Hi, and welcome. Before the Executive AI Academy, we want to give you something simple: a shared vocabulary.

**Sam:** In the session, we'll follow one injured worker's claim, from the day it's reported to the day they're back at work.

**Ava:** And to talk about where AI fits on that journey, we all need to mean the same thing when we say "AI", "agent", or "human in the loop". So: about ten minutes, a dozen ideas. Let's start.

## 2. Three kinds of AI

On screen: three cards appear in turn: Predicts, Writes, Does.

**Sam:** When people say "AI", what do they actually mean?

**Ava:** It helps to think of three kinds. The first predicts. Predictive AI, or machine learning, learns patterns from past data to score or forecast. How complex is this claim likely to be? How many calls will we get next week?

**Ava:** The second reads and writes. Generative AI can summarize a thick claim file, answer questions about it, or draft a letter. That's what Copilot does today.

**Ava:** The third does the work. An agent doesn't just answer. It takes steps toward a goal.

**Sam:** Predicts, writes, does.

**Ava:** Exactly.

## 3. The large language model, and hallucination

On screen: "The worker hurt their…" with candidate words and their scores. Then a confident answer stamped "Not verified".

**Sam:** So how does the "reads and writes" kind actually work?

**Ava:** Underneath is a large language model, or LLM. It does one thing: given the words so far, it predicts a likely next word. Then it does it again, and again.

**Ava:** Take "The worker hurt their…". The model scores every possible next word, like back, hand or knee, and picks a likely one.

**Sam:** That sounds almost too simple.

**Ava:** It is simple. It's why these models are so fluent. But it's also why they can be wrong: a model produces what sounds likely, not what it has checked. A fluent, confident answer that isn't true is called a hallucination.

**Sam:** So confident isn't the same as correct.

**Ava:** Right. Fluent is not the same as verified.

## 4. Grounding, and RAG

On screen: the question goes to three sources (policy manual, claim file, medical guideline); the answer comes back with a citation chip, "Clinic report, page 2". Then the three letters R, A, G, each expanding into its word.

**Sam:** Then how can we trust what it says about a real claim?

**Ava:** We ground it. Before it answers, the system looks things up in trusted sources, like our policy manual, the claim file, or medical guidelines, and answers from those.

**Ava:** You'll hear this called RAG: retrieval-augmented generation. Retrieval: find the right documents. Augmented: add them to the question. Generation: write the answer from them.

**Sam:** And how would I know it did that?

**Ava:** Citations. A grounded answer shows where it came from, so a person can check it in seconds. Ask that of any AI tool: where did this answer come from, and can I see it?

## 5. What makes an agent

On screen: the model in the middle; five parts appear around it: Goal, Instructions, Tools, Memory, Person.

**Sam:** You said agents do the work. How is that different from a chatbot?

**Ava:** A chatbot answers a question. An agent pursues a goal. The language model is the reasoning engine in the middle, and around it are five parts.

**Ava:** A goal: what "done" looks like, say, "get this claim ready for a decision". Instructions: the rules and limits it must follow. Tools: the systems it may use. Memory: what it knows about this claim so far. And a person, who approves and decides.

**Sam:** And when an agent goes wrong?

**Ava:** It's usually one of those five: a vague goal, a missing rule, too much access, out-of-date memory, or no person at the right moment.

## 6. The agent loop

On screen: a loop of Plan, Act, Check, with the example steps lighting up in turn, ending on "Hand to a person".

**Sam:** What does an agent actually do, step by step?

**Ava:** It runs a loop. Plan the next step. Act, usually by using a tool. Check the result. Then repeat until the goal is met.

**Ava:** Say it finds the doctor's note is missing. It plans to ask the clinic for it, drafts the request, and then stops, because sending anything outside WCB needs a person's approval.

**Sam:** So it knows when to stop.

**Ava:** If we design it to: when the goal is met, when a rule says a person must approve, or when it's unsure. And because each step builds on the last, one early mistake can carry forward. You'll see that in the session.

## 7. Tools and permissions

On screen: three levels, Read, Draft, Act, with "Act" outlined in red. Then an agent badge with its own ID and a named owner.

**Sam:** What decides what an agent can touch?

**Ava:** Tools are its hands, and it can only use what we connect it to. There are three levels: read, to look things up; draft, to prepare something for a person; and act, to change something in the world, like sending a letter or scheduling a payment.

**Ava:** The principle is least privilege: only the access the job needs. And like a new hire, every agent gets its own identity and a named human owner.

**Sam:** So that's an IT setting?

**Ava:** IT sets it up. But what agents may do on WCB's behalf is a leadership decision.

## 8. The autonomy dial, and human in the loop

On screen: a dial with five positions: Suggests, Drafts, Acts with approval, Acts then reports, Acts alone. The needle moves as Ava names each one.

**Sam:** How much should an agent do on its own?

**Ava:** Picture a dial. At one end, it only suggests. Then it drafts for a person. Then it acts with approval. Then it acts and reports afterwards. At the far end, it acts alone.

**Ava:** Autonomy is a setting we choose for each task, not a feature of the technology. The rule: the more independently it acts, the stronger the oversight must be.

**Sam:** Which is where "human in the loop" comes in.

**Ava:** Yes. A person reviews or approves at the moments that matter. And for decisions about a worker's benefits, a person decides.

## 9. Evals

On screen: a test set of past claims, scored on five checks: right answer, sources shown, fair, private, knows when to hand over.

**Sam:** Before we switch something on, how do we know it's good enough?

**Ava:** We test it, like any other control. These tests are called evals, short for evaluations. Run it over past claims, with personal details removed, and score it: right answer, sources shown, fair, private, and knows when to hand over to a person.

**Ava:** Then keep testing after launch, because models, data and policies change. Test before you trust.

## 10. Copilot is the floor, not the ceiling

On screen: left, many people each with a Copilot, same journey; right, the redesigned journey with agents between people. Then the factory: a steam engine, an electric motor on the old layout ("little gain"), the redesigned factory ("big gain").

**Sam:** We all have Copilot already. Isn't that our AI strategy?

**Ava:** Copilot is the floor, not the ceiling. Give everyone a Copilot and each person gets a bit faster. That's real. But the journey stays the same shape: same handoffs, same waiting.

**Ava:** The bigger gains come from redesigning the journey itself, with agents doing the busywork between people, and people at the decisions.

**Sam:** That's a much bigger change.

**Ava:** And history says it's the one that pays. When factories got electricity, most bolted an electric motor onto the old layout, and productivity barely moved for decades. The big gains came when factories were redesigned around the new power.

## 11. Four kinds of AI opportunity

On screen: a ladder with four rungs: Personal productivity, Team workflow, End-to-end journey, New services, each with its owner. The top two rungs light up gold, labelled "Executives".

**Sam:** How do we tell AI opportunities apart?

**Ava:** Think of a ladder. Rung one: personal productivity, like Copilot drafting a letter, owned by each of us. Rung two: team workflow, like medical files summarized for adjudicators, owned by managers.

**Ava:** Rung three: an end-to-end journey, like the claim journey redesigned. Rung four: new services, things WCB couldn't do before, like reaching a worker early, before a claim goes long.

**Sam:** And the top two?

**Ava:** They cross teams, systems and policy, so only executives can own them. Most organizations stop at rung one. The value is at three and four.

## 12. Readiness

On screen: a steep rising line, "What AI can do", next to a slow-filling bar, "Getting ready". Then six foundations appear: Data, Written rules, Agent identities, Skills, Journey owners, Monitoring.

**Sam:** Why not wait until the technology settles down?

**Ava:** Because the two move at different speeds. By one independent measure, the length of task an AI agent can complete has been doubling roughly every seven months. Getting ready takes years.

**Ava:** Agents depend on foundations: clean, connected data; rules that are written down; identities and access for agents; people with the skills to direct them; owners for each journey; and monitoring, so we can see what an agent did.

**Sam:** So starting late costs more than the delay.

**Ava:** Much more.

## 13. What stays human, and the day ahead

On screen: four words lock in: Judgment, Empathy, Accountability, The worker's voice. Then the three acts: See it, Choose it, Govern it.

**Sam:** With all that change, what stays the same?

**Ava:** Four things stay with people. Judgment on decisions that affect a worker's life. Empathy for someone who is hurt and worried. Accountability for every decision. And the worker's voice, including the right to ask for a human review.

**Sam:** In the session, we'll put this to work in three acts. See it: where AI creates value. Choose it: which opportunities to pursue. Govern it: what only executives can do.

**Ava:** Bring one question you want answered. And now, the short version, set to music.

## 14. The music video

On screen: the 2:20 "Follow the claim" music video plays in full as a recap.
