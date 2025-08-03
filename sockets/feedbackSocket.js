const feedbackController = require("../controllers/feedbackController");

const handleFeedbackSocket = (io, socket) => {
  const userRole = socket.user.role;
  const userPool = socket.user.pool;

  // Join appropriate rooms based on user role and pool
  if (userRole === "admin") {
    socket.join("admin");
    console.log(`Admin ${socket.user.name} joined admin room`);
  } else {
    // Regular users join their pool room and pools they can see feedback against
    socket.join(`pool_${userPool}`);
    console.log(`User ${socket.user.name} joined pool_${userPool} room`);
  }

  // Load and send feedbacks to the connected client
  const loadFeedbacks = async () => {
    try {
      let feedbacks;

      if (userRole === "admin") {
        // Admin gets all feedbacks grouped by pools
        feedbacks = await feedbackController.getFeedbacksGroupedByPools();
        socket.emit("load_feedbacks", { type: "grouped", data: feedbacks });
      } else {
        // Regular user gets feedbacks grouped by byPool and againstPool
        feedbacks = await feedbackController.getFeedbacksForUserPool(userPool);
        socket.emit("load_feedbacks", {
          type: "user_grouped",
          data: feedbacks,
          userPool: userPool,
        });
      }
    } catch (error) {
      console.error("Error loading feedbacks:", error);
      socket.emit("error", { message: "Failed to load feedbacks" });
    }
  };

  // Handle feedback submission
  const submitFeedback = async (data) => {
    if (userRole === "admin") return;

    try {
      const feedback = await feedbackController.createFeedback({
        headline: data.headline,
        description: data.description,
        drive: data.drive,
        status: data.status || "pending",
        pool: userPool,
        againstPool: data.againstPool,
      });

      // Emit to relevant rooms only
      // 1. Emit to admin room
      io.to("admin").emit("new_feedback", feedback);

      // 2. Emit to users in the same pool as the submitter
      io.to(`pool_${feedback.pool}`).emit("new_feedback", feedback);

      // 3. Emit to users in the pool that the feedback is against
      if (feedback.againstPool !== feedback.pool) {
        io.to(`pool_${feedback.againstPool}`).emit("new_feedback", feedback);
      }

      console.log(
        `Feedback submitted by ${socket.user.name} from ${feedback.pool} against ${feedback.againstPool}`
      );
    } catch (error) {
      console.error("Error submitting feedback:", error);
      socket.emit("error", { message: "Failed to submit feedback" });
    }
  };

  // Handle status change (admin only)
  const changeStatus = async (data, status) => {
    if (userRole !== "admin") return;

    try {
      const updatedFeedback = await feedbackController.updateFeedbackStatus(
        data.id,
        status
      );

      // Emit status change to relevant rooms
      // 1. Emit to admin room
      io.to("admin").emit("status_changed", {
        id: data.id,
        status: status,
        feedback: updatedFeedback,
      });

      // 2. Emit to users in the pool that submitted the feedback
      io.to(`pool_${updatedFeedback.pool}`).emit("status_changed", {
        id: data.id,
        status: status,
        feedback: updatedFeedback,
      });

      // 3. Emit to users in the pool that the feedback is against
      if (updatedFeedback.againstPool !== updatedFeedback.pool) {
        io.to(`pool_${updatedFeedback.againstPool}`).emit("status_changed", {
          id: data.id,
          status: status,
          feedback: updatedFeedback,
        });
      }

      console.log(
        `Feedback ${data.id} status changed to ${status} by admin ${socket.user.name}`
      );
    } catch (error) {
      console.error("Error changing status:", error);
      socket.emit("error", { message: "Failed to change status" });
    }
  };

  const markAccepted = async (data) => {
    await changeStatus(data, "accepted");
  };

  const markPending = async (data) => {
    await changeStatus(data, "pending");
  };

  const markRejected = async (data) => {
    await changeStatus(data, "rejected");
  };

  // Load feedbacks when user connects
  loadFeedbacks();

  // Register event listeners
  socket.on("submit_feedback", submitFeedback);
  socket.on("mark_accepted", markAccepted);
  socket.on("mark_rejected", markRejected);
  socket.on("mark_pending", markPending);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.user.name} disconnected from pool ${userPool}`);
  });
};

module.exports = { handleFeedbackSocket };
