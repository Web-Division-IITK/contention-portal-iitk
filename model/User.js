const mongoose = require("mongoose");
const { pools } = require("../config/general");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  number: { type: String, required: true },
  pool: { type: String, enum: ["None", ...pools], required: true },
});

module.exports = { User: mongoose.model("users", userSchema) };
