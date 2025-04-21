import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './MyDonation.css';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('restaurantToken');
    if (!token) {
      setIsAuthenticated(false);
      setError('You need to be logged in to view your donations');
      setLoading(false);
    } else {
      setIsAuthenticated(true);
      fetchDonations();
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('restaurantToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('http://localhost:5000/api/donations/my-donations', {
        method: 'GET',
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('restaurantToken');
          setIsAuthenticated(false);
          throw new Error('Your session has expired. Please log in again');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDonations(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch donations. Please try again later.');
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('restaurantToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`http://localhost:5000/api/donations/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      setDonations(donations.filter(donation => donation._id !== id));
      setShowDeleteModal(false);
      setDonationToDelete(null);
      
      showNotification('Donation deleted successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete donation. Please try again later.');
      console.error('Error deleting donation:', err);
    }
  };

  const redirectToLogin = () => {
    window.location.href = '/restaurant/login?redirect=' + encodeURIComponent(window.location.pathname);
  };

  const confirmDelete = (donation) => {
    setDonationToDelete(donation);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (status) => {
    let badgeClass = '';
    let statusText = status;
    
    switch (status) {
      case 'available':
        badgeClass = 'badge-success';
        statusText = 'Available';
        break;
      case 'reserved':
        badgeClass = 'badge-warning';
        statusText = 'Reserved';
        break;
      case 'completed':
        badgeClass = 'badge-info';
        statusText = 'Completed';
        break;
      case 'expired':
        badgeClass = 'badge-danger';
        statusText = 'Expired';
        break;
      default:
        badgeClass = 'badge-secondary';
        statusText = 'Unknown';
    }
    
    return <span className={`badge ${badgeClass}`}>{statusText}</span>;
  };

  const getFilteredDonations = () => {
    if (filter === 'active') {
      return donations.filter(d => d.status === 'available' || d.status === 'reserved');
    } else if (filter === 'completed') {
      return donations.filter(d => d.status === 'completed' || d.status === 'expired');
    }
    return donations;
  };

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const getImageUrl = (imageUrl) => {
    // Handle different image URL formats
    if (!imageUrl) return null;
    
    // If it's a full URL
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // If it's a relative path
    return `http://localhost:5000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required-container">
        <div className="auth-message">
          <i className="fas fa-lock"></i>
          <h2>Authentication Required</h2>
          <p>You need to be logged in to view and manage your food donations.</p>
          <button className="btn-primary" onClick={redirectToLogin}>
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-container">
      <div className="donation-header">
        <div className="header-left">
          <h1>My Donations</h1>
          <p className="subtitle">Manage and track your food donation listings</p>
        </div>
        <button className="btn-add" onClick={() => window.location.href = '/restaurant/donate'}>
          <i className="fas fa-plus-circle"></i>
          <span className="btn-text">New Donation</span>
        </button>
      </div>
      
      <div className="donation-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <i className="fas fa-th-list"></i> All
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          <i className="fas fa-clock"></i> Active
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          <i className="fas fa-check-circle"></i> Completed
        </button>
        <div className="filter-spacer"></div>
        <button className="refresh-btn" onClick={fetchDonations} title="Refresh donations">
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading your donations...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={fetchDonations} className="retry-btn">
            <i className="fas fa-redo"></i> Retry
          </button>
        </div>
      ) : getFilteredDonations().length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-utensils"></i>
          </div>
          <h3>No donations found</h3>
          <p>Share your surplus food with those in need and help reduce food waste</p>
          <button className="btn-primary" onClick={() => window.location.href = '/restaurant/donate'}>
            <i className="fas fa-plus-circle"></i> Create Your First Donation
          </button>
        </div>
      ) : (
        <div className="donation-grid">
          {getFilteredDonations().map((donation, index) => (
            <div 
              key={donation._id} 
              className="donation-card"
            >
              <div className="card-image-container">
                {donation.images && donation.images.length > 0 ? (
                  <img 
                    src={getImageUrl(donation.images[0])} 
                    alt={donation.foodName}
                    className="card-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder-food.jpg';
                    }}
                  />
                ) : (
                  <div className="placeholder-image">
                    <i className="fas fa-utensils"></i>
                  </div>
                )}
                <div className="status-badge">
                  {getStatusBadge(donation.status)}
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{donation.foodName}</h3>
                <p className="card-quantity">{donation.quantity} {donation.quantityUnit}</p>
                
                <div className="card-details">
                  <div className="detail-item">
                    <i className="far fa-calendar-alt"></i>
                    <span>Expires: {format(new Date(donation.expiryDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="detail-item">
                    <i className="far fa-clock"></i>
                    <span>Pickup: {format(new Date(donation.pickupTimeStart), 'h:mm a')} - {format(new Date(donation.pickupTimeEnd), 'h:mm a')}</span>
                  </div>
                </div>
                
                <div className="dietary-tags">
                  {donation.dietaryInfo?.vegetarian && <span className="dietary-tag"><i className="fas fa-leaf"></i> Vegetarian</span>}
                  {donation.dietaryInfo?.vegan && <span className="dietary-tag"><i className="fas fa-seedling"></i> Vegan</span>}
                  {donation.dietaryInfo?.glutenFree && <span className="dietary-tag"><i className="fas fa-bread-slice"></i> Gluten-Free</span>}
                  {donation.dietaryInfo?.nutFree && <span className="dietary-tag"><i className="fas fa-allergies"></i> Nut-Free</span>}
                  {donation.dietaryInfo?.dairyFree && <span className="dietary-tag"><i className="fas fa-cheese"></i> Dairy-Free</span>}
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="btn-view"
                  onClick={() => window.location.href = `/donations/${donation._id}`}
                >
                  <i className="fas fa-external-link-alt"></i> View Details
                </button>
                <div className="action-buttons">
                  {/* <button 
                    className="btn-edit"
                    onClick={() => window.location.href = `/donations/edit/${donation._id}`}
                    title="Edit donation"
                  >
                    <i className="fas fa-edit"></i>
                  </button> */}
                  <button 
                    className="btn-delete"
                    onClick={() => confirmDelete(donation)}
                    disabled={donation.status === 'reserved'}
                    title={donation.status === 'reserved' ? "Cannot delete reserved donations" : "Delete donation"}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3><i className="fas fa-exclamation-triangle"></i> Confirm Deletion</h3>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the donation <strong>"{donationToDelete?.foodName}"</strong>?</p>
              <p className="warning-text"><i className="fas fa-info-circle"></i> This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                <i className="fas fa-times"></i> Cancel
              </button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(donationToDelete?._id)}>
                <i className="fas fa-trash-alt"></i> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonations;