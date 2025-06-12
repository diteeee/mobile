const Order = require('../models/Order');

const OrderController = {
  async createOrder(req, res) {
    try {
      const { user, products, totalPrice } = req.body;
      const order = new Order({ user, products, totalPrice });
      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserOrders(req, res) {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ user: userId }).populate('products.product');
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = OrderController;
