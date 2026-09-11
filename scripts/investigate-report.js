import { RECALL_KNOWLEDGE_SKILL_SLUGS, DEGREE_COLORS } from './constants.js';
import { degreeOfSuccess } from './degree-of-success.js';
 
export function buildInvestigateRows(actor, d20, baseDC, loreDC) {
  const rows = [];
 
  const addRow = (skill, dc) => {
    if (!skill) return;
    const total = d20 + skill.mod;
    rows.push({ label: skill.label, total, dc });
  };
 
  for (const slug of RECALL_KNOWLEDGE_SKILL_SLUGS) {
    addRow(actor.skills[slug], baseDC);
  }
  for (const skill of Object.values(actor.skills)) {
    if (skill?.lore) addRow(skill, loreDC);
  }
 
  rows.sort((a, b) => b.total - a.total);
 
  return rows;
}
 
export function renderInvestigateReport(actor, d20, baseDC, loreDC, rows) {
  const tableRows = rows
    .map(({ label, total, dc }) => {
      const result = degreeOfSuccess(total, dc, d20);
      const color = DEGREE_COLORS[result];
      return `
        <tr>
          <td>${label}</td>
          <td>${total}</td>
          <td style="color: ${color};">${result}</td>
        </tr>
      `;
    })
    .join('');
 
  const natNote = getNaturalRollNote(d20);
 
  return `
    <h3>${actor.name} — Investigate Recall Knowledge Totals</h3>
    <p>Level ${actor.level} DC: ${baseDC} (Lore DC: ${loreDC})</p>
    ${natNote}
    <table class='pf2e-exploration-investigate'>
      <thead>
        <tr>
          <th>Skill</th>
          <th>Total</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;
}

function getNaturalRollNote(d20) {
  if (d20 === 20) return `<p><strong>Natural 20</strong></p>`;
  if (d20 === 1) return `<p><strong>Natural 1</strong></p>`;
  return '';
}