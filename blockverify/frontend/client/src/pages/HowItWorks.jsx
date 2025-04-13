import { useEffect, useRef } from 'react';
import './HowItWorks.css'; // Import the CSS file

const HowItWorks = () => {
  const timelineItemsRef = useRef([]);
  
  useEffect(() => {
    const options = {
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-item-visible');
        }
      });
    }, options);
    
    timelineItemsRef.current.forEach(item => {
      if (item) observer.observe(item);
    });
    
    return () => {
      timelineItemsRef.current.forEach(item => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);
  
  const steps = [
    {
      title: "Document Generation",
      description: "Institution creates a student marksheet or certificate and prepares it for blockchain verification."
    },
    {
      title: "Hash Generation",
      description: "A unique hash is generated from the document data using cryptographic algorithms (SHA-256)."
    },
    {
      title: "Blockchain Storage",
      description: "The institution publishes the hash to the Ethereum blockchain, creating a permanent and tamper-proof record."
    },
    {
      title: "Document Verification",
      description: "Organizations can verify a document by generating its hash and comparing with the stored hash on the blockchain."
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-container">
        <h2 className="how-it-works-title">How It Works</h2>
        
        <div className="timeline-container">
          {/* Central line */}
          <div className="timeline-line"></div>
          
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`timeline-step ${index % 2 === 0 ? 'timeline-step-left' : 'timeline-step-right'}`}
            >
              {/* Circle marker */}
              <div className="timeline-marker">
                {index + 1}
              </div>
              
              {/* Content */}
              <div 
                ref={el => timelineItemsRef.current[index] = el}
                className={`timeline-item ${index % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right'}`}
              >
                <h3 className="timeline-item-title">{step.title}</h3>
                <p className="timeline-item-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;