import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css"; // Import the CSS file
import { Link } from "react-router-dom"; // Import React Router for navigation
import LoginModal from "../Pages/Login/Login"; // Import the login popup component
import { auth } from "../firebase-config"; // Import Firebase authentication
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null); // ✅ Track user authentication
  const [dropdownOpen, setDropdownOpen] = useState(false); // ✅ Track dropdown state

  const dropdownRef = useRef(null); // ✅ To detect clicks outside

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // ✅ Handle Click Outside Dropdown to Close It
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo and Brand Name */}
        <div className="navbar-logo">
          <img src="/logo512.png" alt="Logo" className="navbar-logo-img" />
          <Link className="navbar-brand" to="/">ServiceXchange</Link>
        </div>

        {isMobile && (
          <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
        )}

        <div className={`navbar-menu ${isMobile ? (isOpen ? "open" : "") : ""}`}>
          <ul className="navbar-list">
            <li><Link className="navbar-link" to="/">Home</Link></li>
            <li><Link className="navbar-link" to="/services">Services</Link></li>
            <li><Link className="navbar-link" to="/about">About</Link></li>
            <li><Link className="navbar-link" to="/contact">Contact</Link></li>
          </ul>

          {/* ✅ Show Profile Picture & Dropdown Menu */}
          {user ? (
            <div className="profile-container" ref={dropdownRef}>
              <img
                src={user.photoURL || "/default-profile.png"}
                alt="Profile"
                className="profile-icon"
                onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
              />

              <div className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="/settings" className="dropdown-item">Settings</Link>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <button className="navbar-login" onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}
        </div>
      </nav>

      {/* ✅ Show Login Popup when "Login" is clicked */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;
