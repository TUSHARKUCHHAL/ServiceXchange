import React, { useState, useEffect } from "react";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo and ServiceExchange */}
      <div className="navbar-logo">
        <img
          src="/logo512.png" // Correct reference to the image in the public folder
          alt="Logo"
          className="navbar-logo-img"
        />
        <a className="navbar-brand" href="#">
          ServiceXchange
        </a>
      </div>

      {isMobile && (
        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      )}

      <div
        className={`navbar-menu ${isMobile ? (isOpen ? "open" : "") : ""}`}
      >
        <ul className="navbar-list">
          <li>
            <a className="navbar-link" href="#">
              Home
            </a>
          </li>
          <li>
            <a className="navbar-link" href="#">
              Services
            </a>
          </li>
          <li>
            <a className="navbar-link" href="#">
              About
            </a>
          </li>
          <li>
            <a className="navbar-link" href="#">
              Contact
            </a>
          </li>
        </ul>
        <a href="#" className="navbar-login">
          Login
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
