const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const router = express.Router();
const sendOtpEmail = require("../models/sendOTP");
const { OAuth2Client } = require("google-auth-library")
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(GOOGLE_CLIENT_ID)

// Register User
router.post("/register", async (req, res) => {
    try {
        console.log("Received Data:", req.body); // Debugging: See what data is received

        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            firstName, 
            lastName, 
            email, 
            password: hashedPassword // Save the hashed password
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


  // 📌 Google Auth Route
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body
    const ticket = await client.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID })
    const { sub: googleId, name, email, picture } = ticket.getPayload()

    let user = await User.findOne({ email })
    if (!user) {
      user = new User({
        name,
        email,
        phone_number: "",
        googleId,
        password: "",
        gender: "",
        dob: "",
        profile_picture_url: picture,
        is_verified: true,
      })
      await user.save()
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    res.json({ message: "Logged in successfully", token: jwtToken })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Google login failed" })
  }
})

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate OTP function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Route to send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP" });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Implement your sendEmail function to send OTP via email
    console.log(`OTP for ${email}: ${otp}`);
    res.json({ otp });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.otp = null; // Clear OTP after verification
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// 📌 Profile Route
router.get("/profile", verifyToken, async (req, res) => {
  try {
    console.log("Decoded User in Profile Route:", req.user) 
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ error: "User not found" })
    res.json({ user: user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
}

// 📌 Logout Route
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" }) 
})

module.exports = router;