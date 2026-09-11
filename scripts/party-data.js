import { MODULE_ID, MAX_ROLL_SUMMARY_ROWS } from './constants.js';
 
export function getPartyExplorationData() {
  const actors = game.actors.party?.members ?? [];
  const partyMembers = [];
 
  for (const actor of actors) {
    const lastCheck = actor.flags[MODULE_ID]?.lastCheck;
    if (!lastCheck) continue;
 
    partyMembers.push({
      id: actor.id,
      name: actor.name,
      activity: lastCheck.activityName,
      rollSummary: lastCheck.summary.slice(0, MAX_ROLL_SUMMARY_ROWS),
    });
  }
 
  return partyMembers;
}