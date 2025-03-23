import React, { useState, useEffect } from "react";
import "./DonateBlood.css";
import { 
  Heart, User, Droplet, MapPin, Phone, Calendar, 
  FileText, Send, Check, AlertCircle, Info, Medal, 
  Activity, Users, CheckCircle, X
} from "lucide-react";

const DonateBlood = () => {
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    location: "",
    contact: "",
    lastDonation: "",
    medicalConditions: "",
  });
  
  const [validations, setValidations] = useState({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = ['name', 'bloodGroup', 'location', 'contact'];
    const filledFields = requiredFields.filter(field => formData[field].trim() !== '');
    const progress = Math.round((filledFields.length / requiredFields.length) * 100);
    setFormProgress(progress);
  }, [formData]);

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'name':
        if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters';
        }
        break;
      case 'contact':
        if (!/^\d{10}$/.test(value) && value.trim() !== '') {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;
      default:
        break;
    }
    
    setValidations(prev => ({
      ...prev,
      [name]: error
    }));
    
    return error === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    const requiredFields = ['name', 'bloodGroup', 'location', 'contact'];
    
    requiredFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      // Animate the form to indicate validation errors
      document.querySelector('.donate-blood-form').classList.add('shake');
      setTimeout(() => {
        document.querySelector('.donate-blood-form').classList.remove('shake');
      }, 500);
      return;
    }
    
    // Show loading state
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Blood Donation Submitted:", formData);
      setIsSubmitting(false);
      setShowThankYou(true);
    }, 1500);
  };

  const closeModal = () => {
    setShowThankYou(false);
    
    // Reset form after submission
    setFormData({
      name: "",
      bloodGroup: "",
      location: "",
      contact: "",
      lastDonation: "",
      medicalConditions: "",
    });
    setValidations({});
  };

  return (
    <div className="donate-blood-container">
      <div className="donate-blood-header">
        <Heart className="header-icon" />
        <h2>Donate Blood, Save Lives</h2>
        <p>Your donation can make all the difference. One donation can save up to three lives. Join our community of donors and help those in need.</p>
      </div>

      <form className="donate-blood-form" onSubmit={handleSubmit}>
        <div className="progress-container">
          <div className="progress-label">
            <span>Form Completion</span>
            <span>{formProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${formProgress}%` }}></div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="name">
            <User size={16} /> Full Name
          </label>
          <div className={`input-wrapper ${validations.name ? 'input-error' : formData.name ? 'input-success' : ''}`}>
            <input 
              id="name"
              type="text" 
              name="name" 
              placeholder="Enter your full name" 
              value={formData.name}
              required 
              onChange={handleChange} 
              onBlur={handleBlur}
            />
            <User />
          </div>
          {validations.name && (
            <div className="validation-message error-message">
              <AlertCircle size={14} />
              {validations.name}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="bloodGroup">
            <Droplet size={16} /> Blood Group
          </label>
          <div className={`input-wrapper ${validations.bloodGroup ? 'input-error' : formData.bloodGroup ? 'input-success' : ''}`}>
            <select 
              id="bloodGroup"
              name="bloodGroup" 
              value={formData.bloodGroup}
              required 
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select your blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            <Droplet />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">
            <MapPin size={16} /> Your Location
          </label>
          <div className={`input-wrapper ${validations.location ? 'input-error' : formData.location ? 'input-success' : ''}`}>
            <input 
              id="location"
              type="text" 
              name="location" 
              placeholder="City, State" 
              value={formData.location}
              required 
              onChange={handleChange} 
              onBlur={handleBlur}
            />
            <MapPin />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="contact">
            <Phone size={16} /> Contact Number
          </label>
          <div className={`input-wrapper ${validations.contact ? 'input-error' : formData.contact ? 'input-success' : ''}`}>
            <input 
              id="contact"
              type="tel" 
              name="contact" 
              placeholder="Your phone number" 
              value={formData.contact}
              required 
              onChange={handleChange} 
              onBlur={handleBlur}
            />
            <Phone />
          </div>
          {validations.contact && (
            <div className="validation-message error-message">
              <AlertCircle size={14} />
              {validations.contact}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastDonation">
            <Calendar size={16} /> Last Donation Date (if applicable)
          </label>
          <div className="input-wrapper">
            <input 
              id="lastDonation"
              type="date" 
              name="lastDonation" 
              value={formData.lastDonation}
              onChange={handleChange} 
              onBlur={handleBlur}
            />
            <Calendar />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="medicalConditions">
            <FileText size={16} /> Medical Conditions (optional)
          </label>
          <div className="input-wrapper">
            <textarea 
              id="medicalConditions"
              name="medicalConditions" 
              placeholder="Any medical conditions we should know about?"
              value={formData.medicalConditions}
              rows="3"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FileText />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <>Processing<span className="loading-dots">...</span></>
          ) : (
            <>Submit Donation <Send size={18} /></>
          )}
        </button>
      </form>

      <div className="benefits-section">
        <h3>Benefits of Donating Blood</h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <Activity size={24} />
            </div>
            <h4>Free Health Screening</h4>
            <p>Each donation includes a mini health check-up and blood tests that can identify potential health issues.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <Heart size={24} />
            </div>
            <h4>Reduce Health Risks</h4>
            <p>Regular blood donation can reduce the risk of heart and liver ailments and improve cardiovascular health.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <Users size={24} />
            </div>
            <h4>Save Lives</h4>
            <p>Your donation can help accident victims, surgery patients, and those with blood disorders when they need it most.</p>
          </div>
        </div>
      </div>

      <div className="info-text">
        <Info size={20} />
        <span>
          Donors must be at least 17 years old, weigh at least 110 pounds, and be in good health. 
          You must wait at least 56 days between whole blood donations.
        </span>
      </div>

      {/* Thank You Modal */}
      <div className={`thank-you-modal ${showThankYou ? 'show' : ''}`} onClick={closeModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="success-icon-wrapper">
            <CheckCircle className="success-icon" />
          </div>
          <h2>Thank You!</h2>
          <p>Your blood donation offer has been submitted successfully.</p>
          <p>We'll contact you shortly with next steps about your donation.</p>
          <button className="close-button" onClick={closeModal}>
            Close <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonateBlood;