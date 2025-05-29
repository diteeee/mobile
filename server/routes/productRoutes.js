// routes/productRoutes.js
const express = require('express');
const ProductController = require('../controllers/ProductController');

const router = express.Router();

// Get all products
router.get('/', ProductController.getAllProducts);

// Add a new product
router.post('/', ProductController.addProduct);

// Update a product by ID
router.put('/:id', ProductController.updateProduct);

// Delete a product by ID
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
