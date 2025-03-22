import React, { useState } from "react";
import "./DonateBlood.css";

const DonateBlood = () => {
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    location: "",
    contact: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Blood Donation Submitted:", formData);
    alert("Your blood donation offer has been submitted!");
  };

  return (
    <div className="donate-blood-container">
      <h2>Donate Blood</h2>
      <form className="donate-blood-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" required onChange={handleChange} />
        <select name="bloodGroup" required onChange={handleChange}>
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        <input type="text" name="location" placeholder="Your Location" required onChange={handleChange} />
        <input type="text" name="contact" placeholder="Contact Number" required onChange={handleChange} />
        <button type="submit">Submit Donation</button>
      </form>
    </div>
  );
};

export default DonateBlood;
