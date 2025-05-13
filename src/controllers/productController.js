const productService = require('../services/productService');

exports.getProducts = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const result = await productService.getProducts({ search, page: +page, limit: +limit }); // NOTE - The unary + operator is a shorthand way to convert a string to a number.
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send(); // No content
  } catch (err) {
    next(err);
  }
};
