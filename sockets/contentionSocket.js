const contentionController = require("../controllers/contentionController");

const handlecontentionSocket = (io, socket) => {
  const userRole = socket.user.role;
  const userPool = socket.user.pool;
  const userClub = socket.user.club;

  // Join appropriate rooms based on user role and pool
  if (userRole === "admin" || userRole === "superadmin") {
    socket.join("admin");
    console.log(`${userRole} ${socket.user.name} joined admin room`);
  } else {
    socket.join(`pool_${userPool}`);
    console.log(`User ${socket.user.name} joined pool_${userPool} room`);
  }

  // Load and send contentions to the connected client
  const loadcontentions = async () => {
    try {
      let contentions;
      if ( userClub === "sntsecy") {
            const allGrouped = await contentionController.getcontentionsGroupedByPoolsForSuperAdmin();
           // console.log("Emitting all grouped contentions to superadmin, pools:", Object.keys(allGrouped).length);
            socket.emit("load_contentions", { type: "grouped", data: allGrouped });
            return;
      }
      else if (userRole === "admin") {
        contentions = await contentionController.getcontentionsGroupedByPools({
          role: socket.user.role,
          club: socket.user.club,
        });
        socket.emit("load_contentions", { type: "grouped", data: contentions });
      } else {
        contentions = await contentionController.getcontentionsForUserPool(userPool);
        socket.emit("load_contentions", {
          type: "user_grouped",
          data: contentions,
          userPool: userPool,
        });
      }
    } catch (error) {
      console.error("Error loading contentions:", error);
      socket.emit("error", { message: "Failed to load contentions" });
    }
  };

  // Handle contention submission
  const submitcontention = async (data) => {
    if (userRole === "admin") return;

    try {
      const contention = await contentionController.createcontention({
        problemStatement: data.problemStatement,
        description: data.description,
        drive: data.drive,
        status: data.status || "pending",
        pool: userPool,
        club: data.club,
      });

      // Emit to relevant rooms only
      // 1. Emit to admin room
      io.to("admin").emit("new_contention", contention);

      // 2. Emit to users in the same pool as the submitter
      io.to(`pool_${contention.pool}`).emit("new_contention", contention);

      // 3. Emit to users in the pool that the contention is against
      if (contention.againstPool !== contention.pool) {
        io.to(`pool_${contention.againstPool}`).emit("new_contention", contention);
      }

      console.log(
        `contention submitted by ${socket.user.name} from ${contention.pool} against ${contention.againstPool}`
      );
    } catch (error) {
      console.error("Error submitting contention:", error);
      socket.emit("error", { message: "Failed to submit contention" });
    }
  };

  // Handle status change (admin only)
  const changeStatus = async (data, status) => {
    if (userRole !== "admin" && userRole !== "superadmin") return;

    try {
      const updatedcontention = await contentionController.updatecontentionStatus(
        { user: socket.user },
        data.id,
        status
      );

      // Emit status change to relevant rooms
      io.to("admin").emit("status_changed", {
        id: data.id,
        status: status,
        contention: updatedcontention,
      });
      io.to(`pool_${updatedcontention.pool}`).emit("status_changed", {
        id: data.id,
        status: status,
        contention: updatedcontention,
      });
      if (updatedcontention.againstPool !== updatedcontention.pool) {
        io.to(`pool_${updatedcontention.againstPool}`).emit("status_changed", {
          id: data.id,
          status: status,
          contention: updatedcontention,
        });
      }
      console.log(
        `contention ${data.id} status changed to ${status} by ${userRole} ${socket.user.name}`
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

  // Load contentions when user connects
  loadcontentions();

  // Register event listeners
  socket.on("submit_contention", submitcontention);
  socket.on("mark_accepted", markAccepted);
  socket.on("mark_rejected", markRejected);
  socket.on("mark_pending", markPending);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.user.name} disconnected from pool ${userPool}`);
  });
};

module.exports = { handlecontentionSocket };
