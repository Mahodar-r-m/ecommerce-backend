const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const Product = require('../models/productModel');

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => console.error(err));

async function seedProducts(count = 300) {
  await Product.deleteMany();

  const products = [];

  for (let i = 0; i < count; i++) {
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      brand: faker.company.name(),
      stock: faker.number.int({ min: 0, max: 100 }),
      images: [faker.image.urlPicsumPhotos()]
    });
  }

  await Product.insertMany(products);
  console.log(`${count} products seeded ✅`);
  process.exit();
}

seedProducts(300);
