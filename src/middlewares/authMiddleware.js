const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('No token provided');
      return next(new AppError('You are not logged in!', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    console.log('Decoded token:', decoded);
    console.log('User from token:', user);
    if (!user) {
      console.log('User not found');
      return next(new AppError('User no longer exists.', 401));
    }

    req.user = user;
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    console.log('Error in protect middleware:', err.message);
    next(new AppError('Unauthorized. Invalid or expired token.', 401));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(req.user.role);
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
