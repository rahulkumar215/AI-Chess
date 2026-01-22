import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const ws = useRef(null);

  useEffect(() => {
    // connect to websocket
    ws.current = new WebSocket("ws://localhost:3001");

    ws.current.onopen = () => {
      console.log("✅ Custom WS Connected");

      // join game immediately
      sendMessage({
        type: "join_game",
        gameId: "game123",
        userId: "rahul",
      });
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Message from server:", data);

        if (data.type === "opponent_move") {
          console.log("Opponent moved:", data.payload);
        }
      } catch (e) {
        console.error("Error parsing message", e);
      }
    };

    ws.current.onclose = () => {
      console.log("❌ WS Disconnected");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = (data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("WS not open, cannot send:", data);
    }
  };

  const handleMakeMove = () => {
    // make move
    sendMessage({
      type: "make_move",
      gameId: "game123",
      move: { from: "e2", to: "e4" },
      userId: "rahul",
    });
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((count) => count + 1);
            handleMakeMove();
          }}
        >
          count is {count} (and make move)
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
