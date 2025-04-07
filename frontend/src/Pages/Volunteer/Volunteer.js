import React, { useState, useEffect } from 'react';
import './Volunteer.css';
import { motion } from 'framer-motion';

const VolunteerPage = () => {
  // Volunteer statistics data
  const [volunteerStats, setVolunteerStats] = useState({
    totalVolunteers: 3842,
    activeProjects: 76,
    fieldVolunteers: 1568,
    remoteVolunteers: 2274,
    hoursContributed: 28945,
    countriesRepresented: 42,
    successfulProjects: 134
  });

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Community Garden Project",
      date: "April 15, 2025",
      location: "Central Park Community Center",
      category: "Environment",
      spots: 8,
    },
    {
      id: 2,
      title: "Youth Mentorship Program",
      date: "April 22, 2025",
      location: "Downtown Youth Center",
      category: "Education",
      spots: 5,
    },
    {
      id: 3,
      title: "Food Drive Collection",
      date: "May 1, 2025",
      location: "Multiple Locations",
      category: "Food Security",
      spots: 12,
    },
    {
      id: 4,
      title: "Elderly Care Connect",
      date: "May 8, 2025",
      location: "Sunshine Senior Living",
      category: "Healthcare",
      spots: 6,
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello human! 🤖 Need help finding the perfect volunteering opportunity? I\'m here to assist!' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatBotTyping, setChatBotTyping] = useState(false);

  const categories = ['All', 'Environment', 'Education', 'Food Security', 'Healthcare', 'Crisis Response'];

  const filteredEvents = activeCategory === 'All' 
    ? events 
    : events.filter(event => event.category === activeCategory);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
    }, 3000);
  };

  const handleEventSignup = (id) => {
    showMessage('Thanks for your interest! You will receive an email with more details shortly.');
    // Update stats when someone signs up
    setVolunteerStats(prev => ({
      ...prev,
      totalVolunteers: prev.totalVolunteers + 1
    }));
  };

  const handleCommunityJoin = () => {
    showMessage('Welcome to our volunteer community! Check your email for a verification link.');
    // Update stats when someone joins the community
    setVolunteerStats(prev => ({
      ...prev,
      totalVolunteers: prev.totalVolunteers + 1
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    setChatMessages([...chatMessages, { sender: 'user', text: userInput }]);
    
    // Simulate bot typing
    setChatBotTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      setChatBotTyping(false);
      let botResponse;
      const input = userInput.toLowerCase();
      
      if (input.includes('how') && input.includes('start')) {
        botResponse = "🚀 To start volunteering, browse our Events Hub below and click 'Join Event' on any that interest you! I can help you find the perfect match based on your skills.";
      } else if (input.includes('training')) {
        botResponse = "🎓 Affirmative! We provide comprehensive training for all our volunteers. Each opportunity lists specific training details, and you'll always be prepared before starting.";
      } else if (input.includes('time') || input.includes('hours')) {
        botResponse = "⏰ My circuits calculate that you can volunteer as little as 2 hours per week. We have flexible opportunities to fit your schedule! Would you prefer weekdays or weekends?";
      } else if (input.includes('remote') || input.includes('virtual')) {
        botResponse = "💻 Scanning database... We have 42 remote volunteering options currently available! Filter the Events Hub by 'Virtual' to see them all.";
      } else if (input.includes('stats') || input.includes('statistics') || input.includes('numbers')) {
        botResponse = `📊 We currently have ${volunteerStats.totalVolunteers} volunteers worldwide, with ${volunteerStats.fieldVolunteers} in the field and ${volunteerStats.remoteVolunteers} contributing remotely. Our global impact is growing daily!`;
      } else if (input.includes('who') && (input.includes('you') || input.includes('are'))) {
        botResponse = "🤖 I'm VolunteerBot, programmed to help humans find their perfect volunteering match! I process over 1,000 opportunities daily to connect you with meaningful work.";
      } else {
        botResponse = "🔍 Thanks for your question! My algorithms are processing your inquiry. Our human volunteer coordinator will email you with a detailed answer within 24 hours. Is there anything else I can help with?";
      }
      
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1500);
    
    setUserInput('');
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    // If opening chat after it was closed, add a greeting
    if (!isChatOpen && chatMessages.length <= 1) {
      setTimeout(() => {
        setChatMessages([...chatMessages, { 
          sender: 'bot', 
          text: 'My sensors detect you might have questions about volunteering! How can I assist your human quest to make a difference? 🤖' 
        }]);
      }, 500);
    }
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="volunteer-page">
      {isMessageVisible && (
        <div className="floating-message">
          {message}
        </div>
      )}
      
      <header className="volunteer-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Make a Difference as a Volunteer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="header-subtitle"
        >
          Connect with NGOs and find meaningful volunteering opportunities
        </motion.p>
      </header>

      {/* New Statistics Section */}
      <section className="volunteer-stats-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Our Global Impact
        </motion.h2>
        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-number">{volunteerStats.totalVolunteers.toLocaleString()}</div>
            <div className="stat-label">Total Volunteers</div>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-number">{volunteerStats.fieldVolunteers.toLocaleString()}</div>
            <div className="stat-label">Field Volunteers</div>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-number">{volunteerStats.remoteVolunteers.toLocaleString()}</div>
            <div className="stat-label">Remote Volunteers</div>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-number">{volunteerStats.hoursContributed.toLocaleString()}</div>
            <div className="stat-label">Hours Contributed</div>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="stat-number">{volunteerStats.activeProjects}</div>
            <div className="stat-label">Active Projects</div>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="stat-number">{volunteerStats.countriesRepresented}</div>
            <div className="stat-label">Countries</div>
          </motion.div>
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-content">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Volunteer With Us?
          </motion.h2>
          <p>
            Volunteering is a powerful way to contribute to causes you care about while 
            developing new skills and connections. Our platform connects passionate individuals 
            with vetted NGOs working in various sectors including education, healthcare, 
            environment, and crisis response.
          </p>
          <div className="benefits-grid">
            <motion.div 
              className="benefit-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Make Real Impact</h3>
              <p>Our partner NGOs are carefully selected to ensure your time creates meaningful change</p>
            </motion.div>
            <motion.div 
              className="benefit-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Flexible Opportunities</h3>
              <p>From one-time events to ongoing commitments, find options that fit your schedule</p>
            </motion.div>
            <motion.div 
              className="benefit-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Skill Development</h3>
              <p>Gain practical experience and develop new skills while helping others</p>
            </motion.div>
            <motion.div 
              className="benefit-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Community Connection</h3>
              <p>Meet like-minded individuals and build meaningful relationships</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>
        <div className="steps-container">
          <motion.div 
            className="step"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="step-number">1</div>
            <h3>Explore Opportunities</h3>
            <p>Browse our Events & Projects Hub to find opportunities matching your interests and availability</p>
          </motion.div>
          <motion.div 
            className="step"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="step-number">2</div>
            <h3>Sign Up for Events</h3>
            <p>Select an event or project and connect directly with the organizing NGO</p>
          </motion.div>
          <motion.div 
            className="step"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="step-number">3</div>
            <h3>Get Prepared</h3>
            <p>Receive all necessary information, training, and support before your volunteer activity</p>
          </motion.div>
          <motion.div 
            className="step"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <div className="step-number">4</div>
            <h3>Make Impact</h3>
            <p>Contribute your time and skills to create positive change in communities</p>
          </motion.div>
        </div>
      </section>

      <section className="events-hub">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Events & Projects Hub
        </motion.h2>
        <p className="hub-intro">
          Browse our current volunteer opportunities and find your perfect match. 
          New events are added weekly!
        </p>
        
        <div className="category-filters">
          {categories.map(category => (
            <button 
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="events-grid">
          {filteredEvents.map(event => (
            <motion.div 
              key={event.id} 
              className="event-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="event-category">{event.category}</div>
              <h3>{event.title}</h3>
              <div className="event-details">
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Available Spots:</strong> {event.spots}</p>
              </div>
              <button className="join-btn" onClick={() => handleEventSignup(event.id)}>
                Join Event
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Volunteer Map Section */}
      <section className="volunteer-map-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Our Global Volunteer Network
        </motion.h2>
        <div className="map-container">
          <div className="map-placeholder">
            <div className="map-stats">
              <div className="map-stat">
                <div className="map-stat-number">{volunteerStats.countriesRepresented}</div>
                <div className="map-stat-label">Countries</div>
              </div>
              <div className="map-stat">
                <div className="map-stat-number">{volunteerStats.activeProjects}</div>
                <div className="map-stat-label">Active Projects</div>
              </div>
              <div className="map-stat">
                <div className="map-stat-number">{volunteerStats.successfulProjects}</div>
                <div className="map-stat-label">Completed Projects</div>
              </div>
            </div>
          </div>
          <div className="map-regions">
            <div className="map-region">
              <h3>North America</h3>
              <p>1,245 Volunteers</p>
            </div>
            <div className="map-region">
              <h3>Europe</h3>
              <p>964 Volunteers</p>
            </div>
            <div className="map-region">
              <h3>Asia</h3>
              <p>876 Volunteers</p>
            </div>
            <div className="map-region">
              <h3>Africa</h3>
              <p>428 Volunteers</p>
            </div>
            <div className="map-region">
              <h3>South America</h3>
              <p>287 Volunteers</p>
            </div>
            <div className="map-region">
              <h3>Oceania</h3>
              <p>142 Volunteers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="volunteer-types">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Ways to Volunteer
        </motion.h2>
        <div className="volunteer-types-grid">
          <div className="volunteer-type">
            <h3>On-site Volunteering</h3>
            <p>
              Join in-person events and activities where you can directly interact with 
              communities and see the immediate impact of your work.
            </p>
            <ul>
              <li>Community events</li>
              <li>Direct service activities</li>
              <li>Environmental cleanups</li>
              <li>Teaching and mentoring</li>
            </ul>
          </div>
          <div className="volunteer-type">
            <h3>Virtual Volunteering</h3>
            <p>
              Contribute your skills remotely, perfect for those with limited time 
              or mobility constraints.
            </p>
            <ul>
              <li>Content creation</li>
              <li>Online mentoring</li>
              <li>Fundraising support</li>
              <li>Technical assistance</li>
            </ul>
          </div>
          <div className="volunteer-type">
            <h3>Skills-Based Volunteering</h3>
            <p>
              Offer your professional expertise to help NGOs build capacity and 
              increase their impact.
            </p>
            <ul>
              <li>Legal assistance</li>
              <li>Marketing and design</li>
              <li>IT and development</li>
              <li>Strategic planning</li>
            </ul>
          </div>
          <div className="volunteer-type">
            <h3>Group Volunteering</h3>
            <p>
              Involve your company, school, or community group in meaningful 
              team-building volunteer activities.
            </p>
            <ul>
              <li>Corporate social responsibility</li>
              <li>School service projects</li>
              <li>Club activities</li>
              <li>Family volunteering</li>
            </ul>
          </div>
        </div>
      </section>

      {/* New Section: Volunteer Success Stories */}
      <section className="volunteer-stories">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Success Stories
        </motion.h2>
        <div className="stories-container">
          <motion.div 
            className="story-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="story-image-placeholder"></div>
            <div className="story-content">
              <h3>Jane's Education Initiative</h3>
              <p className="story-location">Nairobi, Kenya</p>
              <p>Started with 3 volunteers teaching basic literacy, now reaches over 500 children with a team of 28 dedicated educators.</p>
              <div className="story-stats">
                <div className="story-stat">
                  <div className="story-stat-value">28</div>
                  <div className="story-stat-label">Volunteers</div>
                </div>
                <div className="story-stat">
                  <div className="story-stat-value">500+</div>
                  <div className="story-stat-label">Children Helped</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="story-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="story-image-placeholder"></div>
            <div className="story-content">
              <h3>Urban Garden Collective</h3>
              <p className="story-location">Chicago, USA</p>
              <p>Transformed 12 vacant lots into community gardens providing fresh produce to local food banks, involving 156 regular volunteers.</p>
              <div className="story-stats">
                <div className="story-stat">
                  <div className="story-stat-value">156</div>
                  <div className="story-stat-label">Volunteers</div>
                </div>
                <div className="story-stat">
                  <div className="story-stat-value">12</div>
                  <div className="story-stat-label">Gardens</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="story-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="story-image-placeholder"></div>
            <div className="story-content">
              <h3>Digital Inclusion Project</h3>
              <p className="story-location">Remote/Global</p>
              <p>A network of 283 tech professionals providing digital literacy training to underserved communities across 18 countries.</p>
              <div className="story-stats">
                <div className="story-stat">
                  <div className="story-stat-value">283</div>
                  <div className="story-stat-label">Volunteers</div>
                </div>
                <div className="story-stat">
                  <div className="story-stat-value">18</div>
                  <div className="story-stat-label">Countries</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="join-community">
        <div className="join-content">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Join Our Volunteer Community
          </motion.h2>
          <p>
            Connect with other volunteers, share experiences, and stay updated on 
            new opportunities. Our community members get early access to high-demand 
            volunteer positions and special events.
          </p>
          <button className="primary-btn" onClick={handleCommunityJoin}>
            Join Community
          </button>
        </div>
      </section>

      <section className="faq-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Do I need prior experience to volunteer?</h3>
            <p>
              No prior experience is necessary for most opportunities! Training is provided 
              for all volunteers, and we have positions suitable for all skill levels.
            </p>
          </div>
          <div className="faq-item">
            <h3>How much time do I need to commit?</h3>
            <p>
              Time commitments vary widely. Some events require just a few hours, while other 
              programs might ask for a regular weekly commitment. You can filter opportunities 
              based on your availability.
            </p>
          </div>
          <div className="faq-item">
            <h3>Can I volunteer remotely?</h3>
            <p>
              Yes! We offer many virtual volunteering opportunities that can be done from 
              anywhere with an internet connection.
            </p>
          </div>
          <div className="faq-item">
            <h3>Are there age restrictions for volunteers?</h3>
            <p>
              Some opportunities have minimum age requirements, but we have options for volunteers 
              of all ages, including family-friendly activities and youth-specific programs.
            </p>
          </div>
        </div>
      </section>

      <div className={`chat-widget ${isChatOpen ? 'open' : ''}`}>
        <div className="chat-header" onClick={toggleChat}>
          <h3>
            <span className="robot-icon">🤖</span> VolunteerBot Assistant
          </h3>
          <span>{isChatOpen ? '×' : '+'}</span>
        </div>
        
        {isChatOpen && (
          <div className="chat-container">
            <div className="chat-messages" id="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              {chatBotTyping && (
                <div className="chat-message bot typing">
                  <span className="typing-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask me anything about volunteering..."
                className="chat-input"
              />
              <button type="submit" className="chat-send-btn">
                <span className="send-icon">📤</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerPage;