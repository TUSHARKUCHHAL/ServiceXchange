// utils/otpGenerator.js
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTPEmail = async (email, otp) => {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Use your email provider's SMTP details
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
    subject: 'Your OTP for Registration',
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>OTP Verification</h2>
            <p>Your One-Time Password (OTP) for ServiceXchange is:</p>
            <h1 style="letter-spacing: 10px; text-align: center;">${otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
                <small>If you did not request this, please ignore this email.</small>
        </div>
    `
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = { 
  generateOTP, 
  sendOTPEmail 
};