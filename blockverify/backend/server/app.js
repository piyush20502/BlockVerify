const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import routes
const documentRoutes = require('./routes/documents');
const authRoutes = require('./routes/auth');
const verificationRoutes = require('./routes/verification');

// Initialize express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/verify', verificationRoutes);

// Base route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to BlockVerify API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;