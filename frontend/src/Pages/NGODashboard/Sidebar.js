import React from "react";

import { useNavigate } from "react-router-dom";

import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2>NGO Dashboard</h2>
      <ul>

        <li onClick={() => navigate("/")}>🏠 Home</li>
        <li onClick={() => navigate("/dashboard")}>📊 Dashboard</li>
        <li onClick={() => navigate("/tasklist")}>✅ Task List</li>
        <li onClick={() => navigate("/notifications")}>🔔 Notifications</li>
        <li onClick={() => navigate("/profile")}>👤 Profile</li>
        <li onClick={() => navigate("/logout")}>🚪 Logout</li>

      </ul>
    </div>
  );
};

export default Sidebar;
