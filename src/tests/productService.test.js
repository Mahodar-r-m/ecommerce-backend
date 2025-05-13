const mongoose = require('mongoose');
const Product = require('../models/productModel');
const { createProduct, updateProduct, deleteProduct } = require('../services/productService');
require('dotenv').config();
// 👇 Import in-memory MongoDB setup
require('./setupTestDB');

const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// describe('Product Service - createProduct', () => {
//   it('should create and return a new product', async () => {
//     const payload = {
//       name: 'Test Product',
//       description: 'A test product for unit testing',
//       price: 49.99,
//       stock: 20,
//       category: 'Test Category'
//     };

//     const product = await createProduct(payload);

//     expect(product).toBeDefined();
//     expect(product.name).toBe(payload.name);
//     expect(product.price).toBe(payload.price);
//     expect(product.stock).toBe(payload.stock);
//   });

//   it('should throw validation error for missing name', async () => {
//     const badPayload = {
//       description: 'Missing name field',
//       price: 25,
//       stock: 10,
//     };

//     await expect(createProduct(badPayload)).rejects.toThrow(mongoose.Error.ValidationError);
//   });
// });


let adminToken, userToken, testProduct;

beforeAll(async () => {
  // Create admin and customer users
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: 'Admin@123',
    role: 'admin',
  });
  console.log('Admin user created:', admin);

  const user = await User.create({
    name: 'User',
    email: 'user@test.com',
    password: 'User@123',
    role: 'customer',
  });
  console.log('Customer user created:', user);

  // Generate JWT tokens for admin and customer
  adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  // Create a test product
  testProduct = await Product.create({
    name: 'Test Product',
    price: 50,
    stock: 10,
  });
  console.log('Test product created:', testProduct);
});

describe('Product Service - createProduct', () => {
  it('should create and return a new product', async () => {
    const payload = {
      name: 'Test Product',
      description: 'A test product for unit testing',
      price: 49.99,
      stock: 20,
      category: 'Test Category',
    };

    const product = await createProduct(payload);

    expect(product).toBeDefined();
    expect(product.name).toBe(payload.name);
    expect(product.price).toBe(payload.price);
    expect(product.stock).toBe(payload.stock);
  });

  it('should throw validation error for missing name', async () => {
    const badPayload = {
      description: 'Missing name field',
      price: 25,
      stock: 10,
    };

    await expect(Product.create(badPayload)).rejects.toThrow(mongoose.Error.ValidationError);
  });
});

describe('PATCH /products/:id', () => {
  it('should allow admin to update product', async () => {
    const res = await request(app)
      .patch(`/api/products/${testProduct._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 99 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(99);
  });

  it('should block customer from updating product', async () => {
    const res = await request(app)
      .patch(`/api/products/${testProduct._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 100 });

    expect(res.statusCode).toBe(403);
  });

  it('should return 404 for invalid product id', async () => {
    const res = await request(app)
      .patch(`/api/products/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 88 });

    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /products/:id', () => {
  it('should allow admin to delete product', async () => {
    const product = await Product.create({ name: 'Delete Me', price: 20, stock: 5 });

    const res = await request(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  it('should block customer from deleting product', async () => {
    const product = await Product.create({ name: 'Dont Delete', price: 25, stock: 6 });

    const res = await request(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});