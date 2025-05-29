const express = require('express');
const CartController = require('../controllers/CartController');

const router = express.Router();

// Get the cart for a specific user
router.get('/:userId', CartController.getCart);

// Add a product to the cart
router.post('/add', CartController.addToCart);

module.exports = router;
