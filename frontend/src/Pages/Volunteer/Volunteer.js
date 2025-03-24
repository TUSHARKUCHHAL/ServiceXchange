import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Volunteer.css";


const Volunteer = () => {
  const [volunteer, setVolunteer] = useState({
    name: "",
    email: "",
    skills: "",
    availability: "",
    location: "",
  });

  const [volunteers, setVolunteers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [applyingFor, setApplyingFor] = useState(null);

  const workOpportunities = [
    { id: 1, title: "Teaching Kids", location: "Delhi", time: "10 AM - 1 PM", icon: "📚" },
    { id: 2, title: "Food Distribution", location: "Mumbai", time: "2 PM - 5 PM", icon: "🍲" },
    { id: 3, title: "Blood Donation Camp", location: "Bangalore", time: "10 AM - 4 PM", icon: "🩸" },
  ];

  const handleChange = (e) => {
    setVolunteer({ ...volunteer, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!volunteer.name || !volunteer.email || !volunteer.skills || !volunteer.availability || !volunteer.location) {
      alert("Please fill in all fields.");
      return;
    }

    setVolunteers([...volunteers, volunteer]);
    setVolunteer({ name: "", email: "", skills: "", availability: "", location: "" });
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleApply = (work) => {
    setApplyingFor(work);
    setActiveTab("register");
  };

  return (
    <div className="main-container">
      <motion.div 
        className="volunteer-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="decoration-circle circle1"></div>
        <div className="decoration-circle circle2"></div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="main-title"
        >
          Volunteer Portal
        </motion.h1>
        
        <div className="tab-navigation">
          <motion.button 
            className={`tab-button ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
          <motion.button 
            className={`tab-button ${activeTab === "opportunities" ? "active" : ""}`}
            onClick={() => setActiveTab("opportunities")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Opportunities
          </motion.button>
          <motion.button 
            className={`tab-button ${activeTab === "volunteers" ? "active" : ""}`}
            onClick={() => setActiveTab("volunteers")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Volunteers
          </motion.button>
        </div>
        
        <AnimatePresence mode="wait">
          {submitted && (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="success-icon">✓</div>
              Registration Successful!
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {activeTab === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              <h2 className="section-title">
                {applyingFor ? `Apply for ${applyingFor.title}` : "Volunteer Registration"}
              </h2>
              
              <form onSubmit={handleSubmit} className="volunteer-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <motion.input 
                    whileFocus={{ scale: 1.02 }}
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    value={volunteer.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <motion.input 
                    whileFocus={{ scale: 1.02 }}
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="john@example.com" 
                    value={volunteer.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="skills">Skills</label>
                  <motion.input 
                    whileFocus={{ scale: 1.02 }}
                    type="text" 
                    id="skills" 
                    name="skills" 
                    placeholder="Teaching, Organizing, First Aid..." 
                    value={volunteer.skills} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="availability">Availability</label>
                  <motion.input 
                    whileFocus={{ scale: 1.02 }}
                    type="text" 
                    id="availability" 
                    name="availability" 
                    placeholder="Weekends, 10 AM - 5 PM" 
                    value={volunteer.availability} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <motion.input 
                    whileFocus={{ scale: 1.02 }}
                    type="text" 
                    id="location" 
                    name="location" 
                    placeholder="City, State" 
                    value={volunteer.location} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <motion.button 
                  type="submit" 
                  className="submit-button"
                  whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(66, 153, 225, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {applyingFor ? "Apply Now" : "Register as Volunteer"}
                </motion.button>
                
                {applyingFor && (
                  <motion.button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setApplyingFor(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel Application
                  </motion.button>
                )}
              </form>
            </motion.div>
          )}
          
          {activeTab === "opportunities" && (
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              <h2 className="section-title">Available Work Opportunities</h2>
              <div className="work-list">
                {workOpportunities.map((work, index) => (
                  <motion.div 
                    key={work.id} 
                    className="work-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="work-icon">{work.icon}</div>
                    <div className="work-details">
                      <h3>{work.title}</h3>
                      <div className="detail-row">
                        <span className="detail-label">Location:</span>
                        <span>{work.location}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Time:</span>
                        <span>{work.time}</span>
                      </div>
                    </div>
                    <motion.button 
                      className="apply-button"
                      onClick={() => handleApply(work)}
                      whileHover={{ scale: 1.1, boxShadow: "0 4px 10px rgba(66, 153, 225, 0.4)" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Apply
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {activeTab === "volunteers" && volunteers.length > 0 && (
            <motion.div
              key="volunteers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              <h2 className="section-title">Registered Volunteers</h2>
              <div className="volunteer-list">
                {volunteers.map((v, index) => (
                  <motion.div 
                    key={index} 
                    className="volunteer-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 6px 15px rgba(0, 0, 0, 0.07)" }}
                  >
                    <div className="volunteer-header">
                      <div className="volunteer-avatar">
                        {v.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="volunteer-primary">
                        <h3>{v.name}</h3>
                        <p className="volunteer-location">{v.location}</p>
                      </div>
                    </div>
                    <div className="volunteer-details">
                      <div className="detail-item">
                        <span className="detail-icon">⚡</span>
                        <span className="detail-text">{v.skills}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🕒</span>
                        <span className="detail-text">{v.availability}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {activeTab === "volunteers" && volunteers.length === 0 && (
            <motion.div
              key="no-volunteers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="empty-state"
            >
              <div className="empty-icon">👥</div>
              <p>No volunteers registered yet</p>
              <motion.button
                onClick={() => setActiveTab("register")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="action-button"
              >
                Register Now
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Volunteer;