const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { User } = require("../model/User");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    if (!await User.findOne({ email: "admin@noreply.in" })) {
      const user = new User({
        name: "admin",
        email: "admin@noreply.in",
        passwordHash: bcrypt.hashSync("Admin_00_SnT@Takneek", 10),
        role: "admin",
        number: "0000000000",
        pool: "None",
      });

      await user.save();
    }
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
