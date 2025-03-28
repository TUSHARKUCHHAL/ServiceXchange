const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
const User = require("../models/User") // Assuming `User` model is used
dotenv.config()

const router = express.Router()

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

router.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.body
      console.log("🔍 Received email:", email) // Debugging
  
      const user = await User.findOne({ email })
      if (!user) {
        console.log("❌ User not found")
        return res.status(404).json({ message: "User not found" })
      }
  
      const token = crypto.randomBytes(32).toString("hex")
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
  
      user.resetPasswordToken = token
      user.resetPasswordExpires = Date.now() + 3600000
      await user.save()
  
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`
      console.log("📧 Reset URL:", resetUrl) // Debugging
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">
              Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
          </div>
          `
        }
  
      const info = await transporter.sendMail(mailOptions)
      console.log("✅ Email sent:", info.response) // Debugging
  
      res.json({ message: "Reset link sent to your email" })
    } catch (error) {
      console.error("❌ Server error:", error) // Debugging
      res.status(500).json({ message: "Server error", error: error.message })
    }
  })
  
// Step 2: Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params
    const { newPassword } = req.body

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long" 
      })
    }

    // Verify token with error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (tokenError) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    // Find driver with proper query
    const driver = await Driver.findById(decoded.id).exec()
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" })
    }

    // Verify token matches saved token and not expired
    if (driver.resetPasswordToken !== token || driver.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset token" })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12)  // Increased salt rounds for better security
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update driver password
    driver.password = hashedPassword
    driver.resetPasswordToken = undefined
    driver.resetPasswordExpires = undefined

    // Save with error handling
    try {
      await driver.save()
      res.json({ message: "Password reset successful" })
    } catch (saveError) {
      return handleError(res, saveError, "Failed to update password")
    }
  } catch (error) {
    handleError(res, error)
  }
})

module.exports = router