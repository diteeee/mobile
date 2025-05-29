// routes/categoryRoutes.js
const express = require('express');
const CategoryController = require('../controllers/categoryController');

const router = express.Router();

// Get all categories
router.get('/', CategoryController.getAllCategories);

// Add a new category
router.post('/', CategoryController.addCategory);

module.exports = router;
