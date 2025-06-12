const Wishlist = require('../models/Wishlist');

const WishlistController = {
  async getWishlist(req, res) {
    try {
      const { userId } = req.params;
      const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
      res.status(200).json(wishlist || { products: [] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async addToWishlist(req, res) {
    try {
      const { user, product } = req.body;
      let wishlist = await Wishlist.findOne({ user });

      if (!wishlist) {
        wishlist = new Wishlist({ user, products: [product] });
      } else if (!wishlist.products.includes(product)) {
        wishlist.products.push(product);
      } else {
        return res.status(400).json({ message: 'Product is already in the wishlist.' });
      }

      await wishlist.save();
      res.status(201).json(wishlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async removeFromWishlist(req, res) {
    try {
      const { userId, productId } = req.params;
      const wishlist = await Wishlist.findOne({ user: userId });

      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found.' });
      }

      wishlist.products = wishlist.products.filter(product => product.toString() !== productId);
      await wishlist.save();

      res.status(200).json({ message: 'Product removed from wishlist.', wishlist });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = WishlistController;
