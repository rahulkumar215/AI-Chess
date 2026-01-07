// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";

import appConfig from "./config/appConfig.js";
import routes from "./routes/index.js";
import initSockets from "./sockets/index.js";

const app = express();
const { PORT, FRONTEND_URL } = appConfig;

// ===== Middleware =====
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(
  cors({
    origin: "*", // later: FRONTEND_URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ===== Health check =====
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ===== Routes =====
app.use("/api", routes);

// ===== Error handler =====
app.use((err, req, res, next) => {
  console.error("Error handler:", err.stack || err);

  if (!res.headersSent) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// ===== 404 handler =====
app.use("/*splat", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ==============================
// 🔥 SOCKET.IO INTEGRATION HERE
// ==============================

const server = http.createServer(app);

// init socket.io
initSockets(server);

// start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
