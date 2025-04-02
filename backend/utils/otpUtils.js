// utils/otpUtils.js
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const OTP = require('../models/Otp');

// Generate a 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Save OTP to database
const saveOTP = async (email, otp) => {
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });
    
    // Create new OTP document
    const otpDoc = new OTP({
        email,
        otp
    });
    
    await otpDoc.save();
    return otpDoc;
};

// Verify OTP
const verifyOTP = async (email, otp) => {
    const otpDoc = await OTP.findOne({ email, otp });
    
    if (!otpDoc) {
        return false;
    }
    
    // Delete the OTP after verification
    await OTP.deleteOne({ _id: otpDoc._id });
    
    return true;
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", 
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Restaurant Registration',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Restaurant Registration - OTP Verification</h2>
                <p>Your One-Time Password (OTP) is:</p>
                <h1 style="letter-spacing: 10px; text-align: center; background-color: #f5f5f5; padding: 20px;">${otp}</h1>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <hr>
                <p style="font-size: 12px; color: #777;">
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        `
    };

    // Send email
    return await transporter.sendMail(mailOptions);
};

module.exports = {
    generateOTP,
    saveOTP,
    verifyOTP,
    sendOTPEmail
};