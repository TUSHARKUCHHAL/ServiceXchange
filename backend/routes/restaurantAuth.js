const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Restaurant = require('../models/Restaurant');
const nodemailer = require('nodemailer');

// Environment variables (should be in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Setup nodemailer transporter (configure for your email provider)
const transporter = nodemailer.createTransport({
  // Example for Gmail
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Restaurant Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const isMatch = await restaurant.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if account is verified
    if (!restaurant.verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    // Create and sign JWT token
    const token = jwt.sign(
      { id: restaurant._id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      restaurant: {
        id: restaurant._id,
        name: restaurant.restaurantName,
        email: restaurant.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find restaurant by email
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(404).json({ message: 'No account with that email address exists' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Save reset token and expiration to database
    restaurant.resetPasswordToken = resetToken;
    restaurant.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await restaurant.save();

    // Create reset URL
    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

    // Email message
    const mailOptions = {
      to: restaurant.email,
      from: process.env.EMAIL_USER,
      subject: 'Restaurant Portal Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your restaurant account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Reset Token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find restaurant with valid token
    const restaurant = await Restaurant.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!restaurant) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    res.json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Find restaurant with valid token
    const restaurant = await Restaurant.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!restaurant) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Update password and clear reset token fields
    restaurant.password = password;
    restaurant.resetPasswordToken = undefined;
    restaurant.resetPasswordExpires = undefined;
    
    await restaurant.save();

    res.json({ message: 'Password has been reset' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;