import { useState } from 'react';
import { motion } from 'framer-motion';
import './ngosign.css';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    password: '',
    confirmPassword: '',
    logoUrl: '',
    logoFile: null,
    orgType: '',
    description: '',
    website: '',
    phone: '',
    address: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
    
    if (type === 'file' && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logoFile: file,
          logoUrl: reader.result
        });
      };
      
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Signup data:', formData);
      setIsLoading(false);
      // Handle registration logic here
    }, 1500);
  };

  // Background animation elements
  const renderBackgroundElements = () => {
    return (
      <div className="bg-animation">
        <div className="bg-element element-1"></div>
        <div className="bg-element element-2"></div>
        <div className="bg-element element-3"></div>
        <div className="bg-element element-4"></div>
        
        <div className="decor-element decor-1"></div>
        <div className="decor-element decor-2"></div>
        <div className="decor-element decor-3"></div>
        <div className="decor-element decor-4"></div>
        <div className="decor-element decor-5"></div>
      </div>
    );
  };

  return (
    <div className="main-container signup-container">
      {renderBackgroundElements()}
      
      <motion.div 
        className="signup-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="signup-header">
          <h1>Create Your NGO Account</h1>
          <p>Join our community and make a difference</p>
          
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {step === 1 && (
            <motion.div 
              className="form-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="form-group">
                <label htmlFor="orgName">Organization Name</label>
                <input
                  type="text"
                  id="orgName"
                  name="orgName"
                  value={formData.orgName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your organization name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="contact@yourorganization.org"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a secure password"
                />
                
                <div className="password-strength">
                  <div className="strength-meter">
                    <div 
                      className="strength-value" 
                      style={{ 
                        width: `${passwordStrength * 25}%`,
                        backgroundColor: 
                          passwordStrength === 0 ? '#e74c3c' :
                          passwordStrength === 1 ? '#e67e22' :
                          passwordStrength === 2 ? '#f1c40f' :
                          passwordStrength === 3 ? '#2ecc71' :
                          '#27ae60'
                      }}
                    ></div>
                  </div>
                  <span className="strength-text">
                    {passwordStrength === 0 && 'Very Weak'}
                    {passwordStrength === 1 && 'Weak'}
                    {passwordStrength === 2 && 'Medium'}
                    {passwordStrength === 3 && 'Strong'}
                    {passwordStrength === 4 && 'Very Strong'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
                {formData.password && formData.confirmPassword && 
                 formData.password !== formData.confirmPassword && (
                  <p className="password-mismatch">Passwords do not match</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="next-button"
                type="button"
                onClick={nextStep}
                disabled={!formData.orgName || !formData.email || !formData.password || 
                         formData.password !== formData.confirmPassword}
              >
                Next
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              className="form-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="form-group">
                <label htmlFor="orgType">Organization Type</label>
                <select
                  id="orgType"
                  name="orgType"
                  value={formData.orgType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="nonprofit">Non-profit</option>
                  <option value="charity">Charity</option>
                  <option value="foundation">Foundation</option>
                  <option value="trust">Trust</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Organization Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Briefly describe your organization's mission"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="website">Website (Optional)</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.yourorganization.org"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Contact Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (123) 456-7890"
                />
              </div>

              <div className="nav-buttons">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="back-button"
                  type="button"
                  onClick={prevStep}
                >
                  Back
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="next-button"
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.orgType || !formData.description || !formData.phone}
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              className="form-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="form-group logo-upload">
                <label>Organization Logo</label>
                <div className="logo-preview-container">
                  {formData.logoUrl ? (
                    <img 
                      src={formData.logoUrl} 
                      alt="Logo Preview" 
                      className="logo-preview" 
                    />
                  ) : (
                    <div className="logo-placeholder">
                      <i className="fas fa-image"></i>
                      <span>Upload Logo</span>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    id="logoFile"
                    name="logoFile"
                    onChange={handleChange}
                    accept="image/*"
                    className="file-input"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="upload-btn"
                    onClick={() => document.getElementById('logoFile').click()}
                  >
                    {formData.logoUrl ? 'Change Logo' : 'Select Logo'}
                  </motion.button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Organization Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  required
                  placeholder="Enter your organization's address"
                ></textarea>
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
                  I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="privacy-link">Privacy Policy</a>
                </label>
              </div>

              <div className="nav-buttons">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="back-button"
                  type="button"
                  onClick={prevStep}
                >
                  Back
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="signup-button"
                  type="submit"
                  disabled={isLoading || !formData.address || !formData.agreeTerms}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </form>

        <div className="signup-footer">
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;