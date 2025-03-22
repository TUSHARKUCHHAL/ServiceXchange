import React from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { Link } from "react-router-dom"; // Import Link for navigation
import Analytics from "../Analytics/Analytics";
>>>>>>> 5ca374a74cb8258f692fa336ea505fa464128a49
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2>NGO Dashboard</h2>
      <ul>
<<<<<<< HEAD
        <li onClick={() => navigate("/")}>🏠 Home</li>
        <li onClick={() => navigate("/dashboard")}>📊 Dashboard</li>
        <li onClick={() => navigate("/tasklist")}>✅ Task List</li>
        <li onClick={() => navigate("/notifications")}>🔔 Notifications</li>
        <li onClick={() => navigate("/profile")}>👤 Profile</li>
        <li onClick={() => navigate("/logout")}>🚪 Logout</li>
=======
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/analytics">Analytics</Link></li> {/* This opens the Analytics page */}
        <li><Link to="/tasks">Task List</Link></li>
        <li><Link to="/tracking">Tracking</Link></li>
        <li><Link to="/settings">Settings</Link></li>
>>>>>>> 5ca374a74cb8258f692fa336ea505fa464128a49
      </ul>
    </div>
  );
};

export default Sidebar;
