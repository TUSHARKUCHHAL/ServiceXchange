// Create a new file: services/requestStatusService.js

const BloodRequest = require("../models/BloodRequests");

/**
 * Updates the status of blood requests based on time criteria:
 * 1. Confirmed requests -> Fulfilled after 24 hours
 * 2. Fulfilled requests -> Archived after another 24 hours (optional flag)
 */
async function updateRequestStatuses() {
  try {
    const now = new Date();
    
    // Find confirmed requests that are older than 24 hours
    const confirmedRequests = await BloodRequest.find({
      status: "confirmed",
      confirmationDate: { $lt: new Date(now - 24 * 60 * 60 * 1000) }
    });
    
    // Update these to fulfilled
    for (const request of confirmedRequests) {
      request.status = "fulfilled";
      request.fulfilledDate = now;
      await request.save();
      console.log(`Request ${request._id} moved from confirmed to fulfilled`);
    }
    
    // If you want to completely archive (hide from UI) requests after another 24 hours
    // Find fulfilled requests that are older than 24 hours
    const fulfilledRequests = await BloodRequest.find({
      status: "fulfilled",
      fulfilledDate: { $lt: new Date(now - 24 * 60 * 60 * 1000) }
    });
    
    // Update these to archived
    for (const request of fulfilledRequests) {
      request.status = "archived";
      await request.save();
      console.log(`Request ${request._id} moved from fulfilled to archived`);
    }
    
    console.log(`Status update completed: ${confirmedRequests.length} requests fulfilled, ${fulfilledRequests.length} requests archived`);
  } catch (error) {
    console.error("Error updating request statuses:", error);
  }
}

// Schedule this to run periodically (e.g., every hour)
function startStatusUpdateScheduler() {
  const ONE_HOUR = 60 * 60 * 1000;
  setInterval(updateRequestStatuses, ONE_HOUR);
  console.log("Request status update scheduler started");
  
  // Also run immediately on startup
  updateRequestStatuses();
}

module.exports = {
  updateRequestStatuses,
  startStatusUpdateScheduler
};