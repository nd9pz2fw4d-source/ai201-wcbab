import { autonomyRow, designAgents, threeRights, worksheetRows, type DesignAgent } from "../data/designAgent";
import { stations } from "../data/journey";
import { theme } from "../theme";

/**
 * Printed worksheet for the "Design an agent" table exercise: one page per agent, plus a blank one.
 * Hidden on screen; shown only when printing (the slide's Print handouts button, or Ctrl+P).
 */
export function Handout() {
  return (
    <div className="print-only" aria-hidden>
      {designAgents.map((a) => (
        <Page key={a.id} agent={a} />
      ))}
      <Page />
    </div>
  );
}

function Page({ agent }: { agent?: DesignAgent }) {
  const station = agent && stations.find((s) => s.id === agent.station);
  const rows = [...worksheetRows, autonomyRow];
  return (
    <section className="handout-page" style={{ color: theme.ink, fontFamily: "Roboto, Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9pt", color: theme.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        <span>Follow the claim · Design an agent</span>
        <span>Table ______</span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "12pt", marginTop: "8pt" }}>
        <h1 style={{ margin: 0, fontSize: "24pt", color: theme.brandPrimary }}>{agent ? agent.name : "Our agent: ____________________"}</h1>
        {station && <span style={{ fontSize: "11pt", color: theme.muted }}>Claims step: {station.name}</span>}
      </div>
      <p style={{ margin: "3pt 0 10pt", fontSize: "12pt" }}>{agent ? agent.job : "Pick one step of the claims journey and design an agent for it."}</p>

      <div style={{ display: "flex", gap: "14pt" }}>
        <table style={{ flex: 1, borderCollapse: "collapse", fontSize: "11pt" }}>
          <tbody>
            {rows.map((r) => {
              const optional = r === autonomyRow;
              return (
                <tr key={r.element} style={{ borderTop: `1.5pt ${optional ? "dashed" : "solid"} ${theme.line}` }}>
                  <td style={{ width: "2.1in", padding: "7pt 10pt 7pt 0", verticalAlign: "top" }}>
                    <div style={{ fontSize: "14pt", fontWeight: 700, color: theme.brandPrimary }}>
                      {r.element}
                      {optional && <span style={{ fontSize: "9pt", fontWeight: 500, color: theme.muted }}> optional</span>}
                    </div>
                    <div style={{ color: theme.muted }}>{r.question}</div>
                  </td>
                  <td style={{ height: optional ? "0.85in" : "1in", borderLeft: `1pt solid ${theme.line}` }} />
                </tr>
              );
            })}
          </tbody>
        </table>

        <aside style={{ width: "2.3in", display: "flex", flexDirection: "column", gap: "8pt" }}>
          <div style={{ border: `1.5pt solid ${theme.brandAccent}`, borderRadius: "8pt", padding: "8pt 10pt" }}>
            <div style={{ fontSize: "9pt", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.muted }}>Good instructions give it</div>
            {threeRights.map((r) => (
              <div key={r.title} style={{ marginTop: "6pt" }}>
                <div style={{ fontSize: "11.5pt", fontWeight: 700, color: theme.brandPrimary }}>{r.title}</div>
                <div style={{ fontSize: "10pt" }}>{r.text}</div>
              </div>
            ))}
          </div>
          <div style={{ border: `1.5pt solid ${theme.line}`, borderRadius: "8pt", padding: "8pt 10pt", fontSize: "10pt" }}>
            <div style={{ fontSize: "9pt", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.muted }}>Share back in 30 seconds</div>
            <div style={{ marginTop: "4pt" }}>Its name and goal, one instruction, and one check: when does it stop and ask a person?</div>
          </div>
          <div style={{ fontSize: "9pt", color: theme.muted, marginTop: "auto" }}>
            About 5 minutes. Keep it to one step of the claim. Letters to the worker and payments always need a person to approve.
          </div>
        </aside>
      </div>
    </section>
  );
}
