import React, { useState } from "react";
import "./About.css";

const About = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleJoinClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="about-container">
      <h1 className="about-title">About ServiceXchange</h1>
      <p className="about-mission">
        Connecting NGOs, restaurants, hospitals, and volunteers to make a difference.
      </p>

      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          We aim to build a collaborative network where resources are efficiently shared 
          to benefit those in need. From excess food donations to urgent blood requirements, 
          we ensure quick and effective help.
        </p>
      </div>

      <div className="about-section">
        <h2>How It Works</h2>
        <ul>
          <li>Restaurants donate surplus food.</li>
          <li>NGOs distribute it to those in need.</li>
          <li>Hospitals post urgent blood requirements.</li>
          <li>Volunteers help transport and organize donations.</li>
        </ul>
      </div>

      <button className="cta-button" onClick={handleJoinClick}>
        Get Involved
      </button>

      {showMessage && <p className="success-message">Thank you for your interest! We'll reach out soon.</p>}
    </div>
  );
};

export default About;