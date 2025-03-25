import { useState, useRef, useEffect } from "react";
import "./ExcessFoodRequest.css";

const ExcessFoodRequest = () => {
  const [foodDetails, setFoodDetails] = useState({
    name: "",
    quantity: "",
    location: "",
    description: "",
    expiry: "",
    dietary: "",
    image: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const fileInputRef = useRef(null);
  const [showTip, setShowTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  // Enhanced animation states
  const [animatingStep, setAnimatingStep] = useState(false);

  useEffect(() => {
    // Show tips with rotation
    const tipInterval = setInterval(() => {
      setTipIndex(prevIndex => (prevIndex + 1) % tips.length);
      setShowTip(true);
      setTimeout(() => setShowTip(false), 6000);
    }, 12000);
    
    // Show first tip immediately
    setShowTip(true);
    setTimeout(() => setShowTip(false), 6000);
    
    return () => clearInterval(tipInterval);
  }, []);

  const handleChange = (e) => {
    setFoodDetails({ ...foodDetails, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoodDetails({ ...foodDetails, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Food Donation Details:", foodDetails);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after success display
      setTimeout(() => {
        setIsSuccess(false);
        setFoodDetails({
          name: "",
          quantity: "",
          location: "",
          description: "",
          expiry: "",
          dietary: "",
          image: null,
        });
        setActiveStep(1);
      }, 3000);
    }, 1800);
  };

  const nextStep = () => {
    if (activeStep < 3) {
      setAnimatingStep(true);
      setTimeout(() => {
        setActiveStep(activeStep + 1);
        setAnimatingStep(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setAnimatingStep(true);
      setTimeout(() => {
        setActiveStep(activeStep - 1);
        setAnimatingStep(false);
      }, 300);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDietarySelect = (option) => {
    setFoodDetails({ ...foodDetails, dietary: 
      foodDetails.dietary === option ? "" : option 
    });
  };

  const dietaryOptions = [
    "Vegetarian", 
    "Vegan", 
    "Gluten-Free", 
    "Dairy-Free", 
    "Nut-Free", 
    "Halal",
    "Kosher",
    "None/Other"
  ];

  const progressPercent = ((activeStep - 1) / 2) * 100;

  // Enhanced food donation tips
  const tips = [
    "Cooked food should be properly cooled before packaging for safety",
    "Fresh fruits and vegetables are always in high demand at food banks",
    "Label any common allergens in your food donations clearly",
    "Non-perishable items can help those in need for longer periods",
    "Consider donating culturally diverse foods to support everyone in the community",
    "Ensure food containers are sealed properly to maintain freshness",
    "Food with at least 48 hours before expiry is ideal for donation",
    "Nutritionally balanced meals are especially valuable for donations"
  ];
  
  const randomTip = tips[tipIndex];

  // Get appropriate emoji for the food item
  const getFoodEmoji = () => {
    if (!foodDetails.name) return "🍲";
    
    const name = foodDetails.name.toLowerCase();
    if (name.includes("fruit") || name.includes("apple")) return "🍎";
    if (name.includes("veg") || name.includes("salad")) return "🥗";
    if (name.includes("bread") || name.includes("bakery")) return "🍞";
    if (name.includes("pizza")) return "🍕";
    if (name.includes("soup")) return "🍜";
    if (name.includes("pasta") || name.includes("spaghetti")) return "🍝";
    if (name.includes("burger")) return "🍔";
    if (name.includes("cake") || name.includes("dessert")) return "🍰";
    if (name.includes("rice")) return "🍚";
    
    return "🍲"; // Default
  };

  return (
    <div className="excess-food-container">
      <div className="floating-elements">
        <div className="float-element apple">🍎</div>
        <div className="float-element bread">🍞</div>
        <div className="float-element pizza">🍕</div>
        <div className="float-element carrot">🥕</div>
      </div>
      
      <div className="form-header">
        <div className="icon-container">
          <span className="food-icon">{getFoodEmoji()}</span>
        </div>
        <h1>Share Your Excess Food</h1>
        <p>Help reduce food waste and support your community</p>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="step-indicators">
            <div className={`step-dot ${activeStep >= 1 ? "active" : ""}`}>1</div>
            <div className={`step-dot ${activeStep >= 2 ? "active" : ""}`}>2</div>
            <div className={`step-dot ${activeStep >= 3 ? "active" : ""}`}>3</div>
          </div>
        </div>
      </div>
      
      {showTip && (
        <div className="tip-container">
          <div className="tip-bubble">
            <span className="tip-icon">💡</span>
            <p>{randomTip}</p>
          </div>
        </div>
      )}
      
      <div className="food-form">
        <div className={`step-container ${animatingStep ? "fade-out" : "animate-in"}`} style={{ display: activeStep === 1 ? "block" : "none" }}>
          <h2 className="step-title">Basic Information</h2>
          
          <div className="input-group">
            <label htmlFor="name">Food Item Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={foodDetails.name}
              onChange={handleChange}
              placeholder="E.g., Fresh Vegetables, Canned Goods"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="quantity">Quantity Available</label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={foodDetails.quantity}
              onChange={handleChange}
              placeholder="E.g., 5 pounds, 3 packages, 2 trays"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="location">Pickup Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={foodDetails.location}
              onChange={handleChange}
              placeholder="Your address or general area"
              required
            />
          </div>
          
          <div className="step-actions">
            <button className="back-btn" onClick={prevStep} disabled>
              <span className="arrow">←</span> Back
            </button>
            <button className="next-btn" onClick={nextStep}>
              Next <span className="arrow">→</span>
            </button>
          </div>
        </div>
        
        <div className={`step-container ${animatingStep ? "fade-out" : "animate-in"}`} style={{ display: activeStep === 2 ? "block" : "none" }}>
          <h2 className="step-title">Food Details</h2>
          
          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={foodDetails.description}
              onChange={handleChange}
              placeholder="Provide details about the food items you're sharing"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="input-group">
            <label htmlFor="expiry">Best Before Date</label>
            <input
              type="date"
              id="expiry"
              name="expiry"
              value={foodDetails.expiry}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="dietary-options">
            <label>Dietary Information</label>
            <div className="tag-container">
              {dietaryOptions.map((option) => (
                <div
                  key={option}
                  className={`dietary-tag ${foodDetails.dietary === option ? "selected" : ""}`}
                  onClick={() => handleDietarySelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
          
          <div className="step-actions">
            <button className="back-btn" onClick={prevStep}>
              <span className="arrow">←</span> Back
            </button>
            <button className="next-btn" onClick={nextStep}>
              Next <span className="arrow">→</span>
            </button>
          </div>
        </div>
        
        <div className={`step-container ${animatingStep ? "fade-out" : "animate-in"}`} style={{ display: activeStep === 3 ? "block" : "none" }}>
          <h2 className="step-title">Add Photo & Review</h2>
          
          <div className="file-input-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden-file-input"
            />
            <div className="upload-btn" onClick={triggerFileInput}>
              <span className="upload-icon">📷</span>
              {foodDetails.image ? "Change Photo" : "Add Photo (Optional)"}
            </div>
            {foodDetails.image && <span className="file-selected">✓ Photo Added</span>}
          </div>
          
          {foodDetails.image && (
            <div className="food-preview">
              <img src={foodDetails.image} alt="Food preview" />
              <div className="image-overlay">
                <button className="change-image-btn" onClick={triggerFileInput}>
                  Change Photo
                </button>
              </div>
            </div>
          )}
          
          <div className="summary-card">
            <div className="summary-header">
              <h3>Donation Summary</h3>
              <span className="quantity-badge">{foodDetails.quantity || "N/A"}</span>
            </div>
            
            <div className="summary-details">
              <div className="summary-row">
                <span className="summary-label">Food Item</span>
                <span className="summary-value">{foodDetails.name || "Not specified"}</span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Location</span>
                <span className="summary-value">{foodDetails.location || "Not specified"}</span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Best Before</span>
                <span className="summary-value">
                  {foodDetails.expiry 
                    ? new Date(foodDetails.expiry).toLocaleDateString() 
                    : "Not specified"}
                </span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Dietary</span>
                <span className="summary-value">{foodDetails.dietary || "Not specified"}</span>
              </div>
            </div>
            
            <p className="summary-description">
              {foodDetails.description || "No description provided."}
            </p>
          </div>
          
          <div className="step-actions">
            <button className="back-btn" onClick={prevStep}>
              <span className="arrow">←</span> Back
            </button>
            <button 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting && <span className="loading-spinner"></span>}
              {isSuccess ? "Submitted Successfully!" : "Submit Donation"}
              {isSuccess && <span className="success-icon">✓</span>}
            </button>
          </div>
        </div>
      </div>
      
      <svg className="footer-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="var(--secondary-light)" fillOpacity="0.5" d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,218.7C672,213,768,235,864,234.7C960,235,1056,213,1152,197.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  );
};

export default ExcessFoodRequest;