import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Analytics from "../Analytics/Analytics";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>NGO Dashboard</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/analytics">Analytics</Link></li> {/* This opens the Analytics page */}
        <li><Link to="/tasks">Task List</Link></li>
        <li><Link to="/tracking">Tracking</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
}
