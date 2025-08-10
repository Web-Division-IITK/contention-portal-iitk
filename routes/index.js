const path = require("path");
const { UserRoutes } = require("./User");

const setupRoutes = (app) => {
  // API routes
  app.use("/api/user", UserRoutes);
};

module.exports = { setupRoutes };
