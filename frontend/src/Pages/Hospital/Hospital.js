import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hospital.css";

const Hospital = () => {
  const navigate = useNavigate();

  return (
    <div className="hospital-container">
      {/* Background Banner */}
      <div className="hospital-banner">
        <h2>Hospital Services</h2>
        <p>Your health, our priority. Choose an option below.</p>
      </div>

      {/* Buttons */}
      <div className="hospital-buttons">
        <button className="need-blood-btn" onClick={() => navigate("/hospital/need-blood")}>
          <i className="fas fa-tint"></i> Need Blood
        </button>
        <button className="donate-blood-btn" onClick={() => navigate("/hospital/donate-blood")}>
          <i className="fas fa-hand-holding-heart"></i> Donate Blood
        </button>
      </div>
    </div>
  );
};

export default Hospital;
