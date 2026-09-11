import { TRACKER_TEMPLATE } from './constants.js';
import { getPartyExplorationData } from './party-data.js';

const TOOLTIP_ID = 'pf2e-exploration-tooltip';
const renderTemplate = foundry.applications.handlebars.renderTemplate;

export function registerExplorationTooltip() {
  if (!game.user.isGM) return;
  
  const actorTab = document.querySelector('#sidebar-tabs button[data-tab="actors"]');
  if (!actorTab) return;

  actorTab.addEventListener('mouseover', () => showExplorationTooltip());
  actorTab.addEventListener('mouseout', () => hideExplorationTooltip());
}

async function showExplorationTooltip() {
  const partyMembers = getPartyExplorationData();
  if (partyMembers.length === 0) return;
  
  const explorationTable = await renderTemplate(TRACKER_TEMPLATE, {partyMembers, interactable: false});  
  const content = document.createElement('div');
  content.id = TOOLTIP_ID;
  content.insertAdjacentHTML('afterbegin', explorationTable);
  document.body.appendChild(content);

  positionTooltip(content);
}

function positionTooltip(content) {
  const actorTab = document.querySelector('#sidebar-tabs button[data-tab="actors"]');
  const actorTabRect = actorTab.getBoundingClientRect();
  const viewport = document.body.getBoundingClientRect();
  content.style.right = `${viewport.width - actorTabRect.left + 10}px`;
  content.style.top = `${actorTabRect.bottom + 10}px`;
}

function hideExplorationTooltip() {
  document.getElementById(TOOLTIP_ID)?.remove();
}