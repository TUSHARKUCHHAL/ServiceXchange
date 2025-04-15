import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, FaProjectDiagram, FaUsers, FaCalendarAlt, 
  FaCertificate, FaChartBar, FaBullhorn, FaFolder, 
  FaUserCircle, FaQrcode, FaCog, 
  FaChevronLeft, FaChevronRight // Add these two icons
} from 'react-icons/fa';
import './DashboardHome.css';

// Import all components
import DashboardOverview from './DashboardOverview';
import ProjectManagement from './ProjectManagement';
import VolunteerManagement from './VolunteerManagement';
import EventsCalendar from './EventsCalendar';
import CertificateManagement from './CertificateManagement';
import Analytics from './Analytics';
import Posts from './Posts';
import DocumentCenter from './DocumentCenter';
import NGOProfile from './NGOProfile';
import CertificateVerification from './CertificateVerification';
import Settings from './Settings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulated data fetch
    const fetchData = async () => {
      try {
        // In production, this would be an API call
        const mockNotifications = [
          { id: 1, message: "New volunteer application received", time: "5 min ago" },
          { id: 2, message: "Food Drive completed successfully", time: "2 hours ago" },
          { id: 3, message: "Certificate template updated", time: "Yesterday" }
        ];
        
        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // Menu items configuration
  const menuItems = [
    { id: 'home', label: 'Dashboard Overview', icon: <FaHome /> },
    { id: 'projects', label: 'Project Management', icon: <FaProjectDiagram /> },
    { id: 'volunteers', label: 'Volunteer Management', icon: <FaUsers /> },
    { id: 'events', label: 'Events & Calendar', icon: <FaCalendarAlt /> },
    { id: 'certificates', label: 'Certificate Management', icon: <FaCertificate /> },
    { id: 'analytics', label: 'Analytics & Impact', icon: <FaChartBar /> },
    { id: 'posts', label: 'Posts & Announcements', icon: <FaBullhorn /> },
    { id: 'documents', label: 'Document & Media Center', icon: <FaFolder /> },
    { id: 'profile', label: 'Profile & NGO Info', icon: <FaUserCircle /> },
    { id: 'verification', label: 'Certificate Verification', icon: <FaQrcode /> },
    { id: 'settings', label: 'Settings & Admin Tools', icon: <FaCog /> }
  ];

  // Render the active component based on the selected tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardOverview />;
      case 'projects':
        return <ProjectManagement />;
      case 'volunteers':
        return <VolunteerManagement />;
      case 'events':
        return <EventsCalendar />;
      case 'certificates':
        return <CertificateManagement />;
      case 'analytics':
        return <Analytics />;
      case 'posts':
        return <Posts />;
      case 'documents':
        return <DocumentCenter />;
      case 'profile':
        return <NGOProfile />;
      case 'verification':
        return <CertificateVerification />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <h2>ServiceXchange</h2>
          <button className="toggle-sidebar" onClick={toggleSidebar}>
          {isSidebarCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </button>
        </div>
        
        <div className="menu-items">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              className={`menu-item ${activeTab === item.id ? 'active-menu-item' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="menu-icon">{item.icon}</div>
              {!isSidebarCollapsed && <div className="menu-label">{item.label}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-title">
            <h2>{menuItems.find(item => item.id === activeTab)?.label}</h2>
          </div>
          
          {/* Notification and profile */}
          <div className="header-actions">
            <div className="notification-wrapper">
              <div className="notification-icon">
                <span className="notification-badge">{notifications.length}</span>
                <FaBullhorn />
              </div>
              
              <div className="notification-dropdown">
                <h3>Notifications</h3>
                {notifications.map(notification => (
                  <div key={notification.id} className="notification-item">
                    <p>{notification.message}</p>
                    <small>{notification.time}</small>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="profile">
              <div className="profile-img">
                <FaUserCircle />
              </div>
              <div className="profile-name">
                NGO Admin
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Components */}
        <motion.div 
          className="content-area"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveComponent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;