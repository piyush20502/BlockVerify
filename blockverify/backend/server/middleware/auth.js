const jwt = require('jsonwebtoken');
const config = require('../config');

// Authentication middleware
const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;