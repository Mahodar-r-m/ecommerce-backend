const Product = require('../models/productModel');
const AppError = require('../utils/AppError');

exports.getProducts = async ({ search, page = 1, limit = 10 }) => {
  const query = {};
  console.log(`page: ${page}, limit: ${limit}`);
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

exports.createProduct = async (data) => {
  const product = await Product.create(data);
  return product;
};

exports.updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  console.log('product in updateProduct: ', product);
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError('Product not found', 404);
  return product;
};
