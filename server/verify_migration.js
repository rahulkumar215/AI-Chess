import WebSocket from "ws";
import { spawn } from "child_process";

// 1. Start Server
console.log("Starting server...");
const serverProcess = spawn("npm.cmd", ["run", "start"], {
  cwd: process.cwd(),
  shell: true,
  stdio: "pipe",
});

serverProcess.stdout.on("data", (data) => {
  console.log(`[SERVER]: ${data}`);
  if (data.toString().includes("Server running")) {
    runTest();
  }
});

serverProcess.stderr.on("data", (data) =>
  console.error(`[SERVER ERR]: ${data}`)
);

function runTest() {
  console.log("Starting clients...");
  const ws1 = new WebSocket("ws://localhost:3001");
  const ws2 = new WebSocket("ws://localhost:3001");

  let clientsConnected = 0;

  const checkStart = () => {
    clientsConnected++;
    if (clientsConnected === 2) {
      console.log("Both clients connected. Starting interactions...");
      step1_join();
    }
  };

  ws1.on("open", checkStart);
  ws2.on("open", checkStart);

  function step1_join() {
    console.log("Step 1: Joining Game");
    ws1.send(
      JSON.stringify({
        type: "join_game",
        gameId: "test_game",
        userId: "user1",
      })
    );
    ws2.send(
      JSON.stringify({
        type: "join_game",
        gameId: "test_game",
        userId: "user2",
      })
    );
  }

  ws1.on("message", (data) => {
    const msg = JSON.parse(data);
    console.log("[WS1] Received:", msg);
  });

  ws2.on("message", (data) => {
    const msg = JSON.parse(data);
    console.log("[WS2] Received:", msg);

    if (msg.type === "opponent_move") {
      console.log("✅ SUCCESS: Move received by opponent!");
      cleanup();
    }
  });

  // Give some time to join, then move
  setTimeout(() => {
    console.log("Step 2: Making Move");
    ws1.send(
      JSON.stringify({
        type: "make_move",
        gameId: "test_game",
        userId: "user1",
        move: { from: "e2", to: "e4" },
      })
    );
  }, 1000);
}

function cleanup() {
  console.log("Cleaning up...");
  serverProcess.kill();
  process.exit(0);
}

// Timeout
setTimeout(() => {
  console.error("❌ TIMEOUT");
  cleanup();
}, 10000);
