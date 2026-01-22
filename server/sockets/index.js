import { WebSocketServer } from "ws";
import {
  handleGameMessage,
  handleDisconnect,
  handleConnection,
} from "./game.socket.js";

export default function initSockets(server) {
  const wss = new WebSocketServer({ server });

  console.log("✅ WebSocket Server initialized (ws)");

  wss.on("connection", (ws) => {
    console.log("🟢 New connection");
    handleConnection(ws);

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        handleGameMessage(ws, data);
      } catch (e) {
        console.error("Failed to parse message", e);
      }
    });

    ws.on("close", () => {
      console.log("🔴 Disconnected");
      handleDisconnect(ws);
    });

    ws.on("error", (err) => {
      console.error("WS Error:", err);
    });
  });
}
