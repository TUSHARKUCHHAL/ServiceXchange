import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Heart, Users, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  

  useEffect(() => {
    // Trigger animation on load
    setTimeout(() => setAnimateElements(true), 500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
  
    // Basic password validation
    // if (!password || password.length < 6) {
    //   setError('Password must be at least 6 characters long');
    //   setIsLoading(false);
    //   return;
    // }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {  // Ensure correct backend port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
  
      // Log response details for debugging
      console.log(`Status: ${response.status}, Headers:`, response.headers);
  
      // Read response text
      const text = await response.text();
      console.log('Raw Response:', text);
  
      let data;
      try {
        data = JSON.parse(text); // Attempt to parse JSON
      } catch (jsonError) {
        throw new Error('Server returned invalid JSON. Response might be an error page.');
      }
  
      // Handle response errors
      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status} - ${response.statusText}`);
      }
  
      // Validate expected data fields
      if (!data.token || !data.user) {
        throw new Error('Invalid server response: Missing token or user data.');
      }
  
      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      login({
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        token: data.token
      });
  
      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleGoogleLogin = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      setError('Google authentication failed. Please try again.');
      return;
    }
  
    console.log("Google login initiated...");
  
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
  
      console.log("Response received:", response);
  
      // Check for errors before parsing JSON
      if (response.status === 404) {
        throw new Error('No account found for this Google email. Please sign up first.');
      }
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Google login failed');
      }
  
      const data = await response.json();
      console.log("Parsed response:", data);
  
      // Ensure valid token and user data
      if (!data?.token || !data?.user) {
        throw new Error('Invalid server response');
      }
  
      // Store token and user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
  
      console.log("User logged in:", data.user);
  
      // Call login function to update navbar state
      login({
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        token: data.token
      });
  
      console.log("Login state updated, redirecting...");
  
      // Redirect to dashboard or home page
      navigate('/');
    } catch (err) {
      console.error('Google Login Error:', err);
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      console.log("Stopping loading...");
      setIsLoading(false);
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
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                setError('Google login failed');
              }}
              text="signin_with"
              shape="rectangular"
              theme="outline"
            />
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