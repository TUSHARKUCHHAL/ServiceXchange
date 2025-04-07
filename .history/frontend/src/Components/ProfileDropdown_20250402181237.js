import React, { useState, useEffect, useRef } from 'react';
import { LogOut, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Handler to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Use logout function from AuthContext
    setIsOpen(false);
    navigate('/login'); // Redirect to login page
  };

  // If no user is logged in, don't render the component
  if (!user) return null;

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <div className="profile-icon" onClick={() => setIsOpen(!isOpen)}>
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="profile-image" 
          />
        ) : (
          <div className="profile-placeholder">
            <User size={20} />
          </div>
        )}
      </div>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div className="user-info">
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="dropdown-profile-image" 
              />
            )}
            <div className="user-details">
              <span className="user-name">{user.displayName || 'User'}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <div className="dropdown-options">
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;