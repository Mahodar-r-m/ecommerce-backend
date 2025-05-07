// Unit tests for Auth Service using in-memory MongoDB

const mongoose = require('mongoose');
const authService = require('../services/authService');
const User = require('../models/userModel');
require('dotenv').config();

// 👇 Setup in-memory MongoDB
require('./setupTestDB');

describe('authService - Unit Tests', () => {
  const mockUser = {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'StrongPass123'
  };

  it('should register a new user and return token', async () => {
    const { user, token } = await authService.register(mockUser);

    expect(user).toBeDefined();
    expect(user.email).toBe(mockUser.email);
    expect(token).toBeDefined();

    const saved = await User.findOne({ email: mockUser.email });
    expect(saved).not.toBeNull();
  });

  it('should not allow duplicate email registration', async () => {
    await authService.register(mockUser);

    await expect(authService.register(mockUser))
      .rejects
      .toThrow('Email already exists');
  });

  it('should login with correct credentials', async () => {
    await authService.register(mockUser);

    const { user, token } = await authService.login({
      email: mockUser.email,
      password: mockUser.password
    });

    expect(user).toBeDefined();
    expect(token).toBeDefined();
  });

  it('should not login with incorrect password', async () => {
    await authService.register(mockUser);

    await expect(authService.login({
      email: mockUser.email,
      password: 'WrongPassword'
    })).rejects.toThrow('Invalid email or password');
  });

  it('should not login with non-existent email', async () => {
    await expect(authService.login({
      email: 'notfound@example.com',
      password: 'any'
    })).rejects.toThrow('Invalid email or password');
  });
});

describe('Auth Service - forgotPassword', () => {
    it('should generate reset token and update user record', async () => {
        const user = await User.create({
            name: 'Reset Test',
            email: 'reset@example.com',
            password: 'test1234',
        });
    
        const spy = jest.spyOn(console, 'log'); // optionally log email for debug
        const result = await authService.forgotPassword('reset@example.com');
    
        const updatedUser = await User.findById(user._id);
    
        expect(updatedUser.passwordResetToken).toBeDefined();
        expect(updatedUser.passwordResetExpires).toBeDefined();
        spy.mockRestore();
    });
  
    it('should throw error for non-existing email', async () => {
        await expect(
            authService.forgotPassword('nonexistent@example.com')
        ).rejects.toThrow('No user found with this email');
    });
});
  
describe('Auth Service - resetPassword', () => {
    it('should reset the password with valid token', async () => {
        const user = await User.create({
            name: 'Reset Token',
            email: 'token@example.com',
            password: 'oldPass123',
        });
    
        // Simulate forgot password to generate token
        const resetToken = await authService.forgotPassword(user.email);
        
        const newPassword = 'newSecurePass456';
        
        // Use the resetToken returned by forgotPassword
        const result = await authService.resetPassword(resetToken, newPassword);
        
        expect(result.token).toBeDefined();

        const finalUser = await User.findById(user._id);
        expect(await finalUser.comparePassword(newPassword)).toBe(true);
        expect(finalUser.passwordResetToken).toBeUndefined();
        expect(finalUser.passwordResetExpires).toBeUndefined();
    });
  
    it('should fail for invalid or expired token', async () => {
        await expect(
            authService.resetPassword('invalidtoken', 'newpass')
        ).rejects.toThrow('Token is invalid or has expired');
    });
});
  