#!/usr/bin/env node

/**
 * Simple User Creation Script
 * Usage: node createUserSimple.js
 * 
 * This is a minimal version of the user creation tool
 */

const readline = require('readline');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models and config
const { User } = require('../model/User.js');
const { pools } = require('../config/general.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function createUserSimple() {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Collect user details
    const name = await askQuestion('Name: ');
    const email = await askQuestion('Email: ');
    const password = await askQuestion('Password: ');
    const number = await askQuestion('Phone Number: ');
    
    console.log('\nRoles: user, admin');
    const role = await askQuestion('Role: ');
    
    console.log(`\nPools: ${pools.join(', ')}`);
    const pool = await askQuestion('Pool: ');

    // Validate required fields
    if (!name || !email || !password || !number || !role || !pool) {
      throw new Error('All fields are required');
    }

    // Validate pool
    if (!pools.includes(pool)) {
      throw new Error(`Invalid pool. Must be one of: ${pools.join(', ')}`);
    }

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      throw new Error('Invalid role. Must be either "user" or "admin"');
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password and create user
    const passwordHash = bcrypt.hashSync(password, 10);
    
    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
      number,
      pool
    });

    await newUser.save();
    
    console.log('\n✓ User created successfully!');
    console.log(`User ID: ${newUser._id}`);

  } catch (error) {
    console.error('\n✗ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    rl.close();
  }
}

// Handle process interruption
process.on('SIGINT', async () => {
  console.log('\nProcess interrupted...');
  rl.close();
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});

createUserSimple();
