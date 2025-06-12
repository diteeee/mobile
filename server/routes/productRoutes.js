const express = require('express');
const ProductController = require('../controllers/ProductController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/permission');

const router = express.Router();

router.get('/', ProductController.getAllProducts);

router.get('/:id', ProductController.getProductById);

router.post('/', auth, checkRole(['admin']), ProductController.addProduct);

router.put('/:id', auth, checkRole(['admin']), ProductController.updateProduct);

router.delete('/:id', auth, checkRole(['admin']), ProductController.deleteProduct);

module.exports = router;
