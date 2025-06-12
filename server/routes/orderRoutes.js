const express = require('express');
const OrderController = require('../controllers/OrderController');

const router = express.Router();

router.post('/', OrderController.createOrder);

router.get('/user/:userId', OrderController.getUserOrders);

module.exports = router;
