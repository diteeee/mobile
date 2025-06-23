const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Add a mailer library

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const UserController = {
  async register(req, res) {
    try {
      const { name, surname, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, surname, email, password: hashedPassword });
      await user.save();

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
      const users = await User.find({}, '-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async requestPasswordReset(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate a 6-digit numeric reset token
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
      const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15-minute expiry

      // Save the token and expiry in the user's record
      user.resetToken = resetToken;
      user.resetTokenExpiry = tokenExpiry;
      await user.save();

      // Send the reset token via email
      await transport.sendMail({
        to: email,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${resetToken}`,
        html: `<p>Your password reset code is: <b>${resetToken}</b></p><p>This code will expire in 15 minutes.</p>`,
      });

      res.status(200).json({ message: 'Password reset code sent to your email.' });
    } catch (error) {
      console.error('Error in requestPasswordReset:', error.message);
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  },

  async verifyToken(req, res) {
    const { token } = req.body;
    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }, // token not expired
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error in resetPassword:', error.message);
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  },
  
  async getCurrentUser(req, res) {
    try {
      console.log('Decoded User:', req.user);
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const { name, surname, email } = req.body;
      const userId = req.user.id;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, surname, email },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteProfile(req, res) {
    try {
      const userId = req.user.id;

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = UserController;
