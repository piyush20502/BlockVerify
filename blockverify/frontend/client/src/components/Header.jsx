import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css'; // Import the CSS file

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/" className="logo">
          <div className="logo-icon">🔒</div>
          BlockVerify
        </Link>
        
        {/* Mobile menu button */}
        <div className="mobile-menu-button">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="menu-toggle"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        
        {/* Desktop menu */}
        <ul className="desktop-menu">
          <li><Link to="/features" className="nav-link">Features</Link></li>
          <li><Link to="/how-it-works" className="nav-link">How It Works</Link></li>
          <li><Link to="/code" className="nav-link">Code</Link></li>
          <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
          <li><Link to="/contact" className="nav-link">Contact</Link></li>
        </ul>
      </nav>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="mobile-menu">
          <ul className="mobile-menu-items">
            <li><Link to="/features" onClick={() => setIsOpen(false)} className="mobile-nav-link">Features</Link></li>
            <li><Link to="/how-it-works" onClick={() => setIsOpen(false)} className="mobile-nav-link">How It Works</Link></li>
            <li><Link to="/code" onClick={() => setIsOpen(false)} className="mobile-nav-link">Code</Link></li>
            <li><Link to="/dashboard" onClick={() => setIsOpen(false)} className="mobile-nav-link">Dashboard</Link></li>
            <li><Link to="/contact" onClick={() => setIsOpen(false)} className="mobile-nav-link">Contact</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;