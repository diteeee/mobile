const express = require('express');
const ReviewController = require('../controllers/ReviewController');

const router = express.Router();

// Add a new review
router.post('/', ReviewController.addReview);

// Get all reviews for a specific product
router.get('/product/:productId', ReviewController.getProductReviews);

// Get all reviews by a specific user
router.get('/user/:userId', ReviewController.getUserReviews);

module.exports = router;
