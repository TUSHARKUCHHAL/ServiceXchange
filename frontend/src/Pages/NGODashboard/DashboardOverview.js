import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaProjectDiagram, FaHandsHelping, 
  FaPlus, FaCertificate, FaBullhorn 
} from 'react-icons/fa';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    volunteersAssigned: 0,
    conductedDrives: 0,
    peopleReached: 0
  });

  const [recentUpdates, setRecentUpdates] = useState([]);

  useEffect(() => {
    // Simulate data loading with animation
    const timer = setTimeout(() => {
      setStats({
        totalProjects: 15,
        volunteersAssigned: 42,
        conductedDrives: 7,
        peopleReached: 1250
      });

      setRecentUpdates([
        { id: 1, title: "Food Distribution Drive", time: "2 hours ago", message: "Successfully distributed food packets to 150 people in Riverside area." },
        { id: 2, title: "New Volunteer Applications", time: "Yesterday", message: "5 new volunteer applications received for the Education Program." },
        { id: 3, title: "Upcoming Event Reminder", time: "1 day ago", message: "Health Camp scheduled for next Monday. 8 volunteers assigned." },
        { id: 4, title: "Certificate Request", time: "2 days ago", message: "10 certificates issued for volunteers who participated in the Beach Cleanup Drive." }
      ]);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 }
    })
  };

  return (
    <div className="dashboard-overview">
      {/* Stats Cards */}
      <div className="grid-container">
        <motion.div 
          className="card stat-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <div className="stat-icon project-icon">
            <FaProjectDiagram />
          </div>
          <div className="stat-content">
            <h3>{stats.totalProjects}</h3>
            <p>Total Projects Running</p>
          </div>
        </motion.div>

        <motion.div 
          className="card stat-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <div className="stat-icon volunteer-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.volunteersAssigned}</h3>
            <p>Volunteers Assigned</p>
          </div>
        </motion.div>

        <motion.div 
          className="card stat-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <div className="stat-icon drive-icon">
            <FaHandsHelping />
          </div>
          <div className="stat-content">
            <h3>{stats.conductedDrives}</h3>
            <p>Drives This Week</p>
          </div>
        </motion.div>

        <motion.div 
          className="card stat-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <div className="stat-icon people-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.peopleReached.toLocaleString()}</h3>
            <p>People Reached</p>
          </div>
        </motion.div>
      </div>

      {/* Quick Access Buttons */}
      <motion.div 
        className="card quick-access"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={5}
      >
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="quick-buttons">
          <button className="btn btn-primary">
            <FaPlus /> Create Event
          </button>
          <button className="btn btn-outline">
            <FaCertificate /> Add Certificate
          </button>
          <button className="btn btn-outline">
            <FaBullhorn /> Post Requirement
          </button>
        </div>
      </motion.div>

      {/* Recent Updates */}
      <motion.div 
        className="card recent-updates"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={6}
      >
        <div className="card-header">
          <h3 className="card-title">Recent Updates</h3>
          <span className="card-action">View All</span>
        </div>
        <div className="updates-list">
          {recentUpdates.map((update, index) => (
            <motion.div 
              key={update.id} 
              className="update-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
            >
              <h4>{update.title}</h4>
              <p>{update.message}</p>
              <small>{update.time}</small>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;