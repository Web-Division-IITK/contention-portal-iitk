const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  username: { type: String, required: true },
  feedbackText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
});

module.exports = { Feedback: mongoose.model("feedbacks", feedbackSchema) };
