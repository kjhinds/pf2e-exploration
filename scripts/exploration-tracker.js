import { TRACKER_TEMPLATE } from './constants.js';
import { emitSocketMessage } from './socket.js';
import { getPartyExplorationData } from './party-data.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

let currentTrackerWindow = null;

export function openExplorationTracker() {
  if (currentTrackerWindow?.rendered) {
	  currentTrackerWindow.render(true);
	  return currentTrackerWindow;
  }
  currentTrackerWindow = new ExplorationTracker();
  currentTrackerWindow.render(true);
  return currentTrackerWindow;
}

export function registerExplorationTrackerHook() {
	const trackerRenderer = (actor, changes, options, userId) => {
		if (changes.flags && currentTrackerWindow?.rendered) {
			currentTrackerWindow.render();
		}
	};
	
	Hooks.on("updateActor", trackerRenderer);
}

export class ExplorationTracker extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "exploration-tracker",
    tag: "div",
    window: {
      title: "Party Exploration Activities",
      icon: "fa-solid fa-users",
      resizable: true
    },
    position: {
      width: "auto",
      height: "auto"
    },
    actions: {
      clearActivity: ExplorationTracker.onClearActivity,
      requestReroll: ExplorationTracker.onRequestReroll,
	  requestActivity: ExplorationTracker.onRequestActivity,
	  requestPartyActivities: ExplorationTracker.onRequestPartyActivities,
	  clearAllActivities: ExplorationTracker.onClearAllActivities,
	  closeWindow: ExplorationTracker.onCloseWindow
    }
  };

  static PARTS = {
    body: {
      template: TRACKER_TEMPLATE
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.partyMembers = getPartyExplorationData();
	context.interactable = true;
	return context;
  }

  static onClearActivity(event, target) {
	const data = target.closest("[data-actor-id]")?.dataset
    const actor = game.actors.get(data.actorId);
    actor.update({ 'system.exploration': [] });
  }

  static onRequestReroll(event, target) {
	const data = target.closest("[data-actor-id]")?.dataset
	
	emitSocketMessage({
      type: 'request-reroll',
      actorId: data.actorId,
      activityName: data.actorActivity,
    });
    ui.notifications.info(`Requested ${data.actorName} reroll their ${data.activityName} check.`);
  }
  
  static onRequestActivity(event, target) {
	const data = target.closest("[data-actor-id]")?.dataset;
    emitSocketMessage({
	  type: 'request-exploration',
	  actorId: data.actorId
	});
	ui.notifications.info(`Requested ${data.actorName} to select an exploration activity.`);
  }
  
  static onRequestPartyActivities(event, target) {
    emitSocketMessage({
	  type: 'request-exploration',
	});
	ui.notifications.info(`Requested party exploration activities`);
  }
  
  static onClearAllActivities(event, target) {
    const actors = game.actors.party?.members
	for (const actor of actors) {
		actor.update({ 'system.exploration': [] });
	}
	ui.notifications.info(`Cleared party exploration activities`);
  }
  
  static onCloseWindow(event, target) {
    currentTrackerWindow.close();
	currentTrackerWindow = null;
  }
  
}