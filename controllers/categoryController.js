// controllers/CategoryController.js
const Category = require('../models/Category');

const CategoryController = {
  async getAllCategories(req, res) {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async addCategory(req, res) {
    try {
      const { name, description } = req.body;
      const category = new Category({ name, description });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = CategoryController;
