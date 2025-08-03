const userService = require("../services/userService");

class UserController {
  async createUser(req, res) {
    try {
      const { name, email, password, number, pool } = req.body;

      if (!name || !email || !password || !number || !pool) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
        });
      }

      const result = await userService.createUser({ name, email, password, number, pool });

      res.status(201).json({
        status: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
        });
      }

      const result = await userService.loginUser({ email, password });

      res.status(200).json({
        status: true,
        message: result.message,
        token: result.token,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
