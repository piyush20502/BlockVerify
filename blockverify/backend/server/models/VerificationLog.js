const VerificationLogSchema = {
  institution: {
    type: 'ObjectId', // or 'string' depending on your implementation
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
    type: 'ObjectId', // or 'string' depending on your implementation
    ref: 'User'
  },
  metadata: {
    type: 'Mixed' // or 'object' for plain JavaScript
  },
  verifiedAt: {
    type: Date,
    default: Date.now
  },
  transactionHash: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
};

// Index definitions (would be implemented differently in non-MongoDB systems)
const VerificationLogIndexes = [
  { fields: { documentId: 1, institution: 1 } }
];

module.exports = {
  VerificationLogSchema,
  VerificationLogIndexes
};