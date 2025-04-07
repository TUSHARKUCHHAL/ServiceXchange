import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaProjectDiagram, FaHandsHelping, 
  FaPlus, FaCertificate, FaBullhorn, FaCheckCircle
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
  const [isLoading, setIsLoading] = useState(true);
  const [actionTaken, setActionTaken] = useState(null);

  useEffect(() => {
    // Simulate data loading with animation
    const timer = setTimeout(() => {
      setStats({
        totalProjects: 15,
        volunteersAssigned: 42,
        conductedDrives: 7,
        peopleReached: 1250
      });
      const animationTimer = setTimeout(() => {
        const dashboardElement = document.querySelector('.dashboard-overview');
        if (dashboardElement) {
          dashboardElement.classList.add('loaded');
        }
      }, 100);

      setRecentUpdates([
        { id: 1, title: "Food Distribution Drive", time: "2 hours ago", message: "Successfully distributed food packets to 150 people in Riverside area." },
        { id: 2, title: "New Volunteer Applications", time: "Yesterday", message: "5 new volunteer applications received for the Education Program." },
        { id: 3, title: "Upcoming Event Reminder", time: "1 day ago", message: "Health Camp scheduled for next Monday. 8 volunteers assigned." },
        { id: 4, title: "Certificate Request", time: "2 days ago", message: "10 certificates issued for volunteers who participated in the Beach Cleanup Drive." }
      ]);
      
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle button clicks
  const handleCreateEvent = () => {
    setActionTaken({
      type: "event",
      message: "New event creation initiated",
      icon: <FaPlus className="action-icon" />
    });
    
    // Add a new event to updates
    const newUpdate = {
      id: Date.now(),
      title: "New Event Created",
      time: "Just now",
      message: "Event creation process has been initiated."
    };
    
    setRecentUpdates([newUpdate, ...recentUpdates]);
  };

  const handleAddCertificate = () => {
    setActionTaken({
      type: "certificate",
      message: "Certificate creation started",
      icon: <FaCertificate className="action-icon" />
    });
    
    // Add certificate update
    const newUpdate = {
      id: Date.now(),
      title: "Certificate Creation",
      time: "Just now",
      message: "Certificate generation process has been initiated."
    };
    
    setRecentUpdates([newUpdate, ...recentUpdates]);
  };

  const handlePostRequirement = () => {
    setActionTaken({
      type: "requirement",
      message: "New requirement posted",
      icon: <FaBullhorn className="action-icon" />
    });
    
    // Add requirement update
    const newUpdate = {
      id: Date.now(),
      title: "Requirement Posted",
      time: "Just now",
      message: "New requirement has been posted for volunteers."
    };
    
    setRecentUpdates([newUpdate, ...recentUpdates]);
  };

  // Clear action taken notification after 3 seconds
  useEffect(() => {
    if (actionTaken) {
      const timer = setTimeout(() => {
        setActionTaken(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [actionTaken]);

  // Skeleton loader for stats cards
  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-icon"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-overview">
      {/* Action Notification */}
      {actionTaken && (
        <div className="notification">
          <div className="notification-icon">
            {actionTaken.icon}
          </div>
          <div className="notification-content">
            <div className="notification-title">Success!</div>
            <div className="notification-message">{actionTaken.message}</div>
          </div>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="stats-container">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
              <div className="stat-icon project-icon">
                <FaProjectDiagram />
              </div>
              <div className="stat-content">
                <h3>{stats.totalProjects}</h3>
                <p>Total Projects Running</p>
              </div>
            </div>

            <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
              <div className="stat-icon volunteer-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{stats.volunteersAssigned}</h3>
                <p>Volunteers Assigned</p>
              </div>
            </div>

            <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-icon drive-icon">
                <FaHandsHelping />
              </div>
              <div className="stat-content">
                <h3>{stats.conductedDrives}</h3>
                <p>Drives This Week</p>
              </div>
            </div>

            <div className="stat-card" data-aos="fade-up" data-aos-delay="400">
              <div className="stat-icon people-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{stats.peopleReached.toLocaleString()}</h3>
                <p>People Reached</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Access Buttons */}
      <div className="quick-access" data-aos="fade-up" data-aos-delay="300">
        <div className="section-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="quick-buttons">
          <button 
            onClick={handleCreateEvent}
            className="primary-button"
          >
            <FaPlus className="button-icon" /> Create Event
          </button>
          <button 
            onClick={handleAddCertificate}
            className="secondary-button"
          >
            <FaCertificate className="button-icon" /> Add Certificate
          </button>
          <button 
            onClick={handlePostRequirement}
            className="secondary-button"
          >
            <FaBullhorn className="button-icon" /> Post Requirement
          </button>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="updates-container" data-aos="fade-up" data-aos-delay="400">
        <div className="updates-header">
          <h3>Recent Updates</h3>
          <button className="view-all">View All</button>
        </div>
        
        {isLoading ? (
          <div className="updates-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-update">
                <div className="skeleton-header"></div>
                <div className="skeleton-body"></div>
                <div className="skeleton-body"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="updates-list">
            {recentUpdates.map((update, index) => (
              <div 
                key={update.id} 
                className="update-item"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="update-header">
                  <h4>{update.title}</h4>
                  <span className="update-time">{update.time}</span>
                </div>
                <p>{update.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;