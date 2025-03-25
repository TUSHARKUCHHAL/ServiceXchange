import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Hospital.css";

const Hospital = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    donorsToday: 0,
    livesImpacted: 0,
    bloodNeeded: 0
  });
  
  // Reference for the liquid container element
  const liquidContainerRef = useRef(null);

  // Bubble creation function
  const createBubbles = () => {
    const liquidContainer = liquidContainerRef.current;
    
    if (!liquidContainer) return;
    
    // Create bubbles at random
    const interval = setInterval(() => {
      // Only create bubbles if there's liquid to show them in
      if (liquidContainer.offsetHeight > 20) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Random bubble properties
        const size = Math.random() * 15 + 5; // 5-20px
        const left = Math.random() * 100; // 0-100%
        const riseDuration = Math.random() * 3 + 2; // 2-5s
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.bottom = '0';
        bubble.style.setProperty('--rise-duration', `${riseDuration}s`);
        
        liquidContainer.appendChild(bubble);
        
        // Remove bubble after animation completes
        setTimeout(() => {
          bubble.remove();
        }, riseDuration * 1000);
      }
    }, 300);
    
    return () => clearInterval(interval);
  };

  // Simulate loading stats and initialize effects
  useEffect(() => {
    setIsLoaded(true);
    
    // Animate stats counting up
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        donorsToday: prev.donorsToday < 24 ? prev.donorsToday + 1 : prev.donorsToday,
        livesImpacted: prev.livesImpacted < 72 ? prev.livesImpacted + 3 : prev.livesImpacted,
        bloodNeeded: prev.bloodNeeded < 18 ? prev.bloodNeeded + 1 : prev.bloodNeeded
      }));
    }, 100);
    
    // Initialize the bubble effect
    const cleanupBubbles = createBubbles();
    
    return () => {
      clearInterval(statsInterval);
      if (cleanupBubbles) cleanupBubbles();
    };
  }, []);

  // Blood type data for the chart
  const bloodTypes = [
    { type: "A+", status: "low", percentage: 35 },
    { type: "B+", status: "critical", percentage: 15 },
    { type: "O+", status: "stable", percentage: 80 },
    { type: "AB+", status: "low", percentage: 40 },
    { type: "A-", status: "stable", percentage: 75 },
    { type: "B-", status: "critical", percentage: 20 },
    { type: "O-", status: "low", percentage: 45 },
    { type: "AB-", status: "stable", percentage: 60 }
  ];

  return (
    <div className={`hospital-container ${isLoaded ? 'loaded' : ''}`}>
      {/* Header */}
      <header className="hospital-header">
        <div className="logo-container">
          <div className="logo-icon">
            <i className="fas fa-heartbeat"></i>
          </div>
          <h1>LifeBlood Center</h1>
        </div>
      </header>

      {/* Hero Banner with Liquid Effect */}
      <div className="hospital-hero">
        {/* Liquid Blood Effect */}
        <div className="liquid-container" ref={liquidContainerRef}>
          <div className="liquid-wave"></div>
          {/* Bubbles will be added dynamically via JS */}
        </div>
        
        <div className="hero-content">
          <h2 className="animated-title">Save Lives Today</h2>
          <p>Every donation can save up to 3 lives. Be someone's hero.</p>
          <div className="hero-cta">
            <button 
              className="primary-btn pulse-animation" 
              onClick={() => navigate("/hospital/donate-blood")}
            >
              Start Donating
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card">
          <i className="fas fa-user-friends"></i>
          <div className="stat-value">{stats.donorsToday}</div>
          <div className="stat-label">Donors Today</div>
        </div>
        
        <div className="stat-card">
          <i className="fas fa-heart"></i>
          <div className="stat-value">{stats.livesImpacted}</div>
          <div className="stat-label">Lives Impacted</div>
        </div>
        
        <div className="stat-card">
          <i className="fas fa-tint"></i>
          <div className="stat-value">{stats.bloodNeeded}</div>
          <div className="stat-label">Units Needed</div>
        </div>
      </div>

      {/* Main Options */}
      <div className="services-section">
        <h3>How Can We Help You?</h3>
        
        <div className="service-cards">
          <div className="service-card" onClick={() => navigate("/hospital/need-blood")}>
            <div className="card-icon need-icon">
              <i className="fas fa-tint"></i>
            </div>
            <h4>Need Blood</h4>
            <p>Request blood for patients in need. Emergency services available 24/7.</p>
            <button className="card-btn need-blood-btn">Request Now</button>
          </div>
          
          <div className="service-card" onClick={() => navigate("/hospital/donate-blood")}>
            <div className="card-icon donate-icon">
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <h4>Donate Blood</h4>
            <p>Your donation can save multiple lives. Schedule an appointment today.</p>
            <button className="card-btn donate-blood-btn">Donate Now</button>
          </div>
          
          <div className="service-card" onClick={() => navigate("/hospital/learn-more")}>
            <div className="card-icon learn-icon">
              <i className="fas fa-book-medical"></i>
            </div>
            <h4>Learn More</h4>
            <p>Educate yourself about blood donation process, benefits, and eligibility.</p>
            <button className="card-btn learn-more-btn">Get Educated</button>
          </div>
        </div>
      </div>

      {/* Blood Inventory Status */}
      <div className="inventory-section">
        <h3>Current Blood Inventory Status</h3>
        <p>Help us maintain healthy levels for all blood types</p>
        
        <div className="blood-types-container">
          {bloodTypes.map(blood => (
            <div key={blood.type} className="blood-type-item">
              <div className="blood-type-label">{blood.type}</div>
              <div className="blood-level-bar-container">
                <div 
                  className={`blood-level-bar ${blood.status}`} 
                  style={{width: `${blood.percentage}%`}}
                ></div>
              </div>
              <div className={`blood-status ${blood.status}`}>
                {blood.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <h3>Lives You Can Impact</h3>
        
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <div className="testimonial-img">
              <i className="fas fa-user-circle"></i>
            </div>
            <p>"The blood donation I received saved my life after a serious accident. I'm forever grateful to donors."</p>
            <h5>Maria J.</h5>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-img">
              <i className="fas fa-user-circle"></i>
            </div>
            <p>"As a cancer patient, regular blood transfusions were crucial for my treatment and recovery."</p>
            <h5>David T.</h5>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        
        <div className="faq-accordion">
          <details className="faq-item">
            <summary>Who can donate blood?</summary>
            <div className="faq-content">
              <p>Generally, donors must be at least 17 years old, weigh at least 110 pounds, and be in good health. Some conditions may affect eligibility.</p>
            </div>
          </details>
          
          <details className="faq-item">
            <summary>How often can I donate blood?</summary>
            <div className="faq-content">
              <p>You can donate whole blood every 56 days, platelets every 7 days, and plasma every 28 days.</p>
            </div>
          </details>
          
          <details className="faq-item">
            <summary>Is blood donation safe?</summary>
            <div className="faq-content">
              <p>Yes. Donation is conducted using sterile equipment that is used only once and then discarded.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Hospital;