import React, { useState, useEffect } from 'react';
import './SignUp.css';

const RestaurantSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    contactPerson: '',
    cuisineType: '',
    donationFrequency: 'weekly',
    acceptTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear any errors for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
    
    // Clear any errors for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Handle radio button changes
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate the current step
  const validateCurrentStep = () => {
    const errors = {};
    
    if (currentStep === 1) {
      // Validate step 1 fields
      if (!formData.restaurantName.trim()) errors.restaurantName = "Restaurant name is required";
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = "Email format is invalid";
      }
      if (!formData.phone.trim()) errors.phone = "Phone number is required";
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.contactPerson.trim()) errors.contactPerson = "Contact person is required";
      
    } else if (currentStep === 2) {
      // Validate step 2 fields
      if (!formData.cuisineType.trim()) errors.cuisineType = "Cuisine type is required";
    }
    
    return errors;
  };

  // Move to next step
  const nextStep = () => {
    const errors = validateCurrentStep();
    
    if (Object.keys(errors).length > 0) {
      // If there are errors, set them and don't proceed
      setFormErrors(errors);
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate acceptance of terms
    if (!formData.acceptTerms) {
      setFormErrors({
        ...formErrors,
        acceptTerms: "You must accept the terms and conditions"
      });
      return;
    }
    
    // Show loading state
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1500);
  };

  // Render error message for a field
  const renderError = (fieldName) => {
    if (formErrors[fieldName]) {
      return <div className="error-message">{formErrors[fieldName]}</div>;
    }
    return null;
  };
  
  // Render success message after form submission
  if (formSubmitted) {
    return (
      <div className="restaurant-signup-container">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Thank You!</h2>
          <p>Your restaurant <strong>{formData.restaurantName}</strong> has been successfully registered with our Food Rescue Initiative.</p>
          
          <div className="next-step-info hover-lift">
            <h3>Next Steps:</h3>
            <p>Our team will review your information and contact you within 24-48 hours to discuss the details of your participation.</p>
            <ul>
              <li>You'll receive a confirmation email shortly</li>
              <li>Our coordinator will call you to schedule an onboarding</li>
              <li>We'll set up your regular donation schedule</li>
            </ul>
          </div>
          
          <button 
            className="next-button"
            onClick={() => window.location.reload()}
          >
            Register Another Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-signup-container">
      <div className="signup-header">
        <h1>Restaurant Signup</h1>
        <p>Join our food rescue initiative and help reduce food waste while supporting the community</p>
      </div>
      
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="steps-indicator">
          <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Restaurant Info</div>
          </div>
          
          <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Donation Details</div>
          </div>
          
          <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Review & Submit</div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Restaurant Information */}
        {currentStep === 1 && (
          <div className="form-step slide-in">
            <h2 className="step-title">
              <span className="icon-wrapper">🍽️</span>
              Restaurant Information
            </h2>
            
            <div className="form-group">
              <label htmlFor="restaurantName">
                <span className="input-icon">🏨</span>
                Restaurant Name
              </label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleInputChange}
                className={`shadow-glow ${formErrors.restaurantName ? 'error' : ''}`}
                placeholder="Enter restaurant name"
              />
              {renderError('restaurantName')}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  <span className="input-icon">✉️</span>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`shadow-glow ${formErrors.email ? 'error' : ''}`}
                  placeholder="restaurant@example.com"
                />
                {renderError('email')}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">
                  <span className="input-icon">📞</span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`shadow-glow ${formErrors.phone ? 'error' : ''}`}
                  placeholder="(123) 456-7890"
                />
                {renderError('phone')}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">
                <span className="input-icon">📍</span>
                Restaurant Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`shadow-glow ${formErrors.address ? 'error' : ''}`}
                placeholder="Full restaurant address"
              />
              {renderError('address')}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">
                  <span className="input-icon">🌐</span>
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="shadow-glow"
                  placeholder="https://yourrestaurant.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contactPerson">
                  <span className="input-icon">👤</span>
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className={`shadow-glow ${formErrors.contactPerson ? 'error' : ''}`}
                  placeholder="Full name"
                />
                {renderError('contactPerson')}
              </div>
            </div>
            
            <div className="form-info-box hover-lift">
              <div className="info-icon">i</div>
              <p>We'll use this information to create your restaurant profile and coordinate food pickups.</p>
            </div>
          </div>
        )}
        
        {/* Step 2: Donation Details */}
        {currentStep === 2 && (
          <div className="form-step slide-in">
            <h2 className="step-title">
              <span className="icon-wrapper">🍲</span>
              Donation Details
            </h2>
            
            <div className="form-group">
              <label htmlFor="cuisineType">
                <span className="input-icon">🌮</span>
                Cuisine Type
              </label>
              <input
                type="text"
                id="cuisineType"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleInputChange}
                className={`shadow-glow ${formErrors.cuisineType ? 'error' : ''}`}
                placeholder="E.g., Italian, Indian, Bakery"
              />
              {renderError('cuisineType')}
            </div>
            
            <div className="form-group">
              <label>
                <span className="input-icon">🔄</span>
                How often would you like to donate?
              </label>
              
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="daily"
                    name="donationFrequency"
                    value="daily"
                    checked={formData.donationFrequency === 'daily'}
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="daily" className="radio-label">
                    <span className="radio-icon">🍎</span> Daily
                  </label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="weekly"
                    name="donationFrequency"
                    value="weekly"
                    checked={formData.donationFrequency === 'weekly'}
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="weekly" className="radio-label">
                    <span className="radio-icon">🥗</span> Weekly
                  </label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="monthly"
                    name="donationFrequency"
                    value="monthly"
                    checked={formData.donationFrequency === 'monthly'}
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="monthly" className="radio-label">
                    <span className="radio-icon">🍰</span> Monthly
                  </label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="asNeeded"
                    name="donationFrequency"
                    value="as-needed"
                    checked={formData.donationFrequency === 'as-needed'}
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="asNeeded" className="radio-label">
                    <span className="radio-icon">🍽️</span> As needed
                  </label>
                </div>
              </div>
            </div>
            
            <div className="donation-info-box">
              <h3>Types of food we accept:</h3>
              <ul className="fade-in-bottom">
                <li>🍏 Fresh produce with at least 48 hours of shelf life</li>
                <li>🍱 Prepared foods properly stored and unexpired</li>
                <li>🥐 Bakery items less than 24 hours old</li>
                <li>🥫 Packaged foods before expiration date</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="form-step slide-in">
            <h2 className="step-title">
              <span className="icon-wrapper">📝</span>
              Review & Submit
            </h2>
            
            <div className="review-section scale-in">
              <h3>
                <span className="section-icon">🏨</span>
                Restaurant Information
              </h3>
              
              <div className="review-data">
                <div className="review-item">
                  <span className="review-label">🍽️ Restaurant Name:</span>
                  <span className="review-value">{formData.restaurantName}</span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">✉️ Email:</span>
                  <span className="review-value">{formData.email}</span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">📞 Phone:</span>
                  <span className="review-value">{formData.phone}</span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">📍 Address:</span>
                  <span className="review-value">{formData.address}</span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">👤 Contact Person:</span>
                  <span className="review-value">{formData.contactPerson}</span>
                </div>
                
                {formData.website && (
                  <div className="review-item">
                    <span className="review-label">🌐 Website:</span>
                    <span className="review-value">{formData.website}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="review-section scale-in">
              <h3>
                <span className="section-icon">🍲</span>
                Donation Details
              </h3>
              
              <div className="review-data">
                <div className="review-item">
                  <span className="review-label">🌮 Cuisine Type:</span>
                  <span className="review-value">{formData.cuisineType}</span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">🔄 Donation Frequency:</span>
                  <span className="review-value">
                    {formData.donationFrequency === 'as-needed' ? 'As needed' : 
                     formData.donationFrequency.charAt(0).toUpperCase() + formData.donationFrequency.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="terms-section">
              <div className="form-group">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleCheckboxChange}
                  className={formErrors.acceptTerms ? 'error' : ''}
                />
                <label htmlFor="acceptTerms" className="terms-label">
                  <span className="checkbox-icon">✅</span>
                  I agree to the <a href="#" className="terms-link">Terms and Conditions</a> and <a href="#" className="privacy-link">Privacy Policy</a>
                </label>
              </div>
              {formErrors.acceptTerms && <div className="error-message terms-error">{formErrors.acceptTerms}</div>}
            </div>
          </div>
        )}
        
        <div className="form-navigation">
          {currentStep > 1 && (
            <button
              type="button"
              className="back-button"
              onClick={prevStep}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              className="next-button shimmer"
              onClick={nextStep}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span className="submit-icon">🍴</span>
                  Submit Registration
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RestaurantSignup;