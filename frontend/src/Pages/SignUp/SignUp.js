import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Heart, Mail, Users, Phone, UserPlus, X } from 'lucide-react';
import './SignUp.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState(null);
  const [isOtpPopupOpen, setIsOtpPopupOpen] = useState(false);
  const [otpTimer, setOtpTimer] = useState(600); // 10 minutes
  const [step, setStep] = useState('signup'); // Track signup steps

  useEffect(() => {
    setTimeout(() => setAnimateElements(true), 500);
  }, []);

  useEffect(() => {
    // Password match check
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  // OTP Timer
  useEffect(() => {
    let interval;
    if (isOtpPopupOpen && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpPopupOpen, otpTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP sending failed");
      }

      // Open OTP popup
      setIsOtpPopupOpen(true);
      setOtpTimer(600); // Reset timer
      setStep('otp');
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", formData.email);

      // Navigate to home
      navigate("/");
      window.location.reload();
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const renderSignupForm = () => (
    <form className="signup-form" onSubmit={handleSendOTP}>
      {/* Existing signup form fields */}
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
        </div>
      </div>

      {/* Email input */}
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
      </div>

      {/* Password inputs */}
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
      </div>
      
      {!passwordMatch && formData.confirmPassword && (
        <div className="error-message">Passwords do not match</div>
      )}

      {/* Terms and submit */}
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

      <div className="submit-container">
        <button
          type="submit"
          disabled={isLoading || (formData.confirmPassword && !passwordMatch)}
          className="submit-button"
        >
          {isLoading ? (
            <svg className="loading-spinner">
              <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Sign Up"
          )}
        </button>
      </div>
    </form>
  );

  const renderOTPForm = () => (
    isOtpPopupOpen && (
      <div className="otp-popup-overlay">
        <div className="otp-popup">
          <button 
            className="close-popup" 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOtpPopupOpen(false);
              setStep('signup');
            }}
          >
            <X size={24} />
          </button>
      
          <h2>Verify OTP</h2>
          <p>Enter the 6-digit code sent to {formData.email}</p>
          
          <form onSubmit={handleVerifyOTP}>
            <div className="input-group">
              <div className="input-icon">
                <Mail size={20} />
              </div>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                maxLength="6"
                className="input-field"
                placeholder="Enter 6-digit OTP"
              />
            </div>

            <div className="otp-timer">
              Time Remaining: {formatTime(otpTimer)}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="submit-container">
              <button
                type="submit"
                disabled={isLoading || formData.otp.length !== 6}
                className="submit-button"
              >
                {isLoading ? (
                  <svg className="loading-spinner">
                    <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          </form>

          <div className="resend-otp">
            <button 
              type="button" 
              onClick={handleSendOTP}
              disabled={otpTimer > 0}
            >
              Resend OTP {otpTimer > 0 ? `(${formatTime(otpTimer)})` : ''}
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="signup-container">
      {/* Background animation elements */}
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
    
        <div className="bg-gradient"></div>
      </div>

      <div className={`signup-card ${animateElements ? 'animate-in' : ''}`}>
        {/* Logo and Title */}
        <div className="logo-container">
          <div className="logo-wrapper">
            <UserPlus size={36} className="logo-icon" />
          </div>
          <h1 className="title">ServiceXchange</h1>
        </div>

        {/* Conditional rendering of signup or OTP form */}
        {step === 'signup' ? renderSignupForm() : renderOTPForm()}

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