import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { 
  Calendar, 
  Clock, 
  User, 
  Bell, 
  MapPin, 
  Heart, 
  Award, 
  Users, 
  BarChart2, 
  CheckCircle 
} from "lucide-react";
import "./NGODashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([
    { name: "Active Drives", tasks: 10, progress: 86, color: "#4A148C", icon: "map" },
    { name: "Total Donations", tasks: 12, progress: 46, color: "#00897B", icon: "heart" },
    { name: "Team Members", tasks: 22, progress: 73, color: "#D32F2F", icon: "users" },
    { name: "Completed Tasks", tasks: 18, progress: 94, color: "#1565C0", icon: "check" },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { title: "Beach Cleanup Drive", date: "Mar 28, 2025", location: "Miami Beach" },
    { title: "Food Distribution", date: "Apr 2, 2025", location: "Downtown Center" },
    { title: "Volunteer Orientation", date: "Apr 5, 2025", location: "Community Hall" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [checkinData, setCheckinData] = useState({ motive: "", city: "", description: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New volunteer application received", time: "2 hours ago", read: false },
    { id: 2, message: "Donation goal reached for March", time: "Yesterday", read: true },
    { id: 3, message: "5 tasks completed this week", time: "2 days ago", read: true },
  ]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckinData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCheckinData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Simulate API call with loading state
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Success notification would appear here
      setIsSubmitting(false);
      setShowModal(false);
      setCheckinData({ motive: "", city: "", description: "", image: null });
      setImagePreview(null);
      setShowNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }, 1500);
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const getIconComponent = (iconName) => {
    switch(iconName) {
      case "map": return <MapPin size={24} />;
      case "heart": return <Heart size={24} />;
      case "users": return <Users size={24} />;
      case "check": return <CheckCircle size={24} />;
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Welcome back, Sarah</h1>
            <div className="header-date-time">
              <div className="date-container">
                <Calendar size={16} />
                <span>{currentTime.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="time-container">
                <Clock size={16} />
                <span>{currentTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <div className="avatar-container">
                <img src="https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png" alt="User" className="user-avatar" />
              </div>
              <span>Sarah Johnson</span>
            </div>
            <button className="dashboard-button" onClick={() => setShowModal(true)}>
              <span>New Check-in</span>
            </button>
          </div>
        </div>

        {/* Notifications Dropdown */}

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart2 size={18} />
            <span>Overview</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'drives' ? 'active' : ''}`}
            onClick={() => setActiveTab('drives')}
          >
            <MapPin size={18} />
            <span>Drives</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <Heart size={18} />
            <span>Donations</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'volunteers' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteers')}
          >
            <Users size={18} />
            <span>Volunteers</span>
          </button>
        </div>

        <div className="dashboard-stats-grid">
          {projects.map((project, index) => (
            <div key={index} className="dashboard-card" style={{ backgroundColor: project.color }}>
              <div className="dashboard-card-icon">
                {getIconComponent(project.icon)}
              </div>
              <div className="dashboard-card-content">
                <h2>{project.name}</h2>
                <h3>{project.tasks}</h3>
                <div className="dashboard-progress-container">
                  <div className="dashboard-progress-bar">
                    <div
                      className="dashboard-progress"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{project.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-sections-container">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Upcoming Events</h2>
              <button className="view-all">View All</button>
            </div>
            <div className="events-list">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="event-card">
                  <div className="event-date">
                    <Calendar size={20} />
                    <span>{event.date}</span>
                  </div>
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <div className="event-location">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <button className="event-action-button">Details</button>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Achievements</h2>
              <button className="view-all">View All</button>
            </div>
            <div className="achievements-container">
              <div className="achievement-card">
                <div className="achievement-icon">
                  <Award size={32} color="#FFD700" />
                </div>
                <div className="achievement-details">
                  <h3>Donation Milestone</h3>
                  <p>Reached $10,000 in donations</p>
                </div>
              </div>
              <div className="achievement-card">
                <div className="achievement-icon">
                  <Award size={32} color="#FFD700" />
                </div>
                <div className="achievement-details">
                  <h3>Community Impact</h3>
                  <p>Helped 500+ families this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="student-certification-section">
          <div className="certification-container">
            <h2>Student Volunteer Program</h2>
            <p>Get certified for your volunteer hours and boost your college applications.</p>
            <div className="certification-buttons">
              <button
                className="certification-button"
                onClick={() => navigate("/student-certification")}
              >
                Get Certified
              </button>
              <button className="learn-more">
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Learn More</span>
              </button>
            </div>
          </div>
          <div className="certification-image">
            <img src="/api/placeholder/300/200" alt="Student Certification" />
          </div>
        </div>

        {/* Success notification */}
        {showNotification && (
          <div className="success-notification">
            <CheckCircle size={20} />
            <span>Check-in created successfully!</span>
          </div>
        )}

        {/* Modal for check-in */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Create New Check-in</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Drive Motive</label>
                  <input
                    type="text"
                    name="motive"
                    placeholder="What's the purpose of this drive?"
                    value={checkinData.motive}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Where is this happening?"
                    value={checkinData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Provide additional details about this check-in"
                    value={checkinData.description}
                    onChange={handleChange}
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Upload Image</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      name="image"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                    />
                    <label htmlFor="image-upload" className="file-upload-label">
                      Choose File
                    </label>
                    <span className="file-name">
                      {checkinData.image ? checkinData.image.name : "No file chosen"}
                    </span>
                  </div>
                </div>
                
                {imagePreview && (
                  <div className="image-preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                    />
                  </div>
                )}
                
                <div className="modal-buttons">
                  <button 
                    type="submit" 
                    className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  > 
                    {isSubmitting ? 'Submitting...' : 'Submit Check-in'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
