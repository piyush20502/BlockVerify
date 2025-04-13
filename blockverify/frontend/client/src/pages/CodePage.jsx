// src/pages/CodePage.jsx
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import './CodePage.css'; // Import the CSS file

const CodePage = () => {
  const [activeTab, setActiveTab] = useState('contract');
  
  const codeFiles = {
    contract: {
      title: 'Smart Contract',
      language: 'solidity',
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentVerification {
    address public owner;
    
    // Maps student IDs to document hashes
    mapping(string => bytes32) private documentHashes;
    
    // Events
    event DocumentRegistered(string indexed studentId, bytes32 documentHash);
    event DocumentVerified(string indexed studentId, bool success);
    
    constructor() {
        owner = msg.sender;
    }
    
    // Only owner modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Function to publish a document hash
    function publishDocumentHash(string memory studentId, bytes32 documentHash) 
        public 
        onlyOwner 
        returns (bool) 
    {
        // Store the document hash
        documentHashes[studentId] = documentHash;
        
        // Emit event
        emit DocumentRegistered(studentId, documentHash);
        
        return true;
    }
    
    // Function to verify a document
    function verifyDocument(string memory studentId, bytes32 documentHash) 
        public 
        view 
        returns (bool) 
    {
        // Check if the provided hash matches the stored hash
        bool isValid = documentHashes[studentId] == documentHash;
        
        return isValid;
    }
}`
    },
    frontend: {
      title: 'Frontend Integration',
      language: 'javascript',
      code: `// Example frontend integration with ethers.js
import { ethers } from 'ethers';
import DocumentVerificationABI from './DocumentVerificationABI.json';

// Contract address (replace with your deployed contract address)
const contractAddress = '0x123...';

// Connect to Ethereum provider
const connectToBlockchain = async () => {
  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create Web3Provider instance
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Get signer
    const signer = provider.getSigner();
    
    // Create contract instance
    const contract = new ethers.Contract(
      contractAddress,
      DocumentVerificationABI,
      signer
    );
    
    return { provider, signer, contract };
  } catch (error) {
    console.error("Error connecting to blockchain:", error);
    throw error;
  }
};

// Function to publish a document hash
const publishDocument = async (studentId, documentData) => {
  try {
    const { contract } = await connectToBlockchain();
    
    // Generate document hash
    const documentHash = ethers.utils.id(documentData);
    
    // Call the contract function
    const tx = await contract.publishDocumentHash(studentId, documentHash);
    
    // Wait for transaction to be mined
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error("Error publishing document:", error);
    throw error;
  }
};

// Function to verify a document
const verifyDocument = async (studentId, documentData) => {
  try {
    const { contract } = await connectToBlockchain();
    
    // Generate document hash
    const documentHash = ethers.utils.id(documentData);
    
    // Call the contract function
    const isValid = await contract.verifyDocument(studentId, documentHash);
    
    return isValid;
  } catch (error) {
    console.error("Error verifying document:", error);
    throw error;
  }
};`
    },
    backend: {
      title: 'Backend API',
      language: 'javascript',
      code: `// Example Express.js API for document verification
const express = require('express');
const { ethers } = require('ethers');
const DocumentVerificationABI = require('./DocumentVerificationABI.json');
require('dotenv').config();

const router = express.Router();

// Ethereum provider configuration
const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, DocumentVerificationABI, wallet);

// Publish document hash
router.post('/api/documents', async (req, res) => {
  try {
    const { studentId, documentData } = req.body;
    
    if (!studentId || !documentData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate document hash
    const documentHash = ethers.utils.id(documentData);
    
    // Call contract function
    const tx = await contract.publishDocumentHash(studentId, documentHash);
    await tx.wait();
    
    return res.status(201).json({
      message: 'Document hash published successfully',
      transactionHash: tx.hash
    });
  } catch (error) {
    console.error('Error publishing document hash:', error);
    return res.status(500).json({ error: 'Error publishing document hash' });
  }
});

// Verify document
router.post('/api/verify', async (req, res) => {
  try {
    const { studentId, documentData } = req.body;
    
    if (!studentId || !documentData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate document hash
    const documentHash = ethers.utils.id(documentData);
    
    // Call contract function
    const isValid = await contract.verifyDocument(studentId, documentHash);
    
    return res.status(200).json({
      isValid,
      studentId,
      message: isValid ? 'Document is valid' : 'Document is invalid'
    });
  } catch (error) {
    console.error('Error verifying document:', error);
    return res.status(500).json({ error: 'Error verifying document' });
  }
});

module.exports = router;`
    }
  };
  
  return (
    <div className="code-page-container">
      <div className="code-page-content">
        <h2 className="code-page-title">Code Examples</h2>
        
        <div className="code-display-container">
          {/* Tabs */}
          <div className="code-tabs-container">
            <button 
              className={`code-tab ${activeTab === 'contract' ? 'active' : ''}`}
              onClick={() => setActiveTab('contract')}
            >
              Smart Contract
            </button>
            <button 
              className={`code-tab ${activeTab === 'frontend' ? 'active' : ''}`}
              onClick={() => setActiveTab('frontend')}
            >
              Frontend Integration
            </button>
            <button 
              className={`code-tab ${activeTab === 'backend' ? 'active' : ''}`}
              onClick={() => setActiveTab('backend')}
            >
              Backend API
            </button>
          </div>
          
          {/* Code display */}
          <div className="code-content">
            <div className="code-header">
              <h3 className="code-title">{codeFiles[activeTab].title}</h3>
              <a 
                href="https://github.com" 
                className="github-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="github-icon" /> View on GitHub
              </a>
            </div>
            
            <div className="code-block">
              <pre className="code-pre">
                <code>{codeFiles[activeTab].code}</code>
              </pre>
            </div>
          </div>
        </div>
        
        <div className="contribute-container">
          <h3 className="contribute-title">Want to Contribute?</h3>
          <p className="contribute-text">
            BlockVerify is an open-source project. We welcome contributions from developers to help improve our document verification solution.
          </p>
          <a 
            href="https://github.com" 
            className="github-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="github-button-icon" /> Fork on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default CodePage;