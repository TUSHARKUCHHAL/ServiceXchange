const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorAge: { type: Number, required: true, min: 18 },
  donorEmail: { type: String, required: true },
  donorPhone: { type: String, required: true },
  bloodGroup: { type: String, required: true, enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
  address: { type: String, required: true },
  hasDonatedBefore: { type: String, enum: ["yes", "no"], required: true },
  lastDonationDate: { type: Date },
  medicalConditions: { type: String },
  medications: { type: String },
  requestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "BloodRequest", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "rejected"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donor", DonorSchema);