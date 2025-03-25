import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart2, 
  CheckSquare, 
  Bell, 
  User, 
  LogOut, 
  Heart, 
  MapPin, 
  Calendar, 
  Settings,
  Menu,
  X
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: "/drives", label: "Drives", icon: <MapPin size={20} /> },
    { path: "/donations", label: "Donations", icon: <Heart size={20} /> },
    { path: "/tasklist", label: "Tasks", icon: <CheckSquare size={20} /> },
    { path: "/calendar", label: "Calendar", icon: <Calendar size={20} /> },
    { path: "/notifications", label: "Notifications", icon: <Bell size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
    { path: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <>
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleMobileSidebar} style={{ color: 'black' }}>
          {showMobileSidebar ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''} ${showMobileSidebar ? 'show' : ''}`}>
        <div className="sidebar-header">
          {!isMobile && (
            <button className="toggle-button" onClick={toggleSidebar} style={{ color: 'black' }}>
              {collapsed ? <Menu size={24} /> : <X size={24} />}
            </button>
          )}
        </div>

        <div className="user-profile-sidebar" style={{ marginTop: '20px' }}>
          <div className="avatar-container">
            <img 
              src="https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png" 
              alt="User" 
              className="user-avatar" 
            />
          </div>
          {!collapsed && (
            <div className="user-info">
              <h3>Sarah Johnson</h3>
              <span>Program Manager</span>
            </div>
          )}
        </div>

        <div className="navigation-menu">
          <ul>
            {menuItems.map((item) => (
              <li 
                key={item.path} 
                className={location.pathname === item.path ? 'active' : ''}
                onClick={() => handleNavigation(item.path)}
              >
                <div className="menu-icon">{item.icon}</div>
                {!collapsed && <span>{item.label}</span>}
                {collapsed && <div className="tooltip">{item.label}</div>}
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <button 
            className="logout-button" 
            onClick={() => handleNavigation("/logout")}
            style={{ backgroundColor: '#ff6961', color: 'white' }}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {showMobileSidebar && (
        <div className="sidebar-backdrop" onClick={toggleMobileSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;
