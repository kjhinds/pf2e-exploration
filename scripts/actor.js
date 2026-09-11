import { generateChat } from './chat-utils.js';
import { rollExplorationCheck, isTrackedActivity, recordCheckResult } from './checks.js';
import { getPackDocumentByName, getPackItemNames, isPackAvailable } from './compendium-utils.js';
import { EXPLORATION_EFFECTS_PACK_ID } from './constants.js';

export function registerActorUpdateHook() {
  Hooks.on('updateActor', onActorUpdate);
}

async function onActorUpdate(actor, changes, options, userId) {
  if (actor.type !== 'character') return;
  if (!foundry.utils.hasProperty(changes, 'system.exploration')) return;
  if (userId !== game.user.id) return;

  const activityIds = actor.system.exploration ?? [];
  
  for (const id of activityIds) {
    const item = actor.items.get(id);
    if (!item) continue;

    await generateChat(actor, `<h4>I will <b>${item.name}</b></h4>`);
    await setActivityEffect(actor, item.name);

    if (isTrackedActivity(item.name)) {
      await rollExplorationCheck(actor, item.name);
    } else {
	  recordCheckResult(actor, '', item.name);
	}
  }
  
  if (activityIds.length === 0) recordCheckResult(actor, '', '');
}

async function setActivityEffect(actor, activityName) {
  if (!isPackAvailable(EXPLORATION_EFFECTS_PACK_ID)) return;
  
  const addEffect = await getPackDocumentByName(EXPLORATION_EFFECTS_PACK_ID, activityName);
  if (!addEffect) return;

  const effectNames = getPackItemNames(EXPLORATION_EFFECTS_PACK_ID);
  const existingEffectIds = actor.items
    .filter((item) => effectNames.includes(item.name) && item.type === 'effect')
    .map((item) => item._id);

  await actor.deleteEmbeddedDocuments('Item', existingEffectIds);
  await actor.createEmbeddedDocuments('Item', [addEffect]);
}