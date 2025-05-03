const User = require('../models/userModel');
const AppError = require('../utils/AppError');

exports.createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) throw new AppError('Email already exists', 400);

  const user = new User(userData);
  await user.save();
  return user;
};

exports.getAllUsers = async () => {
  return await User.find().select('-password');
};
