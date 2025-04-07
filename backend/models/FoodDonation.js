const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  foodName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  quantityUnit: {
    type: String,
    required: true,
    enum: ['portions', 'kg', 'lbs', 'boxes', 'containers', 'plates']
  },
  expiryDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  dietaryInfo: {
    vegetarian: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    nutFree: { type: Boolean, default: false },
    dairyFree: { type: Boolean, default: false }
  },
  pickupDetails: {
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    contactPhone: { type: String, required: true },
    pickupInstructions: { type: String }
  },
  pickupTimeStart: {
    type: Date,
    required: true
  },
  pickupTimeEnd: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'collected', 'expired', 'cancelled'],
    default: 'available'
  },
  images: [{
    type: String // URLs to images
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better query performance
foodDonationSchema.index({ expiryDate: 1 });
foodDonationSchema.index({ status: 1 });
foodDonationSchema.index({ restaurant: 1 });

const FoodDonation = mongoose.model('FoodDonation', foodDonationSchema);

module.exports = FoodDonation;