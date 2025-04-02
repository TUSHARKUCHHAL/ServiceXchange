// src/components/RestaurantSignUp.js
import React, { useState } from 'react';
import './RestaurantSignUp.css';
import axios from 'axios';

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
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const validateForm = () => {
        // Password validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        
        // Phone validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setError('');
            setSuccess('');
            
            // Send request to generate OTP
            const response = await axios.post('http://localhost:5000/api/restaurants/send-otp', {
                email: formData.email
            });
            
            if (response.data.success) {
                setSuccess('OTP sent to your email. Please verify to complete registration.');
                setStep(2);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        
        try {
            setError('');
            
            // Verify OTP and create restaurant account
            const response = await axios.post('http://localhost:5000/api/restaurants/verify-otp', {
                email: formData.email,
                otp,
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
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <h1>Restaurant Registration</h1>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {step === 1 ? (
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-section">
                        <h2>Basic Information</h2>
                        <div className="form-group">
                            <label htmlFor="restaurantName">Restaurant Name*</label>
                            <input
                                type="text"
                                id="restaurantName"
                                name="restaurantName"
                                value={formData.restaurantName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email Address*</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number*</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="10-digit number"
                            />
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h2>Location</h2>
                        <div className="form-group">
                            <label htmlFor="address">Street Address*</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City*</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="state">State*</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="zipCode">ZIP Code*</label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h2>Opening Hours</h2>
                        <div className="hours-container">
                            {Object.keys(formData.openingHours).map((day) => (
                                <div key={day} className="day-hours">
                                    <div className="day-header">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={!formData.openingHours[day].closed}
                                                onChange={() => handleDayToggle(day)}
                                            />
                                            {day.charAt(0).toUpperCase() + day.slice(1)}
                                        </label>
                                    </div>
                                    
                                    {!formData.openingHours[day].closed && (
                                        <div className="time-inputs">
                                            <input
                                                type="time"
                                                name={`openingHours.${day}.open`}
                                                value={formData.openingHours[day].open}
                                                onChange={handleChange}
                                            />
                                            <span>to</span>
                                            <input
                                                type="time"
                                                name={`openingHours.${day}.close`}
                                                value={formData.openingHours[day].close}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h2>Security</h2>
                        <div className="form-group">
                            <label htmlFor="password">Password*</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="8"
                            />
                            <small>Minimum 8 characters</small>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password*</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength="8"
                            />
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Register Restaurant</button>
                    </div>
                </form>
            ) : (
                <form onSubmit={verifyOtp} className="otp-form">
                    <h2>OTP Verification</h2>
                    <p>Please enter the 6-digit code sent to your email {formData.email}</p>
                    
                    <div className="form-group">
                        <label htmlFor="otp">OTP Code*</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength="6"
                            placeholder="Enter 6-digit OTP"
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                            Back
                        </button>
                        <button type="submit" className="btn-primary">
                            Verify & Complete Registration
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RestaurantSignUp;