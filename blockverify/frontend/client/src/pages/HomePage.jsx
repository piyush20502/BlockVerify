// src/pages/HomePage.jsx
import Hero from '../components/Hero';
import Features from '../pages/Features';
import HowItWorks from './HowItWorks';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <Features />
      <HowItWorks />
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Try our blockchain-based document verification system today and experience the security and efficiency for yourself.
          </p>
          <div className="cta-buttons">
            <Link 
              to="/dashboard" 
              className="cta-button-primary"
            >
              Try the Demo
            </Link>
            <Link 
              to="/contact" 
              className="cta-button-secondary"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;