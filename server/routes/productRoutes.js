// routes/productRoutes.js
const express = require('express');
const ProductController = require('../controllers/ProductController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/permission');

const router = express.Router();

// Get all products
router.get('/', ProductController.getAllProducts);

// Add a new product
router.post('/', auth, checkRole(['admin']), ProductController.addProduct);

// Update a product by ID
router.put('/:id', auth, checkRole(['admin']), ProductController.updateProduct);

// Delete a product by ID
router.delete('/:id', auth, checkRole(['admin']), ProductController.deleteProduct);

module.exports = router;
