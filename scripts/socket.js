import { SOCKET_EVENT } from './constants.js';

export function emitSocketMessage(data) {
  game.socket.emit(SOCKET_EVENT, data);
}

export function registerSocketListener(handler) {
  game.socket.on(SOCKET_EVENT, handler);
}