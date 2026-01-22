// Map<gameId, Set<ws>>
const rooms = new Map();
// Map<ws, Set<gameId>> - to identify which rooms a socket has joined (for cleanup)
const socketRooms = new Map();

/**
 * Helper to broadcast message to all in a room except sender (optional)
 */
function broadcastToRoom(gameId, data, excludeWs = null) {
  const room = rooms.get(gameId);
  if (!room) return;

  const json = JSON.stringify(data);
  for (const client of room) {
    if (client !== excludeWs && client.readyState === 1) {
      // 1 = OPEN
      client.send(json);
    }
  }
}

export function handleConnection(ws) {
  // Initialize tracking for this socket
  socketRooms.set(ws, new Set());
}

export function handleDisconnect(ws) {
  const userRooms = socketRooms.get(ws);
  if (userRooms) {
    for (const gameId of userRooms) {
      const room = rooms.get(gameId);
      if (room) {
        room.delete(ws);
        if (room.size === 0) {
          rooms.delete(gameId);
        }
      }
    }
    socketRooms.delete(ws);
  }
}

export function handleGameMessage(ws, data) {
  const { type, ...payload } = data;

  switch (type) {
    case "join_game": {
      const { gameId, userId } = payload;

      // stored for cleanup
      if (!rooms.has(gameId)) {
        rooms.set(gameId, new Set());
      }
      rooms.get(gameId).add(ws);
      socketRooms.get(ws).add(gameId);

      console.log(`👤 User ${userId} joined game ${gameId}`);

      // Broadcast to room that player joined
      broadcastToRoom(gameId, {
        type: "player_joined",
        payload: { userId },
      }); // send to everyone including self? logic was io.to(gameId) which includes everyone usually
      break;
    }

    case "make_move": {
      const { gameId, move, userId } = payload;
      console.log(`♟️ Move in ${gameId} by ${userId}:`, move);

      // send only to opponent (everyone else in room)
      broadcastToRoom(
        gameId,
        {
          type: "opponent_move",
          payload: { move, userId },
        },
        ws
      );
      break;
    }

    case "request_ai_move": {
      const { gameId } = payload;
      console.log(`🤖 AI move requested for game ${gameId}`);

      const fakeAiMove = { from: "e7", to: "e5" };

      // broadcast to everyone? or just requester? Original was io.to(gameId)
      broadcastToRoom(gameId, {
        type: "ai_move",
        payload: { move: fakeAiMove },
      });
      break;
    }

    case "chat_message": {
      const { gameId, userId, message } = payload;
      broadcastToRoom(gameId, {
        type: "chat_message",
        payload: { userId, message },
      });
      break;
    }

    default:
      console.log("Unknown message type:", type);
  }
}
