import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown'; // Import the new component
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  // Determine if navbar should have dark background
  const isDarkBg = location.pathname !== '/' && location.pathname !== '/home';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 
  // Handle logout process
  const handleLogout = () => {
    logout(); // Use logout from AuthContext
    closeMenu();
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isDarkBg ? 'dark-bg' : ''}`}>
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          <img src="/logo512.png" alt="ServiceXchange Logo" className="logo-image" />
          <span className="logo-text">ServiceXchange</span>
        </Link>

        {/* Mobile Hamburger Menu */}
        <div 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>

        {/* Navigation Menu */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {/* Main Navigation Links */}
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={closeMenu}>About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-link" onClick={closeMenu}>Services</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact Us</Link>
          </li>

          {/* Authentication Buttons or Profile Dropdown */}
          <div className="nav-buttons">
            {user ? (
              // Desktop view: Show ProfileDropdown component
              <div className="desktop-profile">
                <ProfileDropdown />
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="login-btn" 
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="signup-btn" 
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
     
          
          
         
     

  );
};

export default Navbar;