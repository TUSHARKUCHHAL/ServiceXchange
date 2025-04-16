// Signup.js
import React, { useState } from 'react';
import './ngosign.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ngoType: '',
    agreeTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleNextStep = () => {
    setCurrentStep(2);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      console.log('Registration data:', formData);
      setIsLoading(false);
      // Handle registration logic here
    }, 1500);
  };
  
  const ngoTypes = [
    'Education', 
    'Healthcare', 
    'Environment', 
    'Human Rights', 
    'Animal Welfare',
    'Poverty Alleviation',
    'Disaster Relief',
    'Arts & Culture',
    'Community Development',
    'Other'
  ];

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Join Our Network</h1>
          <p>Create an account to connect with other change-makers</p>
          
          <div className="progress-bar">
            <div className="progress-step completed">
              <div className="step-number">1</div>
              <span className="step-label">Account</span>
            </div>
            <div className="progress-line">
              <div className={`line-fill ${currentStep === 2 ? 'filled' : ''}`}></div>
            </div>
            <div className={`progress-step ${currentStep === 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <span className="step-label">Details</span>
            </div>
          </div>
        </div>
        
        <form className="signup-form" onSubmit={handleSubmit}>
          {currentStep === 1 ? (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-container">
                  <i className="icon email-icon">✉️</i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <i className="icon password-icon">🔒</i>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                  />
                  <span 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </span>
                </div>
                <div className="password-strength">
                  <div className={`strength-bar ${formData.password.length > 0 ? 'weak' : ''}`}></div>
                  <div className={`strength-bar ${formData.password.length > 5 ? 'medium' : ''}`}></div>
                  <div className={`strength-bar ${formData.password.length > 8 ? 'strong' : ''}`}></div>
                  <span className="strength-text">
                    {formData.password.length === 0 && 'Password strength'}
                    {formData.password.length > 0 && formData.password.length <= 5 && 'Weak'}
                    {formData.password.length > 5 && formData.password.length <= 8 && 'Medium'}
                    {formData.password.length > 8 && 'Strong'}
                  </span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-container">
                  <i className="icon password-icon">🔒</i>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="password-mismatch">Passwords don't match</p>
                )}
              </div>
              
              <button 
                type="button" 
                className="continue-button"
                onClick={handleNextStep}
                disabled={!formData.email || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
              >
                Continue
                <span className="button-overlay"></span>
              </button>
            </div>
          ) : (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="orgName">Organization Name</label>
                <div className="input-container">
                  <i className="icon org-icon">🏢</i>
                  <input
                    type="text"
                    id="orgName"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    placeholder="Enter your organization name"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="ngoType">Organization Type</label>
                <div className="input-container">
                  <i className="icon type-icon">📋</i>
                  <select
                    id="ngoType"
                    name="ngoType"
                    value={formData.ngoType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select your organization type</option>
                    {ngoTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreeTerms">
                  I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
                </label>
              </div>
              
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="back-button"
                  onClick={handlePrevStep}
                >
                  Back
                </button>
                
                <button 
                  type="submit" 
                  className={`signup-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading || !formData.orgName || !formData.ngoType || !formData.agreeTerms}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  <span className="button-overlay"></span>
                </button>
              </div>
            </div>
          )}
        </form>
        
        <div className="login-prompt">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
      
      <div className="signup-image">
        <div className="image-overlay">
          <h2>Make An Impact</h2>
          <p>Connect with other NGOs and amplify your impact in communities around the world</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;