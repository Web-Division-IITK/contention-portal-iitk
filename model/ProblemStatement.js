const mongoose = require("mongoose");
const { clubs } = require("../config/general");

const problemStatementSchema = new mongoose.Schema({
  club: { type: String, enum: clubs, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = { ProblemStatement: mongoose.model("problemstatements", problemStatementSchema) };
