import React, { useState } from "react";
import "./Home.css";
import Footer from "../../Components/Footer";  // Footer import

const Home = () => {
  const [activeSection, setActiveSection] = useState("home"); // 
  const changeSection = (section) => {
    setActiveSection(section);
  };

  const handleGetInvolved = () => {
    const involvedSection = document.getElementById("get-involved");
    involvedSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero Section with background image */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Empowering Communities Through Social Service</h1>
          <p>Join us to create a positive impact</p>
          <div className="cta-buttons">
            {/* Get Involved button with yellow color */}
            <button className="get-involved" onClick={handleGetInvolved}>Get Involved</button>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="get-involved" className="section">
       
        <div className="cta-buttons">
          <button className="hospital" onClick={() => changeSection("hospital")}>Hospital</button>
          <button className="volunteer" onClick={() => changeSection("volunteer")}>Volunteer</button>
          <button className="ngo" onClick={() => changeSection("ngo")}>Support an NGO</button>
          <button className="restaurant" onClick={() => changeSection("restaurant")}>Partner with a Restaurant</button>
        </div>
      </section>

    </div>
  );
};

export default Home;
