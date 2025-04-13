const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const VerificationLog = require('../models/VerificationLog');

// Get verification history for an institution
router.get('/history', auth, async (req, res) => {
  try {
    const logs = await VerificationLog.find({ institution: req.user.id })
      .sort({ verifiedAt: -1 });
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching verification history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Log a verification attempt
router.post('/log', auth, async (req, res) => {
  try {
    const { documentId, isValid, metadata } = req.body;
    
    const log = new VerificationLog({
      institution: req.user.id,
      documentId,
      isValid,
      metadata
    });
    
    await log.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Verification logged successfully' 
    });
  } catch (error) {
    console.error('Error logging verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};