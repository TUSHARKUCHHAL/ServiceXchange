import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Heart, Users, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  useEffect(() => {
    // Trigger animation on load
    setTimeout(() => setAnimateElements(true), 500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // Send OTP email
      const otpResponse = await fetch("http://localhost:5000/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const otpData = await otpResponse.json();
      if (!otpResponse.ok) throw new Error(otpData.message || "OTP failed");

      setOtp(otpData.otp); // Store OTP received from backend
      setOtpSent(true); // Show OTP input modal
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (enteredOtp === otp) {
      localStorage.setItem("token", "userToken");
      localStorage.setItem("userEmail", email);
      navigate("/");
      window.location.reload();
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };
  

  return (
    <div className="login-container">
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

      <div className={`login-card ${animateElements ? 'animate-in' : ''}`}>
        {/* Logo and Title */}
        <div className="logo-container">
          <div className="logo-wrapper">
            <Heart size={36} className="logo-icon" />
          </div>
          <h1 className="title">ServiceXchange</h1>
          <p className="subtitle">Login to access your account</p>
        </div>

        {/* Floating icons */}
        <div className="floating-icons">
          <Users size={20} className={`float-icon icon-1 ${animateElements ? 'animate' : ''}`} />
          <Heart size={18} className={`float-icon icon-2 ${animateElements ? 'animate' : ''}`} />
          <Phone size={20} className={`float-icon icon-3 ${animateElements ? 'animate' : ''}`} />
          <Heart size={16} className={`float-icon icon-4 ${animateElements ? 'animate' : ''}`} />
          <Users size={18} className={`float-icon icon-5 ${animateElements ? 'animate' : ''}`} />
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-icon">
              <User size={20} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                <button onClick={verifyOtp}>Verify OTP</button>
              </div>
            </div>
          )}

          <div className="form-options">
            <div className="remember-me">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="checkbox"
              />
              <label htmlFor="remember-me" className="checkbox-label">
                Remember me
              </label>
            </div>

            <div className="forgot-password">
              <a href="#" className="text-link">
                Forgot your password?
              </a>
            </div>
          </div>

          <div className="submit-container">
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              <span className="button-ripple"></span>
              {isLoading ? (
                <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        <div className="register-prompt">
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="text-link">
              Sign Up
            </a>
          </p>
        </div>
        
        <div className="social-login">
          <div className="divider">
            <span className="divider-text">Or login with</span>
          </div>

          <div className="social-buttons">
            <button className="social-button">
              <img src="/api/placeholder/20/20" alt="Google" className="social-icon" />
              Google
            </button>
            <button className="social-button">
              <img src="/api/placeholder/20/20" alt="Facebook" className="social-icon" />
              Facebook
            </button>
            <button className="social-button">
              <img src="/api/placeholder/20/20" alt="Apple" className="social-icon" />
              Apple
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="service-stats">
          <p>Connecting services since 2023</p>
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

export default LoginPage;