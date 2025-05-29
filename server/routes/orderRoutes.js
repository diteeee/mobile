// routes/orderRoutes.js
const express = require('express');
const OrderController = require('../controllers/OrderController');

const router = express.Router();

// Create a new order
router.post('/', OrderController.createOrder);

// Get all orders for a specific user
router.get('/user/:userId', OrderController.getUserOrders);

module.exports = router;
