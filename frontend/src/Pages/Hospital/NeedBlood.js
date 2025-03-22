import React, { useState } from "react";
import "./NeedBlood.css";

const NeedBlood = () => {
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    location: "",
    contact: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Blood Request Submitted:", formData);
    alert("Your blood request has been submitted!");
  };

  return (
    <div className="need-blood-container">
      <h2>Need Blood</h2>
      <form className="need-blood-form" onSubmit={handleSubmit}>
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
        <textarea name="reason" placeholder="Reason for Request" required onChange={handleChange}></textarea>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default NeedBlood;
