import { useEffect } from 'react';
import './BlockchainGraphic.css'; // Import the CSS file

const BlockchainGraphic = () => {
  useEffect(() => {
    // Animation for data packets could be implemented here
    // using either CSS animations or a library like GSAP
  }, []);

  return (
    <div className="blockchain-graphic-container">
      {/* Block 1 */}
      <div className="blockchain-block block-1">
        <div className="block-icon">📄</div>
        <div className="block-label">Document</div>
      </div>
      
      {/* Block 2 */}
      <div className="blockchain-block block-2">
        <div className="block-icon">🔐</div>
        <div className="block-label">Verify</div>
      </div>
      
      {/* Block 3 */}
      <div className="blockchain-block block-3">
        <div className="block-icon">⛓️</div>
        <div className="block-label">Blockchain</div>
      </div>
      
      {/* Connections */}
      <div className="connection connection-1"></div>
      <div className="connection connection-2"></div>
      
      {/* Data packets */}
      <div className="data-packet packet-1"></div>
      <div className="data-packet packet-2"></div>
    </div>
  );
};

export default BlockchainGraphic;