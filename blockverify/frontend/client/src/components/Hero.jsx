import { Link } from 'react-router-dom';
import BlockchainGraphic from './BlockchainGraphic';
import './Hero.css'; // Import the CSS file

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-text-container">
          <h1 className="hero-title">
            Secure Document Verification on Ethereum
          </h1>
          <p className="hero-description">
            A tamper-proof solution for educational institutions and organizations to verify 
            certificates, marksheets, and other important documents using blockchain technology.
          </p>
          <Link 
            to="/how-it-works" 
            className="hero-button"
          >
            Learn How It Works
          </Link>
        </div>
        <div className="hero-graphic-container">
          <BlockchainGraphic />
        </div>
      </div>
    </section>
  );
};

export default Hero;