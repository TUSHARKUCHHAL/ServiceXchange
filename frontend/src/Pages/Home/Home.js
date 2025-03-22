import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Footer from "../../Components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Empowering Communities Through Social Service</h1>
          <p>Join us to create a positive impact</p>
          <div className="cta-buttons">
            <button className="get-involved" onClick={() => navigate("/get-involved")}>
              Get Involved
            </button>
          </div>
        </div>
      </section>

      <section id="get-involved" className="section">
        <div className="cta-buttons">
          <button className="hospital" onClick={() => navigate("/hospital")}>Hospital</button>
          <button className="volunteer" onClick={() => navigate("/volunteer")}>Volunteer</button>
          <button className="ngo" onClick={() => navigate("/ngo")}>Support an NGO</button>
          <button className="restaurant" onClick={() => navigate("/restaurant")}>Partner with a Restaurant</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
