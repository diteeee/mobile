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

  async removeFromCart(req, res) {
    try {
      const { user, product } = req.body;
      const cart = await Cart.findOne({ user });

      if (cart) {
        cart.products = cart.products.filter(p => p.product.toString() !== product);
        await cart.save();
        return res.status(200).json(cart);
      }
      res.status(404).json({ message: 'Cart not found' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateCartQuantity(req, res) {
    try {
      const { user, product, quantity } = req.body;
      const cart = await Cart.findOne({ user });

      if (cart) {
        const existingProduct = cart.products.find(p => p.product.toString() === product);
        if (existingProduct) {
          existingProduct.quantity = quantity;
          await cart.save();
          return res.status(200).json(cart);
        } else {
          return res.status(404).json({ message: 'Product not found in cart' });
        }
      } else {
        res.status(404).json({ message: 'Cart not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async clearCart(req, res) {
    try {
      const { user } = req.body;
      const cart = await Cart.findOne({ user });

      if (cart) {
        cart.products = [];
        await cart.save();
        return res.status(200).json({ message: 'Cart cleared successfully' });
      }
      res.status(404).json({ message: 'Cart not found' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = CartController;
