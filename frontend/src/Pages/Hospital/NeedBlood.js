import React, { useState, useEffect } from "react";
import "./NeedBlood.css";

const NeedBlood = () => {
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    location: "",
    contact: "",
    reason: "",
    urgency: "normal",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldFocus, setFieldFocus] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Set animation complete after initial load animations
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setFieldFocus(field);
  };

  const handleBlur = () => {
    setFieldFocus(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Blood Request Submitted:", formData);
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset after showing success message
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          bloodGroup: "",
          location: "",
          contact: "",
          reason: "",
          urgency: "normal",
        });
      }, 5000);
    }, 1500);
  };

  // Get dynamic class for form fields based on focus state
  const getFieldClass = (field) => {
    return fieldFocus === field ? "form-group focused" : "form-group";
  };

  return (
    <div className="need-blood-container">
      <div className="blood-drop-animation">
        <div className="drop"></div>
      </div>
      
      <div className="blood-corner"></div>
      
      <h2>Request Blood Donation</h2>
      <p className="form-subtitle">Fill in the details to submit your urgent blood requirement</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h3>Request Submitted Successfully!</h3>
          <p>We have received your blood request and will notify matching donors in your area immediately.</p>
          <p>Our team will contact you shortly with updates.</p>
        </div>
      ) : (
        <form className="need-blood-form" onSubmit={handleSubmit}>
          <div className={getFieldClass("name")}>
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name"
              name="name" 
              value={formData.name}
              placeholder="Enter patient or requestor name" 
              required 
              onChange={handleChange}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
              className={animationComplete ? "animated" : ""}
            />
          </div>
          
          <div className="form-row">
            <div className={getFieldClass("bloodGroup")}>
              <label htmlFor="bloodGroup">Blood Group</label>
              <select 
                id="bloodGroup"
                name="bloodGroup" 
                value={formData.bloodGroup}
                required 
                onChange={handleChange}
                onFocus={() => handleFocus("bloodGroup")}
                onBlur={handleBlur}
                className={animationComplete ? "animated" : ""}
              >
                <option value="">Select Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            
            <div className={getFieldClass("urgency")}>
              <label htmlFor="urgency">Urgency Level</label>
              <select 
                id="urgency"
                name="urgency" 
                value={formData.urgency}
                required 
                onChange={handleChange}
                onFocus={() => handleFocus("urgency")}
                onBlur={handleBlur}
                className={animationComplete ? "animated" : ""}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div className={getFieldClass("location")}>
            <label htmlFor="location">Location</label>
            <input 
              type="text" 
              id="location"
              name="location" 
              value={formData.location}
              placeholder="Hospital or area name" 
              required 
              onChange={handleChange}
              onFocus={() => handleFocus("location")} 
              onBlur={handleBlur}
              className={animationComplete ? "animated" : ""}
            />
          </div>
          
          <div className={getFieldClass("contact")}>
            <label htmlFor="contact">Contact Number</label>
            <input 
              type="tel" 
              id="contact"
              name="contact" 
              value={formData.contact}
              placeholder="Phone number for donors to contact" 
              required 
              onChange={handleChange}
              onFocus={() => handleFocus("contact")}
              onBlur={handleBlur}
              className={animationComplete ? "animated" : ""}
            />
          </div>
          
          <div className={getFieldClass("reason")}>
            <label htmlFor="reason">Reason for Request</label>
            <textarea 
              id="reason"
              name="reason" 
              value={formData.reason}
              placeholder="Please provide details about the requirement" 
              required 
              onChange={handleChange}
              onFocus={() => handleFocus("reason")}
              onBlur={handleBlur}
              className={animationComplete ? "animated" : ""}
              rows="4"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                <span style={{ marginLeft: "10px" }}>Processing...</span>
              </>
            ) : (
              "Submit Blood Request"
            )}
          </button>
          
          <p className="privacy-note">
            Your information will only be shared with verified donors in your area.
            We take your privacy seriously.
          </p>
        </form>
      )}
      
      <div className="emergency-info">
        <h3>Emergency Blood Services</h3>
        <p>For critical emergencies, please also contact your nearest blood bank directly:</p>
        <ul>
          <li>National Blood Helpline: <strong>1800-XXX-XXXX</strong></li>
          <li>Red Cross Blood Services: <strong>1800-XXX-YYYY</strong></li>
          <li>Local Hospital Blood Bank: <strong>1800-XXX-ZZZZ</strong></li>
        </ul>
      </div>
    </div>
  );
};

export default NeedBlood;