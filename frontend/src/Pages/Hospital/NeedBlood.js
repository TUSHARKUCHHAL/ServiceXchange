import React, { useState, useEffect } from "react";
import "./NeedBlood.css";

const NeedBlood = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    bloodGroup: "",
    hospitalName: "",
    unitsRequired: "",
    requestorName: "",
    requestorEmail: "",
    requestorPhone: "",
    relationToPatient: "",
    location: "",
    reason: "",
    urgency: "normal",
    status: "pending"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldFocus, setFieldFocus] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await fetch("http://localhost:5000/api/blood/request", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Success:", data);
      setSubmitted(true);
  
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          patientName: "",
          patientAge: "",
          bloodGroup: "",
          hospitalName: "",
          unitsRequired: "",
          requestorName: "",
          requestorEmail: "",
          requestorPhone: "",
          relationToPatient: "",
          location: "",
          reason: "",
          urgency: "normal",
          status: "pending"
        });
      }, 5000);
    } catch (error) {
      console.error("Error submitting blood request:", error);
      alert("Failed to submit request. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Use reverse geocoding to get location name from coordinates
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            
            if (!response.ok) {
              throw new Error("Failed to get location details");
            }
            
            const data = await response.json();
            
            // Extract city and state from response
            const city = data.address.city || data.address.town || data.address.village || "";
            const state = data.address.state || "";
            const locationString = city ? (state ? `${city}, ${state}` : city) : "Unknown location";
            
            setFormData({ ...formData, location: locationString });
            setIsLoadingLocation(false);
          } catch (error) {
            console.error("Error getting location details:", error);
            setLocationError("Failed to get location name. Please enter manually.");
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMsg = "Failed to get your location.";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Location access denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMsg = "Location request timed out.";
              break;
            default:
              errorMsg = "An unknown error occurred.";
          }
          
          setLocationError(errorMsg);
          setIsLoadingLocation(false);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
    }
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
          <h3>Patient Information</h3>
          <div className={getFieldClass("patientName")}>
            <label htmlFor="patientName">Patient Name</label>
            <input 
              type="text" 
              id="patientName"
              name="patientName" 
              value={formData.patientName}
              placeholder="Enter patient name" 
              required 
              onChange={handleChange}
              onFocus={() => handleFocus("patientName")}
              onBlur={handleBlur}
              className={animationComplete ? "animated" : ""}
            />
          </div>
          
          <div className="form-row">
            <div className={getFieldClass("patientAge")}>
              <label htmlFor="patientAge">Patient Age</label>
              <input 
                type="number" 
                id="patientAge"
                name="patientAge" 
                value={formData.patientAge}
                placeholder="Age" 
                required 
                min="0"
                max="120"
                onChange={handleChange}
                onFocus={() => handleFocus("patientAge")}
                onBlur={handleBlur}
                className={animationComplete ? "animated" : ""}
              />
            </div>
            
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
          </div>
          
          <div className="form-row">
            <div className={getFieldClass("hospitalName")}>
              <label htmlFor="hospitalName">Hospital Name</label>
              <input 
                type="text" 
                id="hospitalName"
                name="hospitalName"
                value={formData.hospitalName}
                placeholder="Enter hospital name"
                required 
                onChange={handleChange}
                onFocus={() => handleFocus("hospitalName")}
                onBlur={handleBlur}
                className={animationComplete ? "animated" : ""}
              />
            </div>
            
            <div className={getFieldClass("unitsRequired")}>
              <label htmlFor="unitsRequired">Units Required</label>
              <input 
                type="number" 
                id="unitsRequired"
                name="unitsRequired" 
                value={formData.unitsRequired}
                placeholder="Number of units" 
                required 
                min="1"
                onChange={handleChange}
                onFocus={() => handleFocus("unitsRequired")}
                onBlur={handleBlur}
                className={animationComplete ? "animated" : ""}
              />
            </div>
          </div>

          <h3>Requestor Information</h3>
          <div className={getFieldClass("requestorName")}>
            <label htmlFor="requestorName">Your Name</label>
            <input 
              type="text" 
              id="requestorName"
              name="requestorName" 
              value={formData.requestorName}
              placeholder="Enter your full name" 
              required 
              onChange={handleChange}
              onFocus={() => handleFocus("requestorName")}
              onBlur={handleBlur}
              className={animationComplete ? "animated" : ""}
            />
          </div>
          
          <div className="form-row">
            <div className={getFieldClass("requestorEmail")}>
              <label htmlFor="requestorEmail">Email Address</label>
              <input 
                type="email" 
                id="requestorEmail"
                name="requestorEmail" 
                value={formData.requestorEmail}
                placeholder="Your email address" 
                required 
                onChange={handleChange}
                onFocus={() => handleFocus("requestorEmail")}
                onBlur={handleBlur}
                className={animationComplete ? "animated" : ""}
              />
            </div>
            
            <div className={getFieldClass("requestorPhone")}>
              <label htmlFor="requestorPhone">Contact Number</label>
              <input 
                type="tel" 
                id="requestorPhone"
                name="requestorPhone" 
                value={formData.requestorPhone}
                placeholder="Your phone number" 
                required 
                onChange={handleChange}
                onFocus={() => handleFocus("requestorPhone")}
                onBlur={handleBlur}
                className={animationComplete ? "animated" : ""}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className={getFieldClass("relationToPatient")}>
              <label htmlFor="relationToPatient">Relation to Patient</label>
              <select 
                id="relationToPatient"
                name="relationToPatient" 
                value={formData.relationToPatient}
                required 
                onChange={handleChange}
                onFocus={() => handleFocus("relationToPatient")}
                onBlur={handleBlur}
                className={animationComplete ? "animated" : ""}
              >
                <option value="">Select Relation</option>
                <option value="self">Self</option>
                <option value="family">Family Member</option>
                <option value="friend">Friend</option>
                <option value="medical-staff">Medical Staff</option>
                <option value="other">Other</option>
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
          
          <div className={`${getFieldClass("location")} location-field`}>
            <label htmlFor="location">General Location</label>
            <div className="location-input-wrapper">
              <input 
                type="text" 
                id="location"
                name="location" 
                value={formData.location}
                placeholder="City/Area" 
                required 
                onChange={handleChange}
                onFocus={() => handleFocus("location")} 
                onBlur={handleBlur}
                className={`${animationComplete ? "animated" : ""} ${isLoadingLocation ? "loading" : ""}`}
              />
              <button 
                type="button" 
                className="location-button"
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <span className="location-spinner"></span>
                ) : (
                  "📍 Get My Location"
                )}
              </button>
            </div>
            {locationError && (
              <p className="location-error">{locationError}</p>
            )}
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