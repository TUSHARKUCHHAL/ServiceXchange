import { useState } from 'react';
import { motion } from 'framer-motion';
import './ngologin.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', formData);
      setIsLoading(false);
      // Handle authentication logic here
    }, 1500);
  };

  return (
    <div className="main-container login-container">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <div className="logo-container">
            <img 
              src={formData.logoUrl || "/placeholder-logo.png"} 
              alt="NGO Logo" 
              className="ngo-logo" 
            />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your mission</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="yourname@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="login-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          
          <div className="social-login">
            <p>Or sign in with</p>
            <div className="social-icons">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="social-btn google"
                aria-label="Sign in with Google"
              >
                <i className="fab fa-google"></i>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="social-btn facebook"
                aria-label="Sign in with Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="social-btn twitter"
                aria-label="Sign in with Twitter"
              >
                <i className="fab fa-twitter"></i>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;