import React, { useState, useEffect } from "react";

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
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "#f8fafc",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      {/* Logo and ServiceExchange */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo512.png" // Correct reference to the image in the public folder
          alt="Logo"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        <a
          style={{
            fontWeight: "bold",
            color: "#2563eb",
            textDecoration: "none",
          }}
          href="#"
        >
          ServiceXchange
        </a>
      </div>

      {isMobile && (
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            position: "absolute",
            right: "1rem",
            top: "1rem",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      )}

      <div
        id="navbarNav"
        style={{
          display: isMobile ? (isOpen ? "flex" : "none") : "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          position: isMobile ? "absolute" : "static",
          top: isMobile ? "60px" : "auto",
          right: "0",
          background: isMobile ? "white" : "transparent",
          width: isMobile ? "100%" : "auto",
          textAlign: "center",
          boxShadow: isMobile ? "0 2px 5px rgba(0, 0, 0, 0.1)" : "none",
          padding: isMobile ? "1rem" : "0",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            width: "100%",
            display: "flex",
            gap: "2rem",
            flexDirection: isMobile ? "column" : "row",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <li>
            <a
              style={{
                textDecoration: "none",
                color: "#334155",
                fontSize: "1.2rem",
              }}
              href="#"
            >
              Home
            </a>
          </li>
          <li>
            <a
              style={{
                textDecoration: "none",
                color: "#334155",
                fontSize: "1.2rem",
              }}
              href="#"
            >
              Services
            </a>
          </li>
          <li>
            <a
              style={{
                textDecoration: "none",
                color: "#334155",
                fontSize: "1.2rem",
              }}
              href="#"
            >
              About
            </a>
          </li>
          <li>
            <a
              style={{
                textDecoration: "none",
                color: "#334155",
                fontSize: "1.2rem",
              }}
              href="#"
            >
              Contact
            </a>
          </li>
        </ul>
        <a
          href="#"
          style={{
            backgroundColor: "#22c55e",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            marginLeft: "2rem",
            display: "inline-block",
          }}
        >
          Login
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
