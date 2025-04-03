// models/Restaurant.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const openingHoursSchema = new mongoose.Schema({
    open: {
        type: String,
        required: true
    },
    close: {
        type: String,
        required: true
    },
    closed: {
        type: Boolean,
        default: false
    }
});

const restaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    zipCode: {
        type: String,
        required: true,
        trim: true
    },
    openingHours: {
        monday: openingHoursSchema,
        tuesday: openingHoursSchema,
        wednesday: openingHoursSchema,
        thursday: openingHoursSchema,
        friday: openingHoursSchema,
        saturday: openingHoursSchema,
        sunday: openingHoursSchema
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationOtp: {
        type: String,
        default: null
      },
      otpExpiry: {
        type: Date,
        default: null
      },
      resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to hash password
restaurantSchema.pre('save', async function(next) {
    // Only hash the password if it's modified or new
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to verify password
restaurantSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;