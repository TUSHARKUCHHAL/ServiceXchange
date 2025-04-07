// routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const { generateOTP, saveOTP, verifyOTP, sendOTPEmail } = require('../utils/otpUtils');
const auth = require('../middlewares/AuthenticationMiddleware');

// Route to send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if email already exists in verified restaurants
        const existingRestaurant = await Restaurant.findOne({ email, verified: true });
        if (existingRestaurant) {
            return res.status(400).json({
                success: false,
                message: 'A restaurant with this email already exists. Please login instead.'
            });
        }
        
        // Generate and save OTP
        const otp = generateOTP();
        await saveOTP(email, otp);
        
        // Send OTP email
        await sendOTPEmail(email, otp);
        
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('OTP send error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please try again later.'
        });
    }
});

// Route to verify OTP and register restaurant
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp, restaurantData } = req.body;
        
        // Verify OTP
        const isValidOTP = await verifyOTP(email, otp);
        
        if (!isValidOTP) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }
        
        // Check again if restaurant with this email already exists
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant && existingRestaurant.verified) {
            return res.status(400).json({
                success: false,
                message: 'A restaurant with this email already exists'
            });
        }
        
        // If restaurant exists but not verified, update it
        if (existingRestaurant) {
            existingRestaurant.restaurantName = restaurantData.restaurantName;
            existingRestaurant.phoneNumber = restaurantData.phoneNumber;
            existingRestaurant.address = restaurantData.address;
            existingRestaurant.city = restaurantData.city;
            existingRestaurant.state = restaurantData.state;
            existingRestaurant.zipCode = restaurantData.zipCode;
            existingRestaurant.openingHours = restaurantData.openingHours;
            existingRestaurant.password = restaurantData.password;
            existingRestaurant.verified = true;
            
            await existingRestaurant.save();
            
            return res.status(200).json({
                success: true,
                message: 'Restaurant registration successful'
            });
        }
        
        // Create new restaurant
        const newRestaurant = new Restaurant({
            restaurantName: restaurantData.restaurantName,
            email: restaurantData.email,
            phoneNumber: restaurantData.phoneNumber,
            address: restaurantData.address,
            city: restaurantData.city,
            state: restaurantData.state,
            zipCode: restaurantData.zipCode,
            openingHours: restaurantData.openingHours,
            password: restaurantData.password,
            verified: true
        });
        
        await newRestaurant.save();
        
        res.status(201).json({
            success: true,
            message: 'Restaurant registration successful'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again later.'
        });
    }
});

// Get restaurant profile
router.get('/me', auth, async (req, res) => {
    try {
      // req.restaurant should be set by your auth middleware
      const restaurant = await Restaurant.findById(req.restaurant.id).select('-password -verificationOtp -otpExpiry');
      
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      
      res.json(restaurant);
    } catch (error) {
      console.error('Error fetching restaurant profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;