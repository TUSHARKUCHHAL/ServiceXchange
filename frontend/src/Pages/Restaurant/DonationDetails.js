import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './DonationDetails.css';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchDonationDetails();
  }, [id]);

  const fetchDonationDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('restaurantToken');
      
      const response = await fetch(`http://localhost:5000/api/donations/${id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDonation(data);
      
      // Check if the logged-in user is the owner of this donation
      if (token) {
        try {
          const profileResponse = await fetch('http://localhost:5000/api/restaurants/me', {
            headers: { 'x-auth-token': token }
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setIsOwner(profileData._id === data.restaurant);
          }
        } catch (err) {
          console.error('Error checking ownership:', err);
        }
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch donation details');
      console.error('Error fetching donation details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/donations/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
      return;
    }
    
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
      
      // Show success message
      alert('Donation deleted successfully');
      
      // Redirect to the donations list
      navigate('/donations');
    } catch (err) {
      alert(err.message || 'Failed to delete donation');
      console.error('Error deleting donation:', err);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/placeholder-food.jpg';
    
    // If it's a full URL
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // If it's a relative path
    return `http://localhost:5000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
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

  if (loading) {
    return (
      <div className="details-container">
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading donation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={fetchDonationDetails} className="retry-btn">
              <i className="fas fa-redo"></i> Retry
            </button>
            <button onClick={() => navigate('/donations')} className="back-btn">
              <i className="fas fa-arrow-left"></i> Back to Donations
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="details-container">
        <div className="not-found-message">
          <i className="fas fa-search"></i>
          <h2>Donation Not Found</h2>
          <p>The donation you're looking for doesn't exist or has been removed</p>
          <button onClick={() => navigate('/donations')} className="back-btn">
            <i className="fas fa-arrow-left"></i> Back to Donations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-navigation">
        <button onClick={() => navigate('/donations')} className="back-btn">
          <i className="fas fa-arrow-left"></i> Back to My Donations
        </button>
        {isOwner && (
          <div className="owner-actions">
            <button 
              onClick={handleEdit} 
              className="btn-edit"
              disabled={donation.status === 'completed' || donation.status === 'expired'}
              title={donation.status === 'completed' || donation.status === 'expired' ? 
                "Cannot edit completed or expired donations" : "Edit donation"}
            >
              <i className="fas fa-edit"></i> Edit
            </button>
            <button 
              onClick={handleDelete} 
              className="btn-delete"
              disabled={donation.status === 'reserved'}
              title={donation.status === 'reserved' ? "Cannot delete reserved donations" : "Delete donation"}
            >
              <i className="fas fa-trash-alt"></i> Delete
            </button>
          </div>
        )}
      </div>

      <div className="donation-details-card">
        <div className="details-header">
          <h1>{donation.foodName}</h1>
          <div className="details-status">
            {getStatusBadge(donation.status)}
          </div>
        </div>

        <div className="details-content">
          <div className="details-gallery">
            {donation.images && donation.images.length > 0 ? (
              <>
                <div className="main-image-container">
                  <img 
                    src={getImageUrl(donation.images[activeImageIndex])} 
                    alt={`${donation.foodName} - Image ${activeImageIndex + 1}`}
                    className="main-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder-food.jpg';
                    }}
                  />
                </div>
                {donation.images.length > 1 && (
                  <div className="image-thumbnails">
                    {donation.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img 
                          src={getImageUrl(image)} 
                          alt={`${donation.foodName} - Thumbnail ${index + 1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder-food.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="placeholder-image large">
                <i className="fas fa-utensils"></i>
                <p>No image available</p>
              </div>
            )}
          </div>

          <div className="details-info">
            <div className="info-section">
              <h3>Basic Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label"><i className="fas fa-box"></i> Quantity</span>
                  <span className="info-value">{donation.quantity} {donation.quantityUnit}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"><i className="fas fa-calendar-day"></i> Posted</span>
                  <span className="info-value">{format(new Date(donation.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"><i className="fas fa-hourglass-end"></i> Expires</span>
                  <span className="info-value">{format(new Date(donation.expiryDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"><i className="fas fa-clock"></i> Pickup Hours</span>
                  <span className="info-value">{format(new Date(donation.pickupTimeStart), 'h:mm a')} - {format(new Date(donation.pickupTimeEnd), 'h:mm a')}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Description</h3>
              <p className="description">{donation.description || 'No description provided.'}</p>
            </div>

            <div className="info-section">
              <h3>Dietary Information</h3>
              <div className="dietary-tags detailed">
                {donation.dietaryInfo?.vegetarian && <span className="dietary-tag"><i className="fas fa-leaf"></i> Vegetarian</span>}
                {donation.dietaryInfo?.vegan && <span className="dietary-tag"><i className="fas fa-seedling"></i> Vegan</span>}
                {donation.dietaryInfo?.glutenFree && <span className="dietary-tag"><i className="fas fa-bread-slice"></i> Gluten-Free</span>}
                {donation.dietaryInfo?.nutFree && <span className="dietary-tag"><i className="fas fa-allergies"></i> Nut-Free</span>}
                {donation.dietaryInfo?.dairyFree && <span className="dietary-tag"><i className="fas fa-cheese"></i> Dairy-Free</span>}
                {!donation.dietaryInfo || Object.values(donation.dietaryInfo).every(val => !val) && 
                  <span className="no-info">No dietary information provided</span>
                }
              </div>
            </div>

            {donation.pickupInstructions && (
              <div className="info-section">
                <h3>Pickup Instructions</h3>
                <p className="pickup-instructions">{donation.pickupInstructions}</p>
              </div>
            )}

            <div className="action-section">
              {donation.status === 'available' ? (
                <button className="btn-reserve">
                  <i className="fas fa-hands-helping"></i> Reserve This Donation
                </button>
              ) : donation.status === 'reserved' ? (
                <div className="reservation-info">
                  <i className="fas fa-info-circle"></i>
                  <span>This donation has been reserved</span>
                </div>
              ) : (
                <div className="status-info">
                  <i className="fas fa-info-circle"></i>
                  <span>This donation is {donation.status}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationDetails;