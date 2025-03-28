const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  otp: {
    code: { 
      type: String, 
      required: true 
    },
    expiresAt: { 
      type: Date, 
      required: true 
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: '15m' // Automatically delete after 15 minutes
  }
});

module.exports = mongoose.model('TempUser', tempUserSchema);