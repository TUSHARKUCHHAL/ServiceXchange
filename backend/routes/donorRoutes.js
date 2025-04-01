const express = require("express");
const Donor = require("../models/Donor");
const BloodRequest = require("../models/BloodRequests");
const nodemailer = require("nodemailer");
const router = express.Router();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like SendGrid, AWS SES, etc.
  auth: {
    user: process.env.EMAIL_USER, // store these in environment variables
    pass: process.env.EMAIL_PASS
  }
});

// Register a new donor
router.post("/register", async (req, res) => {
    try {
      // First check if the blood request exists
      const bloodRequest = await BloodRequest.findById(req.body.requestId);
      if (!bloodRequest) {
        return res.status(404).json({ error: "Blood request not found" });
      }
      
      // Check if this would exceed the required units
      if (req.body.status === "confirmed" || req.body.status === undefined) {
        // Get current confirmed donor count
        const confirmedDonorCount = await Donor.countDocuments({
          requestId: req.body.requestId,
          status: "confirmed"
        });
        
        // Check if adding one more would exceed the limit
        if (confirmedDonorCount >= bloodRequest.unitsRequired) {
          return res.status(400).json({ 
            error: "This blood request already has all required donors confirmed",
            currentConfirmed: confirmedDonorCount,
            requiredUnits: bloodRequest.unitsRequired
          });
        }
      }
    
    // Check if the request is in confirmed or fulfilled state and prevent new donors
    if (bloodRequest.status === "confirmed" || bloodRequest.status === "fulfilled") {
      const confirmationDate = new Date(bloodRequest.confirmationDate || bloodRequest.updatedAt);
      const now = new Date();
      const hoursSinceConfirmation = (now - confirmationDate) / (1000 * 60 * 60);
      
      // If already confirmed and it's been more than 24 hours
      if (hoursSinceConfirmation > 24) {
        return res.status(400).json({ 
          error: "This blood request is no longer accepting new donors"
        });
      }
    }

    // Create a new donor
    const newDonor = new Donor(req.body);
    const savedDonor = await newDonor.save();

    // If this is the first confirmed donor, update the blood request status
    if (savedDonor.status === "confirmed" && bloodRequest.status === "pending") {
      bloodRequest.status = "confirmed";
      bloodRequest.confirmationDate = new Date(); // Track when it was first confirmed
      bloodRequest.confirmedDonorCount = 1;
      await bloodRequest.save();
    } 
    // If request is already confirmed, just increment the donor count
    else if (savedDonor.status === "confirmed") {
      bloodRequest.confirmedDonorCount = (bloodRequest.confirmedDonorCount || 0) + 1;
      await bloodRequest.save();
    }

    const totalDonorsForRequest = await Donor.countDocuments({
        requestId: req.body.requestId,
        status: { $in: ["confirmed", "pending"] }
      });

    // Send email notification to requester
    try {
      // Compose email content
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: bloodRequest.requestorEmail, // Updated to match your schema
        subject: "Good News! A Donor Has Been Found For Your Blood Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
            <h2 style="color: #d9534f; text-align: center;">Blood Donor Found!</h2>
            <p>Dear ${bloodRequest.requestorName},</p>
            <p>We're pleased to inform you that a donor has registered to help with your blood request for <strong>${bloodRequest.patientName}</strong>.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #333;">Donor Details:</h3>
              <p><strong>Name:</strong> ${savedDonor.donorName}</p>
              <p><strong>Blood Group:</strong> ${savedDonor.bloodGroup}</p>
              <p><strong>Contact:</strong> ${savedDonor.donorPhone}</p>
              <p><strong>Email:</strong> ${savedDonor.donorEmail}</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #333;">Your Request Details:</h3>
              <p><strong>Patient:</strong> ${bloodRequest.patientName}, ${bloodRequest.patientAge} years</p>
              <p><strong>Blood Group:</strong> ${bloodRequest.bloodGroup}</p>
              <p><strong>Hospital:</strong> ${bloodRequest.hospitalName}</p>
              <p><strong>Units Required:</strong> ${bloodRequest.unitsRequired}</p>
               <p><strong>Available Units:</strong> ${totalDonorsForRequest}</p>
               <p><strong>Units Confirmed:</strong> ${bloodRequest.confirmedDonorCount || 0}</p>
            </div>
            
            <p>The hospital staff will coordinate with the donor. If you have any questions, please contact us or the hospital directly.</p>
            
            <p style="text-align: center; margin-top: 30px; color: #777;">This is an automated message, please do not reply to this email.</p>
          </div>
        `
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log("Donor notification email sent successfully");
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // We don't want to fail the whole request if just the email fails
      // But we log the error for monitoring
    }

    res.status(201).json({ 
      message: "Donor registration successful",
      data: savedDonor
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all donors for a specific blood request
router.get("/by-request/:requestId", async (req, res) => {
  try {
    const donors = await Donor.find({ requestId: req.params.requestId }).sort({ createdAt: -1 });
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific donor
router.get("/:id", async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update donor status
router.put("/:id", async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const previousStatus = donor.status;
    const updatedDonor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Get the associated blood request
    const bloodRequest = await BloodRequest.findById(donor.requestId);
    if (!bloodRequest) {
      return res.status(404).json({ message: "Associated blood request not found" });
    }

    // Handle status updates
    if (req.body.status === "confirmed" && previousStatus !== "confirmed") {
      // First confirmed donor, update request status
      if (bloodRequest.status === "pending") {
        bloodRequest.status = "confirmed";
        bloodRequest.confirmationDate = new Date();
        bloodRequest.confirmedDonorCount = 1;
      } 
      // Additional confirmed donor
      else {
        bloodRequest.confirmedDonorCount = (bloodRequest.confirmedDonorCount || 0) + 1;
      }
      await bloodRequest.save();
      
      // Send email notification when donor status is confirmed
      try {
        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: bloodRequest.requestorEmail, // Updated to match your schema
          subject: "Donor Confirmed for Your Blood Request",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
              <h2 style="color: #28a745; text-align: center;">Donor Confirmed!</h2>
              <p>Dear ${bloodRequest.requestorName},</p>
              <p>We're pleased to inform you that a donor has been <strong>confirmed</strong> for your blood request.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h3 style="margin-top: 0; color: #333;">Donor Details:</h3>
                <p><strong>Name:</strong> ${updatedDonor.donorName}</p>
                <p><strong>Blood Group:</strong> ${updatedDonor.bloodGroup}</p>
                <p><strong>Contact:</strong> ${updatedDonor.donorPhone}</p>
                <p><strong>Units Required:</strong> ${bloodRequest.unitsRequired}</p>
              <p><strong>Units Confirmed:</strong> ${bloodRequest.confirmedDonorCount || 0}</p>
              </div>
              
              <p>The donation has been scheduled. You'll be updated once the donation is complete.</p>
              
              <p style="text-align: center; margin-top: 30px; color: #777;">This is an automated message, please do not reply to this email.</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log("Donor confirmation email sent successfully");
      } catch (emailError) {
        console.error("Failed to send donor confirmation email:", emailError);
      }
    }
    // If the status was "confirmed" but now is not, decrement the count
    else if (previousStatus === "confirmed" && req.body.status !== "confirmed") {
      if (bloodRequest.confirmedDonorCount > 0) {
        bloodRequest.confirmedDonorCount -= 1;
        
        // If no more confirmed donors, revert to pending (only if still in confirmed state)
        if (bloodRequest.confirmedDonorCount === 0 && bloodRequest.status === "confirmed") {
          bloodRequest.status = "pending";
          bloodRequest.confirmationDate = null;
        }
        
        await bloodRequest.save();
      }
    }

    res.status(200).json({ 
      message: "Donor updated successfully", 
      data: updatedDonor 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a donor
router.delete("/:id", async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // If the donor status was "confirmed", decrement the confirmed count
    if (donor.status === "confirmed") {
      const bloodRequest = await BloodRequest.findById(donor.requestId);
      if (bloodRequest && bloodRequest.confirmedDonorCount > 0) {
        bloodRequest.confirmedDonorCount -= 1;
        
        // If no more confirmed donors, revert to pending (only if still in confirmed state)
        if (bloodRequest.confirmedDonorCount === 0 && bloodRequest.status === "confirmed") {
          bloodRequest.status = "pending";
          bloodRequest.confirmationDate = null;
        }
        
        await bloodRequest.save();
      }
    }

    await Donor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Donor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;