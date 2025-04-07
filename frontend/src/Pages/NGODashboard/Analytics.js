import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import './Analytics.css';

const Analytics = () => {
  // Sample data
  const impactData = [
    { month: 'Jan', people: 320, volunteers: 45 },
    { month: 'Feb', people: 450, volunteers: 52 },
    { month: 'Mar', people: 380, volunteers: 48 },
    { month: 'Apr', people: 520, volunteers: 60 },
    { month: 'May', people: 490, volunteers: 55 },
    { month: 'Jun', people: 580, volunteers: 65 }
  ];
  
  const categoryData = [
    { name: 'Education', value: 35 },
    { name: 'Food', value: 25 },
    { name: 'Health', value: 20 },
    { name: 'Environment', value: 15 },
    { name: 'Other', value: 5 }
  ];
  
  const hoursData = [
    { month: 'Jan', hours: 450 },
    { month: 'Feb', hours: 520 },
    { month: 'Mar', hours: 490 },
    { month: 'Apr', hours: 580 },
    { month: 'May', hours: 620 },
    { month: 'Jun', hours: 670 }
  ];
  
  const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
  
  // Download report function
  const downloadReport = () => {
    // Get the button element
    const button = document.querySelector('.report-btn');
    
    // Add downloading class
    button.classList.add('downloading');
    button.innerHTML = '<span class="download-icon">↓</span> Downloading...';
    
    // Simulate download process (replace with actual API call if available)
    setTimeout(() => {
      // Create a sample data for the report (in real app, you would generate this from your actual data)
      const reportData = {
        title: "NGO Impact Report",
        date: new Date().toLocaleDateString(),
        summary: {
          totalPeopleHelped: 2740,
          activeVolunteers: 65,
          eventsCompleted: 24,
          volunteerHours: 670
        },
        details: {
          monthlyBreakdown: impactData,
          programCategories: categoryData,
          volunteerHours: hoursData
        }
      };
      
      // Convert to JSON string
      const jsonData = JSON.stringify(reportData, null, 2);
      
      // Create blob and download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'ngo_impact_report.json';
      
      // Append to the body, trigger click and clean up
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Show success state
      button.classList.remove('downloading');
      button.classList.add('success');
      button.innerHTML = '✓ Downloaded';
      
      // Create and show toast notification
      const toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.textContent = 'Report downloaded successfully!';
      document.body.appendChild(toast);
      
      // Show the toast after a small delay
      setTimeout(() => {
        toast.classList.add('show');
      }, 100);
      
      // Hide and remove the toast after 3 seconds
      setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
      
      // Reset button after 2 seconds
      setTimeout(() => {
        button.classList.remove('success');
        button.innerHTML = '<span class="download-icon">↓</span> Download Full Report';
      }, 2000);
    }, 1500); // Simulate network delay
  };
  
  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics & Impact</h1>
        <p>Measure your NGO's reach and results over time</p>
      </div>
      
      <div className="stats-summary">
        <div className="stat-box">
          <h3>Total People Helped</h3>
          <p className="stat-value">2,740</p>
          <span className="trend positive">+12.4% from last month</span>
        </div>
        <div className="stat-box">
          <h3>Active Volunteers</h3>
          <p className="stat-value">65</p>
          <span className="trend positive">+8.3% from last month</span>
        </div>
        <div className="stat-box">
          <h3>Events Conducted</h3>
          <p className="stat-value">24</p>
          <span className="trend neutral">Same as last month</span>
        </div>
        <div className="stat-box">
          <h3>Volunteer Hours</h3>
          <p className="stat-value">670</p>
          <span className="trend positive">+8.1% from last month</span>
        </div>
      </div>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h2>People Helped & Volunteers</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="people" name="People Helped" fill="#3498db" />
              <Bar yAxisId="right" dataKey="volunteers" name="Volunteers" fill="#2ecc71" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h2>Program Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h2>Volunteer Hours</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hoursData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hours" stroke="#e74c3c" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h2>Impact Report</h2>
          <div className="impact-report">
            <h3>Key Highlights</h3>
            <ul>
              <li>12.4% increase in people served compared to previous month</li>
              <li>Education programs reached 35% of our beneficiaries</li>
              <li>Volunteer participation grew by 8.3% this month</li>
              <li>Total volunteer hours exceeded 670 in June</li>
            </ul>
            <div className="download-report">
              <button className="report-btn" onClick={downloadReport}>
                <span className="download-icon">↓</span> Download Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="data-filters">
        <h3>Filter Data</h3>
        <div className="filter-controls">
          <div className="filter-group">
            <label>Date Range:</label>
            <select>
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>Year to Date</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Program:</label>
            <select>
              <option>All Programs</option>
              <option>Education</option>
              <option>Food</option>
              <option>Health</option>
              <option>Environment</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Region:</label>
            <select>
              <option>All Regions</option>
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
            </select>
          </div>
          <button className="apply-filters">Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;