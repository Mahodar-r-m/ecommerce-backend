const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', protect, productController.getProducts);
router.post('/', protect, productController.createProduct); // Protected route

router
  .route('/:id')
  .patch(protect, restrictTo('admin'), productController.updateProduct)
  .delete(protect, restrictTo('admin'), productController.deleteProduct);
module.exports = router;