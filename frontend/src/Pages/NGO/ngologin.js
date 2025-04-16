// Login.js
import React, { useState } from 'react';
import './ngologin.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt with:', { email, password });
      setIsLoading(false);
      // Handle login logic here
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to continue your journey of making a difference</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <i className="icon email-icon">✉️</i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <span 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>
          
          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
            <span className="button-overlay"></span>
          </button>
        </form>
        
        <div className="social-login">
          <p>Or login with</p>
          <div className="social-icons">
            <button className="social-icon google">G</button>
            <button className="social-icon facebook">f</button>
            <button className="social-icon twitter">X</button>
          </div>
        </div>
        
        <div className="signup-prompt">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
      
      <div className="login-image">
        <div className="image-overlay">
          <h2>Making A Difference Together</h2>
          <p>Join our network of NGOs committed to creating positive change</p>
        </div>
      </div>
    </div>
  );
};

export default Login;