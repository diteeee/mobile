const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const UserController = {
  async register(req, res) {
    try {
      const { name, surname, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, surname, email, password: hashedPassword });
      await user.save();

      // Generate token after registration
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ message: 'User registered successfully.', token, user: { id: user._id, name, surname, email, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(200).json({ token, user: { id: user._id, name: user.name, surname: user.surname, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.find({}, '-password'); // Exclude password field
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async resetPassword(req, res) {
    const { email, newPassword, confirmNewPassword } = req.body;

    if (!email || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      await user.save();

      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password'); // exclude password
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = UserController;
