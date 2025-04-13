// src/pages/FeaturesPage.jsx
import Features from './Features';
import './FeaturesPage.css'; // Import the CSS file

const FeaturesPage = () => {
  return (
    <div className="features-page">
      <div className="features-hero">
        <div className="features-hero-content">
          <h1 className="features-hero-title">Features</h1>
          <p className="features-hero-description">
            Discover how BlockVerify provides secure, efficient, and tamper-proof document verification.
          </p>
        </div>
      </div>
      <Features />
    </div>
  );
};

export default FeaturesPage;