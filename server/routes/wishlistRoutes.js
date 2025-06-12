const express = require('express');
const WishlistController = require('../controllers/WishlistController');

const router = express.Router();

router.get('/:userId', WishlistController.getWishlist);

router.post('/', WishlistController.addToWishlist);

router.delete('/:userId/:productId', WishlistController.removeFromWishlist);

module.exports = router;
