const { UserRoutes } = require("./User");
const problemStatementRoutes = require("./problemStatement");

const setupRoutes = (app) => {
  // API routes
  app.use("/api/user", UserRoutes);
  app.use("/api/problemstatement", problemStatementRoutes);
};

module.exports = { setupRoutes };
