const mongoose = require("mongoose");
const { pools } = require("../config/general");

const feedbackSchema = new mongoose.Schema({
  headline: { type: String, required: true },
  description: { type: String, required: true },
  drive: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  pool: { type: String, enum: pools, require: true },
  againstPool: { type: String, enum: pools, require: true },
});

module.exports = { Feedback: mongoose.model("feedbacks", feedbackSchema) };
