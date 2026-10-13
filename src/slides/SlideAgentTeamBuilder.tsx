import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, RotateCcw, TriangleAlert, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Interactive, SlideButton } from "../components/Interactive";
import { teamCandidates, type Access } from "../data/osOfWork";
import { useSlideState } from "../hooks/useSlideState";
import { theme } from "../theme";
import { TeachLayout } from "./TeachLayout";

type Member = { on: boolean; access: Access; approval: boolean };
type Team = { owner: boolean; members: Record<string, Member> };

const initialTeam = (): Team => ({
  owner: false,
  members: Object.fromEntries(teamCandidates.map((c) => [c.id, { on: c.id === "intake", access: "read", approval: false }])),
});

const accessLabels: Record<Access, string> = { read: "Read", draft: "Draft", act: "Act" };

type Flag = { level: "risk" | "warn"; text: string };

/** The rules the room's team is checked against. */
function check(team: Team): Flag[] {
  const flags: Flag[] = [];
  const on = teamCandidates.filter((c) => team.members[c.id].on);
  if (on.length === 0) return [{ level: "warn", text: "Add agents to the team" }];
  if (!team.owner) flags.push({ level: "risk", text: "No accountable person owns these agents" });
  for (const c of on) {
    const m = team.members[c.id];
    if (m.access === "act" && !m.approval) {
      flags.push(
        c.sensitive
          ? { level: "risk", text: `${c.name} acts with no one approving` }
          : { level: "warn", text: `${c.name} acts alone. Is the risk low enough?` },
      );
    }
  }
  if (on.length >= 4 && on.every((c) => team.members[c.id].access === "act")) {
    flags.push({ level: "warn", text: "Every agent can act. Who checks the whole picture?" });
  }
  return flags;
}

function Pill({ active, color, onClick, children }: { active: boolean; color: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      data-interactive
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-full px-5 py-2 text-[22px] font-medium"
      style={{ background: active ? color : "#EEF3F7", color: active ? "#fff" : theme.muted }}
    >
      {children}
    </button>
  );
}

export default function SlideAgentTeamBuilder() {
  const [team, setTeam] = useSlideState<Team>("teamBuilder", initialTeam());
  const set = (id: string, patch: Partial<Member>) =>
    setTeam((t) => ({ ...t, members: { ...t.members, [id]: { ...t.members[id], ...patch } } }));
  const flags = check(team);
  const clean = flags.length === 0;

  return (
    <TeachLayout strand="where" headline="Build your agent team">
      <Interactive className="absolute left-[100px] top-[270px] flex w-[1140px] flex-col gap-3">
        {teamCandidates.map((c) => {
          const m = team.members[c.id];
          return (
            <div key={c.id} className="flex items-center gap-5 rounded-2xl bg-white px-5 py-3" style={{ boxShadow: m.on ? `0 0 0 3px ${theme.agent}` : "0 1px 0 #C9DDEA", opacity: m.on ? 1 : 0.75 }}>
              <button
                type="button"
                data-interactive
                aria-label={`${m.on ? "Remove" : "Add"} ${c.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  set(c.id, { on: !m.on });
                }}
                className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-full text-[32px] font-bold"
                style={{ background: m.on ? theme.agent : "#EEF3F7", color: m.on ? "#fff" : theme.muted }}
              >
                {m.on ? "✓" : "+"}
              </button>
              <div className="flex w-[330px] shrink-0 flex-col">
                <span className="text-[27px] font-bold" style={{ color: theme.brandPrimary }}>
                  {c.name}
                </span>
                <span className="text-[20px]" style={{ color: theme.muted }}>
                  {c.acts}
                </span>
              </div>
              <div className={`flex gap-2 ${m.on ? "" : "pointer-events-none opacity-40"}`}>
                {(["read", "draft", "act"] as Access[]).map((a) => (
                  <Pill key={a} active={m.access === a} color={a === "act" ? theme.brandPrimary : theme.agent} onClick={() => set(c.id, { access: a })}>
                    {accessLabels[a]}
                  </Pill>
                ))}
              </div>
              {m.on && m.access === "act" && (
                <div className="ml-auto">
                  <Pill active={m.approval} color={theme.human} onClick={() => set(c.id, { approval: !m.approval })}>
                    {m.approval ? "Person approves" : "No approval"}
                  </Pill>
                </div>
              )}
            </div>
          );
        })}
        <div className="mt-2 flex items-center gap-4">
          <button
            type="button"
            data-interactive
            onClick={(e) => {
              e.stopPropagation();
              setTeam((t) => ({ ...t, owner: !t.owner }));
            }}
            className="flex items-center gap-3 rounded-full px-6 py-3 text-[24px] font-medium"
            style={{ background: team.owner ? theme.human : "#fff", color: team.owner ? "#fff" : theme.human, boxShadow: `0 0 0 3px ${theme.human}` }}
          >
            <UserRound size={26} /> {team.owner ? "Accountable owner named" : "Name an accountable owner"}
          </button>
          <SlideButton tone="ghost" className="!py-3 !text-[22px]" onClick={() => setTeam(initialTeam())}>
            <RotateCcw size={22} /> Reset
          </SlideButton>
        </div>
      </Interactive>

      {/* Live risk check */}
      <div className="absolute right-[100px] top-[270px] flex w-[520px] flex-col gap-3 rounded-3xl bg-white p-7" style={{ boxShadow: "0 1px 0 #C9DDEA, 0 16px 40px rgba(12,53,83,0.1)" }}>
        <div className="text-[30px] font-bold" style={{ color: theme.brandPrimary }}>
          Governance check
        </div>
        <AnimatePresence initial={false} mode="popLayout">
          {clean ? (
            <motion.div key="clean" className="flex items-center gap-3 rounded-2xl p-4 text-[26px] font-medium text-white" style={{ background: theme.human }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <CircleCheck size={34} /> Owned, approved, governed
            </motion.div>
          ) : (
            flags.map((f) => (
              <motion.div
                key={f.text}
                layout
                className="flex items-start gap-3 rounded-2xl p-4 text-[24px] font-medium"
                style={{ background: f.level === "risk" ? "#FBE9E9" : "#FFF6E6", color: f.level === "risk" ? theme.risk : "#8A5A00" }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                <TriangleAlert size={28} className="mt-0.5 shrink-0" /> {f.text}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </TeachLayout>
  );
}
