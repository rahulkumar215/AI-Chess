import { Server } from "socket.io";
import gameSocket from "./game.socket.js";

export default function initSockets(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // later restrict to FRONTEND_URL
      methods: ["GET", "POST"],
    },
  });

  console.log("✅ Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    gameSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
}
