import React, { useRef } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const buttonsSectionRef = useRef(null);

  const scrollToButtons = () => {
    buttonsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Connecting Hearts, Building Futures</h1>
          <p className="hero-subtitle">
            Join our community of changemakers and help create a world where everyone has access to the
            resources they need. Together, we can make a difference that lasts generations.
          </p>
          <button className="get-involved-btn" onClick={scrollToButtons}>
            Get Involved
          </button>
        </div>
      </div>

      {/* Category Buttons Section */}
      <div className="categories-section" ref={buttonsSectionRef}>
        <h2>How Would You Like to Help?</h2>
        <p>Choose your path to making a difference in our community</p>
        
        <div className="categories-grid">
          <Link to="/hospital" className="category-card">
            <div className="category-icon hospital-icon">
              <i className="fas fa-hospital"></i>
            </div>
            <h3>Hospitals</h3>
            <p>Support healthcare facilities and patients in need</p>
          </Link>
          
          <Link to="/volunteer" className="category-card">
            <div className="category-icon volunteer-icon">
              <i className="fas fa-hands-helping"></i>
            </div>
            <h3>Volunteer</h3>
            <p>Offer your time and skills to community projects</p>
          </Link>
          
          <Link to="/NGOdashboard" className="category-card">
            <div className="category-icon ngo-icon">
              <i className="fas fa-globe-americas"></i>
            </div>
            <h3>NGOs</h3>
            <p>Connect with organizations making global impact</p>
          </Link>
          
          <Link to="/restaurant" className="category-card">
            <div className="category-icon restaurant-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <h3>Restaurants</h3>
            <p>Partner with food services to reduce waste and feed communities</p>
          </Link>
        </div>
      </div>

      {/* Impact Section */}
      <div className="impact-section">
        <h2>Our Impact</h2>
        <div className="impact-stats">
          <div className="stat-box">
            <h3>10K+</h3>
            <p>Volunteers</p>
          </div>
          <div className="stat-box">
            <h3>250+</h3>
            <p>Partner NGOs</p>
          </div>
          <div className="stat-box">
            <h3>75+</h3>
            <p>Hospitals</p>
          </div>
          <div className="stat-box">
            <h3>120+</h3>
            <p>Restaurants</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2>Voices of Change</h2>
        <div className="testimonial-slider">
          <div className="testimonial-card">
            <p>"Connecting through this platform has allowed our hospital to receive critical volunteer support during peak times. The impact has been tremendous."</p>
            <div className="testimonial-author">
              <h4>Dr. Sarah Johnson</h4>
              <p>City General Hospital</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h2>Ready to Make a Difference?</h2>
        <p>Join thousands of others who are already changing lives in their communities</p>
        <button className="primary-button" onClick={scrollToButtons}>Start Now</button>
      </div>
    </div>
  );
};

export default Home;