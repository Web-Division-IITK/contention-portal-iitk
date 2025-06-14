const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.js");
const jwt = require("jsonwebtoken");

const { UserRoutes } = require("./routes/User.js");

const { Feedback } = require("./model/Feedback.js");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // your React app
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 8080;
const { JWT_SECRET } = process.env;

connectDB();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));

  try {
    const user = jwt.verify(token, JWT_SECRET);
    socket.user = user; // save user to socket
    next();
  } catch (err) {
    console.log("Token:", err);
    next(new Error("Invalid token"));
  }
});

io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);

  // Load feedbacks from the database
  const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });

  // Emit feedbacks to the client
  socket.emit("load_feedbacks", feedbacks);

  // Listen for feedback submission
  socket.on("submit_feedback", async (data) => {
    if (socket.user.role == "admin") return;

    const feedback = new Feedback({
      username: data.username,
      feedbackText: data.feedback,
    });

    await feedback.save();

    // Emit the new feedback to all clients
    io.emit("new_feedback", feedback);
  });

  // add event to change status only by admin
  socket.on("change_status", async (data) => {
    if (socket.user.role == "user") return;

    let feedbackId = data.id;
    await Feedback.findByIdAndUpdate(
      feedbackId,
      { status: data.status },
      { new: true }
    );

    io.emit("status_changed", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve React static files
app.use(express.static(path.join(__dirname, "client/dist")));

app.use("/api/user", UserRoutes);

// Catch-all route to serve index.html on unmatched routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
