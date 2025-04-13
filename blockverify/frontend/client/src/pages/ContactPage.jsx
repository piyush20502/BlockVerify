// src/pages/ContactPage.jsx
import { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import './ContactPage.css'; // Import the CSS file

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful submission
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Your message has been sent successfully! We will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'There was an error sending your message. Please try again later.'
      });
    }
    
    setLoading(false);
  };
  
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="contact-info-icon" />,
      title: "Our Location",
      details: ["1234 Blockchain Avenue", "Tech District", "San Francisco, CA 94107"]
    },
    {
      icon: <FaPhoneAlt className="contact-info-icon" />,
      title: "Phone Number",
      details: ["+1 (555) 123-4567", "+1 (555) 765-4321"]
    },
    {
      icon: <FaEnvelope className="contact-info-icon" />,
      title: "Email Address",
      details: ["info@blockverify.example", "support@blockverify.example"]
    }
  ];
  
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h2 className="contact-title">Get in Touch</h2>
        
        <div className="contact-info-grid">
          {contactInfo.map((info, index) => (
            <div 
              key={index} 
              className="contact-info-card"
            >
              <div className="contact-info-icon-container">{info.icon}</div>
              <h3 className="contact-info-title">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="contact-info-detail">{detail}</p>
              ))}
            </div>
          ))}
        </div>
        
        <div className="contact-form-container">
          <div className="contact-form-left">
            <div className="contact-form-left-content">
              <h3 className="contact-form-left-title">Let's Discuss Your Project</h3>
              <p className="contact-form-left-text">
                Interested in implementing blockchain document verification for your organization? 
                Fill out the form and our team will get back to you shortly.
              </p>
              <div className="contact-form-divider"></div>
            </div>
          </div>
          
          <div className="contact-form-right">
            <h3 className="contact-form-right-title">Send us a Message</h3>
            
            {formStatus.submitted && (
              <div className={`form-status-message ${formStatus.success ? 'success' : 'error'}`}>
                {formStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">Your Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="form-textarea"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;