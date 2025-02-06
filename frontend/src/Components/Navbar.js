import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css"; // Import the CSS file
import { Link } from "react-router-dom"; // Import React Router for navigation
import { useUser, useClerk, UserButton } from "@clerk/clerk-react"; // Import Clerk authentication

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { openSignIn, signOut } = useClerk(); // Clerk sign-in and sign-out functions
  const { isSignedIn } = useUser(); // Get user authentication state

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <li><Link className="navbar-link" to="/NGODashboard">NGODashboard</Link></li>
{/*             
            <li><Link className="navbar-link" to="/services">Services</Link></li> */}
            <li><Link className="navbar-link" to="/about">About</Link></li>
            <li><Link className="navbar-link" to="/contact">Contact</Link></li>
          </ul>
          {isSignedIn ? (
            <div className="navbar-profile" ref={dropdownRef}>
              <button className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <UserButton afterSignOutUrl="/" />
              </button>
            </div>
          ) : (
            <button className="navbar-login" onClick={() => openSignIn()}>Login</button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
