import React, { useState, useEffect } from 'react';
import './RestaurantSignUp.css';
import axios from 'axios';
import { motion } from 'framer-motion';

const RestaurantSignUp = () => {
    const [step, setStep] = useState(1); // 1: Initial form, 2: OTP verification
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
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Focus reference for OTP inputs
    const otpRefs = Array(6).fill(0).map(() => React.createRef());

    // Password strength evaluation
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Handle nested state for opening hours
        if (name.includes('openingHours')) {
            const [day, field] = name.split('.').slice(1);
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

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validateField(name);
    };

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
                const zipRegex = /^\d{5}(-\d{4})?$/;
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
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    
                    const addressData = response.data.address;
                    
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

    const validateForm = () => {
        // Validate all fields
        const fields = [
            'restaurantName', 'email', 'phoneNumber', 
            'address', 'city', 'state', 'zipCode', 
            'password', 'confirmPassword'
        ];
        
        // Mark all as touched
        const newTouched = fields.reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        
        setTouched(newTouched);
        
        // Validate each field
        const validationResults = fields.map(field => validateField(field));
        
        return validationResults.every(isValid => isValid);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll to the first error
            const firstErrorField = document.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        try {
            setErrors({});
            setSuccess('');
            setIsLoading(true);
            
            // Send request to generate OTP
            const response = await axios.post('http://localhost:5000/api/restaurants/send-otp', {
                email: formData.email
            });
            
            if (response.data.success) {
                setSuccess('OTP sent to your email. Please verify to complete registration.');
                setStep(2);
            }
        } catch (err) {
            setErrors(prev => ({ 
                ...prev, 
                submit: err.response?.data?.message || 'Failed to send OTP. Please try again.'
            }));
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleOtpKeyDown = (index, e) => {
        // Focus previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current.focus();
        }
    };

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
            
            // Verify OTP and create restaurant account
            const response = await axios.post('http://localhost:5000/api/restaurants/verify-otp', {
                email: formData.email,
                otp: otpString,
                restaurantData: formData
            });
            
            if (response.data.success) {
                setSuccess('Restaurant registration successful! Redirecting to login...');
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            }
        } catch (err) {
            setErrors(prev => ({ 
                ...prev, 
                otp: err.response?.data?.message || 'Invalid OTP. Please try again.'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async () => {
        try {
            setErrors({});
            setIsLoading(true);
            
            const response = await axios.post('http://localhost:5000/api/restaurants/send-otp', {
                email: formData.email,
                resend: true
            });
            
            if (response.data.success) {
                setSuccess('New OTP sent to your email.');
                setOtp(['', '', '', '', '', '']);
            }
        } catch (err) {
            setErrors(prev => ({ 
                ...prev, 
                otp: err.response?.data?.message || 'Failed to resend OTP. Please try again.'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    // Progress indicator for the form
    const getPasswordStrengthLabel = () => {
        if (passwordStrength === 0) return '';
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 3) return 'Medium';
        if (passwordStrength <= 4) return 'Strong';
        return 'Very Strong';
    };

    const renderPasswordStrength = () => {
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
        <motion.div 
            className="signup-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="title-container">
                <h1>Restaurant Registration</h1>
            </div>
            
            {errors.submit && (
                <motion.div 
                    className="error-message"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {errors.submit}
                </motion.div>
            )}
            
            {success && (
                <motion.div 
                    className="success-message"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {success}
                </motion.div>
            )}
            
            {step === 1 ? (
                <motion.form 
                    onSubmit={handleSubmit} 
                    className="signup-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className="form-section">
                        <h2>Basic Information</h2>
                        <div className={`form-group ${touched.restaurantName && errors.restaurantName ? 'error' : ''}`}>
                            <label htmlFor="restaurantName">Restaurant Name*</label>
                            <input
                                type="text"
                                id="restaurantName"
                                name="restaurantName"
                                value={formData.restaurantName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                className={touched.restaurantName && errors.restaurantName ? 'input-error' : ''}
                            />
                            {touched.restaurantName && errors.restaurantName && (
                                <div className="error-text">{errors.restaurantName}</div>
                            )}
                        </div>
                        
                        <div className={`form-group ${touched.email && errors.email ? 'error' : ''}`}>
                            <label htmlFor="email">Email Address*</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                className={touched.email && errors.email ? 'input-error' : ''}
                            />
                            {touched.email && errors.email && (
                                <div className="error-text">{errors.email}</div>
                            )}
                        </div>
                        
                        <div className={`form-group ${touched.phoneNumber && errors.phoneNumber ? 'error' : ''}`}>
                            <label htmlFor="phoneNumber">Phone Number*</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                placeholder="10-digit number"
                                className={touched.phoneNumber && errors.phoneNumber ? 'input-error' : ''}
                            />
                            {touched.phoneNumber && errors.phoneNumber && (
                                <div className="error-text">{errors.phoneNumber}</div>
                            )}
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h2>Location</h2>
                        <div className="location-actions">
                            <motion.button 
                                type="button" 
                                className="btn-location"
                                onClick={fetchLocation}
                                disabled={isLoading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isLoading ? 
                                    <span className="spinner"></span> : 
                                    <span>Use Current Location</span>
                                }
                            </motion.button>
                            {errors.location && <div className="error-text">{errors.location}</div>}
                        </div>
                        
                        <div className={`form-group ${touched.address && errors.address ? 'error' : ''}`}>
                            <label htmlFor="address">Street Address*</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                className={touched.address && errors.address ? 'input-error' : ''}
                            />
                            {touched.address && errors.address && (
                                <div className="error-text">{errors.address}</div>
                            )}
                        </div>
                        
                        <div className="form-row">
                            <div className={`form-group ${touched.city && errors.city ? 'error' : ''}`}>
                                <label htmlFor="city">City*</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={touched.city && errors.city ? 'input-error' : ''}
                                />
                                {touched.city && errors.city && (
                                    <div className="error-text">{errors.city}</div>
                                )}
                            </div>
                            
                            <div className={`form-group ${touched.state && errors.state ? 'error' : ''}`}>
                                <label htmlFor="state">State*</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={touched.state && errors.state ? 'input-error' : ''}
                                />
                                {touched.state && errors.state && (
                                    <div className="error-text">{errors.state}</div>
                                )}
                            </div>
                            
                            <div className={`form-group ${touched.zipCode && errors.zipCode ? 'error' : ''}`}>
                                <label htmlFor="zipCode">ZIP Code*</label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={touched.zipCode && errors.zipCode ? 'input-error' : ''}
                                />
                                {touched.zipCode && errors.zipCode && (
                                    <div className="error-text">{errors.zipCode}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h2>Opening Hours</h2>
                        <div className="hours-container">
                            {Object.keys(formData.openingHours).map((day) => (
                                <motion.div 
                                    key={day} 
                                    className="day-hours"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <div className="day-header">
                                        <label className="day-label">
                                            <div className="checkbox-wrapper">
                                                <input
                                                    type="checkbox"
                                                    checked={!formData.openingHours[day].closed}
                                                    onChange={() => handleDayToggle(day)}
                                                    className="custom-checkbox"
                                                />
                                                <div className="checkbox-custom"></div>
                                            </div>
                                            <span className="day-name">
                                                {day.charAt(0).toUpperCase() + day.slice(1)}
                                            </span>
                                        </label>
                                    </div>
                                    
                                    {!formData.openingHours[day].closed && (
                                        <motion.div 
                                            className="time-inputs"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <input
                                                type="time"
                                                name={`openingHours.${day}.open`}
                                                value={formData.openingHours[day].open}
                                                onChange={handleChange}
                                                className="time-input"
                                            />
                                            <span className="time-separator">to</span>
                                            <input
                                                type="time"
                                                name={`openingHours.${day}.close`}
                                                value={formData.openingHours[day].close}
                                                onChange={handleChange}
                                                className="time-input"
                                            />
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h2>Security</h2>
                        <div className={`form-group ${touched.password && errors.password ? 'error' : ''}`}>
                            <label htmlFor="password">Password*</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                minLength="8"
                                className={touched.password && errors.password ? 'input-error' : ''}
                            />
                            {renderPasswordStrength()}
                            <small>
                                Password should be at least 8 characters with uppercase, lowercase, 
                                numbers and special characters
                            </small>
                            {touched.password && errors.password && (
                                <div className="error-text">{errors.password}</div>
                            )}
                        </div>
                        
                        <div className={`form-group ${touched.confirmPassword && errors.confirmPassword ? 'error' : ''}`}>
                            <label htmlFor="confirmPassword">Confirm Password*</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                minLength="8"
                                className={touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <div className="error-text">{errors.confirmPassword}</div>
                            )}
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <motion.button 
                            type="submit" 
                            className="btn-primary"
                            disabled={isLoading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                'Register Restaurant'
                            )}
                        </motion.button>
                    </div>
                </motion.form>
            ) : (
                <motion.form 
                    onSubmit={verifyOtp} 
                    className="otp-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2>OTP Verification</h2>
                    <p>Please enter the 6-digit code sent to your email {formData.email}</p>
                    
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={otpRefs[index]}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="otp-input"
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                    
                    {errors.otp && (
                        <div className="error-text centered">{errors.otp}</div>
                    )}
                    
                    <div className="resend-otp">
                        <button 
                            type="button" 
                            onClick={resendOtp} 
                            className="resend-btn"
                            disabled={isLoading}
                        >
                            Resend OTP
                        </button>
                    </div>
                    
                    <div className="form-actions">
                        <motion.button 
                            type="button" 
                            className="btn-secondary"
                            onClick={() => setStep(1)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                        >
                            Back
                        </motion.button>
                        <motion.button 
                            type="submit" 
                            className="btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                'Verify & Complete Registration'
                            )}
                        </motion.button>
                    </div>
                </motion.form>
            )}
        </motion.div>
    );
};

export default RestaurantSignUp;    