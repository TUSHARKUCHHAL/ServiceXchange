import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./NGODashboard.css";
import TaskList from "../TaskList/TaskList";
import Analytics from "../Analytics/Analytics";

export default function Dashboard() {
  const [projects, setProjects] = useState([
    { name: "Your Drives", tasks: 10, progress: 96, color: "#4A148C" },
    { name: "Your Donations", tasks: 12, progress: 46, color: "#00897B" },
    { name: "Total Members", tasks: 22, progress: 73, color: "#D32F2F" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [checkinData, setCheckinData] = useState({ motive: "", city: "", image: null });
  const [imagePreview, setImagePreview] = useState(null); // To show image preview
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckinData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCheckinData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("motive", checkinData.motive);
    formData.append("city", checkinData.city);
    formData.append("image", checkinData.image); // Append the image file
  
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert("Check-in created successfully!");
        setShowModal(false);
        setCheckinData({ motive: "", city: "", image: null }); // Reset form
        setImagePreview(null);
      } else {
        alert("Failed to save check-in data.");
      }
    } catch (error) {
      console.error("Error saving check-in:", error);
      alert("An error occurred while saving the check-in.");
    }
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

        <div className="student-certification-section">
          <div className="certification-container">
            <button
              className="certification-button"
              onClick={() => (window.location.href = "/student-certification")}
            >
              Student Certification
            </button>
            <button className="learn-more">
              <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
              </span>
              <span className="button-text">Learn More</span>
            </button>
          </div>
        </div>

        {/* Modal for check-in */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>New Check-in</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="motive"
                  placeholder="Drive Motive"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  required
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: "100%", height: "auto", marginTop: "10px" }}
                    />
                  </div>
                )}
                <div className="modal-buttons">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
