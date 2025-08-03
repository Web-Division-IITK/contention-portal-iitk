const path = require("path");
const { UserRoutes } = require("./User");

const setupRoutes = (app) => {
  // API routes
  app.use("/api/user", UserRoutes);

  // Catch-all route to serve index.html on unmatched routes
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
};

module.exports = { setupRoutes };
