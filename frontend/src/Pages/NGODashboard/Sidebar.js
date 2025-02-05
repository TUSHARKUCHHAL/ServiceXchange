// Sidebar.js
import React from "react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>NGO Dashboard</h2>
      <ul>
        <li>Dashboard</li>
        <li>Analytics</li>
        <li>Task List</li>
        <li>Tracking</li>
        <li>Settings</li>
      </ul>
    </div>
  );
}
