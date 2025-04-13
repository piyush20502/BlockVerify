const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const auth = require('../middleware/auth');
const MarksVerificationABI = require('../utils/MarksVerificationABI.json').abi;

// Load contract configuration
const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, MarksVerificationABI, wallet);

/**
 * Generates a SHA-256 hash from document data
 * @param {string} data - The document data to hash
 * @returns {string} The generated hash
 */
const generateHash = (data) => {
  return ethers.utils.id(data);
};

/**
 * @route POST /api/documents/publish
 * @desc Publish document hash to blockchain
 * @access Private (requires authentication)
 */
router.post('/publish', auth, async (req, res) => {
  try {
    const { documentId, documentData } = req.body;
    
    // Validate input
    if (!documentId || !documentData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Document ID and data are required' 
      });
    }
    
    // Generate hash and publish to blockchain
    const hash = generateHash(documentData);
    const tx = await contract.publishMarksheetHash(documentId, hash);
    const receipt = await tx.wait();
    
    // Success response
    res.status(201).json({
      success: true,
      message: 'Document hash published successfully',
      transactionHash: receipt.transactionHash,
      documentId,
      blockNumber: receipt.blockNumber
    });
    
  } catch (error) {
    console.error('Error publishing document hash:', error);
    
    // Handle specific error cases
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds for transaction'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error publishing document hash',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/documents/verify
 * @desc Verify document hash on blockchain
 * @access Public
 */
router.post('/verify', async (req, res) => {
  try {
    const { documentId, documentData } = req.body;
    
    // Validate input
    if (!documentId || !documentData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Document ID and data are required' 
      });
    }
    
    // Generate hash and verify on blockchain
    const hash = generateHash(documentData);
    const isValid = await contract.verifyMarksheet(documentId, hash);
    
    // Success response
    res.status(200).json({
      success: true,
      isValid,
      message: isValid ? 'Document is authentic' : 'Document verification failed',
      documentId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error verifying document:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying document',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;