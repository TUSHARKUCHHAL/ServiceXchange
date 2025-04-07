import React, { useState, useEffect } from 'react';
import './NGOProfile.css';

const NGOProfile = () => {
  const [ngo, setNgo] = useState({
    id: 1,
    name: "Hope Foundation",
    logo: "/api/placeholder/150/150",
    coverImage: "/api/placeholder/1200/300",
    category: "Education & Healthcare",
    location: "Mumbai, India",
    established: "2005",
    description: "Hope Foundation works to provide quality education and healthcare to underprivileged children across rural India. Our programs have impacted over 15,000 children in the last decade.",
    mission: "To create equal opportunities for all children through quality education and healthcare initiatives.",
    achievements: [
      "Built 12 schools in rural areas",
      "Provided healthcare to 15,000+ children",
      "Trained 500+ teachers in modern education methods",
      "Established 8 mobile health clinics"
    ],
    programs: [
      {
        id: 1,
        title: "School Building Program",
        description: "Constructing and renovating schools in rural areas"
      },
      {
        id: 2,
        title: "Teacher Training Initiative",
        description: "Training rural teachers in modern teaching methodologies"
      },
      {
        id: 3,
        title: "Mobile Health Clinics",
        description: "Providing healthcare services in remote villages"
      }
    ],
    contact: {
      email: "info@hopefoundation.org",
      phone: "+91 9876543210",
      website: "www.hopefoundation.org",
      address: "123 NGO Street, Mumbai, India"
    },
    socialMedia: {
      facebook: "facebook.com/hopefoundation",
      twitter: "twitter.com/hopefoundation",
      instagram: "instagram.com/hopefoundation"
    },
    donations: {
      received: 1250000,
      goal: 2000000
    }
  });

  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState(100);
  const [message, setMessage] = useState('');

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    setMessage(`You are now ${!isFollowing ? 'following' : 'no longer following'} ${ngo.name}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    setMessage(`Thank you for your donation of $${donationAmount} to ${ngo.name}!`);
    setShowDonateModal(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setMessage('Your message has been sent! The NGO will contact you soon.');
    setTimeout(() => setMessage(''), 3000);
  };

  // Progress bar calculation
  const donationProgress = (ngo.donations.received / ngo.donations.goal) * 100;

  return (
    <div className="ngo-profile-container">
      {/* Cover Image */}
      <div className="cover-image-container">
        <img src={ngo.coverImage} alt="NGO Cover" className="cover-image" />
        <div className="ngo-logo-container">
          <img src={ngo.logo} alt={ngo.name} className="ngo-logo" />
        </div>
      </div>

      {/* NGO Basic Info */}
      <div className="ngo-basic-info">
        <h1>{ngo.name}</h1>
        <p className="ngo-category">{ngo.category}</p>
        <p className="ngo-location">{ngo.location} • Est. {ngo.established}</p>
        
        <div className="action-buttons">
          <button 
            className={`follow-button ${isFollowing ? 'following' : ''}`} 
            onClick={handleFollowClick}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button 
            className="donate-button"
            onClick={() => setShowDonateModal(true)}
          >
            Donate Now
          </button>
        </div>
      </div>

      {/* Message notification */}
      {message && (
        <div className="message-notification">
          {message}
        </div>
      )}

      {/* Donation Progress */}
      <div className="donation-progress-container">
        <div className="donation-info">
          <p>Donation Progress</p>
          <p>${ngo.donations.received.toLocaleString()} of ${ngo.donations.goal.toLocaleString()}</p>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${donationProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="tabs-nav">
          <button 
            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={`tab-button ${activeTab === 'programs' ? 'active' : ''}`}
            onClick={() => setActiveTab('programs')}
          >
            Programs
          </button>
          <button 
            className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
          <button 
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'about' && (
            <div className="about-tab">
              <h2>About Us</h2>
              <p>{ngo.description}</p>
              <h3>Our Mission</h3>
              <p>{ngo.mission}</p>
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="programs-tab">
              <h2>Our Programs</h2>
              <div className="programs-list">
                {ngo.programs.map(program => (
                  <div key={program.id} className="program-card">
                    <h3>{program.title}</h3>
                    <p>{program.description}</p>
                    <button className="learn-more-button">Learn More</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-tab">
              <h2>Our Achievements</h2>
              <ul className="achievements-list">
                {ngo.achievements.map((achievement, index) => (
                  <li key={index} className="achievement-item">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="contact-tab">
              <h2>Contact Us</h2>
              <div className="contact-info">
                <div className="contact-details">
                  <h3>Contact Information</h3>
                  <p><strong>Email:</strong> {ngo.contact.email}</p>
                  <p><strong>Phone:</strong> {ngo.contact.phone}</p>
                  <p><strong>Website:</strong> {ngo.contact.website}</p>
                  <p><strong>Address:</strong> {ngo.contact.address}</p>
                  
                  <div className="social-media-links">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                      <a href={ngo.socialMedia.facebook} className="social-icon facebook">Facebook</a>
                      <a href={ngo.socialMedia.twitter} className="social-icon twitter">Twitter</a>
                      <a href={ngo.socialMedia.instagram} className="social-icon instagram">Instagram</a>
                    </div>
                  </div>
                </div>
                
                <div className="contact-form">
                  <h3>Send Us a Message</h3>
                  <form onSubmit={handleContactSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Your Name</label>
                      <input type="text" id="name" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Your Email</label>
                      <input type="email" id="email" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input type="text" id="subject" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea id="message" rows="4" required></textarea>
                    </div>
                    <button type="submit" className="submit-button">Send Message</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Donate Modal */}
      {showDonateModal && (
        <div className="modal-overlay">
          <div className="donate-modal">
            <button className="close-modal" onClick={() => setShowDonateModal(false)}>×</button>
            <h2>Donate to {ngo.name}</h2>
            <form onSubmit={handleDonateSubmit}>
              <div className="form-group">
                <label htmlFor="amount">Donation Amount ($)</label>
                <input 
                  type="number" 
                  id="amount" 
                  min="1" 
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(parseInt(e.target.value))}
                  required 
                />
              </div>
              <div className="donation-options">
                <button type="button" onClick={() => setDonationAmount(50)} className="donation-option">$50</button>
                <button type="button" onClick={() => setDonationAmount(100)} className="donation-option">$100</button>
                <button type="button" onClick={() => setDonationAmount(250)} className="donation-option">$250</button>
                <button type="button" onClick={() => setDonationAmount(500)} className="donation-option">$500</button>
              </div>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="card">Card Number</label>
                <input type="text" id="card" placeholder="1234 5678 9012 3456" required />
              </div>
              <div className="card-details">
                <div className="form-group">
                  <label htmlFor="expiry">Expiry Date</label>
                  <input type="text" id="expiry" placeholder="MM/YY" required />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input type="text" id="cvv" placeholder="123" required />
                </div>
              </div>
              <button type="submit" className="donate-submit-button">Complete Donation</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGOProfile;