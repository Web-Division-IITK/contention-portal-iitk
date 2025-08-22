// seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../model/User"); // adjust path if needed
const { pools, clubs } = require("../config/general");
const dotenv = require("dotenv");

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // change db if needed

    // clear old users
    // await User.deleteMany({});

    const passwordHash = await bcrypt.hash("password", 10); // same password for all

    // Superadmin
    const superadmin = new User({
      name: "Super Admin",
      email: "superadmin@example.com",
      passwordHash,
      role: "superadmin",
      number: "9999999999",
      pool: "None",
      club: "None",
    });

    // Admins (one per club)
    const admins = clubs.map((club, i) => ({
      name: `${club} Admin`,
      email: `admin${i + 1}@example.com`,
      passwordHash,
      role: "admin",
      number: `900000000${i}`,
      pool: "None",
      club,
    }));

    // Users (one per pool)
    const users = pools.map((pool, i) => ({
      name: `${pool} User`,
      email: `user${i + 1}@example.com`,
      passwordHash,
      role: "user",
      number: `800000000${i}`,
      pool,
      club: "None",
    }));

    await User.insertMany([superadmin, ...admins, ...users]);

    console.log("✅ Seeding done!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
