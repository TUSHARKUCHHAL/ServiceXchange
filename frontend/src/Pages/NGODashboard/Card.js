import React from 'react';
import './Card.css';

const Card = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="card-icon">
        {icon}
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p className="card-value">{value.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Card;