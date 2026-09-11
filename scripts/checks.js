import { MODULE_ID } from './constants.js';
import { generateChat } from './chat-utils.js';
import { emitSocketMessage } from './socket.js';
import { getLevelBasedDC } from './degree-of-success.js';
import { buildInvestigateRows, renderInvestigateReport } from './investigate-report.js';

const EXPLORATION_CHECKS = {
  'Search': { roll: (actor) => rollCheck(actor, 'Search', actor.perception, 'secret') },
  'Avoid Notice': { roll: (actor) => rollCheck(actor, 'Avoid Notice', actor.skills.stealth, 'secret') },
  'Track': { roll: (actor) => rollCheck(actor, 'Track', actor.skills.survival) },
  'Investigate': { roll: (actor) => rollInvestigateCheck(actor) },
};

export function isTrackedActivity(activityName) {
  return activityName in EXPLORATION_CHECKS;
}

export async function rollExplorationCheck(actor, activityName) {
  const check = EXPLORATION_CHECKS[activityName];
  if (!check) return;
  await check.roll(actor);
}

export async function recordCheckResult(actor, summary, activityName) {
  await actor.setFlag(MODULE_ID, 'lastCheck', {
    summary,
    activityName,
    timestamp: Date.now(),
  });
  if (activityName == 'Avoid Notice') {
	await actor.update({'system.initiative.statistic' : "stealth",});
  } else {
	await actor.update({'system.initiative.statistic' : "perception",});
  }
}

async function rollCheck(actor, activityName, skill, rollMode) {
  if(!skill) return;
  const roll = await skill.check.roll({
	traits: [rollMode || ''],
    title: `${activityName} (Exploration)`	
  });

  const summary = [{label: skill.label, total: roll.total}];

  if (!actor.items.get(roll.documentId)) {
    await recordCheckResult(actor, summary, activityName);
  }  
}

async function rollInvestigateCheck(actor) {
  const roll = await new Roll('1d20').evaluate();
  await roll.toMessage(
    { speaker: ChatMessage.getSpeaker({ actor }), flavor: 'Investigate (Exploration)' },
    { rollMode: 'blindroll' }
  );

  const d20 = roll.total;
  const baseDC = getLevelBasedDC(actor.level);
  const loreDC = baseDC - 2;

  const rows = buildInvestigateRows(actor, d20, baseDC, loreDC);
  const content = renderInvestigateReport(actor, d20, baseDC, loreDC, rows);
  
  await recordCheckResult(actor, rows, 'Investigate');

  if (game.user.isGM) {
    await generateChat(actor, content, ChatMessage.getWhisperRecipients('GM').map((u) => u.id));
  } else {
    emitSocketMessage({
      type: 'investigate-whisper',
      speaker: ChatMessage.getSpeaker({ actor }),
      content,
    });
  }
}