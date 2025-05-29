// routes/reviewRoutes.js
const express = require('express');
const ReviewController = require('../controllers/ReviewController');

const router = express.Router();

// Add a new review
router.post('/', ReviewController.addReview);

// Get all reviews for a specific product
router.get('/:productId', ReviewController.getProductReviews);

module.exports = router;
