// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { 
  sendOTP, 
  verifyOTP 
} = require('../controllers/authController');

// OTP Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
// New Google routes
router.post('/google-signup', authController.googleSignup);
router.post('/verify-google-otp', authController.verifyGoogleOTP);



module.exports = router;