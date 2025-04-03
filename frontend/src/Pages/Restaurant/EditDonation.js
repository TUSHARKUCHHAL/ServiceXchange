import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import './EditDonation.css';

const EditDonation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    quantity: '',
    quantityUnit: 'servings',
    expiryDate: '',
    pickupTimeStart: '',
    pickupTimeEnd: '',
    pickupInstructions: '',
    images: [],
    dietaryInfo: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      nutFree: false,
      dairyFree: false
    }
  });
  
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  
  // Fetch donation details on component mount
  useEffect(() => {
    fetchDonationDetails();
  }, [id]);
  
  const fetchDonationDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('restaurantToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`http://localhost:5000/api/donations/${id}`, {
        method: 'GET',
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('restaurantToken');
          navigate('/restaurant/login?redirect=' + encodeURIComponent(window.location.pathname));
          throw new Error('Your session has expired. Please log in again');
        }
        
        if (response.status === 404) {
          throw new Error('Donation not found or you do not have permission to edit it');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const donationData = await response.json();
      
      // Format dates for form inputs
      const formattedData = {
        ...donationData,
        expiryDate: format(new Date(donationData.expiryDate), 'yyyy-MM-dd'),
        pickupTimeStart: format(new Date(donationData.pickupTimeStart), 'HH:mm'),
        pickupTimeEnd: format(new Date(donationData.pickupTimeEnd), 'HH:mm'),
        dietaryInfo: donationData.dietaryInfo || {
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          nutFree: false,
          dairyFree: false
        }
      };
      
      setFormData(formattedData);
      
      // Set image previews from existing images
      if (donationData.images && donationData.images.length > 0) {
        const previews = donationData.images.map(img => ({
          url: getImageUrl(img),
          isExisting: true,
          path: img
        }));
        setImagePreviews(previews);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch donation details. Please try again later.');
      console.error('Error fetching donation:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: checked
        }
      });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate file types and sizes
    const invalidFiles = files.filter(file => 
      !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) || file.size > 5 * 1024 * 1024
    );
    
    if (invalidFiles.length > 0) {
      setFormErrors({
        ...formErrors,
        images: 'Only JPG, JPEG or PNG images under 5MB are allowed'
      });
      return;
    }
    
    setNewImages([...newImages, ...files]);
    
    // Create and set image previews
    const readers = files.map(file => {
      const reader = new FileReader();
      return new Promise(resolve => {
        reader.onload = (e) => {
          resolve({
            url: e.target.result,
            file: file,
            isExisting: false
          });
        };
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(readers).then(newPreviews => {
      setImagePreviews([...imagePreviews, ...newPreviews]);
      setFormErrors({ ...formErrors, images: null });
    });
  };
  
  const removeImage = (index) => {
    const preview = imagePreviews[index];
    
    // If removing an existing image, add to delete list
    if (preview.isExisting) {
      setImagesToDelete([...imagesToDelete, preview.path]);
    } else {
      // If removing a new image, remove from newImages
      const fileToRemove = preview.file;
      setNewImages(newImages.filter(file => file !== fileToRemove));
    }
    
    // Remove from previews
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.foodName.trim()) errors.foodName = 'Food name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.quantity) errors.quantity = 'Quantity is required';
    if (!formData.quantityUnit) errors.quantityUnit = 'Unit is required';
    if (!formData.expiryDate) errors.expiryDate = 'Expiry date is required';
    if (!formData.pickupTimeStart) errors.pickupTimeStart = 'Pickup start time is required';
    if (!formData.pickupTimeEnd) errors.pickupTimeEnd = 'Pickup end time is required';
    
    // Check if pickup end time is after start time
    if (formData.pickupTimeStart && formData.pickupTimeEnd && 
        formData.pickupTimeStart >= formData.pickupTimeEnd) {
      errors.pickupTimeEnd = 'End time must be after start time';
    }
    
    // Ensure there's at least one image
    if (imagePreviews.length === 0) {
      errors.images = 'At least one image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('restaurantToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Create form data for multipart submission
      const submitData = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key === 'dietaryInfo') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'images') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add new images
      newImages.forEach(file => {
        submitData.append('images', file);
      });
      
      // Add list of images to delete
      if (imagesToDelete.length > 0) {
        submitData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }
      
      const response = await fetch(`http://localhost:5000/api/donations/${id}`, {
        method: 'PUT',
        headers: { 
          'x-auth-token': token,
          // Note: Don't set Content-Type for multipart/form-data, browser will set it with boundary
        },
        body: submitData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      setSuccessMessage('Donation updated successfully!');
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate(`/donations/${id}`);
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to update donation. Please try again later.');
      console.error('Error updating donation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const navigateBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading donation details...</p>
        </div>
      </div>
    );
  }
  
  if (error && !formData.foodName) {
    return (
      <div className="page-container">
        <div className="error-container">
          <i className="fas fa-exclamation-circle"></i>
          <h2>Error</h2>
          <p>{error}</p>
          <div className="button-group">
            <button className="btn-secondary" onClick={navigateBack}>
              <i className="fas fa-arrow-left"></i> Go Back
            </button>
            <button className="btn-primary" onClick={fetchDonationDetails}>
              <i className="fas fa-redo"></i> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="edit-donation-container">
      <div className="page-header">
        <button className="back-button" onClick={navigateBack}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Edit Donation</h1>
      </div>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i> {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="donation-form">
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
              placeholder="e.g. Vegetable Soup, Chicken Sandwiches"
              className={formErrors.foodName ? 'input-error' : ''}
            />
            {formErrors.foodName && (
              <div className="error-message">{formErrors.foodName}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the food, how it was prepared, etc."
              rows="4"
              className={formErrors.description ? 'input-error' : ''}
            ></textarea>
            {formErrors.description && (
              <div className="error-message">{formErrors.description}</div>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="quantity">Quantity*</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 10"
                className={formErrors.quantity ? 'input-error' : ''}
              />
              {formErrors.quantity && (
                <div className="error-message">{formErrors.quantity}</div>
              )}
            </div>
            
            <div className="form-group half">
              <label htmlFor="quantityUnit">Unit*</label>
              <select
                id="quantityUnit"
                name="quantityUnit"
                value={formData.quantityUnit}
                onChange={handleChange}
                className={formErrors.quantityUnit ? 'input-error' : ''}
              >
                <option value="servings">Servings</option>
                <option value="meals">Meals</option>
                <option value="boxes">Boxes</option>
                <option value="trays">Trays</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="liters">Liters</option>
                <option value="gallons">Gallons</option>
                <option value="items">Items</option>
              </select>
              {formErrors.quantityUnit && (
                <div className="error-message">{formErrors.quantityUnit}</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Dietary Information</h2>
          <p className="section-description">Select all that apply</p>
          
          <div className="checkbox-grid">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="vegetarian"
                name="dietaryInfo.vegetarian"
                checked={formData.dietaryInfo.vegetarian}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="vegetarian"><i className="fas fa-leaf"></i> Vegetarian</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="vegan"
                name="dietaryInfo.vegan"
                checked={formData.dietaryInfo.vegan}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="vegan"><i className="fas fa-seedling"></i> Vegan</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="glutenFree"
                name="dietaryInfo.glutenFree"
                checked={formData.dietaryInfo.glutenFree}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="glutenFree"><i className="fas fa-bread-slice"></i> Gluten-Free</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="nutFree"
                name="dietaryInfo.nutFree"
                checked={formData.dietaryInfo.nutFree}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="nutFree"><i className="fas fa-allergies"></i> Nut-Free</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="dairyFree"
                name="dietaryInfo.dairyFree"
                checked={formData.dietaryInfo.dairyFree}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="dairyFree"><i className="fas fa-cheese"></i> Dairy-Free</label>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Availability Information</h2>
          
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date*</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              min={format(new Date(), 'yyyy-MM-dd')}
              className={formErrors.expiryDate ? 'input-error' : ''}
            />
            {formErrors.expiryDate && (
              <div className="error-message">{formErrors.expiryDate}</div>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="pickupTimeStart">Pickup Start Time*</label>
              <input
                type="time"
                id="pickupTimeStart"
                name="pickupTimeStart"
                value={formData.pickupTimeStart}
                onChange={handleChange}
                className={formErrors.pickupTimeStart ? 'input-error' : ''}
              />
              {formErrors.pickupTimeStart && (
                <div className="error-message">{formErrors.pickupTimeStart}</div>
              )}
            </div>
            
            <div className="form-group half">
              <label htmlFor="pickupTimeEnd">Pickup End Time*</label>
              <input
                type="time"
                id="pickupTimeEnd"
                name="pickupTimeEnd"
                value={formData.pickupTimeEnd}
                onChange={handleChange}
                className={formErrors.pickupTimeEnd ? 'input-error' : ''}
              />
              {formErrors.pickupTimeEnd && (
                <div className="error-message">{formErrors.pickupTimeEnd}</div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="pickupInstructions">Pickup Instructions</label>
            <textarea
              id="pickupInstructions"
              name="pickupInstructions"
              value={formData.pickupInstructions}
              onChange={handleChange}
              placeholder="Provide details on how to pick up the food (e.g. 'Come to the back entrance', 'Ask for manager')"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Food Images</h2>
          <p className="section-description">Upload clear images of the food (Max 5MB per image, JPG/PNG only)</p>
          
          <div className="image-upload-container">
            <div 
              className={`image-dropzone ${formErrors.images ? 'dropzone-error' : ''}`}
              onClick={() => document.getElementById('imageUpload').click()}
            >
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Click to upload images</p>
              <input
                type="file"
                id="imageUpload"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            
            {formErrors.images && (
              <div className="error-message">{formErrors.images}</div>
            )}
            
            {imagePreviews.length > 0 && (
              <div className="image-preview-grid">
                {imagePreviews.map((preview, index) => (
                  <div className="image-preview-container" key={index}>
                    <div className="image-preview">
                      <img src={preview.url} alt={`Preview ${index + 1}`} />
                      <button 
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={navigateBack}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="btn-loader"></div> Updating...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDonation;