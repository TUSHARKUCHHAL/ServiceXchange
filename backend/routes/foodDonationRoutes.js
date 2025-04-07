const express = require('express');
const router = express.Router();
const FoodDonation = require('../models/FoodDonation');
const auth = require('../middlewares/AuthenticationMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/donations';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change this to your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all donations created by the logged-in restaurant
router.get('/my-donations', auth, async (req, res) => {
  try {
    const donations = await FoodDonation.find({ restaurant: req.restaurant.id })
      .sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new food donation
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      foodName,
      quantity,
      quantityUnit,
      expiryDate,
      description,
      vegetarian,
      vegan,
      glutenFree,
      nutFree,
      dairyFree,
      address,
      contactPerson,
      contactPhone,
      pickupInstructions,
      pickupTimeStart,
      pickupTimeEnd
    } = req.body;

    // Process uploaded images
    const imageUrls = req.files ? req.files.map(file => `/uploads/donations/${file.filename}`) : [];

    const newDonation = new FoodDonation({
      restaurant: req.restaurant.id,
      foodName,
      quantity: Number(quantity),
      quantityUnit,
      expiryDate,
      description,
      dietaryInfo: {
        vegetarian: vegetarian === 'true',
        vegan: vegan === 'true',
        glutenFree: glutenFree === 'true',
        nutFree: nutFree === 'true',
        dairyFree: dairyFree === 'true'
      },
      pickupDetails: {
        address,
        contactPerson,
        contactPhone,
        pickupInstructions
      },
      pickupTimeStart,
      pickupTimeEnd,
      images: imageUrls
    });

    await newDonation.save();
    res.status(201).json(newDonation);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific donation by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if the user is the restaurant that created this donation
    if (donation.restaurant.toString() !== req.restaurant.id) {
      return res.status(403).json({ message: 'Not authorized to access this donation' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a donation
router.put('/:id', auth, upload.array('newImages', 5), async (req, res) => {
  try {
    let donation = await FoodDonation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if the user is the restaurant that created this donation
    if (donation.restaurant.toString() !== req.restaurant.id) {
      return res.status(403).json({ message: 'Not authorized to update this donation' });
    }

    // Process any new uploaded images
    const newImageUrls = req.files ? req.files.map(file => `/uploads/donations/${file.filename}`) : [];
    
    // Keep existing images that weren't deleted
    const keepImages = req.body.keepImages ? 
      (Array.isArray(req.body.keepImages) ? req.body.keepImages : [req.body.keepImages]) : 
      [];
    
    // Combine kept images with new images
    const updatedImages = [...keepImages, ...newImageUrls];

    const {
      foodName,
      quantity,
      quantityUnit,
      expiryDate,
      description,
      vegetarian,
      vegan,
      glutenFree,
      nutFree,
      dairyFree,
      address,
      contactPerson,
      contactPhone,
      pickupInstructions,
      pickupTimeStart,
      pickupTimeEnd,
      status
    } = req.body;

    const updatedDonation = {
      foodName,
      quantity: Number(quantity),
      quantityUnit,
      expiryDate,
      description,
      dietaryInfo: {
        vegetarian: vegetarian === 'true',
        vegan: vegan === 'true',
        glutenFree: glutenFree === 'true',
        nutFree: nutFree === 'true',
        dairyFree: dairyFree === 'true'
      },
      pickupDetails: {
        address,
        contactPerson,
        contactPhone,
        pickupInstructions
      },
      pickupTimeStart,
      pickupTimeEnd,
      status,
      images: updatedImages
    };

    donation = await FoodDonation.findByIdAndUpdate(
      req.params.id,
      { $set: updatedDonation },
      { new: true }
    );

    res.json(donation);
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a donation
router.delete('/:id', auth, async (req, res) => {
    try {
      const donation = await FoodDonation.findById(req.params.id);
      
      if (!donation) {
        return res.status(404).json({ message: 'Donation not found' });
      }
  
      // Check if the user is the restaurant that created this donation
      if (donation.restaurant.toString() !== req.restaurant.id) {
        return res.status(403).json({ message: 'Not authorized to delete this donation' });
      }
  
      // Delete associated images from storage with proper error handling
      const imageDeletionPromises = donation.images.map(imageUrl => {
        return new Promise((resolve, reject) => {
          const imagePath = path.join(__dirname, '..', imageUrl);
          fs.unlink(imagePath, err => {
            if (err && err.code !== 'ENOENT') { // Ignore if file doesn't exist
              console.error('Error deleting image:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });
      
      try {
        await Promise.all(imageDeletionPromises);
      } catch (imageError) {
        console.error('Error deleting one or more images:', imageError);
        // Continue with donation deletion even if some images failed to delete
      }
  
      await FoodDonation.findByIdAndRemove(req.params.id);
      res.json({ message: 'Donation removed' });
    } catch (error) {
      console.error('Error deleting donation:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Send OTP
router.post('/send-otp', auth, async (req, res) => {
  try {
    // Get the restaurant's email from the authenticated restaurant object
    const restaurantEmail = req.restaurant.email;
    
    if (!restaurantEmail) {
      return res.status(400).json({ message: 'Restaurant email not found' });
    }
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database with expiry
    req.restaurant.verificationOtp = otp;
    req.restaurant.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await req.restaurant.save();
    
    // Set up email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: restaurantEmail,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #4CAF50;">Food Donation Platform</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; margin: 20px 0; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
          <p style="font-size: 12px; color: #777; margin-top: 30px;">This is an automated message, please do not reply.</p>
        </div>
      `
    };
    
    // Send the email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'OTP sent successfully to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});
  
// Verify OTP
router.post('/verify-otp', auth, async (req, res) => {
  try {
    const { otp } = req.body;
    
    // Check if OTP matches and is not expired
    if (req.restaurant.verificationOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (Date.now() > req.restaurant.otpExpiry) {
      return res.status(400).json({ message: 'OTP expired' });
    }
    
    // Clear OTP after successful verification
    req.restaurant.verificationOtp = null;
    req.restaurant.otpExpiry = null;
    await req.restaurant.save();
    
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

module.exports = router;