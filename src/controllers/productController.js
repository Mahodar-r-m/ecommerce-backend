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