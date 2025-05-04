const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('../models/userModel');

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => console.error(err));

async function seedUsers(count = 100) {
  await User.deleteMany();

  const users = [];

  for (let i = 0; i < count; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10); // Hash the password
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword // Use the hashed password
    });
  }

  await User.insertMany(users);
  console.log(`${count} users seeded ✅`);
  process.exit();
}

seedUsers(150);
