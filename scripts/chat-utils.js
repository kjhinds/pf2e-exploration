import { MODULE_ID } from './constants.js';

export async function generateChat(actor, content, whisperTo = null) {
  const chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
  };
  if (whisperTo) chatData.whisper = whisperTo;
  await ChatMessage.create(chatData, {});
}