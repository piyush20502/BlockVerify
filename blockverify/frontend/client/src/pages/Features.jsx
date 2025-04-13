import { FaShieldAlt, FaSearch, FaGlobeAmericas, FaLock, FaMoneyBillWave, FaRocket } from 'react-icons/fa';
import './Features.css'; // Import the CSS file

const Features = () => {
  const features = [
    {
      icon: <FaShieldAlt className="feature-icon" />,
      title: "Tamper-Proof Records",
      description: "Once a document hash is stored on the Ethereum blockchain, it becomes immutable and secure from any unauthorized alterations."
    },
    {
      icon: <FaSearch className="feature-icon" />,
      title: "Instant Verification",
      description: "Verify the authenticity of any document in seconds, eliminating lengthy manual verification processes."
    },
    {
      icon: <FaGlobeAmericas className="feature-icon" />,
      title: "Global Accessibility",
      description: "Access and verify documents from anywhere in the world, providing a truly global solution for document verification."
    },
    {
      icon: <FaLock className="feature-icon" />,
      title: "Privacy First",
      description: "Only document hashes are stored on the blockchain, keeping the actual document content private and secure."
    },
    {
      icon: <FaMoneyBillWave className="feature-icon" />,
      title: "Cost-Effective",
      description: "Eliminate expensive verification processes and reduce fraud with an affordable blockchain solution."
    },
    {
      icon: <FaRocket className="feature-icon" />,
      title: "Easy Integration",
      description: "Simple API for integrating with existing systems and document management workflows."
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <h2 className="features-title">Why BlockVerify?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
            >
              <div className="feature-icon-container">{feature.icon}</div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;