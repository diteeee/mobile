const Product = require('../models/Product');

const ProductController = {
  async getAllProducts(req, res) {
    try {
      const filter = {};
      if (req.query.categoryId && req.query.categoryId !== 'all') {
        filter.category = req.query.categoryId;
      }
      const products = await Product.find(filter).populate('category');
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id).populate('category');
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async addProduct(req, res) {
    try {
      const { name, description, price, stock, category, imageUrl } = req.body;
      const product = new Product({ name, description, price, stock, category, imageUrl });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await Product.findByIdAndDelete(id);
      res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ProductController;
