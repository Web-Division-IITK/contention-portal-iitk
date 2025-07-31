const { Router } = require("express");
const { User } = require("../model/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserRoutes = Router();

UserRoutes.post("/createUser", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ status: false, message: "User already exists" });
      }

      const passwordHash = bcrypt.hashSync(password, 10);

      const newUser = new User({
        name,
        email,
        passwordHash,
        role: "user"
      });

      newUser
        .save()
        .then(() => {
          res
            .status(201)
            .json({ status: true, message: "User created successfully" });
        })
        .catch((err) => {
          res.status(500).json({ status: false, message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: err.message });
    });
});

UserRoutes.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid credentials" });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid credentials" });
      }

      const { JWT_SECRET } = process.env;

      const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, JWT_SECRET);

      res
        .status(200)
        .json({ status: true, message: "Login successful", token });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: err.message });
    });
});

module.exports = { UserRoutes };
