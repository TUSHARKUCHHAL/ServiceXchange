import React, { useState } from "react";
import "./About.css";

const About = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);

  const handleJoinClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className="about-page">
      <h1 className="about-title">About ServiceXchange</h1>
      <p className="about-mission">
        Connecting NGOs, restaurants, hospitals, and volunteers to bring positive change.
      </p>
      <div className="about-section">
    <h2>Our Mission</h2>
    <p>
      At ServiceXchange, we are dedicated to reducing food waste and ensuring timely
      blood donations. By linking resources efficiently, we create a bridge between
      donors and those in need, maximizing impact and saving lives.
    </p>
  </div>

  <div className="about-section">
    <h2>How It Works</h2>
    <ul>
      <li><strong>Restaurants & Food Suppliers:</strong> Donate surplus food for redistribution.</li>
      <li><strong>NGOs & Community Centers:</strong> Receive and distribute food.</li>
      <li><strong>Hospitals & Blood Banks:</strong> Post urgent blood donation requests.</li>
      <li><strong>Volunteers:</strong> Assist in collecting and distributing food and blood donations.</li>
    </ul>
  </div>

  <div className="about-section">
    <h2>Why Choose ServiceXchange?</h2>
    <p>We believe in making a real difference. Our platform provides:</p>
    <ul>
      <li>🔹 A real-time connection between donors and recipients.</li>
      <li>🔹 Transparent and efficient resource allocation.</li>
      <li>🔹 A volunteer-driven community that cares.</li>
    </ul>
  </div>

  <div className="testimonial-container" style={{ background: "#f8f9fa", padding: "40px", borderRadius: "12px", textAlign: "center", marginTop: "40px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
    <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#34495e", marginBottom: "20px" }}>What People Say</h2>
    <div className="testimonial" style={{ fontStyle: "italic", fontSize: "1.2rem", color: "#333", background: "#ffffff", padding: "20px", borderRadius: "10px", marginBottom: "15px", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
      "ServiceXchange helped our restaurant donate excess food efficiently. It's amazing to be part of something so impactful!" – <strong>John D.</strong>
    </div>
    <div className="testimonial" style={{ fontStyle: "italic", fontSize: "1.2rem", color: "#333", background: "#ffffff", padding: "20px", borderRadius: "10px", marginBottom: "15px", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
      "I found a blood donor within hours thanks to this platform. Truly a life-saving initiative!" – <strong>Susan M.</strong>
    </div>
  </div>


  <div className="faq-section">
    <h2 className="faq-title" style={{ fontSize: "2rem", fontWeight: "bold", color: "#34495e", marginBottom: "20px", textAlign: "center" }}>Frequently Asked Questions</h2>
    <div style={{ marginBottom: "30px" }}></div>
    {[
      { question: "How can I become a volunteer?", answer: "You can sign up on our website and start participating in food and blood donation activities." },
      { question: "Is the food quality checked before donation?", answer: "Yes! All food donations are monitored for safety before distribution." },
      { question: "How do I request emergency blood?", answer: "Simply post a request on our platform, and available donors will be notified immediately." }
    ].map((faq, index) => (
      <div key={index} className="faq-item" style={{ marginBottom: "25px" }}>
        <div 
          className={`faq-question ${activeFAQ === index ? "active" : ""}`} 
          onClick={() => toggleFAQ(index)}
          style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#34495e", padding: "12px", background: "#f8f9fa", borderRadius: "8px", cursor: "pointer", transition: "0.3s", textAlign: "left" }}
        >
          <span className="faq-icon" style={{ marginRight: "12px", color: "#e74c3c", fontSize: "1.5rem" }}>
            {activeFAQ === index ? "➖" : "➕"}
          </span> 
          {faq.question}
        </div>
        <div 
          className={`faq-answer ${activeFAQ === index ? "show" : "hide"}`} 
          style={{ fontSize: "1rem", color: "#555", padding: "12px", borderLeft: "4px solid #e74c3c", background: "#ffffff", borderRadius: "8px", marginTop: "8px", transition: "0.3s" }}
        >
          <p>{faq.answer}</p>
        </div>
      </div>
    ))}
  </div>

  
  <button className="cta-button" onClick={handleJoinClick}>
    Join the Movement
  </button>

  {showMessage && <p className="success-message">Thank you for joining us! We'll be in touch soon.</p>}
</div>
 );
};

export default About; 