import React, { useState } from "react";
import "./DonorForm.css";

const DonorForm = ({ request, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    donorAge: "",
    bloodGroup: "",
    address: "",
    hasDonatedBefore: "no",
    lastDonationDate: "",
    medicalConditions: "",
    medications: "",
    agreeToTerms: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields
    const requiredFields = [
      "donorName", "donorEmail", "donorPhone", "donorAge", 
      "bloodGroup", "address"
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = "This field is required";
      }
    });
    
    // Email validation
    if (formData.donorEmail && !/\S+@\S+\.\S+/.test(formData.donorEmail)) {
      errors.donorEmail = "Please enter a valid email address";
    }
    
    // Phone validation
    if (formData.donorPhone && !/^\d{10}$/.test(formData.donorPhone.replace(/\D/g, ''))) {
      errors.donorPhone = "Please enter a valid 10-digit phone number";
    }
    
    // Age validation
    if (formData.donorAge) {
      const age = parseInt(formData.donorAge);
      if (isNaN(age) || age < 18 || age > 65) {
        errors.donorAge = "Donor must be between 18-65 years old";
      }
    }
    
    // Last donation date validation
    if (formData.hasDonatedBefore === "yes" && !formData.lastDonationDate) {
      errors.lastDonationDate = "Please enter your last donation date";
    }
    
    // Terms agreement validation
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to terms and conditions";
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Check if blood group matches the request
    if (formData.bloodGroup !== request.bloodGroup) {
      setSubmitError(`This patient needs ${request.bloodGroup} blood type. Your blood type (${formData.bloodGroup}) doesn't match.`);
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Submit donation to backend with hospitalName included
      const response = await fetch(`http://localhost:5000/api/blood/donate/${request._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donorInfo: formData,
          requestId: request._id,
          hospitalName: request.hospitalName // Include hospitalName from the request
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit donation");
      }
      
      setSubmitSuccess(true);
      
      // Call success callback after 2 seconds
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      setSubmitError(error.message);
      console.error("Donation error:", error);
      setSubmitting(false);
    }
  };

  return (
    <div className="donor-form-overlay">
      <div className="donor-form-container">
        {submitSuccess ? (
          <div className="submit-success">
            <i className="fas fa-check-circle"></i>
            <h2>Thank You for Your Donation!</h2>
            <p>
              Your information has been sent to the requester. They will contact
              you soon with further details.
            </p>
          </div>
        ) : (
          <>
            <div className="form-header">
              <h2>Blood Donation Form</h2>
              <button className="close-btn" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="request-summary">
              <h3>Donating To:</h3>
              <p>
                <strong>{request.patientName}</strong>, {request.patientAge} years
              </p>
              <p>
                <strong>Blood Type Needed:</strong>{" "}
                <span className="blood-type">{request.bloodGroup}</span>
              </p>
              <p>
                <strong>Hospital:</strong> {request.hospitalName}
              </p>
              <p>
                <strong>Units Required:</strong> {request.unitsRequired}
              </p>
            </div>

            {submitError && (
              <div className="submit-error">
                <i className="fas fa-exclamation-circle"></i>
                <p>{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Donor Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="donorName">Full Name *</label>
                    <input
                      type="text"
                      id="donorName"
                      name="donorName"
                      value={formData.donorName}
                      onChange={handleChange}
                      className={formErrors.donorName ? "error" : ""}
                    />
                    {formErrors.donorName && (
                      <p className="error-message">{formErrors.donorName}</p>
                    )}
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
                      onChange={handleChange}
                      className={formErrors.donorAge ? "error" : ""}
                    />
                    {formErrors.donorAge && (
                      <p className="error-message">{formErrors.donorAge}</p>
                    )}
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
                      onChange={handleChange}
                      className={formErrors.donorEmail ? "error" : ""}
                    />
                    {formErrors.donorEmail && (
                      <p className="error-message">{formErrors.donorEmail}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="donorPhone">Phone Number *</label>
                    <input
                      type="tel"
                      id="donorPhone"
                      name="donorPhone"
                      value={formData.donorPhone}
                      onChange={handleChange}
                      className={formErrors.donorPhone ? "error" : ""}
                    />
                    {formErrors.donorPhone && (
                      <p className="error-message">{formErrors.donorPhone}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bloodGroup">Blood Group *</label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className={formErrors.bloodGroup ? "error" : ""}
                    >
                      <option value="">Select your blood group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    {formErrors.bloodGroup && (
                      <p className="error-message">{formErrors.bloodGroup}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={formErrors.address ? "error" : ""}
                    />
                    {formErrors.address && (
                      <p className="error-message">{formErrors.address}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Medical Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Have you donated blood before? *</label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          name="hasDonatedBefore"
                          value="yes"
                          checked={formData.hasDonatedBefore === "yes"}
                          onChange={handleChange}
                        />{" "}
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="hasDonatedBefore"
                          value="no"
                          checked={formData.hasDonatedBefore === "no"}
                          onChange={handleChange}
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>

                  {formData.hasDonatedBefore === "yes" && (
                    <div className="form-group">
                      <label htmlFor="lastDonationDate">
                        When was your last donation? *
                      </label>
                      <input
                        type="date"
                        id="lastDonationDate"
                        name="lastDonationDate"
                        value={formData.lastDonationDate}
                        onChange={handleChange}
                        className={formErrors.lastDonationDate ? "error" : ""}
                      />
                      {formErrors.lastDonationDate && (
                        <p className="error-message">
                          {formErrors.lastDonationDate}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="medicalConditions">
                    Do you have any medical conditions?
                  </label>
                  <textarea
                    id="medicalConditions"
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    placeholder="List any medical conditions that might affect your eligibility to donate blood."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="medications">
                    Are you currently taking any medications?
                  </label>
                  <textarea
                    id="medications"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    placeholder="List any medications you are currently taking."
                  ></textarea>
                </div>
              </div>

              <div className="form-group terms-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  I confirm that all information provided is accurate and I consent
                  to share my contact information with the blood requester. *
                </label>
                {formErrors.agreeToTerms && (
                  <p className="error-message">{formErrors.agreeToTerms}</p>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner"></span> Submitting...
                    </>
                  ) : (
                    "Submit Donation"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DonorForm;