export default function gameSocket(io, socket) {
  // =========================
  // JOIN GAME ROOM
  // =========================
  socket.on("join_game", ({ gameId, userId }) => {
    socket.join(gameId);

    console.log(`👤 User ${userId} joined game ${gameId}`);

    io.to(gameId).emit("player_joined", {
      userId,
      socketId: socket.id,
    });
  });

  // =========================
  // PLAYER MOVE
  // =========================
  socket.on("make_move", ({ gameId, move, userId }) => {
    console.log(`♟️ Move in ${gameId} by ${userId}:`, move);

    // send only to opponent
    socket.to(gameId).emit("opponent_move", {
      move,
      userId,
    });
  });

  // =========================
  // AI MOVE REQUEST
  // =========================
  socket.on("request_ai_move", async ({ gameId, fen }) => {
    console.log(`🤖 AI move requested for game ${gameId}`);

    // placeholder (later call Gemini/Stockfish)
    const fakeAiMove = { from: "e7", to: "e5" };

    io.to(gameId).emit("ai_move", {
      move: fakeAiMove,
    });
  });

  // =========================
  // CHAT
  // =========================
  socket.on("chat_message", ({ gameId, userId, message }) => {
    io.to(gameId).emit("chat_message", {
      userId,
      message,
    });
  });
}
