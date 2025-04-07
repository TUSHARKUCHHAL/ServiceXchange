import React, { useState, useEffect } from 'react';
import './VolunteerManagement.css';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [newVolunteer, setNewVolunteer] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    status: 'Active',
    joinDate: '',
    hours: 0
  });
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch volunteers data (simulated)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulated API call
        setTimeout(() => {
          const dummyVolunteers = [
            { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '555-123-4567', skills: 'Teaching, Organizing', availability: 'Weekends', status: 'Active', joinDate: '2023-05-15', hours: 45 },
            { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-987-6543', skills: 'Fundraising, Marketing', availability: 'Evenings', status: 'Active', joinDate: '2023-02-10', hours: 78 },
            { id: 3, name: 'Mike Johnson', email: 'mike.j@example.com', phone: '555-567-8901', skills: 'Web Development, Graphic Design', availability: 'Flexible', status: 'Inactive', joinDate: '2022-11-20', hours: 120 },
            { id: 4, name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '555-345-6789', skills: 'Counseling, Administration', availability: 'Mornings', status: 'Active', joinDate: '2024-01-05', hours: 15 },
            { id: 5, name: 'Robert Chen', email: 'robert.c@example.com', phone: '555-890-1234', skills: 'Event Planning, Photography', availability: 'Weekdays', status: 'On Leave', joinDate: '2023-08-12', hours: 67 },
          ];
          setVolunteers(dummyVolunteers);
          setFilteredVolunteers(dummyVolunteers);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
        setIsLoading(false);
        showNotification('Failed to load volunteer data', 'error');
      }
    };

    fetchData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...volunteers];
    
    // Apply status filter
    if (filter !== 'All') {
      result = result.filter(vol => vol.status === filter);
    }
    
    // Apply search
    if (searchTerm) {
      result = result.filter(vol => 
        vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.skills.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'joinDate') {
        comparison = new Date(a.joinDate) - new Date(b.joinDate);
      } else if (sortBy === 'hours') {
        comparison = a.hours - b.hours;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredVolunteers(result);
  }, [volunteers, filter, searchTerm, sortBy, sortOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVolunteer(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewVolunteer({
      id: null,
      name: '',
      email: '',
      phone: '',
      skills: '',
      availability: '',
      status: 'Active',
      joinDate: '',
      hours: 0
    });
    setSelectedVolunteer(null);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) resetForm();
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new volunteer
    if (!selectedVolunteer) {
      const newId = volunteers.length > 0 ? Math.max(...volunteers.map(v => v.id)) + 1 : 1;
      const volunteerToAdd = { ...newVolunteer, id: newId };
      
      setVolunteers([...volunteers, volunteerToAdd]);
      showNotification('Volunteer added successfully!', 'success');
    } 
    // Update existing volunteer
    else {
      setVolunteers(volunteers.map(v => 
        v.id === selectedVolunteer.id ? { ...newVolunteer } : v
      ));
      showNotification('Volunteer updated successfully!', 'success');
    }
    
    setShowForm(false);
    resetForm();
  };

  const editVolunteer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setNewVolunteer({ ...volunteer });
    setShowForm(true);
  };

  const deleteVolunteer = (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      setVolunteers(volunteers.filter(v => v.id !== id));
      showNotification('Volunteer deleted', 'info');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Render functions
  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Inactive': return 'status-inactive';
      case 'On Leave': return 'status-onleave';
      default: return '';
    }
  };

  return (
    <div className="volunteer-management">
      <div className="vm-header">
        <h1>Volunteer Management</h1>
        <p>Organize and manage your volunteer team efficiently</p>
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="vm-controls">
        <div className="search-filter">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-options">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <button className="add-button" onClick={toggleForm}>
          {showForm ? 'Cancel' : '+ Add Volunteer'}
        </button>
      </div>

      {showForm && (
        <div className="volunteer-form-container">
          <form className="volunteer-form" onSubmit={handleSubmit}>
            <h2>{selectedVolunteer ? 'Edit Volunteer' : 'Add New Volunteer'}</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newVolunteer.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newVolunteer.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newVolunteer.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Join Date</label>
                <input
                  type="date"
                  name="joinDate"
                  value={newVolunteer.joinDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={newVolunteer.skills}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Availability</label>
                <input
                  type="text"
                  name="availability"
                  value={newVolunteer.availability}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Volunteer Hours</label>
                <input
                  type="number"
                  name="hours"
                  value={newVolunteer.hours}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={newVolunteer.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={resetForm} className="reset-button">Reset</button>
              <button type="submit" className="submit-button">
                {selectedVolunteer ? 'Update' : 'Add'} Volunteer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="volunteers-section">
        <div className="section-header">
          <h2>Volunteers ({filteredVolunteers.length})</h2>
          {!isLoading && filteredVolunteers.length === 0 && (
            <p className="no-results">No volunteers found matching your criteria</p>
          )}
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading volunteer data...</p>
          </div>
        ) : (
          <div className="volunteers-table-container">
            <table className="volunteers-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>
                    Name {renderSortIcon('name')}
                  </th>
                  <th>Contact</th>
                  <th>Skills & Availability</th>
                  <th onClick={() => handleSort('joinDate')}>
                    Join Date {renderSortIcon('joinDate')}
                  </th>
                  <th onClick={() => handleSort('hours')}>
                    Hours {renderSortIcon('hours')}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map(volunteer => (
                  <tr key={volunteer.id} className="volunteer-row">
                    <td>{volunteer.name}</td>
                    <td>
                      <div>{volunteer.email}</div>
                      <div>{volunteer.phone}</div>
                    </td>
                    <td>
                      <div><strong>Skills:</strong> {volunteer.skills}</div>
                      <div><strong>Available:</strong> {volunteer.availability}</div>
                    </td>
                    <td>{new Date(volunteer.joinDate).toLocaleDateString()}</td>
                    <td>{volunteer.hours}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(volunteer.status)}`}>
                        {volunteer.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button 
                        className="edit-button" 
                        onClick={() => editVolunteer(volunteer)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => deleteVolunteer(volunteer.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="vm-stats">
        <div className="stat-card">
          <h3>Total Volunteers</h3>
          <p>{volunteers.filter(v => v.status === 'Active').length} active</p>
          <p>{volunteers.length} total</p>
        </div>
        <div className="stat-card">
          <h3>Total Hours</h3>
          <p>{volunteers.reduce((sum, v) => sum + v.hours, 0)} hours</p>
        </div>
        <div className="stat-card">
          <h3>Avg. Tenure</h3>
          <p>
            {volunteers.length > 0 
              ? Math.round(volunteers.reduce((sum, v) => {
                  const days = (new Date() - new Date(v.joinDate)) / (1000 * 60 * 60 * 24);
                  return sum + days;
                }, 0) / volunteers.length) 
              : 0} days
          </p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerManagement;