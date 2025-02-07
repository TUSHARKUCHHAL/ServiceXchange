import React from "react";
import "./Services.css";

const Services = () => {
  return (
    <div className="services-page">
      <h1 className="services-title">Our Services</h1>
      <p className="services-mission">
        ServiceXchange connects NGOs, restaurants, hospitals, and volunteers to provide essential services that create a meaningful impact.
      </p>

      <div className="services-container">
        <div className="service-card">
          <h2>Food Donation</h2>
          <p>
            Restaurants and suppliers donate surplus food, which is distributed to NGOs and communities in need.
          </p>
        </div>

        <div className="service-card">
          <h2>Blood Donation</h2>
          <p>
            We bridge the gap between hospitals and blood donors, ensuring life-saving donations reach those in need quickly.
          </p>
        </div>

        <div className="service-card">
          <h2>Volunteer Support</h2>
          <p>
            Our dedicated volunteers help with food distribution and blood donation drives, making a real difference in communities.
          </p>
        </div>
      </div>

      <button className="cta-button">Get Involved</button>
    </div>
  );
};

export default Services;
