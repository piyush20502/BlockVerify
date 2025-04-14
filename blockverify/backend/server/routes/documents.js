const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const auth = require('../middleware/auth');

// First load environment variables
const contractAddress = process.env.CONTRACT_ADDRESS;
const rpcUrl = process.env.ETHEREUM_RPC_URL;
const privateKey = process.env.PRIVATE_KEY;

// Check ethers version and initialize provider and wallet accordingly
let provider, wallet;

// For ethers v6
if (ethers.JsonRpcProvider) {
  provider = new ethers.JsonRpcProvider(rpcUrl);
  wallet = new ethers.Wallet(privateKey, provider);
} 
// For ethers v5
else if (ethers.providers && ethers.providers.JsonRpcProvider) {
  provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  wallet = new ethers.Wallet(privateKey, provider);
} else {
  throw new Error('Unsupported ethers.js version');
}

// Then import and use contract ABI
const MarksVerificationABI = require('../artifacts/contracts/MarksVerification.sol/MarksVerification.json').abi;
const contract = new ethers.Contract(contractAddress, MarksVerificationABI, wallet);

console.log("Contract initialized at:", contractAddress); // Debug log

/**
 * Generates a hash from document data
 */
const generateHash = (data) => {
  // Handle different ethers versions
  if (ethers.keccak256 && ethers.toUtf8Bytes) {
    // ethers v6
    return ethers.keccak256(ethers.toUtf8Bytes(data));
  } else if (ethers.utils && ethers.utils.keccak256 && ethers.utils.toUtf8Bytes) {
    // ethers v5
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));
  } else {
    throw new Error('Unsupported ethers.js version');
  }
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
    const result = await contract.verifyMarksheet(documentId, hash);
    
    // Convert BigNumber to number if needed
    const verificationCode = typeof result === 'object' && result.toNumber ? 
      result.toNumber() : Number(result);
    
    console.log('Verification result code:', verificationCode);
    
    let message, isValid;
    
    switch (verificationCode) {
      case 0:
        message = 'Document not found in registry';
        isValid = false;
        break;
      case 1:
        message = 'Document exists but content has been altered';
        isValid = false;
        break;
      case 2:
        message = 'Document is authentic';
        isValid = true;
        break;
      default:
        message = 'Unexpected verification result';
        isValid = false;
    }
    
    // Success response
    res.status(200).json({
      success: true,
      verificationCode,
      isValid,
      message,
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