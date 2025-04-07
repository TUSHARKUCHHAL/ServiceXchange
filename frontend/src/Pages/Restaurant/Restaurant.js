import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./Restaurant.css";

const Restaurant = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6 
      } 
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.8
      } 
    }
  };

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Testimonials rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Testimonial quotes
  const testimonials = [
    "Thanks to this platform, our restaurant has donated over 200 meals this month alone!",
    "Being able to contribute excess food instead of throwing it away has been rewarding for our entire staff.",
    "The process is so streamlined - it takes minutes to make a huge difference in someone's life."
  ];

  // Success stories
  const successStories = [
    {
      name: "Café Horizon",
      donated: "1,200 meals",
      impact: "Helped feed 80 families in need"
    },
    {
      name: "Fresh Bistro",
      donated: "850 meals",
      impact: "Supported 3 local shelters"
    },
    {
      name: "Sunset Grill",
      donated: "750 meals",
      impact: "Provided food for 5 community events"
    }
  ];

  // FAQ content
  const faqItems = [
    {
      question: "How do I know if my food donation is eligible?",
      answer: "Any unsold, untouched, and properly stored food that meets safety standards is eligible. This includes prepared meals, baked goods, produce, and packaged items within their best-by dates."
    },
    {
      question: "What are the time commitments for volunteers?",
      answer: "Volunteering is flexible. You can choose to participate in one-time events or sign up for regular shifts. Most volunteer opportunities require 2-4 hours of your time."
    },
    {
      question: "Do I need special equipment or vehicles to donate?",
      answer: "No special equipment is required. For smaller donations, volunteers can pick them up. For larger donations, we can coordinate with our logistics partners."
    },
    {
      question: "Are there any tax benefits for participating restaurants?",
      answer: "Yes! Restaurants that donate food are eligible for tax deductions. Our system automatically generates the documentation you need for tax purposes."
    },
    {
      question: "How quickly will my donation be collected?",
      answer: "We aim to collect donations within 1-2 hours of posting. Our network of volunteers and partner organizations ensures quick response times to maintain food quality."
    }
  ];

  // Handle FAQ toggle
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div 
          className="loader"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity
          }}
        >
          <i className="fas fa-utensils"></i>
        </motion.div>
        <p>Loading amazing possibilities...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="restaurant-container-light"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Banner Section */}
      <motion.div className="restaurant-banner-light" variants={itemVariants}>
        <h1>Join Hands to Fight Hunger</h1>
        <p>"Your surplus can be someone's survival"</p>
        <motion.button
          className="banner-cta-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/restaurant/signup")}
        >
          Join Our Mission
        </motion.button>
        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <i className="fas fa-angle-down"></i>
        </motion.div>
      </motion.div>

      {/* Main Content Section */}
      <motion.div className="restaurant-content-light" variants={itemVariants}>
        <h2>Partner with Us</h2>
        <p>
          Your restaurant can make a real difference in your community. Donate excess food 
          that would otherwise go to waste or volunteer your time to help distribute meals.
        </p>

        {/* Feature Cards */}
        <motion.div className="feature-cards" variants={fadeInVariants}>
          <motion.div 
            className="feature-card"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="feature-icon">
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <h3>Make a Difference</h3>
            <p>Help those in need by donating your restaurant's excess food.</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="feature-icon">
              <i className="fas fa-leaf"></i>
            </div>
            <h3>Reduce Waste</h3>
            <p>Turn potential waste into valuable resources for the community.</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="feature-icon">
              <i className="fas fa-medal"></i>
            </div>
            <h3>Build Reputation</h3>
            <p>Showcase your restaurant's commitment to social responsibility.</p>
          </motion.div>
        </motion.div>

        {/* Buttons Section */}
        <div className="restaurant-buttons-light">
          <motion.button 
            onClick={() => navigate("/restaurant/donate")}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(229, 57, 53, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="donate-btn"
          >
            <i className="fas fa-utensils"></i> Donate Excess Food
          </motion.button>

          <motion.button 
            onClick={() => navigate("/restaurant/volunteer-r")}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 126, 103, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="volunteer-btn"
          >
            <i className="fas fa-hands-helping"></i> Become a Volunteer
          </motion.button>
        </div>

        {/* Impact Stats */}
        <motion.div 
          className="impact-stats-light"
          variants={itemVariants}
        >
          <motion.div 
            className="stat-card"
            whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(229, 57, 53, 0.15)" }}
          >
            <div className="stat-icon"><i className="fas fa-utensils"></i></div>
            <h4>5,000+</h4>
            <p>Meals Donated</p>
          </motion.div>
          <motion.div 
            className="stat-card"
            whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(229, 57, 53, 0.15)" }}
          >
            <div className="stat-icon"><i className="fas fa-store"></i></div>
            <h4>120+</h4>
            <p>Restaurant Partners</p>
          </motion.div>
          <motion.div 
            className="stat-card"
            whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(229, 57, 53, 0.15)" }}
          >
            <div className="stat-icon"><i className="fas fa-users"></i></div>
            <h4>300+</h4>
            <p>Active Volunteers</p>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div className="how-it-works" variants={itemVariants}>
          <h3>How It Works</h3>
          <div className="steps-container">
            <motion.div 
              className="step-item"
              whileHover={{ scale: 1.03 }}
            >
              <div className="step-number">1</div>
              <h4>Sign Up</h4>
              <p>Register your restaurant on our platform in just a few minutes.</p>
            </motion.div>
            <div className="step-connector"></div>
            <motion.div 
              className="step-item"
              whileHover={{ scale: 1.03 }}
            >
              <div className="step-number">2</div>
              <h4>List Your Donations</h4>
              <p>Post details about the food you can donate and when it's available.</p>
            </motion.div>
            <div className="step-connector"></div>
            <motion.div 
              className="step-item"
              whileHover={{ scale: 1.03 }}
            >
              <div className="step-number">3</div>
              <h4>Connect</h4>
              <p>We'll connect you with nearby organizations that can use your donation.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          className="testimonials-section-light"
          variants={itemVariants}
        >
          <h3>What Our Partners Say</h3>
          <div className="testimonials-container">
            {testimonials.map((quote, index) => (
              <motion.div 
                key={index} 
                className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`}
                initial={false}
                animate={{ opacity: index === activeTestimonial ? 1 : 0, y: index === activeTestimonial ? 0 : 20 }}
                transition={{ duration: 0.5 }}
              >
                <i className="fas fa-quote-left quote-icon"></i>
                <p>"{quote}"</p>
                <div className="testimonial-author">- Restaurant Partner</div>
              </motion.div>
            ))}
            <div className="dot-indicators">
              {testimonials.map((_, index) => (
                <span 
                  key={index} 
                  className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                ></span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div className="success-stories-light" variants={itemVariants}>
          <h3>Success Stories</h3>
          <div className="stories-container">
            {successStories.map((story, index) => (
              <motion.div 
                key={index} 
                className="story-card"
                whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(229, 57, 53, 0.15)" }}
              >
                <h4>{story.name}</h4>
                <p><strong>Donated:</strong> {story.donated}</p>
                <p><strong>Impact:</strong> {story.impact}</p>
                <motion.div 
                  className="read-more-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/success-stories/${story.name.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  Read Full Story
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div className="faq-section" variants={itemVariants}>
          <h3>Frequently Asked Questions</h3>
          <div className="faq-container">
            {faqItems.map((faq, index) => (
              <motion.div 
                key={index}
                className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
                initial={false}
                animate={{ backgroundColor: expandedFaq === index ? "rgba(255, 126, 103, 0.1)" : "rgba(255, 255, 255, 0.8)" }}
                whileHover={{ backgroundColor: expandedFaq === index ? "rgba(255, 126, 103, 0.1)" : "rgba(255, 255, 255, 0.9)" }}
              >
                <div 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <h4>{faq.question}</h4>
                  <motion.div 
                    className="faq-icon"
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </motion.div>
                </div>
                <motion.div 
                  className="faq-answer"
                  initial={false}
                  animate={{ 
                    height: expandedFaq === index ? "auto" : "0px",
                    opacity: expandedFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{faq.answer}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div className="cta-section-light" variants={itemVariants}>
          <h3>Ready to Make a Difference?</h3>
          <p>
            Join our community of restaurants fighting hunger and food waste. 
            Together, we can create a more sustainable and compassionate food system.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/restaurant/signup")}
          >
            Get Started Today
          </motion.button>
        </motion.div>

        {/* Stats Counter Section */}
        <motion.div 
          className="stats-counter-section"
          variants={itemVariants}
        >
          <h3>Our Impact This Month</h3>
          <div className="counters-container">
            <motion.div 
              className="counter-item"
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(229, 57, 53, 0.15)" }}
            >
              <i className="fas fa-utensils"></i>
              <div className="counter-value">
                <motion.span
                  initial={{ count: 0 }}
                  animate={{ count: 520 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  {({ count }) => Math.floor(count)}
                </motion.span>+
              </div>
              <p>Meals Donated This Month</p>
            </motion.div>
            <motion.div 
              className="counter-item"
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(229, 57, 53, 0.15)" }}
            >
              <i className="fas fa-store"></i>
              <div className="counter-value">
                <motion.span
                  initial={{ count: 0 }}
                  animate={{ count: 18 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  {({ count }) => Math.floor(count)}
                </motion.span>
              </div>
              <p>New Restaurant Partners</p>
            </motion.div>
            <motion.div 
              className="counter-item"
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(229, 57, 53, 0.15)" }}
            >
              <i className="fas fa-leaf"></i>
              <div className="counter-value">
                <motion.span
                  initial={{ count: 0 }}
                  animate={{ count: 850 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  {({ count }) => Math.floor(count)}
                </motion.span>kg
              </div>
              <p>Food Waste Prevented</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Partner Logos */}
        <motion.div className="partner-logos-section" variants={itemVariants}>
          <h3>Our Restaurant Partners</h3>
          <div className="logo-slider">
            <motion.div 
              className="logos-track"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "loop", 
                duration: 20, 
                ease: "linear" 
              }}
            >
              {/* Replace with actual partner logos */}
              <div className="partner-logo"><i className="fas fa-utensils"></i> Gourmet Central</div>
              <div className="partner-logo"><i className="fas fa-pizza-slice"></i> Pizza Paradise</div>
              <div className="partner-logo"><i className="fas fa-hamburger"></i> Burger Haven</div>
              <div className="partner-logo"><i className="fas fa-coffee"></i> Morning Brew</div>
              <div className="partner-logo"><i className="fas fa-fish"></i> Ocean Delights</div>
              <div className="partner-logo"><i className="fas fa-pepper-hot"></i> Spice Garden</div>
              <div className="partner-logo"><i className="fas fa-bread-slice"></i> Fresh Bakery</div>
              <div className="partner-logo"><i className="fas fa-ice-cream"></i> Sweet Treats</div>
              
              {/* Duplicate logos for seamless looping */}
              <div className="partner-logo"><i className="fas fa-utensils"></i> Gourmet Central</div>
              <div className="partner-logo"><i className="fas fa-pizza-slice"></i> Pizza Paradise</div>
              <div className="partner-logo"><i className="fas fa-hamburger"></i> Burger Haven</div>
              <div className="partner-logo"><i className="fas fa-coffee"></i> Morning Brew</div>
              <div className="partner-logo"><i className="fas fa-fish"></i> Ocean Delights</div>
              <div className="partner-logo"><i className="fas fa-pepper-hot"></i> Spice Garden</div>
              <div className="partner-logo"><i className="fas fa-bread-slice"></i> Fresh Bakery</div>
              <div className="partner-logo"><i className="fas fa-ice-cream"></i> Sweet Treats</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div className="newsletter-section" variants={itemVariants}>
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for updates, success stories, and opportunities.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
          <p className="newsletter-disclaimer">We respect your privacy and will never share your information.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Restaurant;