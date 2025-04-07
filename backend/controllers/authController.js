const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const TempUser = require('../models/TempUser');
const generateToken = require('../utils/generateToken');
const { generateOTP, sendOTPEmail } = require('../utils/otpGenerator');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
require("dotenv").config();

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid email address" 
      });
    }

    // Find user
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
      expiresIn: "1h" 
    });

    // Store token in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    try {
      await user.save();
    } catch (saveError) {
      console.error("Failed to save reset token:", saveError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to save reset token"
      });
    }

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Ensure this is set
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ 
        success: true, 
        message: "Password reset email sent successfully" 
      });
    } catch (emailError) {
      console.error("Email Sending Error:", emailError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send reset email" 
      });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "An error occurred during password reset request" 
    });
  }
};
4



const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Extract token from URL
    const { newPassword } = req.body; // Get new password from request body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    // Save updated user
    await user.save();

    return res.status(200).json({ message: "Password reset successful. You can now log in." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Server error during password reset" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If password is set (local authentication), compare passwords
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // If no password is set, it might mean the user registered via Google
      return res.status(401).json({ message: 'Please login with Google or Set Password using Forget-password' });
z    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    // Check if user exists in database
    let user = await User.findOne({ email });

    // If user doesn't exist, return error - no auto-registration
    if (!user) {
      return res.status(404).json({ message: 'No account found for this Google email. Please sign up first.' });
    }

    // User exists, generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return successful response with token and user data
    res.status(200).json({
      message: 'Login successful',
      token: jwtToken,
      user: {
        email: user.email,
        firstName: user.firstName || given_name,
        lastName: user.lastName || family_name,
        // Include any other user fields you need
      }
    });

  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({ 
      message: 'Google login failed',
      error: error.message 
    });
  }
};

// Existing send OTP function remains the same
const sendOTP = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if temp user exists and delete
    await TempUser.deleteOne({ email });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create temp user
    const tempUser = new TempUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp: {
        code: otp,
        expiresAt: otpExpiration
      }
    });
    await tempUser.save();

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Existing verify OTP function remains the same
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find temp user
    const tempUser = await TempUser.findOne({ 
      email,
      'otp.code': otp,
      'otp.expiresAt': { $gt: new Date() }
    });

    if (!tempUser) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Create permanent user
    const newUser = new User({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      email: tempUser.email,
      password: tempUser.password,
      authMethod: 'email'
    });
    await newUser.save();

    // Delete temp user
    await TempUser.deleteOne({ email });

    // Generate JWT token
    const token = generateToken(newUser);

    res.status(201).json({ 
      message: 'Registration successful', 
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const googleSignup = async (req, res) => {
    try {
      const { token } = req.body;
  
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      const { email, given_name, family_name } = payload;
  
      // Delete existing temp user if any
      await TempUser.deleteOne({ email });
  
      // Generate new OTP
      const otp = generateOTP();
      const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
  
      // Create new temp user
      const tempUser = new TempUser({
        firstName: given_name || 'User',
        lastName: family_name || '',
        email,
        authMethod: 'google',
        otp: {
          code: otp,
          expiresAt: otpExpiration
        }
      });
  
      await tempUser.save();
      await sendOTPEmail(email, otp);
  
      res.status(200).json({ 
        email,
        firstName: given_name || 'User',
        lastName: family_name || ''
      });
  
    } catch (error) {
      console.error('Google Auth Error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'OTP already sent. Please check your email or wait before requesting another.'
        });
      }
      
      res.status(500).json({ 
        message: 'Google authentication failed',
        error: error.message 
      });
    }
  };
  
  const verifyGoogleOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      // Find temp user
      const tempUser = await TempUser.findOne({ 
        email,
        'otp.code': otp,
        'otp.expiresAt': { $gt: new Date() }
      });
  
      if (!tempUser) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // Create/update user without password
      const userData = {
        firstName: tempUser.firstName,
        lastName: tempUser.lastName || '', // Handle missing last name
        email: tempUser.email,
        authMethod: 'google',
        isVerified: true
      };
  
      const user = await User.findOneAndUpdate(
        { email },
        userData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
  
      // Delete temp user
      await TempUser.deleteOne({ email });
  
      // Generate JWT token
      const token = generateToken(user);
  
      res.status(200).json({ 
        message: 'Google verification successful', 
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Google OTP Verification Error:', error);
      res.status(500).json({ 
        message: 'Google OTP verification failed',
        error: error.message 
      });
    }
  };
  
  module.exports = {
    sendOTP,
    verifyOTP,
    googleSignup,
    verifyGoogleOTP,
    login,
    googleLogin,
    forgotPassword,
    resetPassword
  };