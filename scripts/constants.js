export const MODULE_ID = 'pf2e-exploration';
export const SOCKET_EVENT = `module.${MODULE_ID}`;
export const ACTIONS_PACK_ID = 'pf2e.actionspf2e';
export const EXPLORATION_EFFECTS_PACK_ID = 'pf2e-exploration-effects.exploration-effects';
export const CHOOSER_TEMPLATE = 'modules/pf2e-exploration/templates/exploration-chooser.hbs';
export const TRACKER_TEMPLATE = 'modules/pf2e-exploration/templates/exploration-tracker.hbs';
export const ACTIVITY_OPTION_PARTIAL = 'pf2e-exploration.activity-option';
export const ACTIVITY_OPTION_TEMPLATE = 'modules/pf2e-exploration/templates/partials/exploration-activity-option.hbs';
export const MAX_ROLL_SUMMARY_ROWS = 3;

export const DEFAULT_ACTIVITIES = {
  'Avoid Notice': 'Sneak to attempt to start encounters undetected',
  'Cover Tracks': 'Make it harder for others to follow your trail',
  'Defend': 'Start combat with shield raised',
  'Detect Magic': 'Be alerted to the presence of nearby magic',
  'Follow the Expert': 'Follow an Expert ally to improve your own skill check',
  'Hustle': 'Strain yourself to move twice as fast as normal',
  'Investigate': 'Gain clues requiring knowledge or reasoning',
  'Scout': 'Be on the lookout to gain a party initiative bonus',
  'Search': 'Look for hidden doors, hazards, items, etc',
  'Squeeze': 'Squeeze through tight spaces',
  'Track': 'Follow the trail of a person or creature',
};

export const RECALL_KNOWLEDGE_SKILL_SLUGS = [
  'arcana', 'crafting', 'medicine', 'nature', 'occultism', 'religion', 'society',
];

export const LEVEL_BASED_DCS = {
  '-1': 13, '0': 14, '1': 15, '2': 16, '3': 18, '4': 19, '5': 20, '6': 22, '7': 23,
  '8': 24, '9': 26, '10': 27, '11': 28, '12': 30, '13': 31, '14': 32, '15': 34,
  '16': 35, '17': 36, '18': 38, '19': 39, '20': 40, '21': 42, '22': 44, '23': 46,
  '24': 48, '25': 50,
};

export const DEGREE_LABELS = ['Crit Fail', 'Failure', 'Success', 'Crit Succ'];

export const DEGREE_COLORS = {
  'Crit Fail': '#c62828',
  'Failure': '#ef6c00',
  'Success': '#1565c0',
  'Crit Succ': '#2e7d32',
};
