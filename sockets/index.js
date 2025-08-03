const { socketAuth } = require("./socketAuth");
const { handleFeedbackSocket } = require("./feedbackSocket");

const setupSocketIO = (io) => {
  // Apply authentication middleware
  io.use(socketAuth);

  // Handle connections
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Setup feedback socket handlers
    handleFeedbackSocket(io, socket);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { setupSocketIO };
