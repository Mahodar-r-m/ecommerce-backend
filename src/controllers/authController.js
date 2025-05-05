const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { token, user } = await authService.register(req.body);
    res.status(201).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body);
    res.json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetToken = await authService.forgotPassword(email);
    res.status(200).json({
      success: true,
      message: 'Password reset token sent to email.'
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.status(200).json({
      success: true,
      message: 'Password reset successful.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};