const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, expires: "10m", default: Date.now }, // Auto-delete after 10 mins
});

module.exports = mongoose.model("OTP", OTPSchema);
