import React, { useState } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import './Topbar.css';

const Topbar = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showDropdown) setShowDropdown(false);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="topbar-right">
        <div className="notification-wrapper">
          <button className="notification-bell" onClick={toggleNotifications}>
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          {showNotifications && (
            <div className="dropdown-menu notification-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <a href="#" className="mark-all">Mark all as read</a>
              </div>
              <div className="notification-list">
                <div className="notification-item unread">
                  <div className="notification-content">
                    <p className="notification-text">New volunteer application received</p>
                    <span className="notification-time">10 minutes ago</span>
                  </div>
                </div>
                <div className="notification-item unread">
                  <div className="notification-content">
                    <p className="notification-text">Food Drive event starts in 2 hours</p>
                    <span className="notification-time">1 hour ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <p className="notification-text">Certificate verification request</p>
                    <span className="notification-time">Yesterday</span>
                  </div>
                </div>
              </div>
              <div className="dropdown-footer">
                <a href="#" className="view-all">View all notifications</a>
              </div>
            </div>
          )}
        </div>
        
        <div className="user-wrapper">
          <button className="user-profile" onClick={toggleDropdown}>
            <div className="avatar">
              <User size={20} />
            </div>
            <span className="user-name">NGO Admin</span>
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu user-dropdown">
              <a href="/profile" className="dropdown-item">
                <User size={16} />
                <span>Profile</span>
              </a>
              <a href="/settings" className="dropdown-item">
                <Settings size={16} />
                <span>Settings</span>
              </a>
              <div className="dropdown-divider"></div>
              <a href="/logout" className="dropdown-item logout">
                <LogOut size={16} />
                <span>Logout</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;