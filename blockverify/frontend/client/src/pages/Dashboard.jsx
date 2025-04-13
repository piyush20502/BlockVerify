import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MarksVerificationABI from '../utils/MarksVerificationABI.json';
import './Dashboard.css';

const Dashboard = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [activeTab, setActiveTab] = useState('publish');
  const [documentId, setDocumentId] = useState('');
  const [documentData, setDocumentData] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  // Initialize contract with provider
  const initContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        MarksVerificationABI,
        signer
      );
      setProvider(provider);
      setContract(contract);
      return contract;
    } catch (err) {
      console.error("Contract initialization error:", err);
      setError("Failed to initialize contract");
      return null;
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await initContract();
            setConnected(true);
            setAccount(accounts[0]);
          }
        } catch (err) {
          console.error("Connection check error:", err);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this application");
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await initContract();
      setConnected(true);
      setAccount(accounts[0]);
      setSuccess("Wallet connected successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to hash document data
  const hashDocumentData = (data) => {
    try {
      // Convert string to bytes
      const dataBytes = ethers.toUtf8Bytes(data);
      // Hash the bytes using keccak256
      return ethers.keccak256(dataBytes);
    } catch (err) {
      console.error("Hashing error:", err);
      throw new Error("Failed to hash document data");
    }
  };

  const handlePublish = async () => {
    try {
      if (!documentId.trim() || !documentData.trim()) {
        throw new Error("Both Document ID and Data are required");
      }
      
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Ensure contract is initialized
      const activeContract = contract || await initContract();
      if (!activeContract) {
        throw new Error("Contract not initialized");
      }
      
      // Hash the document data
      const documentHash = hashDocumentData(documentData);
      
      // Estimate gas with error handling
      let gasEstimate;
      try {
        gasEstimate = await activeContract.publishMarksheetHash.estimateGas(
          documentId, 
          documentHash
        );
      } catch (estimateError) {
        console.warn("Gas estimate failed, using default:", estimateError);
        gasEstimate = 500000; // Fallback gas limit
      }
      
      // Send transaction
      const tx = await activeContract.publishMarksheetHash(
        documentId, 
        documentHash,
        { gasLimit: gasEstimate }
      );
      
      await tx.wait();
      
      setSuccess("Document hash published to blockchain successfully!");
      setDocumentId('');
      setDocumentData('');
    } catch (err) {
      setError(err.message.includes("user rejected") 
        ? "Transaction was rejected" 
        : err.message.includes("reverted") 
          ? "Transaction reverted (check input data)"
          : `Publish failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
        if (!documentId.trim() || !documentData.trim()) {
            throw new Error("Both Document ID and Data are required");
        }
        
        setLoading(true);
        setError('');
        setSuccess('');
        setVerificationResult(null);
        
        const activeContract = contract || await initContract();
        if (!activeContract) throw new Error("Contract not initialized");
        
        const documentHash = hashDocumentData(documentData);
        
        // Log values being sent to the contract for debugging
        console.log("Verifying with document ID:", documentId);
        console.log("Generated hash:", documentHash);
        
        try {
            // Use call instead of staticCall if you're on an older ethers version
            const resultCode = await activeContract.verifyMarksheet(
                documentId, 
                documentHash
            );
            
            console.log("Verification result code:", resultCode);
            
            // Parse the result - note that ethers v6 might return BigInt
            const resultValue = Number(resultCode);
            
            switch (resultValue) {
                case 0:
                    setVerificationResult('not-found');
                    setError("Document not found in registry");
                    break;
                case 1:
                    setVerificationResult('mismatch');
                    setError("Document exists but hash doesn't match");
                    break;
                case 2:
                    setVerificationResult('match');
                    setSuccess("✓ Document verification successful!");
                    break;
                default:
                    throw new Error("Unexpected verification result: " + resultValue);
            }
        } catch (err) {
            console.error("Verification error:", err);
            if (err.message.includes("revert")) {
                setVerificationResult('error');
                setError("Verification failed: Contract reverted");
            } else {
                throw err;
            }
        }
    } catch (err) {
        setVerificationResult('error');
        setError(`Verification error: ${err.message}`);
    } finally {
        setLoading(false);
    }
};



  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2 className="dashboard-title">Document Verification Dashboard</h2>
        
        {!connected ? (
          <div className="connect-wallet-container">
            <h3 className="connect-wallet-title">Connect Your Wallet</h3>
            <p className="connect-wallet-description">
              Connect your Ethereum wallet to start publishing and verifying document hashes.
            </p>
            <button 
              className="connect-wallet-button"
              onClick={connectWallet}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
            {error && <div className="alert-error">{error}</div>}
          </div>
        ) : (
          <>
            <div className="dashboard-card">
              <div className="dashboard-tabs">
                <button 
                  className={`dashboard-tab ${activeTab === 'publish' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('publish');
                    setError('');
                    setSuccess('');
                    setVerificationResult(null);
                  }}
                >
                  Publish Document Hash
                </button>
                <button 
                  className={`dashboard-tab ${activeTab === 'verify' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('verify');
                    setError('');
                    setSuccess('');
                    setVerificationResult(null);
                  }}
                >
                  Verify Document
                </button>
              </div>
              
              <div className="dashboard-form">
                <div className="form-group">
                  <label htmlFor="documentId" className="form-label">
                    Document ID
                  </label>
                  <input 
                    type="text" 
                    id="documentId" 
                    className="form-input"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    placeholder="e.g., CS101-2023-001"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="documentData" className="form-label">
                    Document Data
                  </label>
                  <textarea 
                    id="documentData" 
                    className="form-textarea"
                    value={documentData}
                    onChange={(e) => setDocumentData(e.target.value)}
                    placeholder="e.g., JohnDoe|CS101|Math:90|Physics:88|Chemistry:85"
                    rows="5"
                  />
                </div>
                
                {activeTab === 'publish' ? (
                  <button 
                    className="action-button publish-button"
                    onClick={handlePublish}
                    disabled={loading || !documentId || !documentData}
                  >
                    {loading ? "Publishing..." : "Publish Document Hash"}
                  </button>
                ) : (
                  <button 
                    className="action-button verify-button"
                    onClick={handleVerify}
                    disabled={loading || !documentId || !documentData}
                  >
                    {loading ? "Verifying..." : "Verify Document"}
                  </button>
                )}
                
                {error && (
                  <div className="alert-error">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="alert-success">
                    {success}
                  </div>
                )}
                
                {verificationResult !== null && (
                  <div className={`alert-${verificationResult ? 'success' : 'error'}`}>
                    {verificationResult 
                      ? "✓ Document is valid and matches the stored hash!" 
                      : "✗ Document verification failed. No matching hash found."}
                  </div>
                )}
              </div>
            </div>
            
            <div className="account-info">
              <span className="account-label">Connected Account:</span>
              <span className="account-address">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;