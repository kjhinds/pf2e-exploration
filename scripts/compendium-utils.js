export function isPackAvailable(packId) {
  return game.packs.has(packId);
}

export async function getPackDocumentByName(packId, name) {
  const pack = game.packs.get(packId);
  if (!pack) return null;
 
  const entry = pack.index.find((indexEntry) => indexEntry.name === name);
  if (!entry) return null;
 
  return pack.getDocument(entry._id);
}

export function getPackItemNames(packId) {
  const pack = game.packs.get(packId);
  return pack ? pack.index.map((entry) => entry.name) : [];
}