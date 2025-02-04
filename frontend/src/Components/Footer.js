import React from "react";
import "./Footer.css";

// Social media icons (you can use FontAwesome or any other icon library)
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-heading">About Us</h3>
          <p>
            We are dedicated to bridging the gap between communities and
            providing opportunities to contribute to meaningful causes.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Get Involved</a></li>
            <li><a href="#">Donate</a></li>
            <li><a href="#">Volunteer</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Contact</h3>
          <p>Email: info@servicexchange.org</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: 123 Charity St, City, Country</p>
        </div>

        <div className="footer-section social-media">
          <h3 className="footer-heading">Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 ServiceXchange. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
