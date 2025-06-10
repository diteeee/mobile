// routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.get('/all', UserController.getAllUsers);

router.get('/me', auth, UserController.getCurrentUser);

router.post('/reset-password', UserController.resetPassword);

router.put('/me', auth, UserController.updateProfile);

router.delete('/me', auth, UserController.deleteProfile);

module.exports = router;
