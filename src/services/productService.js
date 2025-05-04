const Product = require('../models/productModel');

exports.getProducts = async ({ search, page = 1, limit = 10 }) => {
  const query = {};

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query)
  ]);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    results: products
  };
};