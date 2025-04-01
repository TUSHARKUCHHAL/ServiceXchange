import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DonorPage.css";

const DonorPage = () => {
  const navigate = useNavigate();
  const [bloodRequests, setBloodRequests] = useState([]);
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

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  const fetchBloodRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/blood/requests");
      if (!response.ok) {
        throw new Error("Failed to fetch blood requests");
      }
      const data = await response.json();
      setBloodRequests(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDonateClick = (request) => {
    setSelectedRequest(request);
    setShowDonorForm(true);
    // Pre-set the blood group to match the request
    setFormData({
      ...formData,
      bloodGroup: request.bloodGroup
    });
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
    setFormData({ ...formData, [name]: value });
    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.donorName.trim()) errors.donorName = "Name is required";
    
    if (!formData.donorAge) {
      errors.donorAge = "Age is required";
    } else if (parseInt(formData.donorAge) < 18) {
      errors.donorAge = "You must be at least 18 years old to donate";
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
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const donorData = {
        ...formData,
        requestId: selectedRequest._id
      };
      
      const response = await fetch("http://localhost:5000/api/donors/register", {
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
      // We don't mark the request as fulfilled yet as specified
      // Refresh the blood requests list
      fetchBloodRequests();
      
      // Reset form after 3 seconds
      setTimeout(() => {
        handleFormClose();
      }, 3000);
      
    } catch (err) {
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
            {bloodRequests.length === 0 ? (
              <div className="no-requests">
                <i className="fas fa-info-circle"></i>
                <p>No blood requests available at the moment.</p>
              </div>
            ) : (
              bloodRequests.map((request) => (
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
                        Requested on: {new Date(request.createdAt).toLocaleDateString()}
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
                      disabled={request.status === "fulfilled"}
                    >
                      {request.status === "fulfilled" ? "Request Fulfilled" : "Donate Now"}
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
              <button className="close-btn" onClick={handleFormClose}>
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
                    Hospital: {selectedRequest.hospitalName}
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
                      value={formData.donorAge}
                      onChange={handleInputChange}
                      className={formErrors.donorAge ? "input-error" : ""}
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
                    />
                    {formErrors.lastDonationDate && <div className="error-message">{formErrors.lastDonationDate}</div>}
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
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="medications">Are you currently taking any medications? (Optional)</label>
                  <textarea
                    id="medications"
                    name="medications"
                    value={formData.medications}
                    onChange={handleInputChange}
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