import { getPartyExplorationData } from './party-data.js';

const pending = new Map();

function getPublicPartyData() {
  return getPartyExplorationData().map(({ id, name, activity }) => ({ id, name, activity }));
}

export async function fetchPartyActivities(timeoutMs = 1500) {
  if (game.user.isGM || !game.users.activeGM) return getPublicPartyData();

  const requestId = foundry.utils.randomID();
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      pending.delete(requestId);
      resolve(getPublicPartyData());
    }, timeoutMs);

    pending.set(requestId, (party) => {
      clearTimeout(timer);
      resolve(party);
    });

    emitSocketMessage({
      type: 'request-party-data',
      requestId,
      userId: game.user.id,
    });
  });
}

export function handlePartyDataRequest({ requestId, userId }) {
  if (!game.user.isActiveGM) return;
  emitSocketMessage(
    { type: 'party-data-response', requestId, userId, party: getPublicPartyData() },
    { recipients: [userId] }
  );
}

export function handlePartyDataResponse({ requestId, userId, party }) {
  if (userId !== game.user.id) return;
  pending.get(requestId)?.(party);
  pending.delete(requestId);
}