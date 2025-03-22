import React, { useEffect, useState, useRef } from "react";
import "./About.css";
import { FaHeartbeat, FaUtensils, FaHandshake, FaQuoteLeft, FaLightbulb, FaHistory, FaUsers, FaGlobe, FaAward } from "react-icons/fa";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [activeTab, setActiveTab] = useState("mission");
  const timelineRef = useRef(null);

  const handleJoinClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };
  
  useEffect(() => {
    setIsVisible(true);
    
    // Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });
    
    // Track all elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const scrollTimeline = (direction) => {
    if (timelineRef.current) {
      const scrollAmount = 300;
      timelineRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  const faqs = [
    { 
      question: "How can I become a volunteer?", 
      answer: "You can sign up on our website and start participating in food and blood donation activities. We provide training and resources to help you make a meaningful impact."
    },
    { 
      question: "Is the food quality checked before donation?", 
      answer: "Yes! All food donations undergo strict quality control checks. Our team follows food safety guidelines to ensure all donations are safe for distribution."
    },
    { 
      question: "How do I request emergency blood?", 
      answer: "Simply post a request on our platform, and available donors will be notified immediately. Our system prioritizes urgent requests and connects you with nearby donors."
    },
    { 
      question: "Do you offer corporate partnership programs?", 
      answer: "Yes, we work with businesses of all sizes to create customized social responsibility programs. Contact us to learn how your organization can get involved."
    },
    { 
      question: "Can I donate money instead of time or resources?", 
      answer: "Absolutely! Financial contributions help us expand our operations and reach more communities in need. Visit our donation page to make a contribution."
    }
  ];

  const testimonials = [
    {
      quote: "ServiceXchange helped our restaurant donate excess food efficiently. It's amazing to be part of something so impactful!",
      author: "John Davis",
      role: "Owner, Fresh Bites Restaurant"
    },
    {
      quote: "I found a blood donor within hours thanks to this platform. Truly a life-saving initiative that came through when we needed it most.",
      author: "Susan Mitchell",
      role: "Blood Recipient"
    },
    {
      quote: "As an NGO coordinator, this platform has streamlined our food collection process. We can now serve 40% more people with the same resources.",
      author: "Michael Chang",
      role: "Community Outreach Director"
    }
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
          <h1 className="about-title">About <span className="highlight">ServiceXchange</span></h1>
          <p className="about-mission">
            Connecting NGOs, restaurants, hospitals, and volunteers to bring positive change.
          </p>
        </div>
        <div className="wave-container">
          <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#fff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,154.7C384,128,480,96,576,96C672,96,768,128,864,149.3C960,171,1056,181,1152,176C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="about-tabs-section">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === "mission" ? "active" : ""}`}
            onClick={() => setActiveTab("mission")}
          >
            Our Mission
          </button>
          <button 
            className={`tab-button ${activeTab === "values" ? "active" : ""}`}
            onClick={() => setActiveTab("values")}
          >
            Our Values
          </button>
          <button 
            className={`tab-button ${activeTab === "story" ? "active" : ""}`}
            onClick={() => setActiveTab("story")}
          >
            Our Story
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === "mission" && (
            <div className="tab-panel animate-on-scroll">
              <div className="mission-content">
                <div className="mission-icon">
                  <FaLightbulb size={40} color="#e74c3c" />
                </div>
                <h2>Our Mission</h2>
                <p>
                  At ServiceXchange, we are dedicated to reducing food waste and ensuring timely
                  blood donations. By linking resources efficiently, we create a bridge between
                  donors and those in need, maximizing impact and saving lives.
                </p>
                <p>
                  We envision a world where no one goes hungry and where blood is always available
                  for those who need it. Through innovative technology and community engagement,
                  we're making this vision a reality.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === "values" && (
            <div className="tab-panel animate-on-scroll">
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">
                    <FaHeartbeat size={30} color="#e74c3c" />
                  </div>
                  <h3>Compassion</h3>
                  <p>We believe in empathy-driven service and care for our communities.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">
                    <FaHandshake size={30} color="#e74c3c" />
                  </div>
                  <h3>Collaboration</h3>
                  <p>Together, we can accomplish what none of us could do alone.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">
                    <FaGlobe size={30} color="#e74c3c" />
                  </div>
                  <h3>Sustainability</h3>
                  <p>Creating lasting change through responsible resource management.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">
                    <FaAward size={30} color="#e74c3c" />
                  </div>
                  <h3>Excellence</h3>
                  <p>Committing to the highest standards in everything we do.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "story" && (
            <div className="tab-panel animate-on-scroll">
              <div className="story-content">
                <h2>Our Journey</h2>
                <p>
                  ServiceXchange began in 2020 when our founder witnessed both food waste at restaurants
                  and shortages at local food banks. What started as a simple app connecting these two groups
                  has evolved into a comprehensive platform serving multiple causes.
                </p>
                
                <div className="timeline-container">
                  <button className="timeline-nav left" onClick={() => scrollTimeline(-1)}>❮</button>
                  <div className="timeline" ref={timelineRef}>
                    <div className="timeline-item">
                      <div className="timeline-date">2020</div>
                      <div className="timeline-content">
                        <h4>The Beginning</h4>
                        <p>ServiceXchange launches with 10 restaurant partners and 5 food banks.</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-date">2021</div>
                      <div className="timeline-content">
                        <h4>Blood Donation Integration</h4>
                        <p>Expanded platform to include blood donation matching services.</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-date">2022</div>
                      <div className="timeline-content">
                        <h4>National Recognition</h4>
                        <p>Received Social Innovation Award for community impact.</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-date">2023</div>
                      <div className="timeline-content">
                        <h4>Volunteer Network</h4>
                        <p>Grew to over 2,000 active volunteers nationwide.</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-date">Today</div>
                      <div className="timeline-content">
                        <h4>Growing Impact</h4>
                        <p>Now serving 100+ communities with expanding services.</p>
                      </div>
                    </div>
                  </div>
                  <button className="timeline-nav right" onClick={() => scrollTimeline(1)}>❯</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="services-overview animate-on-scroll">
        <h2>How It Works</h2>
        <div className="services-cards">
          <div className="service-overview-card">
            <div className="service-overview-icon">
              <FaUtensils size={30} color="#e74c3c" />
            </div>
            <h3>Food Donation</h3>
            <p>Restaurants & food suppliers donate surplus food for redistribution through our platform.</p>
          </div>
          <div className="service-overview-card">
            <div className="service-overview-icon">
              <FaHeartbeat size={30} color="#e74c3c" />
            </div>
            <h3>Blood Donation</h3>
            <p>Hospitals & blood banks post urgent blood donation requests that reach potential donors immediately.</p>
          </div>
          <div className="service-overview-card">
            <div className="service-overview-icon">
              <FaHandshake size={30} color="#e74c3c" />
            </div>
            <h3>Volunteer Support</h3>
            <p>Our volunteers assist in collecting and distributing food and supporting blood donation drives.</p>
          </div>
        </div>
      </div>

      <div className="why-choose-section animate-on-scroll">
        <h2 className="section-title">Why Choose ServiceXchange?</h2>
        <div className="why-choose-content">
          <div className="why-choose-image">
            <div className="image-placeholder">
              <FaUsers size={120} color="#e74c3c" opacity={0.2} />
            </div>
          </div>
          <div className="why-choose-points">
            <div className="why-choose-point">
              <div className="point-icon">🔹</div>
              <div className="point-text">
                <h3>Real-time Connection</h3>
                <p>Instant matching between donors and recipients when time matters most.</p>
              </div>
            </div>
            <div className="why-choose-point">
              <div className="point-icon">🔹</div>
              <div className="point-text">
                <h3>Transparent Allocation</h3>
                <p>Clear tracking of resources to ensure they reach those who need them.</p>
              </div>
            </div>
            <div className="why-choose-point">
              <div className="point-icon">🔹</div>
              <div className="point-text">
                <h3>Community-Driven</h3>
                <p>A volunteer network that truly cares about making a difference.</p>
              </div>
            </div>
            <div className="why-choose-point">
              <div className="point-icon">🔹</div>
              <div className="point-text">
                <h3>Measurable Impact</h3>
                <p>Track your contributions and see the difference you're making.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="team-section animate-on-scroll">
        <h2 className="section-title">Meet Our Team</h2>
        <div className="team-cards">
          <div className="team-card">
            <div className="team-avatar"></div>
            <h3>Sarah Johnson</h3>
            <p className="team-role">Founder & CEO</p>
            <p className="team-bio">Former hospital administrator with a passion for community service.</p>
          </div>
          <div className="team-card">
            <div className="team-avatar"></div>
            <h3>David Chen</h3>
            <p className="team-role">CTO</p>
            <p className="team-bio">Tech innovator focused on creating platforms for social good.</p>
          </div>
          <div className="team-card">
            <div className="team-avatar"></div>
            <h3>Maria Rodriguez</h3>
            <p className="team-role">Community Director</p>
            <p className="team-bio">10+ years experience in nonprofit management and volunteer coordination.</p>
          </div>
        </div>
      </div>

      <div className="testimonial-section animate-on-scroll">
        <h2 className="section-title">What People Say</h2>
        <div className="testimonial-container">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <FaQuoteLeft size={24} color="#e74c3c" style={{ opacity: 0.3, marginBottom: '15px' }} />
              <p className="testimonial-quote">
                {testimonial.quote}
              </p>
              <p className="testimonial-author">{testimonial.author}</p>
              <p className="testimonial-role">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="faq-section animate-on-scroll">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className={`faq-question ${activeFAQ === index ? "active" : ""}`} 
                onClick={() => toggleFAQ(index)}
              >
                <span className="faq-icon">
                  {activeFAQ === index ? "−" : "+"}
                </span>
                {faq.question}
              </div>
              <div className={`faq-answer ${activeFAQ === index ? "show" : ""}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="impact-counter animate-on-scroll">
        <h2 className="section-title">Our Impact So Far</h2>
        <div className="counter-cards">
          <div className="counter-card">
            <div className="counter-number">250K+</div>
            <div className="counter-label">Meals Delivered</div>
          </div>
          <div className="counter-card">
            <div className="counter-number">45K+</div>
            <div className="counter-label">Blood Units Donated</div>
          </div>
          <div className="counter-card">
            <div className="counter-number">2.5K+</div>
            <div className="counter-label">Active Volunteers</div>
          </div>
          <div className="counter-card">
            <div className="counter-number">100+</div>
            <div className="counter-label">Communities Served</div>
          </div>
        </div>
      </div>

      <div className="cta-section animate-on-scroll">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of others who are creating positive change in their communities.</p>
          <button className="cta-button" onClick={handleJoinClick}>
            Join the Movement
          </button>
          {showMessage && <p className="success-message">Thank you for joining us! We'll be in touch soon.</p>}
        </div>
      </div>
    </div>
  );
};

export default About;