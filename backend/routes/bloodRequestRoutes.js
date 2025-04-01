const express = require("express");
const BloodRequest = require("../models/BloodRequests");

const router = express.Router();

// 📌 Create a new blood request
router.post("/request", async (req, res) => {
  try {
    const newRequest = new BloodRequest(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json({ message: "Blood request submitted successfully", data: savedRequest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📌 Get all blood requests
router.get("/requests", async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get a single blood request by ID
router.get("/request/:id", async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Update blood request status
// Add this to your router.put("/request/:id") endpoint to prevent confirming more donors than needed
router.put("/request/:id", async (req, res) => {
  try {
    // First check if we're trying to confirm a request
    if (req.body.status === "confirmed") {
      // Get the current request
      const currentRequest = await BloodRequest.findById(req.params.id);
      if (!currentRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      // Get current confirmed donor count for this request
      const confirmedDonorCount = await Donor.countDocuments({
        requestId: req.params.id,
        status: "confirmed"
      });
      
      // Check if adding another donor would exceed the required units
      if (confirmedDonorCount >= currentRequest.unitsRequired) {
        return res.status(400).json({ 
          message: "Cannot confirm more donors than the required blood units",
          currentConfirmed: confirmedDonorCount,
          requiredUnits: currentRequest.unitsRequired
        });
      }
    }

    // If check passes or we're not confirming, proceed with the update
    const updatedRequest = await BloodRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRequest) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Request updated successfully", data: updatedRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Delete a blood request
router.delete("/request/:id", async (req, res) => {
  try {
    const deletedRequest = await BloodRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
