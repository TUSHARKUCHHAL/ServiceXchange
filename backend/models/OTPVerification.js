const mongoose = require('mongoose');

const OTPVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest',
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure uniqueness of email-requestId pair
OTPVerificationSchema.index({ email: 1, requestId: 1 }, { unique: true });

module.exports = mongoose.model('OTPVerification', OTPVerificationSchema);