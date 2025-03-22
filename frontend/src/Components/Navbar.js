import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Check if current path needs dark background
  const isDarkBg = location.pathname !== '/' && location.pathname !== '/home';

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle menu open/closed
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Optional: prevent body scroll when menu is open
    document.body.style.overflow = !isOpen ? 'hidden' : 'auto';
  };

  // Close menu when a link is clicked
  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isDarkBg ? 'dark-bg' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo512.png" alt="Your Logo" className="logo-image" />
          <span className="logo-text">ServiceXchange</span>
        </Link>


        
        <div 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>
        
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/NGODashbaord" className="nav-link" onClick={closeMenu}>NGODashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/About" className="nav-link" onClick={closeMenu}>About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-link" onClick={closeMenu}>Services</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact Us</Link>
          </li>
          
          <div className="nav-buttons">
            <Link to="/login" className="login-btn" onClick={closeMenu}>Login</Link>
            <Link to="/signup" className="signup-btn" onClick={closeMenu}>Sign Up</Link>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;