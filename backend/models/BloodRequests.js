const mongoose = require("mongoose");
const bloodRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },
    patientAge: {
      type: Number,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    unitsRequired: {
      type: Number,
      required: true,
      min: 1,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      required: true,
      enum: ["normal", "urgent", "critical"],
    },
    reason: {
      type: String,
      required: true,
    },
    requestorName: {
      type: String,
      required: true,
    },
    relationToPatient: {
      type: String,
      required: true,
    },
    requestorPhone: {
      type: String,
      required: true,
    },
    requestorEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "fulfilled", "rejected", "archived"],
      default: "pending",
    },
    confirmedDonorCount: {
      type: Number,
      default: 0,
    },
    // Fields to track the status lifecycle
    confirmationDate: {
      type: Date,
      default: null,
    },
    fulfilledDate: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);