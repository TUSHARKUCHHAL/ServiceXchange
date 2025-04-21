import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RestaurantSignUp.css'; // Import your CSS file for styling

const RestaurantSignUp = () => {
  // Main form states
  const [step, setStep] = useState(1); // 1: Initial form, 2: OTP verification
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Form data state
  const [formData, setFormData] = useState({
    restaurantName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    openingHours: {
      monday: { open: '09:00', close: '21:00', closed: false },
      tuesday: { open: '09:00', close: '21:00', closed: false },
      wednesday: { open: '09:00', close: '21:00', closed: false },
      thursday: { open: '09:00', close: '21:00', closed: false },
      friday: { open: '09:00', close: '21:00', closed: false },
      saturday: { open: '09:00', close: '21:00', closed: false },
      sunday: { open: '09:00', close: '21:00', closed: false }
    },
    password: '',
    confirmPassword: ''
  });
  
  // Create refs array outside of the callback
  const otpRef1 = useRef(null);
  const otpRef2 = useRef(null);
  const otpRef3 = useRef(null);
  const otpRef4 = useRef(null);
  const otpRef5 = useRef(null);
  const otpRef6 = useRef(null);
  
  // Create array of refs
  const otpRefs = [otpRef1, otpRef2, otpRef3, otpRef4, otpRef5, otpRef6];
  
  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Effect for password strength evaluation
  useEffect(() => {
    const { password } = formData;
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  // Form field change handler - Fixed to properly update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested state for opening hours
    if (name.includes('openingHours')) {
      const parts = name.split('.');
      const day = parts[1];
      const field = parts[2];
      
      setFormData(prev => ({
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [day]: {
            ...prev.openingHours[day],
            [field]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form field blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name);
  };

  // Toggle day open/closed
  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          closed: !prev.openingHours[day].closed
        }
      }
    }));
  };

  // Validate a specific field
  const validateField = (name) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'restaurantName':
        if (!formData.restaurantName.trim()) {
          newErrors.restaurantName = 'Restaurant name is required';
        } else if (formData.restaurantName.length < 3) {
          newErrors.restaurantName = 'Name must be at least 3 characters';
        } else {
          newErrors.restaurantName = '';
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          newErrors.email = '';
        }
        break;
        
      case 'phoneNumber':
        const phoneRegex = /^\d{10}$/;
        if (!formData.phoneNumber) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phoneNumber)) {
          newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        } else {
          newErrors.phoneNumber = '';
        }
        break;
        
      case 'address':
        if (!formData.address.trim()) {
          newErrors.address = 'Address is required';
        } else {
          newErrors.address = '';
        }
        break;
        
      case 'city':
        if (!formData.city.trim()) {
          newErrors.city = 'City is required';
        } else {
          newErrors.city = '';
        }
        break;
        
      case 'state':
        if (!formData.state.trim()) {
          newErrors.state = 'State is required';
        } else {
          newErrors.state = '';
        }
        break;
        
      case 'zipCode':
        const zipRegex = /^\d{6}(-\d{4})?$/;
        if (!formData.zipCode) {
          newErrors.zipCode = 'ZIP code is required';
        } else if (!zipRegex.test(formData.zipCode)) {
          newErrors.zipCode = 'Please enter a valid ZIP code';
        } else {
          newErrors.zipCode = '';
        }
        break;
        
      case 'password':
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (passwordStrength < 3) {
          newErrors.password = 'Password is too weak';
        } else {
          newErrors.password = '';
        }
        
        // Also validate confirm password if already entered
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (formData.confirmPassword) {
          newErrors.confirmPassword = '';
        }
        break;
        
      case 'confirmPassword':
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          newErrors.confirmPassword = '';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return !newErrors[name];
  };

  // Validate all form fields
  const validateForm = () => {
    const fields = [
      'restaurantName', 'email', 'phoneNumber', 
      'address', 'city', 'state', 'zipCode', 
      'password', 'confirmPassword'
    ];
    
    // Mark all as touched to trigger error display
    const newTouched = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    
    setTouched(newTouched);
    
    // Add console log to see which fields are invalid
    let invalidFields = [];
    
    // Validate each field
    const validationResults = fields.map(field => {
      const isValid = validateField(field);
      if (!isValid) invalidFields.push(field);
      return isValid;
    });
    
    console.log("Invalid fields:", invalidFields);
    
    return validationResults.every(isValid => isValid);
  };

  // Get user's current location
  const fetchLocation = () => {
    setIsLoading(true);
    setErrors(prev => ({ ...prev, location: '' }));
    
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, location: 'Geolocation is not supported by your browser' }));
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get address details
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const addressData = data.address;
          
          setFormData(prev => ({
            ...prev,
            address: addressData.road ? `${addressData.house_number || ''} ${addressData.road}`.trim() : '',
            city: addressData.city || addressData.town || addressData.village || '',
            state: addressData.state || '',
            zipCode: addressData.postcode || ''
          }));
          
          setSuccess('Location fetched successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
          setErrors(prev => ({ ...prev, location: 'Failed to retrieve address from coordinates' }));
          console.error('Error fetching location data:', err);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setErrors(prev => ({ ...prev, location: 'Location permission denied' }));
            break;
          case err.POSITION_UNAVAILABLE:
            setErrors(prev => ({ ...prev, location: 'Location information is unavailable' }));
            break;
          case err.TIMEOUT:
            setErrors(prev => ({ ...prev, location: 'Request to get location timed out' }));
            break;
          default:
            setErrors(prev => ({ ...prev, location: 'An unknown error occurred' }));
        }
      }
    );
  };

  // Handle main form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission attempted");
    
    if (!validateForm()) {
      console.log("Form validation failed", errors);
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-text');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    console.log("Form validation passed, proceeding to OTP");
    
    try {
      setErrors({});
      setSuccess('');
      setIsLoading(true);
      
      // Send request to generate OTP
      const response = await fetch('http://localhost:5000/api/restaurants/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('OTP sent to your email. Please verify to complete registration.');
        setStep(2);
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        submit: err.message || 'Failed to send OTP. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  // Handle OTP input keydown events
  const handleOtpKeyDown = (index, e) => {
    // Focus previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  // Verify OTP and complete registration
  const verifyOtp = async (e) => {
    e.preventDefault();
    
    // Validate OTP
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Please enter the complete 6-digit OTP' }));
      return;
    }
    
    try {
      setErrors({});
      setIsLoading(true);
      
      // Make a deep copy of formData to avoid sending unnecessary fields
      const registrationData = {
        restaurantName: formData.restaurantName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        openingHours: formData.openingHours,
        password: formData.password
      };
      
      // Verify OTP and create restaurant account
      const response = await fetch('http://localhost:5000/api/restaurants/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otpString,
          restaurantData: registrationData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Restaurant registration successful! Redirecting to login...');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/restaurant/login';
        }, 3000);
      } else {
        throw new Error(data.message || 'Verification failed');
      }
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        otp: err.message || 'Invalid OTP. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      setErrors({});
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5000/api/restaurants/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          resend: true
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('New OTP sent to your email.');
        setOtp(['', '', '', '', '', '']);
      } else {
        throw new Error(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        otp: err.message || 'Failed to resend OTP. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for password strength label
  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  // Password strength indicator component
  const PasswordStrengthIndicator = () => {
    if (!formData.password) return null;
    
    const strengthClass = 
      passwordStrength <= 2 ? 'weak' : 
      passwordStrength <= 3 ? 'medium' : 
      passwordStrength <= 4 ? 'strong' : 'very-strong';
    
    return (
      <div className="password-strength">
        <div className="strength-bars">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`strength-bar ${i < passwordStrength ? strengthClass : ''}`}
            />
          ))}
        </div>
        <span className={`strength-label ${strengthClass}`}>
          {getPasswordStrengthLabel()}
        </span>
      </div>
    );
  };

  return (
    <div className="signup-containerr">
      <motion.div 
        className="signup-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="signup-header">
          <h1 className="signup-title">Restaurant Registration</h1>
          <p className="signup-subtitle">Join our platform and start receiving orders</p>
        </div>
        
        {/* Error and success notifications */}
        <AnimatePresence>
          {errors.submit && (
            <motion.div 
              className="notification error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {errors.submit}
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              className="notification success"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Step indicator */}
        <div className="step-indicator">
          <div className={`step ${step === 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Registration</div>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Verification</div>
          </div>
        </div>
        
        {/* Registration form */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="registration-form"
              onSubmit={handleSubmit} 
              className="signup-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Basic Information Section */}
              <section className="form-section">
                <h2 className="section-title">Basic Information</h2>
                
                <div className={`form-field ${touched.restaurantName && errors.restaurantName ? 'error' : ''}`}>
                  <label htmlFor="restaurantName" className="form-label">
                    Restaurant Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="restaurantName"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`form-input ${touched.restaurantName && errors.restaurantName ? 'input-error' : ''}`}
                  />
                  {touched.restaurantName && errors.restaurantName && (
                    <div className="error-text">{errors.restaurantName}</div>
                  )}
                </div>
                
                <div className={`form-field ${touched.email && errors.email ? 'error' : ''}`}>
                  <label htmlFor="email" className="form-label">
                    Email Address<span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`form-input ${touched.email && errors.email ? 'input-error' : ''}`}
                  />
                  {touched.email && errors.email && (
                    <div className="error-text">{errors.email}</div>
                  )}
                </div>
                
                <div className={`form-field ${touched.phoneNumber && errors.phoneNumber ? 'error' : ''}`}>
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number<span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="10-digit number"
                    className={`form-input ${touched.phoneNumber && errors.phoneNumber ? 'input-error' : ''}`}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <div className="error-text">{errors.phoneNumber}</div>
                  )}
                </div>
              </section>
              
              {/* Location Section */}
              <section className="form-section">
                <h2 className="section-title">Location</h2>
                
                <div className="location-actions">
                  <motion.button 
                    type="button" 
                    className="btn-location"
                    onClick={fetchLocation}
                    disabled={isLoading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isLoading ? (
                      <div className="spinner"></div>
                    ) : (
                      <>
                        <svg className="location-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        Use Current Location
                      </>
                    )}
                  </motion.button>
                  {errors.location && <div className="error-text">{errors.location}</div>}
                </div>
                
                <div className={`form-field ${touched.address && errors.address ? 'error' : ''}`}>
                  <label htmlFor="address" className="form-label">
                    Street Address<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`form-input ${touched.address && errors.address ? 'input-error' : ''}`}
                  />
                  {touched.address && errors.address && (
                    <div className="error-text">{errors.address}</div>
                  )}
                </div>
                
                <div className="form-row">
                  <div className={`form-field ${touched.city && errors.city ? 'error' : ''}`}>
                    <label htmlFor="city" className="form-label">
                      City<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`form-input ${touched.city && errors.city ? 'input-error' : ''}`}
                    />
                    {touched.city && errors.city && (
                      <div className="error-text">{errors.city}</div>
                    )}
                  </div>
                  
                  <div className={`form-field ${touched.state && errors.state ? 'error' : ''}`}>
                    <label htmlFor="state" className="form-label">
                      State<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`form-input ${touched.state && errors.state ? 'input-error' : ''}`}
                    />
                    {touched.state && errors.state && (
                      <div className="error-text">{errors.state}</div>
                    )}
                  </div>
                  
                  <div className={`form-field ${touched.zipCode && errors.zipCode ? 'error' : ''}`}>
                    <label htmlFor="zipCode" className="form-label">
                      ZIP Code<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`form-input ${touched.zipCode && errors.zipCode ? 'input-error' : ''}`}
                    />
                    {touched.zipCode && errors.zipCode && (
                      <div className="error-text">{errors.zipCode}</div>
                    )}
                  </div>
                </div>
              </section>
              
              {/* Opening Hours Section */}
              <section className="form-section">
                <h2 className="section-title">Opening Hours</h2>
                
                <div className="hours-grid">
                  {Object.keys(formData.openingHours).map((day) => (
                    <motion.div 
                      key={day} 
                      className="day-hours-card"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="day-toggle">
                        <label className="toggle-label">
                          <input
                            type="checkbox"
                            checked={!formData.openingHours[day].closed}
                            onChange={() => handleDayToggle(day)}
                            className="toggle-input"
                          />
                          <span className="toggle-switch"></span>
                          <span className="day-name">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </span>
                        </label>
                      </div>
                      
                      <AnimatePresence>
                        {!formData.openingHours[day].closed && (
                          <motion.div 
                            className="time-inputs"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="time-field">
                              <label className="time-label">Open</label>
                              <input
                                type="time"
                                name={`openingHours.${day}.open`}
                                value={formData.openingHours[day].open}
                                onChange={handleChange}
                                className="time-input"
                              />
                            </div>
                            
                            <div className="time-separator">to</div>
                            
                            <div className="time-field">
                              <label className="time-label">Close</label>
                              <input
                                type="time"
                                name={`openingHours.${day}.close`}
                                value={formData.openingHours[day].close}
                                onChange={handleChange}
                                className="time-input"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </section>
              
              {/* Security Section */}
              <section className="form-section">
                <h2 className="section-title">Security</h2>
                
                <div className={`form-field ${touched.password && errors.password ? 'error' : ''}`}>
                  <label htmlFor="password" className="form-label">
                    Password<span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    minLength="8"
                    className={`form-input ${touched.password && errors.password ? 'input-error' : ''}`}
                  />
                  <PasswordStrengthIndicator />
                  <p className="password-hint">
                    Password should be at least 8 characters with uppercase, lowercase, 
                    numbers and special characters
                  </p>
                  {touched.password && errors.password && (
                    <div className="error-text">{errors.password}</div>
                  )}
                </div>
                
                <div className={`form-field ${touched.confirmPassword && errors.confirmPassword ? 'error' : ''}`}>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password<span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    minLength="8"
                    className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}`}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="error-text">{errors.confirmPassword}</div>
                  )}
                </div>
              </section>
              
              {/* Form Actions */}
              <div className="form-actions">
                <motion.button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    'Continue to Verification'
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.form 
              key="otp-form"
              onSubmit={verifyOtp} 
              className="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="section-title">OTP Verification</h2>
              <p className="otp-instructions">
                Please enter the 6-digit code sent to your email{' '}
                <span className="otp-email">{formData.email}</span>
              </p>
              
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="otp-digit"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              {errors.otp && (
                <div className="error-text text-center">{errors.otp}</div>
              )}
              
              <div className="otp-actions">
                <p className="otp-resend-text">
                  Didn't receive the code?{' '}
                  <button 
                    type="button" 
                    onClick={resendOtp} 
                    className="btn-link"
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
              
              <div className="form-actions">
                <motion.button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Back
                </motion.button>
                <motion.button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    'Complete Registration'
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RestaurantSignUp;