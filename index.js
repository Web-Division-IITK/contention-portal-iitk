const http = require("http");
const dotenv = require("dotenv");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const { connectDB } = require("./config/db.js");
const { setupRoutes } = require("./routes/index.js");
const { setupSocketIO } = require("./sockets/index.js");

dotenv.config();

const requiredEnvironmentVariables = ["MONGO_URI", "JWT_SECRET"];
const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (name) => !process.env[name]
);

if (missingEnvironmentVariables.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvironmentVariables.join(", ")}`
  );
  process.exit(1);
}

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const corsOrigin = process.env.CORS_ORIGIN || (isProduction ? false : "*");
const corsOptions = { origin: corsOrigin };

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
  },
});

// Configuration
const PORT = process.env.PORT || 8080;

// Setup routes
setupRoutes(app);

// Setup Socket.IO
setupSocketIO(io);

app.use("/", express.static(path.join(__dirname, "client/dist")));

app.get("/healthz", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "unavailable",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
