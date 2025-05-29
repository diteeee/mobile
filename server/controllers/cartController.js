// controllers/CartController.js
const Cart = require('../models/Cart');

const CartController = {
  async getCart(req, res) {
    try {
      const { userId } = req.params;
      const cart = await Cart.findOne({ user: userId }).populate('products.product');
      res.status(200).json(cart || { products: [] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async addToCart(req, res) {
    try {
      const { user, product, quantity } = req.body;
      let cart = await Cart.findOne({ user });

      if (!cart) {
        cart = new Cart({ user, products: [{ product, quantity }] });
      } else {
        const existingProduct = cart.products.find(p => p.product.toString() === product);
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ product, quantity });
        }
      }
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = CartController;
