import { useState } from "react";
import "./Volunteer.css";

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
    <div className="volunteer-container">
      <h1>Available Volunteers</h1>
      <ul className="volunteer-list">
        {volunteers.map((volunteer) => (
          <li key={volunteer.id} className="volunteer-item">
            <span>{volunteer.name}</span> - {volunteer.status}
            {volunteer.status === "Available" && (
              <button onClick={() => confirmVolunteer(volunteer.id)}>Confirm</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Volunteer;
