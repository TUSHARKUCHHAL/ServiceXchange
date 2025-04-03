import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FoodDonationForm.css';
import { FaUser, FaSignOutAlt, FaCamera, FaImages } from 'react-icons/fa';

const FoodDonationForm = () => {
  // All state variables remain the same
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [restaurantData, setRestaurantData] = useState({});
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [submissionOtp, setSubmissionOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    quantityUnit: 'portions',
    expiryDate: '',
    description: '',
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    nutFree: false,
    dairyFree: false,
    address: '',
    contactPerson: '',
    contactPhone: '',
    pickupInstructions: '',
    pickupTimeStart: '',
    pickupTimeEnd: '',
    images: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate();
  
  // Add references for both camera capture and file selection
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Check if user is logged in
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('restaurantToken');
    if (token) {
      setIsLoggedIn(true);
      // Get restaurant details for pre-filling form
      fetchRestaurantDetails(token);
    } else {
      // Instead of showing login page, redirect to login page
      navigate('/restaurant/login');
    }
  };

  const fetchRestaurantDetails = async (token) => {
    try {
      if (!token) {
        const storedToken = localStorage.getItem('restaurantToken');
        if (!storedToken) {
          setIsLoggedIn(false);
          navigate('/login');
          return;
        }
        token = storedToken;
      }
      
      setLoading(true);
      
      // Check if we have cached restaurant data in localStorage
      const cachedData = localStorage.getItem('restaurantData');
      if (cachedData) {
        const data = JSON.parse(cachedData);
        setRestaurantData(data);
        
        // Pre-fill contact information
        setFormData(prev => ({
          ...prev,
          address: data.address || '',
          contactPerson: data.contactName || '',
          contactPhone: data.phoneNumber || data.contactPhone || ''
        }));
        
        setLoading(false);
        return;
      }
      
      // If no cached data, try to get from API
      try {
        const response = await fetch('http://localhost:5000/api/restaurants/me', {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Cache the data for future use
          localStorage.setItem('restaurantData', JSON.stringify(data));
          
          setRestaurantData(data);
          setFormData(prev => ({
            ...prev,
            address: data.address || '',
            contactPerson: data.contactName || '',
            contactPhone: data.phoneNumber || data.contactPhone || ''
          }));
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        // If API fails, use a minimal restaurant object
        // This is a fallback to prevent the app from breaking
        const fallbackData = { 
          _id: localStorage.getItem('restaurantId') || 'unknown',
          restaurantName: localStorage.getItem('restaurantName') || 'Restaurant',
          email: localStorage.getItem('restaurantEmail') || ''
        };
        
        setRestaurantData(fallbackData);
        // Don't prefill form data if we don't have it
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      setError('Failed to load restaurant information. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('restaurantToken');
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    setRestaurantData({});
    navigate('/restaurant/login');
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (type === 'file') {
      // Handle file uploads
      handleFileChange(files);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle camera capture button click
  const handleCameraClick = () => {
    // Programmatically click the hidden camera input when the camera button is clicked
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Handle gallery selection button click
  const handleGalleryClick = () => {
    // Programmatically click the hidden file input when the gallery button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (files) => {
    // Create array from FileList object
    const filesArray = Array.from(files);
    
    // Validate files (size, type, etc.)
    const validFiles = filesArray.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, JPG, and PNG images are allowed');
        return false;
      }
      
      if (file.size > maxSize) {
        setError('File size should not exceed 5MB');
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === filesArray.length) {
      setError(''); // Clear error if all files are valid
    }
    
    // Update form data by appending new images to existing ones (up to a maximum of 5)
    const updatedImages = [...formData.images, ...validFiles].slice(0, 5);
    setFormData({
      ...formData,
      images: updatedImages
    });
    
    // Generate and set preview URLs for the updated image array
    const updatedPreviews = [
      ...previewImages,
      ...validFiles.map(file => URL.createObjectURL(file))
    ].slice(0, 5);
    
    setPreviewImages(updatedPreviews);
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('restaurantToken');
      
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      if (!restaurantData || !restaurantData.email) {
        setError('Restaurant email not found. Please refresh the page or log in again.');
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/donations/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ email: restaurantData.email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      setOtpSent(true);
      setSuccess('OTP sent to your email');
    } catch (err) {
      setError(err.message || 'An error occurred while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!submissionOtp || submissionOtp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('restaurantToken');
      
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/donations/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ 
          email: restaurantData.email,
          otp: submissionOtp
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }
      
      setOtpVerified(true);
      setSubmissionOtp('');
      setSuccess('OTP verified successfully. You can now submit your donation.');
    } catch (err) {
      setError(err.message || 'An error occurred while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpVerified) {
      setError('Please verify your OTP before submitting the donation');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Form validation
    if (!formData.foodName || !formData.quantity || !formData.expiryDate || 
        !formData.address || !formData.contactPerson || !formData.contactPhone ||
        !formData.pickupTimeStart || !formData.pickupTimeEnd) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }
    
    // Ensure pickup start time is before end time
    if (new Date(formData.pickupTimeStart) >= new Date(formData.pickupTimeEnd)) {
      setError('Pickup start time must be before end time');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('restaurantToken');
      
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        navigate('/login');
        return;
      }
      
      // Create FormData object for file uploads
      const donationData = new FormData();
      
      // Add text fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          donationData.append(key, formData[key]);
        }
      });
      
      // Add image files to FormData
      formData.images.forEach(image => {
        donationData.append('images', image);
      });
      
      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: {
          'x-auth-token': token
        },
        body: donationData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create donation');
      }
      
      setSuccess('Donation submitted successfully!');
      
      // Reset form
      setFormData({
        foodName: '',
        quantity: '',
        quantityUnit: 'portions',
        expiryDate: '',
        description: '',
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        nutFree: false,
        dairyFree: false,
        address: formData.address, // Keep address
        contactPerson: formData.contactPerson, // Keep contact person
        contactPhone: formData.contactPhone, // Keep contact phone
        pickupInstructions: '',
        pickupTimeStart: '',
        pickupTimeEnd: '',
        images: []
      });
      setPreviewImages([]);
      setOtpVerified(false);
      setOtpSent(false);
      
      // Redirect to donations list after 2 seconds
      setTimeout(() => {
        navigate('/restaurant/my-donations');
      }, 2000);
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the donation');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to remove preview image
  const removeImage = (index) => {
    const updatedPreviews = [...previewImages];
    const updatedImages = [...formData.images];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index]);
    
    updatedPreviews.splice(index, 1);
    updatedImages.splice(index, 1);
    
    setPreviewImages(updatedPreviews);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  // If not logged in, don't render anything - redirect will happen in useEffect
  if (!isLoggedIn) {
    return null;
  }

  // If logged in, show donation form with header
  return (
    <div className="donation-page">
      {/* Header with Profile Icon */}
      <div className="app-header">
        <div className="header-container">
          <h2 className="app-title">Food Donation Portal</h2>
            <div className="profile-section">
            <div className="profile-icon" onClick={handleProfileClick}>
                <FaUser />
                <span className="restaurant-name">
                {restaurantData?.restaurantName || 'Restaurant'}
                </span>
            </div>
            {showProfileMenu && (
                <div className="profile-menu">
                <div className="menu-header">
                    <span>Signed in as</span>
                    <strong>{restaurantData?.email || ''}</strong>
                </div>
                <ul>
                    <li onClick={() => navigate('/profile')}>
                    <FaUser /> Profile
                    </li>
                    <li onClick={() => navigate('/restaurant/my-donations')}>
                    My Donations
                    </li>
                    <li onClick={handleLogout} className="logout-item">
                    <FaSignOutAlt /> Sign Out
                    </li>
                </ul>
                </div>
            )}
            </div>
        </div>
      </div>
      
      <div className="donation-container">
        <div className="form-header">
          <h1>Submit Food Donation</h1>
          <p>Help reduce food waste and support your community by donating surplus food</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form className="donation-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Food Information</h2>
            
            <div className="form-group">
              <label htmlFor="foodName">Food Name*</label>
              <input
                type="text"
                id="foodName"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="e.g., Pasta, Rice, Sandwiches"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity*</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="quantityUnit">Unit*</label>
                <select
                  id="quantityUnit"
                  name="quantityUnit"
                  value={formData.quantityUnit}
                  onChange={handleChange}
                  required
                >
                  <option value="portions">Portions</option>
                  <option value="kg">Kilograms</option>
                  <option value="lbs">Pounds</option>
                  <option value="boxes">Boxes</option>
                  <option value="containers">Containers</option>
                  <option value="plates">Plates</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date*</label>
              <input
                type="datetime-local"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the food, how it was prepared, what it contains, etc."
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Dietary Information</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="vegetarian"
                    checked={formData.vegetarian}
                    onChange={handleChange}
                  />
                  Vegetarian
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="vegan"
                    checked={formData.vegan}
                    onChange={handleChange}
                  />
                  Vegan
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="glutenFree"
                    checked={formData.glutenFree}
                    onChange={handleChange}
                  />
                  Gluten-Free
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="nutFree"
                    checked={formData.nutFree}
                    onChange={handleChange}
                  />
                  Nut-Free
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="dairyFree"
                    checked={formData.dairyFree}
                    onChange={handleChange}
                  />
                  Dairy-Free
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Food Images (Max 5)</label>
              <div className="image-upload-options">
                {/* Camera capture option */}
                <div className="image-upload-button camera-button" onClick={handleCameraClick}>
                  <FaCamera size={20} />
                  <span>Take Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment" 
                    ref={cameraInputRef}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                </div>
                
                {/* Gallery selection option */}
                <div className="image-upload-button gallery-button" onClick={handleGalleryClick}>
                  <FaImages size={20} />
                  <span>Photo Gallery</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    accept="image/jpeg, image/jpg, image/png"
                    multiple
                    style={{ display: 'none' }} 
                  />
                </div>
              </div>
              <p className="form-hint">Add photos of the food (max 5MB each)</p>
              
              {previewImages.length > 0 && (
                <div className="image-previews">
                  {previewImages.map((src, index) => (
                    <div key={index} className="image-preview">
                      <img src={src} alt={`Preview ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-image" 
                        onClick={() => removeImage(index)}
                        aria-label="Remove image"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Display image count */}
              {formData.images.length > 0 && (
                <div className="image-count">
                  {formData.images.length} of 5 images selected
                </div>
              )}
            </div>
          </div>
          
          <div className="form-section">
            <h2>Pickup Information</h2>
            
            <div className="form-group">
              <label htmlFor="address">Pickup Address*</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address where food can be picked up"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person*</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contactPhone">Contact Phone*</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pickupTimeStart">Pickup Time Start*</label>
                <input
                  type="datetime-local"
                  id="pickupTimeStart"
                  name="pickupTimeStart"
                  value={formData.pickupTimeStart}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pickupTimeEnd">Pickup Time End*</label>
                <input
                  type="datetime-local"
                  id="pickupTimeEnd"
                  name="pickupTimeEnd"
                  value={formData.pickupTimeEnd}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="pickupInstructions">Pickup Instructions</label>
              <textarea
                id="pickupInstructions"
                name="pickupInstructions"
                value={formData.pickupInstructions}
                onChange={handleChange}
                placeholder="Special instructions for pickup (e.g., 'Ring doorbell', 'Ask for kitchen staff')"
                rows="2"
              />
            </div>
          </div>
          
          {/* OTP Verification Section */}
          <div className="form-section">
            <h2>Verification</h2>
            <p>To verify your donation submission, please complete OTP verification</p>
            
            {!otpSent ? (
              <div className="form-group">
                <button 
                  type="button" 
                  className="otp-button"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send OTP to Email'}
                </button>
              </div>
            ) : !otpVerified ? (
              <div className="otp-verification">
                <div className="form-group">
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    value={submissionOtp}
                    onChange={(e) => setSubmissionOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    maxLength="6"
                  />
                </div>
                <div className="form-group otp-actions">
                  <button 
                    type="button" 
                    className="otp-button verify"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button 
                    type="button" 
                    className="otp-button resend"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            ) : (
              <div className="verification-success">
                <p>✓ OTP Verified</p>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading || !otpVerified}
            >
              {loading ? 'Submitting...' : 'Submit Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodDonationForm;