const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../model/User.js");

class UserService {
  async createUser(userData) {
    const { name, email, password, number, pool } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: "user",
      number,
      pool,
    });

    await newUser.save();
    return { message: "User created successfully" };
  }

  async loginUser(credentials) {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
        role: user.role,
        pool: user.pool,
      },
      process.env.JWT_SECRET
    );

    return { message: "Login successful", token };
  }
}

module.exports = new UserService();
