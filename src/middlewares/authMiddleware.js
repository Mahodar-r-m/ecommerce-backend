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
      return next(new AppError('You are not logged in!', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppError('User no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new AppError('Unauthorized. Invalid or expired token.', 401));
  }
};