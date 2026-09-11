import { openExplorationChooser } from './chooser-dialog.js';
import { registerActorUpdateHook } from './actor.js';
import { registerSocketHandlers } from './socket-handlers.js';
import { registerExplorationTooltip } from './exploration-tooltip.js';
import { openExplorationTracker, registerExplorationTrackerHook } from './exploration-tracker.js';
import { ACTIVITY_OPTION_PARTIAL, ACTIVITY_OPTION_TEMPLATE } from './constants.js';

console.log('PF2e Exploration | module file loaded');

Hooks.once('init', () => {
  foundry.applications.handlebars.loadTemplates({
    [ACTIVITY_OPTION_PARTIAL]: ACTIVITY_OPTION_TEMPLATE,
  });
});

Hooks.once('ready', () => {
  game.pf2eExploration = {
    explorationActivity: openExplorationChooser,
	explorationTracker: openExplorationTracker,
  };

  registerActorUpdateHook();
  registerSocketHandlers();
  registerExplorationTooltip();
  registerExplorationTrackerHook();

  console.log('PF2e Exploration | ready');
});