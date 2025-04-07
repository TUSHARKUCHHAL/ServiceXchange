const nodemailer = require('nodemailer');
const BloodRequest = require('../models/BloodRequests');
const OTPVerification = require('../models/OTPVerification');
require('dotenv').config();

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to requestor's email
const sendOTP = async (req, res) => {
  try {
    const { email, requestId } = req.body;

    // Validate input
    if (!email || !requestId) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and requestId are required" 
      });
    }

    // Check if request exists and matches the email
    const request = await BloodRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: "Blood request not found" 
      });
    }

    // Verify that the email matches the requestor's email
    if (request.requestorEmail !== email) {
      return res.status(403).json({ 
        success: false, 
        message: "Email does not match the request's requestor email" 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await OTPVerification.findOneAndUpdate(
      { email, requestId },
      {
        email,
        requestId,
        otp,
        expiresAt: otpExpiration
      },
      { upsert: true, new: true }
    );

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Blood Request Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Blood Request Verification</h2>
          <p>Your verification code to confirm a blood donor is:</p>
          <div style="padding: 10px; background-color: #f8f9fa; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({ 
      success: true, 
      message: "OTP sent successfully" 
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to send OTP" 
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, requestId, otp } = req.body;

    // Validate input
    if (!email || !requestId || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Email, requestId and OTP are required" 
      });
    }

    // Find the OTP verification record
    const verification = await OTPVerification.findOne({
      email,
      requestId,
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      });
    }

    // OTP is valid, delete it to prevent reuse
    await OTPVerification.deleteOne({ _id: verification._id });

    return res.status(200).json({ 
      success: true, 
      message: "OTP verified successfully",
      isVerified: true
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to verify OTP" 
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};