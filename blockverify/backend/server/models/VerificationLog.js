const mongoose = require('mongoose');

const VerificationLogSchema = new mongoose.Schema({
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentId: {
    type: String,
    required: true,
    index: true
  },
  documentHash: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  verifiedAt: {
    type: Date,
    default: Date.now
  },
  transactionHash: {
    type: String
  }
}, {
  timestamps: true
});

// Add compound index for faster queries
VerificationLogSchema.index({ documentId: 1, institution: 1 });

module.exports = mongoose.model('VerificationLog', VerificationLogSchema);