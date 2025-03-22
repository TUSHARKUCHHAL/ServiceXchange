import React from 'react';
import './Analytics.css'; // Make sure to create this CSS file for styling
import { Bar } from 'react-chartjs-2'; // Using Chart.js for a simple bar chart
import { Chart as ChartJS } from 'chart.js/auto';

const Analytics = () => {
  // Dummy data for the chart (you can replace this with real data from your backend)
  const data = {
    labels: ['Volunteers', 'Blood Donations', 'Surplus Food', 'Clothing Donations'],
    datasets: [
      {
        label: 'Statistics for this Month',
        data: [300, 500, 2000, 800], // Example numbers
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue color
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h2>NGO Analytics Dashboard</h2>
      <div className="overview">
        <div className="card">
          <h3>Total Volunteers</h3>
          <p>300</p>
        </div>
        <div className="card">
          <h3>Total Blood Donations</h3>
          <p>500 Liters</p>
        </div>
        <div className="card">
          <h3>Surplus Food Collected</h3>
          <p>2000 kg</p>
        </div>
        <div className="card">
          <h3>Clothing Donations</h3>
          <p>800 Items</p>
        </div>
      </div>
      <div className="chart-container">
        <h3>Activity Statistics</h3>
        <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>
    </div>
  );
};

export default Analytics;
