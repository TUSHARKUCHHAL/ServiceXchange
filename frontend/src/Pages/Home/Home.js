import React, { useState } from "react";
import "./Home.css";
import Footer from "../../Components/Footer";
import axios from "axios";

const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}`;

const Home = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [showNGOForm, setShowNGOForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    services: "",
  });
  const [ngoFormData, setNGOFormData] = useState({
    name: "",
    city: "",
    pocName: "",
    pocNumber: "",
    email: "",
  });

  const [formStatus, setFormStatus] = useState(null);

  const changeSection = (section) => {
    setActiveSection(section);
    if (section === "hospital") {
      setShowHospitalForm(true);
      setShowNGOForm(false);
    } else if (section === "ngo") {
      setShowNGOForm(true);
      setShowHospitalForm(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNGOChange = (e) => {
    setNGOFormData({ ...ngoFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("Submitting...");
    
    try {
      const response = await fetch(`${SERVER_URL}/api/hospital`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setFormStatus("Hospital registered successfully!");
        setShowHospitalForm(false);
      } else {
        setFormStatus(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setFormStatus("An error occurred. Please try again.");
    }
  };

  const handleNGOSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("Submitting...");
    
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/ngo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ngoFormData),
      });

      const result = await response.json();
      if (response.ok) {
        setFormStatus("NGO registered successfully!");
        setShowNGOForm(false);
      } else {
        setFormStatus(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setFormStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Empowering Communities Through Social Service</h1>
          <p>Join us to create a positive impact</p>
          <div className="cta-buttons">
            <button className="get-involved" onClick={() => setActiveSection("get-involved")}>
              Get Involved
            </button>
          </div>
        </div>
      </section>

      <section id="get-involved" className="section">
        <div className="cta-buttons">
          <button className="hospital" onClick={() => changeSection("hospital")}>
            Hospital
          </button>
          <button className="volunteer" onClick={() => changeSection("volunteer")}>
            Volunteer
          </button>
          <button className="ngo" onClick={() => changeSection("ngo")}>
            Support an NGO
          </button>
          <button className="restaurant" onClick={() => changeSection("restaurant")}>
            Partner with a Restaurant
          </button>
        </div>
      </section>

      {/* Popup Modal for Hospital Form */}
      {showHospitalForm && (
        <div className="overlay active">
          <div className="form-popup active">
            <span className="close-btn" onClick={() => setShowHospitalForm(false)}>
              &times;
            </span>
            <h2>Register Your Hospital</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Hospital Name" onChange={handleChange} required />
              <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
              <input type="text" name="contact" placeholder="Contact Number" onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
              <textarea name="services" placeholder="Services Provided" onChange={handleChange} required></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Popup Modal for NGO Form */}
      {showNGOForm && (
        <div className="overlay active">
          <div className="form-popup active">
            <span className="close-btn" onClick={() => setShowNGOForm(false)}>
              &times;
            </span>
            <h2>Register Your NGO</h2>
            <form onSubmit={handleNGOSubmit}>
              <input type="text" name="name" placeholder="NGO Name" onChange={handleNGOChange} required />
              <input type="text" name="city" placeholder="City" onChange={handleNGOChange} required />
              <input type="text" name="pocName" placeholder="POC Name" onChange={handleNGOChange} required />
              <input type="text" name="pocNumber" placeholder="POC Number" onChange={handleNGOChange} required />
              <input type="email" name="email" placeholder="Email" onChange={handleNGOChange} required />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Form Status Message */}
      {formStatus && (
        <div className="form-status">
          <p>{formStatus}</p>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
