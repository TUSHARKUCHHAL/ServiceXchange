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
  const [sendingOtp, setSendingOtp] = useState(false);

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
          if (req.status === 'confirmed') return true;
          
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

  // Check if more donors can be confirmed
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
      setSendingOtp(true); // Show the loader when starting to send OTP
      
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
    } finally {
      setSendingOtp(false); // Hide the loader when done, regardless of success or failure
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

  // Return donor progress percentage
  const getDonorProgressPercentage = (request, donors) => {
    if (!request || !donors.length) return 0;
    const confirmedDonors = donors.filter(d => d.status === 'confirmed').length;
    return Math.min(100, Math.round((confirmedDonors / request.unitsRequired) * 100));
  };

  return (
    <div className="manage-requests-container">
      <div className="dashboard-header">
        <h1>Blood Request Management</h1>
      </div>
      
      <div className="dashboard-content">
        <div className="requests-panel">
          <div className="panel-header">
            <h2>Active Requests</h2>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><i className="fas fa-clipboard-list"></i></div>
              <h3>No Active Requests</h3>
              <p>There are no blood requests available at the moment.</p>
            </div>
          ) : (
            <div className="requests-list">
              {requests.map(request => (
                <div 
                  key={request._id}
                  className={`request-card ${selectedRequest && selectedRequest._id === request._id ? 'selected' : ''}`}
                  onClick={() => handleRequestClick(request)}
                >
                  <div className="request-header">
                    <span className={`blood-type ${request.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
                      {request.bloodGroup}
                    </span>
                    <span className={`urgency-label ${request.urgency}`}>
                      {request.urgency}
                    </span>
                  </div>
                  
                  <h3 className="patient-name">{request.patientName}</h3>
                  <p className="hospital-name">{request.hospitalName}</p>
                  <p className="units-required">Units needed: {request.unitsRequired}</p>
                  
                  <div className="request-footer">
                    <span className={`status-label ${request.status}`}>
                      {request.status}
                    </span>
                    {(request.status === 'confirmed' || request.status === 'fulfilled') && (
                      <span className="time-indicator">
                        {getTimeRemaining(request)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="detail-panel">
          {selectedRequest ? (
            <div className="request-details">
              <div className="detail-header">
                <h2>Request Details</h2>
                <span className={`status-badge large ${selectedRequest.status}`}>
                  {selectedRequest.status}
                </span>
              </div>
              
              <div className="detail-content">
                <div className="detail-section patient-info">
                  <h3>Patient Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Name</span>
                      <span className="value">{selectedRequest.patientName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Age</span>
                      <span className="value">{selectedRequest.patientAge} years</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Blood Group</span>
                      <span className={`value blood-type ${selectedRequest.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
                        {selectedRequest.bloodGroup}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Hospital</span>
                      <span className="value">{selectedRequest.hospitalName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Location</span>
                      <span className="value">{selectedRequest.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Units Required</span>
                      <span className="value">{selectedRequest.unitsRequired}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Urgency</span>
                      <span className={`value urgency-label ${selectedRequest.urgency}`}>
                        {selectedRequest.urgency}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Reason</span>
                      <span className="value reason-text">{selectedRequest.reason}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section requestor-info">
                  <h3>Requestor Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Name</span>
                      <span className="value">{selectedRequest.requestorName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Relation</span>
                      <span className="value">{selectedRequest.relationToPatient}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Phone</span>
                      <span className="value">{selectedRequest.requestorPhone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Email</span>
                      <span className="value">{selectedRequest.requestorEmail}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section timeline-info">
                  <h3>Timeline</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Created</span>
                      <span className="value">{formatDate(selectedRequest.createdAt)}</span>
                    </div>
                    {selectedRequest.confirmationDate && (
                      <div className="detail-item">
                        <span className="label">First Confirmation</span>
                        <span className="value">{formatDate(selectedRequest.confirmationDate)}</span>
                      </div>
                    )}
                    {selectedRequest.fulfilledDate && (
                      <div className="detail-item">
                        <span className="label">Fulfilled</span>
                        <span className="value">{formatDate(selectedRequest.fulfilledDate)}</span>
                      </div>
                    )}
                    {(selectedRequest.status === 'confirmed' || selectedRequest.status === 'fulfilled') && (
                      <div className="detail-item">
                        <span className="label">Time Remaining</span>
                        <span className="value time-indicator">{getTimeRemaining(selectedRequest)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="detail-section donors-section">
                  <div className="donors-header">
                    <h3>Donors</h3>
                    {!canRegisterNewDonors(selectedRequest) && (
                      <span className="registration-closed-badge">
                        New registrations closed
                      </span>
                    )}
                  </div>
                  
                  <div className="donor-progress-container">
                    <div className="progress-text">
                      <span>{donors.filter(d => d.status === 'confirmed').length} of {selectedRequest.unitsRequired} units confirmed</span>
                      <span>{getDonorProgressPercentage(selectedRequest, donors)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${getDonorProgressPercentage(selectedRequest, donors)}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  {donors.length === 0 ? (
                    <div className="empty-state small">
                      <div className="empty-icon"><i className="fas fa-user"></i></div>
                      <h4>No Donors Available</h4>
                      <p>No donors have registered for this request yet.</p>
                    </div>
                  ) : (
                    <>
                      {!otpSent && 
                       (selectedRequest.status === 'pending' || selectedRequest.status === 'confirmed') && 
                       canRegisterNewDonors(selectedRequest) && 
                       canConfirmMoreDonors(selectedRequest, donors) ? (
                        <div className="verification-section">
                          <p>To confirm a donor, please verify your identity as the requestor</p>
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
                            <div className="success-icon"><i className="fas fa-check"></i></div>
                            <p>All {selectedRequest.unitsRequired} required units have been confirmed.</p>
                          </div>
                        )
                      )}
                      
                      {otpSent && 
                       (selectedRequest.status === 'pending' || selectedRequest.status === 'confirmed') && 
                       canRegisterNewDonors(selectedRequest) && (
                        <div className="otp-section">
                          <p>Enter the verification code sent to {selectedRequest.requestorEmail}</p>
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="otp-input"
                            maxLength="6"
                          />
                        </div>
                      )}
                      
                      {verificationError && (
                        <div className="message error">{verificationError}</div>
                      )}
                      
                      {successMessage && (
                        <div className="message success">{successMessage}</div>
                      )}
                      
                      <div className="donors-grid">
                        {donors.map(donor => (
                          <div key={donor._id} className={`donor-card ${donor.status}`}>
                            <div className="donor-info">
                              <h4>{donor.donorName}</h4>
                              <div className="donor-meta">
                                <span className="donor-age">{donor.donorAge} years</span>
                                <span className={`donor-blood ${donor.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
                                  {donor.bloodGroup}
                                </span>
                              </div>
                              
                              <div className="donor-details">
                                <div className="donor-detail">
                                  <span className="detail-icon"><i className="fas fa-mobile-alt"></i></span>
                                  <span>{donor.donorPhone}</span>
                                </div>
                                <div className="donor-detail">
                                  <span className="detail-icon"><i className="fas fa-syringe"></i></span>
                                  <span>Previous donations: {donor.hasDonatedBefore}</span>
                                </div>
                                {donor.hasDonatedBefore === 'yes' && donor.lastDonationDate && (
                                  <div className="donor-detail">
                                    <span className="detail-icon"><i className="fas fa-calendar-alt"></i></span>
                                    <span>Last donation: {new Date(donor.lastDonationDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="donor-status-bar">
                                <span className={`donor-status-indicator ${donor.status}`}>
                                  {donor.status}
                                </span>
                              </div>
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
                                Confirm Donor
                              </button>
                            )}
                            
                            {donor.status === 'confirmed' && (
                              <div className="donor-confirmed-badge">
                                <span className="check-icon"><i className="fas fa-check"></i></span> Confirmed
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="welcome-screen">
              <div className="welcome-icon"><i className="fas fa-tint"></i></div>
              <h2>Blood Request Management</h2>
              <p>Select a request from the list to view details and manage donors.</p>
              
              <div className="info-cards">
                <div className="info-card">
                  <h3>Request Lifecycle</h3>
                  <ul>
                    <li><strong>Pending:</strong> Initial state, awaiting donor confirmation</li>
                    <li><strong>Confirmed:</strong> At least one donor confirmed, active for 24 hours</li>
                    <li><strong>Fulfilled:</strong> Visible for 24 hours after fulfillment</li>
                  </ul>
                </div>
                
                <div className="info-card">
                  <h3>Quick Instructions</h3>
                  <ul>
                    <li>Click any request to see its full details</li>
                    <li>Only the original requestor can confirm donors</li>
                    <li>Email verification is required to confirm donors</li>
                    <li>Donor registration closes 24 hours after first confirmation</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRequests;