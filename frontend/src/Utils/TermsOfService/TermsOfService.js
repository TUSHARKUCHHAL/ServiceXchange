import React, { useState, useEffect } from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
  const [accepted, setAccepted] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Track scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>ServiceXchange Terms of Service</h1>
        <p className="last-updated">Effective Date: April 1, 2025</p>
      </div>

      <div className="terms-intro">
        <p>
          Welcome to ServiceXchange, an online platform that connects volunteers, institutions, and organizations 
          for the purpose of facilitating blood and food donations. By using ServiceXchange, you agree to these 
          Terms of Service. If you do not agree, please refrain from using the platform.
        </p>
      </div>

      <div className="terms-navigation">
        <h3>Contents</h3>
        <ul>
          <li><a href="#section1" onClick={() => toggleSection('section1')}>1. Overview</a></li>
          <li><a href="#section2" onClick={() => toggleSection('section2')}>2. User Eligibility</a></li>
          <li><a href="#section3" onClick={() => toggleSection('section3')}>3. Description of Services</a></li>
          <li><a href="#section4" onClick={() => toggleSection('section4')}>4. User Responsibilities</a></li>
          <li><a href="#section5" onClick={() => toggleSection('section5')}>5. Ethical Guidelines</a></li>
          <li><a href="#section6" onClick={() => toggleSection('section6')}>6. Limitation of Liability</a></li>
          <li><a href="#section7" onClick={() => toggleSection('section7')}>7. Intellectual Property</a></li>
          <li><a href="#section8" onClick={() => toggleSection('section8')}>8. Amendments to Terms</a></li>
          <li><a href="#section9" onClick={() => toggleSection('section9')}>9. Governing Law and Dispute Resolution</a></li>
          <li><a href="#section10" onClick={() => toggleSection('section10')}>10. Contact Information</a></li>
        </ul>
      </div>

      <div className="terms-content">
        <div
          id="section1"
          className={`terms-section ${activeSection === 'section1' ? 'active' : ''}`}
          onClick={() => toggleSection('section1')}
        >
          <h2>1. Overview</h2>
          <div className="section-content">
            <p>
              These Terms of Service govern the use of the ServiceXchange platform. By accessing or using our services, you accept these terms, including any future amendments.
            </p>
          </div>
        </div>

        <div
          id="section2"
          className={`terms-section ${activeSection === 'section2' ? 'active' : ''}`}
          onClick={() => toggleSection('section2')}
        >
          <h2>2. User Eligibility</h2>
          <div className="section-content">
            <p>
              To use ServiceXchange, you must be at least 18 years old and legally able to enter into binding agreements.
            </p>
          </div>
        </div>

        <div
          id="section3"
          className={`terms-section ${activeSection === 'section3' ? 'active' : ''}`}
          onClick={() => toggleSection('section3')}
        >
          <h2>3. Description of Services</h2>
          <div className="section-content">
            <p>
              ServiceXchange connects volunteers, medical facilities, non-governmental organizations (NGOs), and restaurants to facilitate food and blood donations. Users can volunteer for donation activities, medical facilities can request blood donations, and restaurants can contribute meals.
            </p>
          </div>
        </div>

        <div
          id="section4"
          className={`terms-section ${activeSection === 'section4' ? 'active' : ''}`}
          onClick={() => toggleSection('section4')}
        >
          <h2>4. User Responsibilities</h2>
          <div className="section-content">
            <ul>
              <li>You must provide accurate and truthful information.</li>
              <li>You may only use the platform for lawful purposes.</li>
              <li>You must respect the rights of other users and not engage in any harmful or fraudulent activities.</li>
            </ul>
          </div>
        </div>

        <div
          id="section5"
          className={`terms-section ${activeSection === 'section5' ? 'active' : ''}`}
          onClick={() => toggleSection('section5')}
        >
          <h2>5. Ethical Guidelines</h2>
          <div className="section-content">
            <h3>Food Donation</h3>
            <ul>
              <li>Donated food must be safe, properly stored, and meet health regulations.</li>
              <li>Users must not donate expired or unsafe food.</li>
              <li>Businesses should not exploit the platform for personal or commercial gain beyond its charitable purpose.</li>
            </ul>
            
            <h3>Blood Donation</h3>
            <ul>
              <li>Donors must meet medical eligibility criteria.</li>
              <li>Blood donations should be made only for legitimate medical purposes.</li>
              <li>Users must ensure compliance with legal, medical, and ethical guidelines.</li>
            </ul>
            
            <h3>Volunteer Conduct</h3>
            <ul>
              <li>Volunteers must act respectfully and professionally.</li>
              <li>Activities should prioritize the well-being of all participants.</li>
              <li>Volunteers must not engage in harassment, discrimination, or exploitation.</li>
            </ul>
          </div>
        </div>

        <div
          id="section6"
          className={`terms-section ${activeSection === 'section6' ? 'active' : ''}`}
          onClick={() => toggleSection('section6')}
        >
          <h2>6. Limitation of Liability</h2>
          <div className="section-content">
            <p>
              ServiceXchange acts as a facilitator and is not responsible for:
            </p>
            <ul>
              <li>Health issues arising from food or blood donations.</li>
              <li>The actions of users on the platform.</li>
            </ul>
            <p>
              To the fullest extent permitted by law, ServiceXchange is not liable for any direct or indirect damages resulting from the use of the platform.
            </p>
          </div>
        </div>

        <div
          id="section7"
          className={`terms-section ${activeSection === 'section7' ? 'active' : ''}`}
          onClick={() => toggleSection('section7')}
        >
          <h2>7. Intellectual Property</h2>
          <div className="section-content">
            <p>
              All content, including software, text, graphics, and logos, is the property of ServiceXchange. Users may not copy, distribute, or use any content without prior written permission.
            </p>
          </div>
        </div>

        <div
          id="section8"
          className={`terms-section ${activeSection === 'section8' ? 'active' : ''}`}
          onClick={() => toggleSection('section8')}
        >
          <h2>8. Amendments to Terms</h2>
          <div className="section-content">
            <p>
              ServiceXchange may update these Terms of Service at any time. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of the updated terms.
            </p>
          </div>
        </div>

        <div
          id="section9"
          className={`terms-section ${activeSection === 'section9' ? 'active' : ''}`}
          onClick={() => toggleSection('section9')}
        >
          <h2>9. Governing Law and Dispute Resolution</h2>
          <div className="section-content">
            <p>
              These terms are governed by the laws of India. Any disputes shall be resolved through legally binding arbitration in India.
            </p>
          </div>
        </div>

        <div
          id="section10"
          className={`terms-section ${activeSection === 'section10' ? 'active' : ''}`}
          onClick={() => toggleSection('section10')}
        >
          <h2>10. Contact Information</h2>
          <div className="section-content">
            <p>
              For inquiries about these Terms of Service, contact us at:
              <br />
              Email: servicexchange1@gmail.com
            </p>
          </div>
        </div>
      </div>

      <div className="terms-acceptance">
        <label className="checkbox-container">
          <input 
            type="checkbox" 
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <span className="checkmark"></span>
          I have read and agree to the Terms of Service
        </label>
        <button 
          className={`accept-button ${accepted ? 'active' : ''}`}
          disabled={!accepted}
        >
          Accept Terms
        </button>
      </div>

      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
};

export default TermsOfService;