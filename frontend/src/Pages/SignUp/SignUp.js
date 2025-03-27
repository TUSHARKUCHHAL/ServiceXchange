import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { Eye, EyeOff, User, Lock, Heart, Mail, Users, Phone, UserPlus } from 'lucide-react';
import './SignUp.css';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const SignupPage = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [error, setError] = useState(null);

  useEffect(() => {
    // Trigger animation on load
    setTimeout(() => setAnimateElements(true), 500);
  }, []);

  useEffect(() => {
    // Check if passwords match
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleGoogleLogin = async (response) => {
    const token = response.credential;  // Make sure this is correct!
    
    const res = await fetch("http://localhost:5000/api/users/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  
    const data = await res.json();
    console.log(data);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Register User
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      // Step 2: Send OTP
      const otpResponse = await fetch("http://localhost:5000/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const otpData = await otpResponse.json();
      if (!otpResponse.ok) throw new Error(otpData.message || "OTP sending failed");

      setOtp(otpData.otp); // Store OTP
      setOtpSent(true); // Show OTP input field
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: enteredOtp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "OTP verification failed");

      // If OTP is correct, store token and complete signup
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", formData.email);
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOtp = () => {
    setOtpSent(false);
    setEnteredOtp("");
    setOtp("");
   };
    

  return (
    <div className="signup-container">
      {/* Background animation elements */}
      <div class="bg-animation">
      <div class="bg-element element-1"></div>
      <div class="bg-element element-2"></div>
      <div class="bg-element element-3"></div>
      <div class="bg-element element-4"></div>
      
      <div class="decor-element decor-1"></div>
      <div class="decor-element decor-2"></div>
      <div class="decor-element decor-3"></div>
      <div class="decor-element decor-4"></div>
      <div class="decor-element decor-5"></div>
  
      <div class="bg-gradient"></div>
</div>

      <div className={`signup-card ${animateElements ? 'animate-in' : ''}`}>
        {/* Logo and Title */}
        <div className="logo-container">
          <div className="logo-wrapper">
            <UserPlus size={36} className="logo-icon" />
          </div>
          <h1 className="title">ServiceXchange</h1>
          <p className="subtitle">Create your account and start connecting</p>
        </div>

        {/* Floating icons */}
        <div className="floating-icons">
          <Users size={20} className={`float-icon icon-1 ${animateElements ? 'animate' : ''}`} />
          <Heart size={18} className={`float-icon icon-2 ${animateElements ? 'animate' : ''}`} />
          <Phone size={20} className={`float-icon icon-3 ${animateElements ? 'animate' : ''}`} />
          <Heart size={16} className={`float-icon icon-4 ${animateElements ? 'animate' : ''}`} />
          <Users size={18} className={`float-icon icon-5 ${animateElements ? 'animate' : ''}`} />
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="name-fields">
            <div className="input-group">
              <div className="input-icon">
                <User size={20} />
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="First Name"
              />
              <div className="focus-indicator"></div>
            </div>

            <div className="input-group">
              <div className="input-icon">
                <User size={20} />
              </div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Last Name"
              />
              <div className="focus-indicator"></div>
            </div>
          </div>

          <div className="input-group">
            <div className="input-icon">
              <Mail size={20} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Email address"
            />
            <div className="focus-indicator"></div>
          </div>

          <div className="input-group">
            <div className="input-icon">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <div className="focus-indicator"></div>
          </div>

          <div className="input-group">
            <div className="input-icon">
              <Lock size={20} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`input-field ${!passwordMatch && formData.confirmPassword ? 'password-error' : ''}`}
              placeholder="Confirm Password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <div className="focus-indicator"></div>
          </div>
          
          {!passwordMatch && formData.confirmPassword && (
            <div className="error-message">Passwords do not match</div>
          )}

          <div className="terms-check">
            <input
              id="terms-agreement"
              name="terms"
              type="checkbox"
              required
              className="checkbox"
            />
            <label htmlFor="terms-agreement" className="checkbox-label">
              I agree to the <a href="/terms-of-service" className="text-link">Terms of Service</a> and <a href="/privacy-policy" className="text-link">Privacy Policy</a>
            </label>
          </div>

          {/* OTP Popup */}
          {otpSent && (
            <div className="otp-modal">
              <div className="otp-box">
                <h2>Enter OTP</h2>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
                <div className="otp-buttons">
                  <button 
                    className="verify-button" 
                    onClick={(e) => verifyOtp(e)}
                  >
                    <span className="button-ripple"></span>
                    Verify OTP
                  </button>
                  <button 
                    className="cancel-button" 
                    onClick={handleCancelOtp}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="submit-container">
            <button
              type="submit"
              disabled={isLoading || (formData.confirmPassword && !passwordMatch)}
              className="submit-button"
            >
              <span className="button-ripple"></span>
              {isLoading ? (
                <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        <div className="login-prompt">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-link">
              Login
            </a>
          </p>
        </div>
        
        <div className="social-signup">
          <div className="divider">
            <span className="divider-text">Or sign up with</span>
          </div>

          <div className="social-buttons">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin 
                  onSuccess={handleGoogleLogin} 
                  onError={() => setError("Google Login Failed")}
                  theme="outline"
                  size="large"
                  shape="pill"
                />
              </GoogleOAuthProvider>
            {/* <button className="social-button">
              <img src="/api/placeholder/20/20" alt="Facebook" className="social-icon" />
              Facebook
            </button>
            <button className="social-button">
              <img src="/api/placeholder/20/20" alt="Apple" className="social-icon" />
              Apple
            </button> */}
          </div>
        </div>

        {/* Stats */}
        <div className="service-stats">
          <p>Join our growing community today</p>
          <div className="stats-container">
            <span className="stat-item">
              <Users size={12} className="stat-icon" /> 
              5,000+ Users
            </span>
            <span className="stat-item">
              <Heart size={12} className="stat-icon" /> 
              15,000+ Services
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;