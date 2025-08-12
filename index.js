const http = require("http");
const dotenv = require("dotenv");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const { connectDB } = require("./config/db.js");
const { setupRoutes } = require("./routes/index.js");
const { setupSocketIO } = require("./sockets/index.js");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve React static files
app.use(express.static(path.join(__dirname, "../client/dist")));

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // your React app
    methods: ["GET", "POST"],
  },
});

// Configuration
const PORT = process.env.PORT || 8080;

// Connect to database
connectDB();

// Setup routes
setupRoutes(app);

// Setup Socket.IO
setupSocketIO(io);

// Serve static files from dist under /a
app.use("/", express.static(path.join(__dirname, "client/dist")));

// Serve index.html for /a
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Serve index.html for any SPA route under /a/*
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
