// seedProblems.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { ProblemStatement } = require("../model/ProblemStatement");
const { clubs } = require("../config/general");

dotenv.config();

async function seedProblems() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // clear old problem statements
    await ProblemStatement.deleteMany({});
    console.log("🗑️ Old problem statements removed");

    // insert fake problem statements
    const fakeProblems = clubs.flatMap((club, i) => [
      {
        club,
        title: `Problem Statement 1 for ${club}`,
      },
      {
        club,
        title: `Problem Statement 2 for ${club}`,
      },
    ]);

    await ProblemStatement.insertMany(fakeProblems);

    console.log("✅ Problem statements seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  }
}

seedProblems();
