import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./NGODashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([
    { name: "Your Drives", tasks: 10, progress: 96, color: "#4A148C" },
    { name: "Your Donations", tasks: 12, progress: 46, color: "#00897B" },
    { name: "Total Members", tasks: 22, progress: 73, color: "#D32F2F" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [checkinData, setCheckinData] = useState({ motive: "", city: "", image: null });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckinData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setCheckinData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Check-in Data:", checkinData);
    setShowModal(false);
    navigate("/checkin-details"); // Redirect to check-in details page
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Hello, User</h1>
          <button className="dashboard-button" onClick={() => setShowModal(true)}>
            Create a new check-in
          </button>
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
              <button className="register-button" onClick={() => navigate('/register-volunteer')}>
                Become a Volunteer
              </button>
              <button className="register-button" onClick={() => navigate('/register-student')}>
                Student Certification
              </button>
            </div>
          </div>
          <div className="vertical-line"></div>
          <button className="login-button" onClick={() => navigate('/login')}>Login</button>
        </div>

        {/* Modal for check-in */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>New Check-in</h2>
              <form onSubmit={handleSubmit}>
                <input type="text" name="motive" placeholder="Drive Motive" onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" onChange={handleChange} required />
                <input type="file" name="image" accept="image/*" onChange={handleImageUpload} required />
                <div className="modal-buttons">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
