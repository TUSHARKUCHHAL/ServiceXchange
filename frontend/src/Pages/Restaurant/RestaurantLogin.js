import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, UtensilsCrossed, Store, Clock, AlertCircle } from 'lucide-react';
import './RestaurantLogin.css';

const RestaurantLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation on load
    setTimeout(() => setAnimateElements(true), 500);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/restaurants/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('restaurantToken', data.token);
      
      // Redirect to dashboard
      navigate('/restaurant/donate');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
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
            <UtensilsCrossed size={36} className="logo-icon" />
          </div>
          <h1 className="title">Restaurant Portal</h1>
          <p className="subtitle">Login to manage your restaurant account</p>
        </div>

        {/* Floating icons */}
        <div className="floating-icons">
          <Store size={20} className={`float-icon icon-1 ${animateElements ? 'animate' : ''}`} />
          <UtensilsCrossed size={18} className={`float-icon icon-2 ${animateElements ? 'animate' : ''}`} />
          <Clock size={20} className={`float-icon icon-3 ${animateElements ? 'animate' : ''}`} />
          <UtensilsCrossed size={16} className={`float-icon icon-4 ${animateElements ? 'animate' : ''}`} />
          <Store size={18} className={`float-icon icon-5 ${animateElements ? 'animate' : ''}`} />
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="error-container">
            <AlertCircle size={18} className="error-icon" />
            <p className="error-message">{error}</p>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-icon">
              <User size={20} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Restaurant email address"
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
              <Link to="/restaurant/forgot-password" className="text-link">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="submit-container">
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              <span className="button-ripple"></span>
              {loading ? (
                <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Login to Restaurant Portal"
              )}
            </button>
          </div>
        </form>

        <div className="register-prompt">
          <p>
            Don't have a restaurant account?{' '}
            <Link to="/restaurant/signup" className="text-link">
              Register here
            </Link>
          </p>
        </div>

        {/* Stats */}
        <div className="service-stats">
          <p>Empowering restaurants since 2023</p>
          <div className="stats-container">
            <span className="stat-item">
              <Store size={12} className="stat-icon" /> 
              500+ Restaurants
            </span>
            <span className="stat-item">
              <UtensilsCrossed size={12} className="stat-icon" /> 
              10,000+ Meals Donated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;