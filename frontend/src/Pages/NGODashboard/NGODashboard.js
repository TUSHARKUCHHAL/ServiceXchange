import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./NGODashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([
    { name: "Your Drives", tasks: 10, progress: 96, color: "#4A148C" },
    { name: "Your Donations", tasks: 12, progress: 46, color: "#00897B" },
    { name: "Total Members", tasks: 22, progress: 73, color: "#D32F2F" },
  ]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Hello, User</h1>
          <button className="dashboard-button">Create a new check-in</button>
        </div>
        <div className="dashboard-grid">
          {projects.map((project, index) => (
            <div key={index} className="dashboard-card" style={{ backgroundColor: project.color }}>
              <div className="dashboard-card-content">
                <h2>{project.name}</h2>
                <p>{project.tasks} tasks</p>
                <div className="dashboard-progress-bar">
                  <div
                    className="dashboard-progress"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="join-us-section">
          <div className="join-us-container">
            <h2 className="join-us-text">Join Us</h2>
            <div className="dashboard-buttons">
              <button className="register-button" onClick={() => window.location.href = '/register-volunteer'}>
                Become a Volunteer
              </button>
              <button className="register-button" onClick={() => window.location.href = '/register-student'}>
                Student Certification
              </button>
            </div>
          </div>
          <div className="vertical-line"></div>
          <button className="login-button" onClick={() => window.location.href = '/login'}>Login</button>
        </div>
      </main>
    </div>
  );
}