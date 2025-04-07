import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Folder, Users, Calendar, Award, 
  BarChart2, MessageSquare, FileText, 
  User, Shield, Settings
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { title: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { title: 'Projects & Drives', icon: <Folder size={20} />, path: '/projects' },
    { title: 'Volunteers', icon: <Users size={20} />, path: '/volunteers' },
    { title: 'Events', icon: <Calendar size={20} />, path: '/events' },
    { title: 'Certificates', icon: <Award size={20} />, path: '/certificates' },
    { title: 'Analytics', icon: <BarChart2 size={20} />, path: '/analytics' },
    { title: 'Posts', icon: <MessageSquare size={20} />, path: '/posts' },
    { title: 'Documents', icon: <FileText size={20} />, path: '/documents' },
    { title: 'NGO Profile', icon: <User size={20} />, path: '/profile' },
    { title: 'Certificate Verification', icon: <Shield size={20} />, path: '/verify' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/settings' }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="logo-container">
        <h2>ServiceXchange</h2>
      </div>
      <nav className="menu">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'menu-item active' : 'menu-item'
            }
          >
            <span className="icon">{item.icon}</span>
            <span className="title">{item.title}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>© 2025 ServiceXchange</p>
      </div>
    </div>
  );
};

export default Sidebar;