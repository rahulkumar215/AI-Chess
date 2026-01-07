import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const [count, setCount] = useState(0);

  const socket = io("http://localhost:3001");

  // join game
  socket.emit("join_game", {
    gameId: "game123",
    userId: "rahul",
  });

  // make move
  socket.emit("make_move", {
    gameId: "game123",
    move: { from: "e2", to: "e4" },
    userId: "rahul",
  });

  // listen
  socket.on("opponent_move", (data) => {
    console.log("Opponent moved:", data);
  });

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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
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
