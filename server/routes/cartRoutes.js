const express = require('express');
const CartController = require('../controllers/CartController');

const router = express.Router();

router.get('/:userId', CartController.getCart);

router.post('/add', CartController.addToCart);

router.post('/remove', CartController.removeFromCart);

router.put('/update-quantity', CartController.updateCartQuantity);

module.exports = router;
