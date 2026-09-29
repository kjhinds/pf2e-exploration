import { registerSocketListener } from './socket.js';
import { openExplorationChooser } from './chooser-dialog.js';
import { rollExplorationCheck } from './checks.js';
import { handlePartyDataRequest, handlePartyDataResponse } from './party-sync.js';
 
export function registerSocketHandlers() {
  registerSocketListener(handleSocketMessage);
}
 
function handleSocketMessage(data) {
  switch (data?.type) {
    case 'investigate-whisper':
      return handleInvestigateWhisper(data);
    case 'request-reroll':
      return handleRerollRequest(data);
    case 'request-exploration':
      return handleExplorationRequest(data);
    case 'request-party-data':
      return handlePartyDataRequest(data);
    case 'party-data-response':
      return handlePartyDataResponse(data);
  }
}
 
function handleInvestigateWhisper({ speaker, content }) {
  if (!game.user.isGM) return;
  ChatMessage.create({
    speaker,
    content,
    whisper: ChatMessage.getWhisperRecipients('GM').map((u) => u.id),
  });
}
 
function handleRerollRequest({ actorId, activityName }) {
  if (game.user.isGM) return;
  const actor = game.actors.get(actorId);
  if (!actor?.isOwner) return;
  rollExplorationCheck(actor, activityName);
}
 
function handleExplorationRequest({ actorId }) {
  const actor = game.actors.get(actorId);
  if (actor?.isOwner || (!game.user.isGM && !actor)) openExplorationChooser();
}