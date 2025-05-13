require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'StrongPassword123',
      role: 'admin'
    });

    console.log('✅ Admin created:', adminUser.email);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
};

createAdmin();
