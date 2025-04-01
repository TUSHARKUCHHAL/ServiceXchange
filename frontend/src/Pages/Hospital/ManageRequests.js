import React, { useState, useEffect } from 'react';
import './ManageRequests.css';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donors, setDonors] = useState([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch all blood requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/blood/requests`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response not OK:', response.status, errorText);
          throw new Error(`Failed to fetch requests: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter active requests - pending, confirmed, or fulfilled but within 24 hours
        const activeRequests = data.filter(req => {
          // Include pending requests
          if (req.status === 'pending') return true;
          
          // Include confirmed requests
          if (req.status === 'confirmed') {
            // Check if it's been less than 24 hours since confirmation
            const confirmDate = new Date(req.confirmationDate || req.updatedAt);
            const now = new Date();
            const hoursDifference = (now - confirmDate) / (1000 * 60 * 60);
            return true; // Always show confirmed requests (visibility handled in UI)
          }
          
          // Include fulfilled requests that are less than 24 hours old
          if (req.status === 'fulfilled') {
            const fulfilledDate = new Date(req.fulfilledDate || req.updatedAt);
            const now = new Date();
            const hoursDifference = (now - fulfilledDate) / (1000 * 60 * 60);
            return hoursDifference <= 24;
          }
          
          return false;
        });
        
        setRequests(activeRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    // Refresh data every minute
    const interval = setInterval(fetchRequests, 60000);
    return () => clearInterval(interval);
  }, [API_BASE_URL]);

  // Add this function to check if more donors can be confirmed
  const canConfirmMoreDonors = (request, donors) => {
    if (!request || request.status === 'fulfilled') return false;
    
    // Count already confirmed donors
    const confirmedDonors = donors.filter(donor => donor.status === 'confirmed').length;
    
    // Check if we've reached the required number of units
    return confirmedDonors < request.unitsRequired;
  };

  // Handle request click
  const handleRequestClick = async (request) => {
    setSelectedRequest(request);
    setOtpSent(false);
    setOtp('');
    setVerificationError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/donors/by-request/${request._id}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', response.status, errorText);
        throw new Error(`Failed to fetch donors: ${response.status}`);
      }
      
      const donorData = await response.json();
      setDonors(donorData);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  // Send OTP to request creator
  const handleSendOTP = async () => {
    if (!selectedRequest) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/verification/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: selectedRequest.requestorEmail,
          requestId: selectedRequest._id
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', response.status, errorText);
        throw new Error(`Failed to send OTP: ${response.status}`);
      }
      
      setOtpSent(true);
      setSuccessMessage('OTP sent to your email. Please verify to confirm a donor.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setVerificationError('Failed to send OTP. Please try again.');
      setTimeout(() => setVerificationError(''), 5000);
    }
  };

  // Verify OTP and confirm donor
  const handleConfirmDonor = async (donorId) => {
    if (!selectedRequest || !otp) {
      setVerificationError('Please enter the OTP sent to your email');
      return;
    }
    
    // Check if we can confirm more donors
    if (!canConfirmMoreDonors(selectedRequest, donors)) {
      setVerificationError(`All ${selectedRequest.unitsRequired} required units have already been confirmed`);
      setTimeout(() => setVerificationError(''), 5000);
      return;
    }
    
    try {
      // First verify OTP
      const verifyResponse = await fetch(`${API_BASE_URL}/api/verification/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: selectedRequest.requestorEmail,
          requestId: selectedRequest._id,
          otp: otp
        }),
      });
      
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => 
          ({ message: `Invalid OTP: ${verifyResponse.status}` })
        );
        throw new Error(errorData.message || 'Invalid OTP');
      }
      
      // If OTP verified, confirm donor
      const confirmResponse = await fetch(`${API_BASE_URL}/api/donors/${donorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'confirmed'
        }),
      });
      
      if (!confirmResponse.ok) {
        const errorText = await confirmResponse.text();
        console.error('Response not OK:', confirmResponse.status, errorText);
        throw new Error(`Failed to confirm donor: ${confirmResponse.status}`);
      }
      
      // The backend now handles status changes automatically
      // No need to update the request status manually
      
      // Update UI status if this is the first confirmed donor
      if (selectedRequest.status === 'pending') {
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req._id === selectedRequest._id 
              ? { ...req, status: 'confirmed', confirmationDate: new Date() } 
              : req
          )
        );
        
        setSelectedRequest(prev => ({ 
          ...prev, 
          status: 'confirmed',
          confirmationDate: new Date()
        }));
      }
      
      setSuccessMessage('Donor confirmed successfully!');
      setOtpSent(false);
      setOtp('');
      
      // Refresh donors list
      const donorsResponse = await fetch(`${API_BASE_URL}/api/donors/by-request/${selectedRequest._id}`);
      if (donorsResponse.ok) {
        const donorData = await donorsResponse.json();
        setDonors(donorData);
      }
    } catch (error) {
      console.error('Error confirming donor:', error);
      setVerificationError(error.message || 'Failed to confirm donor. Please try again.');
      setTimeout(() => setVerificationError(''), 5000);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get time remaining for requests
  const getTimeRemaining = (request) => {
    let baseDate, statusText;
    
    if (request.status === 'confirmed') {
      baseDate = new Date(request.confirmationDate || request.updatedAt);
      statusText = 'confirmation';
    } else if (request.status === 'fulfilled') {
      baseDate = new Date(request.fulfilledDate || request.updatedAt);
      statusText = 'fulfillment';
    } else {
      return '';
    }
    
    const expiryDate = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (now > expiryDate) {
      return `Past 24h ${statusText} window`;
    }
    
    const hoursRemaining = Math.floor((expiryDate - now) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor(((expiryDate - now) % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursRemaining}h ${minutesRemaining}m remaining`;
  };

  // Check if new donors can register
  const canRegisterNewDonors = (request) => {
    if (request.status === 'pending') return true;
    
    if (request.status === 'confirmed') {
      const confirmDate = new Date(request.confirmationDate || request.updatedAt);
      const now = new Date();
      const hoursDifference = (now - confirmDate) / (1000 * 60 * 60);
      return hoursDifference <= 24;
    }
    
    return false;
  };

  // Urgency class for styling
  const getUrgencyClass = (urgency) => {
    switch(urgency) {
      case 'critical': return 'urgency-critical';
      case 'urgent': return 'urgency-urgent';
      default: return 'urgency-normal';
    }
  };

  // Status class for styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'confirmed': return 'status-confirmed';
      case 'fulfilled': return 'status-fulfilled';
      case 'rejected': return 'status-rejected';
      case 'archived': return 'status-archived';
      default: return 'status-pending';
    }
  };

  return (
    <div className="manage-requests-container">
      <h1>Manage Blood Requests</h1>
      
      <div className="requests-panel">
        {loading ? (
          <div className="loading-spinner">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="no-requests">No active blood requests found</div>
        ) : (
          <div className="requests-list">
            <h2>Active Requests</h2>
            <ul>
              {requests.map(request => (
                <li 
                  key={request._id}
                  className={`request-item ${selectedRequest && selectedRequest._id === request._id ? 'selected' : ''}`}
                  onClick={() => handleRequestClick(request)}
                >
                  <div className="request-header">
                    <span className={`blood-group ${request.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
                      {request.bloodGroup}
                    </span>
                    <span className={`urgency-badge ${getUrgencyClass(request.urgency)}`}>
                      {request.urgency}
                    </span>
                  </div>
                  
                  <div className="request-details">
                    <h3>{request.patientName}</h3>
                    <p>{request.hospitalName}</p>
                    <p>Units: {request.unitsRequired}</p>
                    <div className="request-meta">
                      <span className={`status-badge ${getStatusClass(request.status)}`}>
                        {request.status}
                      </span>
                      {(request.status === 'confirmed' || request.status === 'fulfilled') && (
                        <span className="time-remaining">
                          {getTimeRemaining(request)}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="detail-panel">
        {selectedRequest ? (
          <div className="request-detail">
            <h2>Request Details</h2>
            <div className="request-detail-content">
              <div className="detail-row">
                <strong>Patient:</strong> {selectedRequest.patientName}, {selectedRequest.patientAge} years
              </div>
              <div className="detail-row">
                <strong>Blood Group:</strong> {selectedRequest.bloodGroup}
              </div>
              <div className="detail-row">
                <strong>Hospital:</strong> {selectedRequest.hospitalName}
              </div>
              <div className="detail-row">
                <strong>Location:</strong> {selectedRequest.location}
              </div>
              <div className="detail-row">
                <strong>Units Required:</strong> {selectedRequest.unitsRequired}
              </div>
              <div className="detail-row">
                <strong>Urgency:</strong> 
                <span className={`urgency-badge ${getUrgencyClass(selectedRequest.urgency)}`}>
                  {selectedRequest.urgency}
                </span>
              </div>
              <div className="detail-row">
                <strong>Status:</strong> 
                <span className={`status-badge ${getStatusClass(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
                {(selectedRequest.status === 'confirmed' || selectedRequest.status === 'fulfilled') && (
                  <span className="time-info"> ({getTimeRemaining(selectedRequest)})</span>
                )}
              </div>
              <div className="detail-row">
                <strong>Posted:</strong> {formatDate(selectedRequest.createdAt)}
              </div>
              {selectedRequest.confirmationDate && (
                <div className="detail-row">
                  <strong>First Confirmed:</strong> {formatDate(selectedRequest.confirmationDate)}
                </div>
              )}
              {selectedRequest.fulfilledDate && (
                <div className="detail-row">
                  <strong>Fulfilled:</strong> {formatDate(selectedRequest.fulfilledDate)}
                </div>
              )}
              <div className="detail-row">
                <strong>Reason:</strong> {selectedRequest.reason}
              </div>
              <div className="detail-row">
                <strong>Requestor:</strong> {selectedRequest.requestorName} ({selectedRequest.relationToPatient})
              </div>
              <div className="detail-row">
                <strong>Contact:</strong> {selectedRequest.requestorPhone}, {selectedRequest.requestorEmail}
              </div>
            </div>
            
            <div className="donors-section">
              <h3>
                Available Donors
                {!canRegisterNewDonors(selectedRequest) && (
                  <span className="registration-closed">
                    (New registrations closed)
                  </span>
                )}
              </h3>
              
              {/* Add this progress indicator */}
              <div className="donor-progress">
                <strong>Units Confirmed:</strong> {donors.filter(d => d.status === 'confirmed').length} of {selectedRequest.unitsRequired} required
              </div>
              
              {donors.length === 0 ? (
                <p className="no-donors">No donors available for this request yet</p>
              ) : (
                <>
                  {/* Conditional rendering based on confirmation limits */}
                  {!otpSent && 
                   (selectedRequest.status === 'pending' || selectedRequest.status === 'confirmed') && 
                   canRegisterNewDonors(selectedRequest) && 
                   canConfirmMoreDonors(selectedRequest, donors) ? (
                    <div className="verification-section">
                      <p>To confirm a donor, you need to verify your identity as the requestor.</p>
                      <button onClick={handleSendOTP} className="otp-button">
                        Send OTP to Email
                      </button>
                    </div>
                  ) : (
                    !otpSent && 
                    (selectedRequest.status === 'pending' || selectedRequest.status === 'confirmed') && 
                    canRegisterNewDonors(selectedRequest) && 
                    !canConfirmMoreDonors(selectedRequest, donors) && (
                      <div className="limit-reached-section">
                        <p className="limit-message">All {selectedRequest.unitsRequired} required units have been confirmed.</p>
                        <p className="limit-info">No more donors can be confirmed for this request.</p>
                      </div>
                    )
                  )}
                  
                  {otpSent && 
                   (selectedRequest.status === 'pending' || selectedRequest.status === 'confirmed') && 
                   canRegisterNewDonors(selectedRequest) && (
                    <div className="otp-section">
                      <p>Please enter the OTP sent to {selectedRequest.requestorEmail}</p>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="otp-input"
                      />
                    </div>
                  )}
                  
                  {verificationError && (
                    <div className="error-message">{verificationError}</div>
                  )}
                  
                  {successMessage && (
                    <div className="success-message">{successMessage}</div>
                  )}
                  
                  <ul className="donors-list">
                    {donors.map(donor => (
                      <li key={donor._id} className={`donor-item ${donor.status}`}>
                        <div className="donor-info">
                          <h4>{donor.donorName}, {donor.donorAge}</h4>
                          <p>Blood Group: {donor.bloodGroup}</p>
                          <p>Phone: {donor.donorPhone}</p>
                          <p>Previous Donations: {donor.hasDonatedBefore}</p>
                          {donor.hasDonatedBefore === 'yes' && donor.lastDonationDate && (
                            <p>Last Donation: {new Date(donor.lastDonationDate).toLocaleDateString()}</p>
                          )}
                          <p>Status: <span className={`donor-status ${donor.status}`}>{donor.status}</span></p>
                        </div>
                        
                        {otpSent && 
                         (selectedRequest.status === 'pending' || selectedRequest.status === 'confirmed') && 
                         donor.status === 'pending' &&
                         canRegisterNewDonors(selectedRequest) && (
                          <button 
                            onClick={() => handleConfirmDonor(donor._id)} 
                            className="confirm-button"
                            disabled={!otp}
                          >
                            Confirm This Donor
                          </button>
                        )}
                        
                        {donor.status === 'confirmed' && (
                          <div className="confirmed-badge">
                            ✓ Confirmed
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="no-selection">
            <h2>Request Management</h2>
            <p>Select a blood request from the list to see details and manage donors.</p>
            <div className="instructions">
              <h3>Request Lifecycle:</h3>
              <ul>
                <li><strong>Pending:</strong> Initial state, waiting for donors</li>
                <li><strong>Confirmed:</strong> At least one donor confirmed, remains active for 24 hours</li>
                <li><strong>Fulfilled:</strong> 24 hours after first confirmation, visible in management for another 24 hours</li>
                <li><strong>Archived:</strong> No longer visible in UI, but retained in database</li>
              </ul>
              <h3>Instructions:</h3>
              <ul>
                <li>Click on any request to view details</li>
                <li>Only the original requestor can confirm donors</li>
                <li>Verification via OTP is required to confirm donors</li>
                <li>New donor registrations close 24 hours after first confirmation</li>
                <li>Urgent and critical requests are highlighted</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;