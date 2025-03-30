const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String,
    trim: true,
    default: ''
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String
  },
  resetPasswordToken: { 
    type: String, 
    default: null 
  },
  resetPasswordExpires: { 
    type: Date, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);