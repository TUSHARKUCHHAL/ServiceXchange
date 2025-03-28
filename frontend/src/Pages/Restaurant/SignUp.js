import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Utensils, User, Mail, Phone, Award, Star, ChefHat, Heart } from 'lucide-react';
import './SignUp.css';

const RestaurantSignUp = () => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    openingTime: '',
    closingTime: '',
    cuisineTypes: [],
    seatingCapacity: '',
    specialties: ''
  });

  const [errors, setErrors] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const cuisineOptions = [
    'Italian', 'Chinese', 'Mexican', 
    'Indian', 'American', 'Japanese',
    'French', 'Thai', 'Mediterranean'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (['street', 'city', 'state', 'zipCode'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCuisineChange = (cuisine) => {
    setFormData(prev => {
      const currentCuisines = prev.cuisineTypes;
      const newCuisines = currentCuisines.includes(cuisine)
        ? currentCuisines.filter(c => c !== cuisine)
        : [...currentCuisines, cuisine];
      
      return {
        ...prev,
        cuisineTypes: newCuisines
      };
    });

    if (errors.cuisineTypes && formData.cuisineTypes.length > 0) {
      setErrors(prev => ({ ...prev, cuisineTypes: '' }));
    }
  };

  const validateSection = (sectionIndex) => {
    const newErrors = {};

    if (sectionIndex === 0) {
      if (!formData.restaurantName.trim()) {
        newErrors.restaurantName = 'Restaurant name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
    } else if (sectionIndex === 1) {
      if (!formData.address.street.trim()) {
        newErrors.street = 'Street address is required';
      }
      if (!formData.address.city.trim()) {
        newErrors.city = 'City is required';
      }
    } else if (sectionIndex === 2) {
      if (!formData.cuisineTypes.length) {
        newErrors.cuisineTypes = 'Select at least one cuisine type';
      }
      if (formData.openingTime && formData.closingTime) {
        const opening = new Date(`2000-01-01T${formData.openingTime}`);
        const closing = new Date(`2000-01-01T${formData.closingTime}`);
        if (opening >= closing) {
          newErrors.closingTime = 'Closing time must be after opening time';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextSection = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    setCurrentSection(prev => prev - 1);
  };

  const validateForm = () => {
    let isValid = true;
    for (let i = 0; i <= 2; i++) {
      if (!validateSection(i)) {
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        console.log('Form Submitted', formData);
        setIsSubmitting(false);
        setShowSuccess(true);
      }, 1500);
    }
  };

  const formSections = [
    <>
      <div className="section-header">
        <h3>Basic Information</h3>
        <p>Tell us about your restaurant</p>
      </div>
      
      <div className="form-group">
        <label htmlFor="restaurantName">
          <Utensils size={16} />
          Restaurant Name
        </label>
        <input
          id="restaurantName"
          type="text"
          name="restaurantName"
          value={formData.restaurantName}
          onChange={handleInputChange}
          className={errors.restaurantName ? 'error-input' : ''}
          placeholder="e.g. Bella Cucina"
        />
        {errors.restaurantName && (
          <span className="error-message">{errors.restaurantName}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="ownerName">
          <User size={16} />
          Owner Name
        </label>
        <input
          id="ownerName"
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleInputChange}
          placeholder="e.g. John Smith"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">
          <Mail size={16} />
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={errors.email ? 'error-input' : ''}
          placeholder="e.g. restaurant@example.com"
        />
        {errors.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">
          <Phone size={16} />
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={errors.phone ? 'error-input' : ''}
          placeholder="e.g. 1234567890"
        />
        {errors.phone && (
          <span className="error-message">{errors.phone}</span>
        )}
      </div>
    </>,

    <>
      <div className="section-header">
        <h3>Restaurant Location</h3>
        <p>Where can customers find you?</p>
      </div>
      
      <div className="form-group">
        <label htmlFor="street">
          <MapPin size={16} />
          Street Address
        </label>
        <input
          id="street"
          type="text"
          name="street"
          value={formData.address.street}
          onChange={handleInputChange}
          className={errors.street ? 'error-input' : ''}
          placeholder="e.g. 123 Main St"
        />
        {errors.street && (
          <span className="error-message">{errors.street}</span>
        )}
      </div>

      <div className="address-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.address.city}
            onChange={handleInputChange}
            className={errors.city ? 'error-input' : ''}
            placeholder="e.g. New York"
          />
          {errors.city && (
            <span className="error-message">{errors.city}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            id="state"
            type="text"
            name="state"
            value={formData.address.state}
            onChange={handleInputChange}
            placeholder="e.g. NY"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="zipCode">Zip Code</label>
          <input
            id="zipCode"
            type="text"
            name="zipCode"
            value={formData.address.zipCode}
            onChange={handleInputChange}
            placeholder="e.g. 10001"
          />
        </div>
      </div>
    </>,

    <>
      <div className="section-header">
        <h3>Restaurant Details</h3>
        <p>Tell us more about what makes you special</p>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="openingTime">
            <Clock size={16} />
            Opening Time
          </label>
          <input
            id="openingTime"
            type="time"
            name="openingTime"
            value={formData.openingTime}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="closingTime">
            <Clock size={16} />
            Closing Time
          </label>
          <input
            id="closingTime"
            type="time"
            name="closingTime"
            value={formData.closingTime}
            onChange={handleInputChange}
            className={errors.closingTime ? 'error-input' : ''}
          />
          {errors.closingTime && (
            <span className="error-message">{errors.closingTime}</span>
          )}
        </div>
      </div>

      <div className="form-group cuisine-group">
        <label>
          <Utensils size={16} />
          Cuisine Types
        </label>
        <div className="cuisine-options">
          {cuisineOptions.map(cuisine => (
            <label 
              key={cuisine} 
              className={`cuisine-checkbox ${formData.cuisineTypes.includes(cuisine) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={formData.cuisineTypes.includes(cuisine)}
                onChange={() => handleCuisineChange(cuisine)}
              />
              {cuisine}
            </label>
          ))}
        </div>
        {errors.cuisineTypes && (
          <span className="error-message">{errors.cuisineTypes}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="seatingCapacity">
          <User size={16} />
          Seating Capacity
        </label>
        <input
          id="seatingCapacity"
          type="number"
          name="seatingCapacity"
          value={formData.seatingCapacity}
          onChange={handleInputChange}
          placeholder="e.g. 50"
        />
      </div>

      <div className="form-group">
        <label htmlFor="specialties">
          <Award size={16} />
          Restaurant Specialties
        </label>
        <textarea
          id="specialties"
          name="specialties"
          value={formData.specialties}
          onChange={handleInputChange}
          placeholder="Describe your restaurant's unique offerings"
          rows={4}
        />
      </div>
    </>
  ];

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3,
        ease: "easeIn" 
      }
    }
  };

  const progress = ((currentSection + 1) / (formSections.length + 1)) * 100;

  useEffect(() => {
    const container = document.querySelector('.restaurant-signup-container');
    const formGroups = document.querySelectorAll('.form-group');
    const successMessage = document.querySelector('.success-message');
    
    setTimeout(() => {
      container.classList.add('animate');
      formGroups.forEach((group, index) => {
        setTimeout(() => {
          group.classList.add('animate');
        }, index * 100);
      });
      
      if (showSuccess) {
        setTimeout(() => {
          successMessage.classList.add('animate');
        }, 300);
      }
    }, 100);
  }, [currentSection, showSuccess]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    out: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  return (
    <div className="restaurant-signup-wrapper">
      <div className="restaurant-signup-container">
        <div className="form-progress-bar">
          <div className="progress-track">
            <motion.div 
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="progress-steps">
            {[...Array(formSections.length + 1)].map((_, i) => (
              <motion.div 
                key={i} 
                className={`progress-step ${i <= currentSection ? 'active' : ''}`}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: i === currentSection ? 1.1 : 1,
                  backgroundColor: i <= currentSection ? '#e74c3c' : '#f0f2f5',
                  borderColor: i <= currentSection ? '#c0392b' : '#e0e4e8'
                }}
                transition={{ duration: 0.3 }}
              >
                {i < currentSection ? '✓' : i + 1}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Restaurant Registration
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="restaurant-signup-form">
          {!showSuccess ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`section-${currentSection}`}
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  className="form-section"
                >
                  {currentSection < formSections.length 
                    ? formSections[currentSection] 
                    : (
                        <div className="confirmation-section">
                          <motion.div 
                            className="section-header"
                            variants={itemVariants}
                          >
                            <h3>Confirm Your Details</h3>
                            <p>Please review your information before submitting</p>
                          </motion.div>
                          
                          <motion.div 
                            className="confirmation-details"
                            variants={itemVariants}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="detail-group">
                              <h4><User size={16} className="icon-pulse" /> Basic Information</h4>
                              <p><strong>Restaurant:</strong> {formData.restaurantName || 'Not provided'}</p>
                              <p><strong>Owner:</strong> {formData.ownerName || 'Not provided'}</p>
                              <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
                              <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
                            </div>
                            
                            <div className="detail-group">
                              <h4><MapPin size={16} className="icon-pulse" /> Address</h4>
                              <p><strong>Street:</strong> {formData.address.street || 'Not provided'}</p>
                              <p><strong>City:</strong> {formData.address.city || 'Not provided'}</p>
                              <p><strong>State:</strong> {formData.address.state || 'Not provided'}</p>
                              <p><strong>Zip Code:</strong> {formData.address.zipCode || 'Not provided'}</p>
                            </div>
                            
                            <div className="detail-group">
                              <h4><Utensils size={16} className="icon-pulse" /> Restaurant Details</h4>
                              <p><strong>Hours:</strong> {formData.openingTime || 'Not set'} - {formData.closingTime || 'Not set'}</p>
                              <p><strong>Cuisines:</strong> {formData.cuisineTypes.join(', ') || 'None selected'}</p>
                              <p><strong>Seating:</strong> {formData.seatingCapacity || 'Not provided'}</p>
                              <p><strong>Specialties:</strong> {formData.specialties || 'None provided'}</p>
                            </div>
                          </motion.div>
                        </div>
                      )
                  }
                </motion.div>
              </AnimatePresence>

              <motion.div 
                className="form-navigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {currentSection > 0 && (
                  <motion.button 
                    type="button" 
                    onClick={prevSection}
                    className="nav-button prev-button"
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back
                  </motion.button>
                )}
                
                {currentSection < formSections.length ? (
                  <motion.button 
                    type="button" 
                    onClick={nextSection}
                    className="nav-button next-button"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue
                  </motion.button>
                ) : (
                  <motion.button 
                    type="submit" 
                    className="nav-button submit-button"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <div className="spinner"></div>
                    ) : (
                      'Register Restaurant'
                    )}
                  </motion.button>
                )}
              </motion.div>
            </>
          ) : (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              <motion.div 
                className="success-icon"
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.05, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  repeatDelay: 2,
                  duration: 1
                }}
              >
                ✓
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Registration Successful!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Thank you for registering your restaurant with us.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                We'll review your submission and contact you soon.
              </motion.p>
              <motion.button 
                type="button" 
                className="nav-button reset-button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFormData({
                    restaurantName: '',
                    ownerName: '',
                    email: '',
                    phone: '',
                    address: {
                      street: '',
                      city: '',
                      state: '',
                      zipCode: ''
                    },
                    openingTime: '',
                    closingTime: '',
                    cuisineTypes: [],
                    seatingCapacity: '',
                    specialties: ''
                  });
                  setCurrentSection(0);
                  setShowSuccess(false);
                }}
              >
                Register Another Restaurant
              </motion.button>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};
/* Add JavaScript to create dynamic background elements when the component loads */
window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.restaurant-signup-wrapper');
  
  if (wrapper) {
    // Add waves
    for (let i = 1; i <= 3; i++) {
      const wave = document.createElement('div');
      wave.className = `wave wave-${i}`;
      wrapper.appendChild(wave);
    }
    
    // Add plates
    for (let i = 1; i <= 4; i++) {
      const plate = document.createElement('div');
      plate.className = `plate plate-${i}`;
      wrapper.appendChild(plate);
    }
    
    // Add bokeh particles
    const colors = [
      'rgba(255, 215, 143, 0.7)',
      'rgba(244, 150, 108, 0.6)',
      'rgba(230, 57, 70, 0.5)',
      'rgba(242, 174, 46, 0.6)',
      'rgba(234, 85, 69, 0.5)'
    ];
    
    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 80 + 20;
      const bokeh = document.createElement('div');
      bokeh.className = 'bokeh-particle';
      bokeh.style.width = `${size}px`;
      bokeh.style.height = `${size}px`;
      bokeh.style.left = `${Math.random() * 100}%`;
      bokeh.style.top = `${Math.random() * 100}%`;
      bokeh.style.background = colors[Math.floor(Math.random() * colors.length)];
      bokeh.style.opacity = `${Math.random() * 0.3 + 0.1}`;
      bokeh.style.filter = `blur(${Math.random() * 5 + 3}px)`;
      
      // Create floating animation dynamically
      const duration = Math.random() * 10 + 10;
      const xMove = Math.random() * 40 - 20;
      const yMove = Math.random() * 40 - 20;
      bokeh.style.animation = `float-${i} ${duration}s ease-in-out infinite`;
      
      // Create keyframes
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes float-${i} {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(${xMove}px, ${yMove}px) scale(${Math.random() * 0.3 + 0.9}); }
          50% { transform: translate(${xMove * 0.8}px, ${-yMove * 1.2}px) scale(${Math.random() * 0.2 + 1}); }
          75% { transform: translate(${-xMove * 1.1}px, ${yMove * 0.7}px) scale(${Math.random() * 0.3 + 0.9}); }
        }
      `;
      
      document.head.appendChild(style);
      wrapper.appendChild(bokeh);
    }
  }
});
export default RestaurantSignUp;