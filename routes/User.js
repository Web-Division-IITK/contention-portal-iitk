const { Router } = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const UserRoutes = Router();

UserRoutes.post("/createUser", userController.createUser);
UserRoutes.post("/login", userController.loginUser);

module.exports = { UserRoutes };
