// routes/wishlistRoutes.js
const express = require('express');
const WishlistController = require('../controllers/WishlistController');

const router = express.Router();

// Get wishlist for a user
router.get('/:userId', WishlistController.getWishlist);

// Add a product to wishlist
router.post('/', WishlistController.addToWishlist);

// Remove a product from wishlist
router.delete('/:userId/:productId', WishlistController.removeFromWishlist);

module.exports = router;
