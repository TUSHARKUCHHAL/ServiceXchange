import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./DonorPage.css";

const DonorPage = () => {
  const navigate = useNavigate();
  const [bloodRequests, setBloodRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [formData, setFormData] = useState({
    donorName: "",
    donorAge: "",
    donorEmail: "",
    donorPhone: "",
    bloodGroup: "",
    address: "",
    hasDonatedBefore: "",
    lastDonationDate: "",
    medicalConditions: "",
    medications: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    location: "",
    urgency: "",
    bloodGroup: "",
    dateFrom: "",
    dateTo: ""
  });
  const [locations, setLocations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // API base URL - consider moving this to environment variable
  const API_BASE_URL = "http://localhost:5000/api";

  // Memoize applyFilters function to prevent unnecessary rerenders
  const applyFilters = useCallback(() => {
    let result = [...bloodRequests];
    
    // Filter by location
    if (filters.location) {
      result = result.filter(request => request.location === filters.location);
    }
    
    // Filter by urgency
    if (filters.urgency) {
      result = result.filter(request => request.urgency === filters.urgency);
    }
    
    // Filter by blood group - new filter
    if (filters.bloodGroup) {
      result = result.filter(request => request.bloodGroup === filters.bloodGroup);
    }
    
    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(request => new Date(request.createdAt) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set time to end of day for inclusive filtering
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(request => new Date(request.createdAt) <= toDate);
    }
    
    setFilteredRequests(result);
  }, [bloodRequests, filters]);

  const fetchBloodRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blood/requests`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blood requests: ${response.status}`);
      }
      
      const data = await response.json();
      setBloodRequests(data);
      setFilteredRequests(data);
      
      // Extract unique locations for the filter dropdown
      const uniqueLocations = [...new Set(data.map(request => request.location))];
      setLocations(uniqueLocations);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blood requests:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  useEffect(() => {
    if (bloodRequests.length > 0) {
      applyFilters();
    }
  }, [bloodRequests, filters, applyFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      urgency: "",
      bloodGroup: "",
      dateFrom: "",
      dateTo: ""
    });
  };

  const toggleFilters = () => {
    setShowFilters(prevState => !prevState);
  };

  const handleDonateClick = (request) => {
    setSelectedRequest(request);
    setShowDonorForm(true);
    // Pre-set the blood group to match the request
    setFormData(prevData => ({
      ...prevData,
      bloodGroup: request.bloodGroup
    }));
  };

  const handleFormClose = () => {
    setShowDonorForm(false);
    setSelectedRequest(null);
    setFormData({
      donorName: "",
      donorAge: "",
      donorEmail: "",
      donorPhone: "",
      bloodGroup: "",
      address: "",
      hasDonatedBefore: "",
      lastDonationDate: "",
      medicalConditions: "",
      medications: ""
    });
    setFormErrors({});
    setSubmitSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ 
      ...prevData, 
      [name]: value 
    }));
    
    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({ 
        ...prevErrors, 
        [name]: null 
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.donorName.trim()) errors.donorName = "Name is required";
    
    if (!formData.donorAge) {
      errors.donorAge = "Age is required";
    } else if (parseInt(formData.donorAge) < 18) {
      errors.donorAge = "You must be at least 18 years old to donate";
    } else if (parseInt(formData.donorAge) > 65) {
      errors.donorAge = "Please consult with a doctor if you're over 65";
    }
    
    if (!formData.donorEmail.trim()) {
      errors.donorEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.donorEmail)) {
      errors.donorEmail = "Email is invalid";
    }
    
    if (!formData.donorPhone.trim()) {
      errors.donorPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.donorPhone.replace(/\D/g, ''))) {
      errors.donorPhone = "Please enter a valid 10-digit phone number";
    }
    
    if (!formData.bloodGroup) errors.bloodGroup = "Blood group is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.hasDonatedBefore) errors.hasDonatedBefore = "This field is required";
    
    if (formData.hasDonatedBefore === "yes" && !formData.lastDonationDate) {
      errors.lastDonationDate = "Please provide your last donation date";
    }
    
    // Check if last donation was within the last 3 months (too soon)
    if (formData.lastDonationDate) {
      const lastDonation = new Date(formData.lastDonationDate);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      if (lastDonation > threeMonthsAgo) {
        errors.lastDonationDate = "You must wait at least 3 months between donations";
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      // Scroll to the first error
      const firstErrorField = document.querySelector(".input-error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    
    setSubmitting(true);
    
    try {
      const donorData = {
        ...formData,
        requestId: selectedRequest._id
      };
      
      const response = await fetch(`${API_BASE_URL}/donors/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(donorData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit donor information");
      }
      
      setSubmitSuccess(true);
      // Refresh the blood requests list
      fetchBloodRequests();
      
      // Reset form after a delay
      setTimeout(() => {
        handleFormClose();
      }, 3000);
      
    } catch (err) {
      console.error("Error submitting donor form:", err);
      setFormErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case "critical":
        return "urgency-critical";
      case "urgent":
        return "urgency-urgent";
      default:
        return "urgency-normal";
    }
  };

  // Calculate available units for a request
  const getAvailableUnits = (request) => {
    if (!request.confirmedDonorCount) return request.unitsRequired;
    return Math.max(0, request.unitsRequired - request.confirmedDonorCount);
  };

  // Format date in a more readable way
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if request can be fulfilled
  const canDonate = (request) => {
    return request.status !== "fulfilled" && getAvailableUnits(request) > 0;
  };

  // Extract all available blood groups from requests
  const bloodGroups = [...new Set(bloodRequests.map(request => request.bloodGroup))];

  return (
    <div className="donor-page-container">
      <header className="donor-header">
        <div className="header-content">
          <h1>Donate Blood</h1>
          <p>Your donation can save a life!</p>
          <button className="back-btn" onClick={() => navigate("/")}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
        </div>
      </header>

      <div className="donor-content">
        <div className="page-description">
          <i className="fas fa-hands-helping icon-help"></i>
          <div>
            <h2>Current Blood Donation Requests</h2>
            <p>
              Below are patients in need of blood donations. You can choose to donate
              to any compatible request. Thank you for your generosity!
            </p>
          </div>
        </div>

        {/* Filter section */}
        <div className="filter-section">
          <button className="filter-toggle-btn" onClick={toggleFilters}>
            <i className={`fas ${showFilters ? 'fa-chevron-up' : 'fa-filter'}`}></i>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {showFilters && (
            <div className="filter-container">
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="bloodGroup">Blood Group</label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={filters.bloodGroup}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroups.map((group, index) => (
                      <option key={index} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label htmlFor="location">Location</label>
                  <select
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Locations</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label htmlFor="urgency">Urgency</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={filters.urgency}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Urgency Levels</option>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="dateFrom">From Date</label>
                  <input
                    type="date"
                    id="dateFrom"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <div className="filter-group">
                  <label htmlFor="dateTo">To Date</label>
                  <input
                    type="date"
                    id="dateTo"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              
              <div className="filter-actions">
                <button className="clear-filters-btn" onClick={clearFilters}>
                  <i className="fas fa-times"></i> Clear Filters
                </button>
                <div className="result-count">
                  Showing {filteredRequests.length} of {bloodRequests.length} requests
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading blood requests...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchBloodRequests}>Try Again</button>
          </div>
        ) : (
          <div className="blood-requests-grid">
            {filteredRequests.length === 0 ? (
              <div className="no-requests">
                <i className="fas fa-info-circle"></i>
                <p>
                  {bloodRequests.length === 0 
                    ? "No blood requests available at the moment." 
                    : "No blood requests match your current filters."}
                </p>
                {bloodRequests.length > 0 && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              // Sort by urgency first (critical > urgent > normal), then by creation date (newest first)
              filteredRequests.sort((a, b) => {
                const urgencyOrder = { critical: 0, urgent: 1, normal: 2 };
                if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
                  return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
                }
                // If same urgency, sort by date (newest first)
                return new Date(b.createdAt) - new Date(a.createdAt);
              }).map((request) => (
                <div
                  key={request._id}
                  className={`request-card ${
                    request.status === "fulfilled" ? "request-fulfilled" : ""
                  }`}
                >
                  <div className="request-header">
                    <div className="blood-group-badge">
                      {request.bloodGroup}
                    </div>
                    <div
                      className={`urgency-badge ${getUrgencyClass(
                        request.urgency
                      )}`}
                    >
                      {request.urgency}
                    </div>
                  </div>

                  <div className="request-details">
                    <h3>{request.patientName}, {request.patientAge} years</h3>
                    <div className="detail-item">
                      <i className="fas fa-hospital"></i>
                      <span>{request.hospitalName}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{request.location}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-tint"></i>
                      <span>
                        <strong>{getAvailableUnits(request)}</strong> of {request.unitsRequired} units still needed
                      </span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>
                        Requested on: {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="request-reason">
                    <h4>Reason:</h4>
                    <p>{request.reason}</p>
                  </div>

                  <div className="request-status">
                    <span className={`status-badge status-${request.status}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="request-actions">
                    <button
                      className="donate-btn"
                      onClick={() => handleDonateClick(request)}
                      disabled={!canDonate(request)}
                    >
                      {!canDonate(request) ? "Request Fulfilled" : "Donate Now"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showDonorForm && selectedRequest && (
        <div className="donor-form-overlay">
          <div className="donor-form-container">
            <div className="donor-form-header">
              <h2>Donate Blood</h2>
              <button className="close-btn" onClick={handleFormClose} aria-label="Close form">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {submitSuccess ? (
              <div className="submission-success">
                <i className="fas fa-check-circle"></i>
                <h3>Thank you for your donation!</h3>
                <p>Your information has been submitted successfully. The hospital will contact you shortly with further instructions.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="donor-form">
                <div className="form-request-info">
                  <h3>You are donating for:</h3>
                  <p>
                    <strong>{selectedRequest.patientName}</strong>, {selectedRequest.patientAge} years
                    <br />
                    Blood Type: <span className="highlight">{selectedRequest.bloodGroup}</span>
                    <br />
                    Hospital: {selectedRequest.hospitalName}, {selectedRequest.location}
                  </p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="donorName">Full Name *</label>
                    <input
                      type="text"
                      id="donorName"
                      name="donorName"
                      value={formData.donorName}
                      onChange={handleInputChange}
                      className={formErrors.donorName ? "input-error" : ""}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                    {formErrors.donorName && <div className="error-message">{formErrors.donorName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="donorAge">Age *</label>
                    <input
                      type="number"
                      id="donorAge"
                      name="donorAge"
                      min="18"
                      max="65"
                      value={formData.donorAge}
                      onChange={handleInputChange}
                      className={formErrors.donorAge ? "input-error" : ""}
                      placeholder="Must be 18 or older"
                    />
                    {formErrors.donorAge && <div className="error-message">{formErrors.donorAge}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="donorEmail">Email *</label>
                    <input
                      type="email"
                      id="donorEmail"
                      name="donorEmail"
                      value={formData.donorEmail}
                      onChange={handleInputChange}
                      className={formErrors.donorEmail ? "input-error" : ""}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                    />
                    {formErrors.donorEmail && <div className="error-message">{formErrors.donorEmail}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="donorPhone">Phone Number *</label>
                    <input
                      type="tel"
                      id="donorPhone"
                      name="donorPhone"
                      value={formData.donorPhone}
                      onChange={handleInputChange}
                      className={formErrors.donorPhone ? "input-error" : ""}
                      placeholder="10-digit phone number"
                      autoComplete="tel"
                    />
                    {formErrors.donorPhone && <div className="error-message">{formErrors.donorPhone}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bloodGroup">Blood Group *</label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className={formErrors.bloodGroup ? "input-error" : ""}
                      aria-describedby="bloodTypeHelp"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    {formErrors.bloodGroup && <div className="error-message">{formErrors.bloodGroup}</div>}
                    <small id="bloodTypeHelp" className="form-text text-muted">
                      Must be compatible with {selectedRequest.bloodGroup}
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="hasDonatedBefore">Have you donated blood before? *</label>
                    <select
                      id="hasDonatedBefore"
                      name="hasDonatedBefore"
                      value={formData.hasDonatedBefore}
                      onChange={handleInputChange}
                      className={formErrors.hasDonatedBefore ? "input-error" : ""}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {formErrors.hasDonatedBefore && <div className="error-message">{formErrors.hasDonatedBefore}</div>}
                  </div>
                </div>

                {formData.hasDonatedBefore === "yes" && (
                  <div className="form-group">
                    <label htmlFor="lastDonationDate">Last Donation Date *</label>
                    <input
                      type="date"
                      id="lastDonationDate"
                      name="lastDonationDate"
                      value={formData.lastDonationDate}
                      onChange={handleInputChange}
                      className={formErrors.lastDonationDate ? "input-error" : ""}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {formErrors.lastDonationDate && <div className="error-message">{formErrors.lastDonationDate}</div>}
                    <small className="form-text text-muted">
                      Must be at least 3 months since your last donation
                    </small>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={formErrors.address ? "input-error" : ""}
                    placeholder="Enter your full address"
                    rows="2"
                  ></textarea>
                  {formErrors.address && <div className="error-message">{formErrors.address}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="medicalConditions">Do you have any medical conditions? (Optional)</label>
                  <textarea
                    id="medicalConditions"
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    placeholder="List any relevant medical conditions"
                    rows="2"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="medications">Are you currently taking any medications? (Optional)</label>
                  <textarea
                    id="medications"
                    name="medications"
                    value={formData.medications}
                    onChange={handleInputChange}
                    placeholder="List any medications you're currently taking"
                    rows="2"
                  ></textarea>
                </div>

                {formErrors.submit && (
                  <div className="form-error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{formErrors.submit}</p>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={handleFormClose}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? (
                      <>
                        <div className="spinner-small"></div> Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorPage;