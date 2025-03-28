// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const {
    sendOTP,
    verifyOTP,
    googleSignup,
    verifyGoogleOTP,
    login,
    googleLogin
} = require('../controllers/authController');

// OTP Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Google Routes
router.post('/google-signup', googleSignup);
router.post('/verify-google-otp', verifyGoogleOTP);

// Login Routes
router.post('/login', login);
router.post('/google-login', googleLogin);

module.exports = router;