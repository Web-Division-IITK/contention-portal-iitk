const mongoose = require("mongoose");
const { pools, clubs } = require("../config/general");

const contentionSchema = new mongoose.Schema({
  problemStatement: { type: String, required: true },
  description: { type: String, required: true },
  drive: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  pool: { type: String, enum: pools, required: true },
  club: { type: String, enum: clubs, required: true },
  // problemStatement: { type: String, required: true },
});

module.exports = { contention: mongoose.model("contentions", contentionSchema) };
