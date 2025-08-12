#!/usr/bin/env node

const readline = require('readline');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models and config
const { User } = require('../model/User.js');
const { pools } = require('../config/general.js');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Color codes for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate phone number
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}

// Main function to create user
async function createUser() {
  try {
    console.log(`${colors.cyan}${colors.bright}===========================================`);
    console.log(`         USER CREATION TOOL`);
    console.log(`===========================================${colors.reset}\n`);

    // Connect to database
    console.log(`${colors.yellow}Connecting to database...${colors.reset}`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`${colors.green}✓ Connected to MongoDB successfully${colors.reset}\n`);

    // Collect user details
    let name, email, password, number, role, pool;

    // Get name
    while (!name) {
      name = await askQuestion(`${colors.blue}Enter user's full name: ${colors.reset}`);
      if (!name) {
        console.log(`${colors.red}✗ Name is required!${colors.reset}`);
      }
    }

    // Get email
    while (!email) {
      email = await askQuestion(`${colors.blue}Enter user's email: ${colors.reset}`);
      if (!email) {
        console.log(`${colors.red}✗ Email is required!${colors.reset}`);
      } else if (!isValidEmail(email)) {
        console.log(`${colors.red}✗ Please enter a valid email address!${colors.reset}`);
        email = null;
      } else {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.log(`${colors.red}✗ User with this email already exists!${colors.reset}`);
          email = null;
        }
      }
    }

    // Get password
    while (!password) {
      password = await askQuestion(`${colors.blue}Enter password (min 6 characters): ${colors.reset}`);
      if (!password) {
        console.log(`${colors.red}✗ Password is required!${colors.reset}`);
      } else if (password.length < 6) {
        console.log(`${colors.red}✗ Password must be at least 6 characters long!${colors.reset}`);
        password = null;
      }
    }

    // Get phone number
    while (!number) {
      number = await askQuestion(`${colors.blue}Enter phone number (10 digits): ${colors.reset}`);
      if (!number) {
        console.log(`${colors.red}✗ Phone number is required!${colors.reset}`);
      } else if (!isValidPhone(number)) {
        console.log(`${colors.red}✗ Please enter a valid 10-digit phone number!${colors.reset}`);
        number = null;
      }
    }

    // Get role
    console.log(`${colors.yellow}Available roles:${colors.reset}`);
    console.log(`1. user`);
    console.log(`2. admin`);
    
    while (!role) {
      const roleChoice = await askQuestion(`${colors.blue}Select role (1 for user, 2 for admin): ${colors.reset}`);
      if (roleChoice === '1') {
        role = 'user';
      } else if (roleChoice === '2') {
        role = 'admin';
      } else {
        console.log(`${colors.red}✗ Please enter 1 or 2!${colors.reset}`);
      }
    }

    // Get pool
    console.log(`${colors.yellow}Available pools:${colors.reset}`);
    pools.forEach((p, index) => {
      console.log(`${index + 1}. ${p}`);
    });

    while (!pool) {
      const poolChoice = await askQuestion(`${colors.blue}Select pool (1-${pools.length}): ${colors.reset}`);
      const poolIndex = parseInt(poolChoice) - 1;
      if (poolIndex >= 0 && poolIndex < pools.length) {
        pool = pools[poolIndex];
      } else {
        console.log(`${colors.red}✗ Please enter a number between 1 and ${pools.length}!${colors.reset}`);
      }
    }

    // Display user details for confirmation
    console.log(`\n${colors.cyan}${colors.bright}User Details:${colors.reset}`);
    console.log(`${colors.bright}Name:${colors.reset} ${name}`);
    console.log(`${colors.bright}Email:${colors.reset} ${email}`);
    console.log(`${colors.bright}Password:${colors.reset} ${'*'.repeat(password.length)}`);
    console.log(`${colors.bright}Phone:${colors.reset} ${number}`);
    console.log(`${colors.bright}Role:${colors.reset} ${role}`);
    console.log(`${colors.bright}Pool:${colors.reset} ${pool}`);

    const confirm = await askQuestion(`\n${colors.yellow}Create this user? (y/n): ${colors.reset}`);
    
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log(`${colors.yellow}User creation cancelled.${colors.reset}`);
      process.exit(0);
    }

    // Hash password
    console.log(`${colors.yellow}Hashing password...${colors.reset}`);
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create user
    console.log(`${colors.yellow}Creating user in database...${colors.reset}`);
    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
      number,
      pool
    });

    await newUser.save();

    console.log(`${colors.green}${colors.bright}✓ User created successfully!${colors.reset}`);
    console.log(`${colors.green}User ID: ${newUser._id}${colors.reset}`);

  } catch (error) {
    console.error(`${colors.red}✗ Error creating user:${colors.reset}`, error.message);
    
    if (error.code === 11000) {
      console.error(`${colors.red}✗ Email already exists in database!${colors.reset}`);
    }
  } finally {
    // Close database connection and readline interface
    await mongoose.connection.close();
    rl.close();
    console.log(`${colors.yellow}Database connection closed.${colors.reset}`);
  }
}

// Handle process interruption
process.on('SIGINT', async () => {
  console.log(`\n${colors.yellow}Process interrupted. Cleaning up...${colors.reset}`);
  rl.close();
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});

// Start the user creation process
createUser().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
