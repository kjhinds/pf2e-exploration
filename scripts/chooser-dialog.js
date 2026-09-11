import { DEFAULT_ACTIVITIES, CHOOSER_TEMPLATE, ACTIONS_PACK_ID } from './constants.js';
import { getPackDocumentByName } from './compendium-utils.js';
import { openExplorationTracker } from './exploration-tracker.js';

const renderTemplate = foundry.applications.handlebars.renderTemplate;
const DialogV2 = foundry.applications.api.DialogV2;

export function openExplorationChooser() {
  const tokens = canvas.tokens.controlled.filter((t) => t.actor?.type === 'character');

  if (tokens.length === 0 && game.user.isGM) {
	openExplorationTracker();
	return;
  } else if (tokens.length === 0) {
    ui.notifications.error('You must select at least one PC token');
    return;
  }

  for (const token of tokens) {
    const actor = token.actor;
    const activities = getExplorationItems(actor);
    showChooserDialog(actor, buildDialogData(actor, activities));
  }
}

function getExplorationItems(actor) {
  return actor.items.contents.filter(isExplorationActivity);
}

function isExplorationActivity(item) {
  if (!(item.traits && item.system.actionType)) return false;
  if (item.system.actionType.value !== 'passive' || item.type === 'feat') return false;
  return item.traits.some((t) => t === 'exploration');
}

function buildDialogData(actor, activities) {
  const activitiesByName = new Map(activities.map((activity) => [activity.name, activity]));
  const favoriteActivities = [];
  const standardActivities = [];

  for (const [name, desc] of Object.entries(DEFAULT_ACTIVITIES)) {
    const matchingItem = activitiesByName.get(name);
    if (matchingItem) {
      favoriteActivities.push({ name, desc, id: matchingItem.id });
    } else {
      standardActivities.push({ name, desc });
    }
  }

  const extraActivities = activities
    .filter((activity) => !(activity.name in DEFAULT_ACTIVITIES))
    .map(({ id, name }) => ({ id, name }));

  return { favoriteActivities, standardActivities, extraActivities, actor };
}

async function addDefaultActivity(actor, actionName) {
  const actionItem = await getPackDocumentByName(ACTIONS_PACK_ID, actionName);
  const [created] = await actor.createEmbeddedDocuments('Item', [actionItem]);
  return created._id;
}

async function showChooserDialog(actor, data) {
  const content = document.createElement('div');
  const explorationTable = await renderTemplate(CHOOSER_TEMPLATE, data);
  content.insertAdjacentHTML('afterbegin', explorationTable);
  const explorationDialog = new DialogV2({
	window: { title: 'Exploration Activity' },
    content: content,
	buttons: [{
		action: 'choice',
		label: 'Select Activity',
		default: true,
		callback: async () => {
          const selectedInput = document.querySelector('input[name="exploration_activity"]:checked');
          if (!selectedInput) return;

          let itemId = selectedInput.id;
          if (itemId === '') {
            itemId = await addDefaultActivity(actor, selectedInput.value);
          }

          await actor.update({ 'system.exploration': [] });
          await actor.update({ 'system.exploration': [itemId] });
        }
	}, {
		action: 'cancel',
		label: 'Cancel'
	}],
  });
  explorationDialog.render({ force: true});
}