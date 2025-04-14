const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = {
  name: {
    type: String,
    required: [true, 'Please provide name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Never return password in queries
  },
  role: {
    type: String,
    enum: ['institution', 'verifier', 'admin'],
    default: 'institution'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
};

// User methods
const UserMethods = {
  // Encrypt password before saving
  encryptPassword: async function(password) {
    return await bcrypt.hash(password, 12);
  },

  // Compare passwords
  comparePassword: async function(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },

  // Generate JWT token
  generateAuthToken: function(userId, role) {
    return jwt.sign(
      { id: userId, role: role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
  },

  // Create password reset token
  createPasswordResetToken: function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    const passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return { resetToken, hashedToken, passwordResetExpires };
  }
};

module.exports = {
  UserSchema,
  UserMethods
};