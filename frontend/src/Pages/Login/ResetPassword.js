import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, Heart, Users, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import './Login.css'; // Reusing the same styling

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [animateElements, setAnimateElements] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation on load
    setTimeout(() => setAnimateElements(true), 500);
    
    // Validate token exists
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate password
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      setSuccess(true);

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Reset Password Error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
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

      <div className={`login-card ${animateElements ? 'animate-in' : ''}`}>
        {/* Logo and Title */}
        <div className="logo-container">
          <div className="logo-wrapper">
            <Heart size={36} className="logo-icon" />
          </div>
          <h1 className="title">ServiceXchange</h1>
          <p className="subtitle">Create a new password</p>
        </div>

        {/* Floating icons */}
        <div className="floating-icons">
          <Users size={20} className={`float-icon icon-1 ${animateElements ? 'animate' : ''}`} />
          <Heart size={18} className={`float-icon icon-2 ${animateElements ? 'animate' : ''}`} />
          <Phone size={20} className={`float-icon icon-3 ${animateElements ? 'animate' : ''}`} />
          <Heart size={16} className={`float-icon icon-4 ${animateElements ? 'animate' : ''}`} />
          <Users size={18} className={`float-icon icon-5 ${animateElements ? 'animate' : ''}`} />
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="error-container">
            <AlertCircle size={18} className="error-icon" />
            <p className="error-message">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success ? (
          <div className="success-container">
            <div className="success-message">
              <h3>Password Reset Successful!</h3>
              <p>Your password has been changed. You will be redirected to the login page in a moment.</p>
              <button 
                className="submit-button" 
                onClick={() => navigate('/login')}
                style={{ marginTop: '20px' }}
              >
                Go to Login
              </button>
            </div>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-icon">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input-field"
                placeholder="New password"
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-field"
                placeholder="Confirm new password"
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

            <div className="password-requirements">
              <p>Password must be at least 8 characters long</p>
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
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        )}

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

export default ResetPassword;