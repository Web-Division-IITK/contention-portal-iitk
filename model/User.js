const mongoose = require("mongoose");
const { pools, clubs } = require("../config/general");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  number: { type: String, required: true },
  pool: { type: String, enum: ["None", ...pools], required: true },
  club: { type: String, enum: ["None", ...clubs]},
});

module.exports = { User: mongoose.model("users", userSchema) };
