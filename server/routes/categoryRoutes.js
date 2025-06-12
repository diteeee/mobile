const express = require('express');
const CategoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', CategoryController.getAllCategories);

router.post('/', CategoryController.addCategory);

module.exports = router;
