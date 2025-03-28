const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const TempUser = require('../models/TempUser');
const generateToken = require('../utils/generateToken');
const { generateOTP, sendOTPEmail } = require('../utils/otpGenerator');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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
    verifyGoogleOTP
  };