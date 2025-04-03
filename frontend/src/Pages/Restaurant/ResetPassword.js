import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify token validity when component mounts
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/restaurants/verify-reset-token/${token}`);
        const data = await response.json();
        
        if (!response.ok) {
          setTokenValid(false);
          setError(data.message || 'Invalid or expired token');
        }
      } catch (err) {
        setTokenValid(false);
        setError('Could not verify reset token');
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/restaurants/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: formData.password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      // Redirect to login page with success message
      navigate('/restaurant/login', { state: { message: 'Password reset successful. Please login with your new password.' } });
    } catch (err) {
      setError(err.message || 'An error occurred while resetting your password');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form-wrapper">
          <h1>Invalid Reset Link</h1>
          <p className="error-message">
            {error || 'This password reset link is invalid or has expired.'}
          </p>
          <div className="back-to-forgot">
            <Link to="/forgot-password">Request a new reset link</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-form-wrapper">
        <h1>Reset Your Password</h1>
        <form className="reset-password-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter new password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
            />
          </div>
          
          <button type="submit" className="reset-button" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        
        <div className="back-to-login">
          <Link to="/restaurant/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;