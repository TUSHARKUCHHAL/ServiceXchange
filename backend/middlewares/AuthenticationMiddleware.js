const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');

// Environment variables (should be in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add restaurant from payload to req object
    const restaurant = await Restaurant.findById(decoded.id).select('-password');
    
    if (!restaurant) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.restaurant = restaurant;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};