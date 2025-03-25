import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const location = useLocation();

  const isDarkBg = location.pathname !== '/' && location.pathname !== '/home';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');

    if (token && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail(null);
    window.location.reload(); // Refresh page to update UI
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isDarkBg ? 'dark-bg' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo512.png" alt="Your Logo" className="logo-image" />
          <span className="logo-text">ServiceXchange</span>
        </Link>

        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item"><Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li className="nav-item"><Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About Us</Link></li>
          <li className="nav-item"><Link to="/services" className="nav-link" onClick={() => setIsOpen(false)}>Services</Link></li>
          <li className="nav-item"><Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact Us</Link></li>

          <div className="nav-buttons">
            {isAuthenticated ? (
              <>
                <button className="signup-btn" onClick={handleLogout}>Logout</button>
                <span className="profile">
                  <User size={20} /> {userEmail}
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className="login-btn" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/signup" className="signup-btn" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
