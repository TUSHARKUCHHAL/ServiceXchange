import React, { useState, useEffect } from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll event for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle section toggle
  const toggleSection = (sectionId) => {
    if (activeSection === sectionId) {
      setActiveSection(null);
    } else {
      setActiveSection(sectionId);
    }
  };

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Privacy policy sections data
  const sections = [
    {
      id: 'information-we-collect',
      title: '1. Information We Collect',
      content: (
        <>
          <p>We collect the following personal data:</p>
          <ul>
            <li>Name, email address, phone number, and location.</li>
            <li>Blood type and medical history (for blood donors).</li>
            <li>Food preferences (for food donors).</li>
            <li>Volunteer activity details.</li>
          </ul>
        </>
      )
    },
    {
      id: 'how-we-use',
      title: '2. How We Use Your Information',
      content: (
        <>
          <p>Your information is used to:</p>
          <ul>
            <li>Facilitate blood and food donations.</li>
            <li>Inform you of platform updates and events.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </>
      )
    },
    {
      id: 'data-security',
      title: '3. Data Security',
      content: (
        <p>We implement security measures to protect your personal data from unauthorized access, use, or disclosure. However, no security system is entirely foolproof, and we cannot guarantee absolute data security.</p>
      )
    },
    {
      id: 'sharing-information',
      title: '4. Sharing of Information',
      content: (
        <>
          <p>We do not sell or rent your personal data. However, we may share necessary information with:</p>
          <ul>
            <li>Hospitals and NGOs for donation coordination.</li>
            <li>Service providers who assist in platform operations.</li>
            <li>Legal authorities when required by law.</li>
          </ul>
        </>
      )
    },
    {
      id: 'your-rights',
      title: '5. Your Rights',
      content: (
        <>
          <p>You have the right to:</p>
          <ul>
            <li>Access, update, or delete your personal data.</li>
            <li>Opt out of certain data processing activities.</li>
          </ul>
          <p>To exercise these rights, please contact us at info@servicexexchange.com.</p>
        </>
      )
    },
    {
      id: 'changes-policy',
      title: '6. Changes to the Privacy Policy',
      content: (
        <p>We may update this Privacy Policy from time to time. Users will be notified of major changes, and continued use of the platform constitutes acceptance of the new policy.</p>
      )
    },
    {
      id: 'contact-information',
      title: '7. Contact Information',
      content: (
        <>
          <p>For questions regarding this Privacy Policy, contact us at:</p>
          <p>Email: info@servicexexchange.com</p>
        </>
      )
    }
  ];

  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <h1>ServiceXchange Privacy Policy</h1>
        <span className="last-updated">Effective Date: April 1, 2025</span>
      </div>

      <div className="privacy-intro">
        <p>At ServiceXchange, we prioritize the privacy and security of your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you use our platform.</p>
      </div>

      <div className="privacy-navigation">
        <h3>Quick Navigation</h3>
        <ul>
          {sections.map(section => (
            <li key={section.id}>
              <a href={`#${section.id}`} onClick={(e) => {
                e.preventDefault();
                document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' });
              }}>
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {sections.map(section => (
        <div 
          id={section.id} 
          key={section.id}
          className={`privacy-section ${activeSection === section.id ? 'active' : ''}`}
          onClick={() => toggleSection(section.id)}
        >
          <h2>{section.title}</h2>
          <div className="section-content">
            {section.content}
          </div>
        </div>
      ))}

      <div className="privacy-acceptance">
        <label className="checkbox-container">
          I have read and agree to the ServiceXchange Privacy Policy
          <input 
            type="checkbox" 
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <span className="checkmark"></span>
        </label>
        <button className={`accept-button ${isChecked ? 'active' : ''}`}>
          Accept Privacy Policy
        </button>
      </div>

      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        ↑
      </button>

      {/* Add bottom margin to separate from footer */}
      <div className="bottom-margin"></div>
    </div>
  );
};

export default PrivacyPolicy;