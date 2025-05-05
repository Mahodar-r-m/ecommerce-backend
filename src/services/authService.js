const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/sendEmail');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

exports.register = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new AppError('Email already exists', 400);

  const user = await User.create(userData);
  const token = signToken(user._id);
  return { token, user };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  const token = signToken(user._id);
  return { token, user };
};

exports.forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new AppError('No user found with this email', 404);
  
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 mins
  
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = resetTokenExpire;
    await user.save({ validateBeforeSave: false });
  
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(user.email, 'Reset Password', `Reset here: ${resetURL}`);
    return resetToken;
};
  
exports.resetPassword = async (token, newPassword) => {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    });
  
    if (!user) throw new AppError('Invalid or expired reset token', 400);
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  
    const jwtToken = signToken(user._id);
    return { token: jwtToken, user };
};
  