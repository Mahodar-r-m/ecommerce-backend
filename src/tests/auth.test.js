// auth.test.js
const request = require('supertest');
const app = require('../app'); // Your express app
const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config();

// 👇 Import in-memory MongoDB setup
require('./setupTestDB');

// Remove this block, as `setupTestDB.js` already handles the connection
// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/local?retryWrites=false');
// });

// Remove this block as well, as `setupTestDB.js` handles disconnection
// afterAll(async () => {
//   await mongoose.connection.close();
// });

afterEach(async () => {
  await User.deleteMany(); // Clean DB after each test
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test1234',
      });

    console.log('Test started');
    console.log(res.body); // Log the response body
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should login the user with correct credentials', async () => {
    // Register first
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test1234',
    });

    // Then login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test1234',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fail login with wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test1234',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpass',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
