const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, productController.getProducts);

module.exports = router;