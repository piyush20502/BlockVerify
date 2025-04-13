// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-heading">BlockVerify</h3>
            <p className="footer-text">
              Secure document verification powered by Ethereum blockchain technology.
            </p>
            <div className="social-links">
              <a href="https://github.com" className="social-link">
                <FaGithub size={24} />
              </a>
              <a href="https://twitter.com" className="social-link">
                <FaTwitter size={24} />
              </a>
              <a href="https://linkedin.com" className="social-link">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/features" className="footer-link">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="footer-link">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/code" className="footer-link">
                  Code
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-heading">Contact Us</h3>
            <p className="footer-text">Email: info@blockverify.example</p>
            <p className="footer-text">Phone: +1 (555) 123-4567</p>
            <Link 
              to="/contact" 
              className="footer-button"
            >
              Get in Touch
            </Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 BlockVerify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;