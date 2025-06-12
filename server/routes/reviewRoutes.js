const express = require('express');
const ReviewController = require('../controllers/ReviewController');

const router = express.Router();

router.post('/', ReviewController.addReview);

router.get('/product/:productId', ReviewController.getProductReviews);

router.get('/user/:userId', ReviewController.getUserReviews);

module.exports = router;
