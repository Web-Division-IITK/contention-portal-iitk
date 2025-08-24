const { socketAuth } = require("./socketAuth");
const { handlecontentionSocket } = require("./contentionSocket");

const setupSocketIO = (io) => {
  // Apply authentication middleware
  io.use(socketAuth);

  // Handle connections
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Setup contention socket handlers
    handlecontentionSocket(io, socket);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { setupSocketIO };
