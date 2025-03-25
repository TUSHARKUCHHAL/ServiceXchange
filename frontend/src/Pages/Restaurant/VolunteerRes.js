import { useState } from "react";
import "./VolunteerRes.css";
import { motion } from "framer-motion";
import { Button } from "./VolunteerButton";

const Volunteer = () => {
  const [volunteers, setVolunteers] = useState([
    { id: 1, name: "John Doe", status: "Available" },
    { id: 2, name: "Sarah Smith", status: "Available" },
    { id: 3, name: "Michael Johnson", status: "Available" },
  ]);

  const confirmVolunteer = (id) => {
    setVolunteers(volunteers.map(v => v.id === id ? { ...v, status: "Confirmed" } : v));
  };

  return (
    <motion.div 
      className="volunteer-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Available Volunteers</h1>
      <ul className="volunteer-list">
        {volunteers.map((volunteer) => (
          <motion.li 
            key={volunteer.id} 
            className={`volunteer-item ${volunteer.status === "Confirmed" ? "confirmed" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="volunteer-info">
              <span className="volunteer-name">{volunteer.name}</span>
              <span className={`volunteer-status ${volunteer.status.toLowerCase()}`}>
                {volunteer.status}
              </span>
            </div>
            
            {volunteer.status === "Available" && (
              <Button onClick={() => confirmVolunteer(volunteer.id)}>
                Confirm
              </Button>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Volunteer;