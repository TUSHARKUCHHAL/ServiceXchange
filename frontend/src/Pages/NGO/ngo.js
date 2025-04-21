import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, BookOpen, Home, Coffee, Scale, ArrowLeft, ArrowRight, Search, Mail } from 'lucide-react';
import './ngo.css'; // Import your CSS file for styling

const NGOConnect = () => {
  // Sample registered NGOs data for the slider
  const registeredNGOs = [
    { id: 1, name: "Green Earth Foundation", logo: "/api/placeholder/80/80", focus: "Environmental Conservation" },
    { id: 2, name: "Child Care International", logo: "/api/placeholder/80/80", focus: "Children's Rights" },
    { id: 3, name: "Global Health Initiative", logo: "/api/placeholder/80/80", focus: "Healthcare Access" },
    { id: 4, name: "Education For All", logo: "/api/placeholder/80/80", focus: "Educational Equity" },
    { id: 5, name: "Women Empowerment Alliance", logo: "/api/placeholder/80/80", focus: "Gender Equality" },
    { id: 6, name: "Food Security Network", logo: "/api/placeholder/80/80", focus: "Hunger Relief" },
    { id: 7, name: "Digital Access Project", logo: "/api/placeholder/80/80", focus: "Technology Access" },
    { id: 8, name: "Clean Water Action", logo: "/api/placeholder/80/80", focus: "Water Resources" },
  ];

  const navigate = useNavigate();

  // Enhanced testimonials data
  const testimonials = [
    { 
      id: 1, 
      quote: "Working with NGOs through this platform has been an incredible experience. The certificate helped me in my college applications!", 
      author: "Sarah J.", 
      role: "Student Volunteer",
      avatar: "/api/placeholder/60/60"
    },
    { 
      id: 2, 
      quote: "As the director of a small NGO, this platform has connected us with passionate volunteers who truly care about our cause.", 
      author: "Michael T.", 
      role: "NGO Director",
      avatar: "/api/placeholder/60/60"
    },
    { 
      id: 3, 
      quote: "The certification process is streamlined and professional. My volunteer work here has opened doors to numerous opportunities.", 
      author: "Priya K.", 
      role: "Community Leader",
      avatar: "/api/placeholder/60/60"
    },
    { 
      id: 4, 
      quote: "I've volunteered with three different organizations through this platform. Each experience has been transformative and well-organized.", 
      author: "David L.", 
      role: "Regular Volunteer",
      avatar: "/api/placeholder/60/60"
    },
  ];

  // Impact areas data with icons
  const impactAreas = [
    { id: 1, icon: <Heart size={32} />, title: "Environment", description: "Conservation and sustainability initiatives" },
    { id: 2, icon: <Users size={32} />, title: "Healthcare", description: "Medical access and wellness programs" },
    { id: 3, icon: <BookOpen size={32} />, title: "Education", description: "Learning and skill development" },
    { id: 4, icon: <Home size={32} />, title: "Housing", description: "Shelter and community development" },
    { id: 5, icon: <Coffee size={32} />, title: "Food Security", description: "Addressing hunger and nutrition" },
    { id: 6, icon: <Scale size={32} />, title: "Social Justice", description: "Equality and human rights" }
  ];

/* JavaScript to clone slider items for infinite effect */
  document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.ngo-slider');
    const sliderContent = slider.innerHTML;
    const sliderClone = document.createElement('div');
    sliderClone.className = 'slider-clone';
    sliderClone.innerHTML = sliderContent;
    slider.appendChild(sliderClone);
  });

  // State variables
  const [ngoSliderPosition, setNgoSliderPosition] = useState(0);
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSlides, setVisibleSlides] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragX, setStartDragX] = useState(0);
  const [currentDragX, setCurrentDragX] = useState(0);
  
  // Refs for slider
  const ngoSliderRef = useRef(null);
  
  // Calculate how many testimonial pages we need (showing 2 per page)
  const testimonialsPerPage = 2;
  const totalTestimonialPages = Math.ceil(testimonials.length / testimonialsPerPage);

  // Filter NGOs based on search term
  const filteredNGOs = registeredNGOs.filter(ngo => 
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ngo.focus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create an infinite loop of NGOs by duplicating the array
  const infiniteNGOs = [...filteredNGOs, ...filteredNGOs, ...filteredNGOs];

  // Update visible slides based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleSlides(1);
      } else if (window.innerWidth < 992) {
        setVisibleSlides(2);
      } else if (window.innerWidth < 1200) {
        setVisibleSlides(3);
      } else {
        setVisibleSlides(4);
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide effect for NGOs slider
  useEffect(() => {
    if (filteredNGOs.length <= visibleSlides) return;
    
    const interval = setInterval(() => {
      if (!isPaused && !isDragging) {
        setNgoSliderPosition((prevPosition) => {
          // Create wrap-around effect
          const nextPosition = prevPosition + 1;
          return nextPosition >= filteredNGOs.length ? 0 : nextPosition;
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isPaused, filteredNGOs.length, visibleSlides, isDragging]);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentTestimonialPage((prev) => (prev + 1) % totalTestimonialPages);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused, totalTestimonialPages]);

  // Function to navigate to specific testimonial page
  const goToTestimonialPage = (page) => {
    setCurrentTestimonialPage(page);
  };

  // Function to handle slider hover (pause/play)
  const handleSliderHover = (isPaused) => {
    setIsPaused(isPaused);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset slider position when search changes
    setNgoSliderPosition(0);
  };

  // Get current testimonials to display
  const getCurrentTestimonials = () => {
    const startIndex = currentTestimonialPage * testimonialsPerPage;
    return testimonials.slice(startIndex, startIndex + testimonialsPerPage);
  };

  // NGO Slider Navigation
  const navigateNGOSlider = (direction) => {
    if (direction === 'prev') {
      setNgoSliderPosition(prev => {
        const newPos = prev - 1;
        return newPos < 0 ? filteredNGOs.length - 1 : newPos;
      });
    } else {
      setNgoSliderPosition(prev => (prev + 1) % filteredNGOs.length);
    }
  };
  
  // Mouse drag event handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartDragX(e.clientX);
    setCurrentDragX(e.clientX);
    setIsPaused(true);
    
    // Prevent default behavior to avoid text selection during drag
    e.preventDefault();
  };
  
  const handleDragMove = (e) => {
    if (isDragging) {
      setCurrentDragX(e.clientX);
    }
  };
  
  const handleDragEnd = () => {
    if (isDragging) {
      const dragDistance = startDragX - currentDragX;
      
      if (Math.abs(dragDistance) > 50) {
        if (dragDistance > 0) {
          // Dragged left -> next slide
          navigateNGOSlider('next');
        } else {
          // Dragged right -> prev slide
          navigateNGOSlider('prev');
        }
      }
      
      setIsDragging(false);
      setIsPaused(false);
    }
  };
  
  // Handle mouse leave during drag
  const handleDragLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="ngo-connect">
      <div className="main-content">
        <div className="intro-panel">
          <h1>Make a Difference Today</h1>
          <p>Join forces with registered NGOs and contribute to meaningful causes</p>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search for NGOs or causes..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-button">
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </div>

        <section className="ngo-actions">
          <div className="action-card">
            <div className="card-icon">
              <Users size={40} />
            </div>
            <h2>Join an NGO</h2>
            <p>Connect with organizations making a difference in various causes</p>
            <button className="action-button">Join Now</button>
          </div>

          <div className="action-card">
            <div className="card-icon">
              <BookOpen size={40} />
            </div>
            <h2>Student Certificate</h2>
            <p>Get certification for your volunteer hours and experiences</p>
            <button className="action-button">Get Certificate</button>
          </div>

          <div className="action-card">
            <div className="card-icon">
              <Home size={40} />
            </div>
            <h2>Register Your NGO</h2>
            <p>Add your organization to our growing network of change-makers</p>
            <button className="action-button" onClick={() => navigate("/ngo-signup")}>Register NGO</button>
          </div>
        </section>

        <section className="impact-areas">
          <h2>Areas of Impact</h2>
          <div className="impact-grid">
            {impactAreas.map(area => (
              <div key={area.id} className="impact-area-card">
                <div className="impact-icon">{area.icon}</div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ngo-statistics">
          <div className="stat-item">
            <span className="stat-number">200+</span>
            <span className="stat-label">Registered NGOs</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5K+</span>
            <span className="stat-label">Student Volunteers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Hours Contributed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">120+</span>
            <span className="stat-label">Active Projects</span>
          </div>
        </section>

        <section className="ngo-slider-section">
          <h2>Our Registered NGOs</h2>
          {searchTerm && filteredNGOs.length === 0 ? (
            <div className="no-results">No NGOs found matching "{searchTerm}"</div>
          ) : (
            <div 
              className="ngo-slider-container"
              onMouseEnter={() => handleSliderHover(true)}
              onMouseLeave={() => {
                handleSliderHover(false); 
                handleDragLeave();
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              ref={ngoSliderRef}
            >
              <div 
                className={`ngo-slider ${isDragging ? 'dragging' : ''}`} 
                style={{ 
                  transform: `translateX(-${ngoSliderPosition * 280}px)`,
                  transition: isDragging ? 'none' : 'transform 0.5s ease'
                }}
              >
                {infiniteNGOs.map((ngo, index) => (
                  <div key={`${ngo.id}-${index}`} className="ngo-card">
                    <img src={ngo.logo} alt={ngo.name} className="ngo-logo" />
                    <h3>{ngo.name}</h3>
                    <p>{ngo.focus}</p>
                    <button className="ngo-details-button">View Details</button>
                  </div>
                ))}
              </div>
              <div className="slider-controls">
                <button 
                  className="slider-arrow prev" 
                  onClick={() => navigateNGOSlider('prev')}
                >
                  <ArrowLeft size={24} />
                </button>
                <button 
                  className="slider-arrow next" 
                  onClick={() => navigateNGOSlider('next')}
                >
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* <section className="testimonials">
          <h2>What Our Volunteers Say</h2>
          <div 
            className="testimonial-slider"
            onMouseEnter={() => handleSliderHover(true)}
            onMouseLeave={() => handleSliderHover(false)}
          >
            <div className="testimonial-container">
              {getCurrentTestimonials().map(testimonial => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-header">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="testimonial-avatar" 
                    />
                    <div className="testimonial-meta">
                      <h4>{testimonial.author}</h4>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                  <p>"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
            <div className="testimonial-dots">
              {Array.from({ length: totalTestimonialPages }).map((_, index) => (
                <span 
                  key={index} 
                  className={`testimonial-dot ${index === currentTestimonialPage ? 'active' : ''}`}
                  onClick={() => goToTestimonialPage(index)}
                ></span>
              ))}
            </div>
          </div>
        </section> */}

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your account and complete your profile</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Find NGOs</h3>
              <p>Browse organizations by cause or location</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Apply</h3>
              <p>Send applications to NGOs you're interested in</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Volunteer</h3>
              <p>Contribute your time and skills</p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <h3>Get Certified</h3>
              <p>Receive recognition for your contributions</p>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-container">
            <details className="faq-item">
              <summary>How do I get a volunteer certificate?</summary>
              <p>Complete at least 40 hours of volunteer work with a registered NGO. The organization will verify your hours and our system will generate an official certificate.</p>
            </details>
            <details className="faq-item">
              <summary>What requirements must my NGO meet to register?</summary>
              <p>Your organization must be legally registered, have active community projects, and provide documentation of your nonprofit status.</p>
            </details>
            <details className="faq-item">
              <summary>Can international students participate?</summary>
              <p>Yes! We welcome volunteers from around the world. Many of our NGOs offer remote volunteering opportunities.</p>
            </details>
            <details className="faq-item">
              <summary>How long does the verification process take?</summary>
              <p>NGO registration verification typically takes 3-5 business days. Volunteer certificates are usually processed within 48 hours after hour verification.</p>
            </details>
          </div>
        </section>

        <section className="newsletter">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest NGO opportunities and impact stories</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button className="subscribe-button">
                <Mail size={18} />
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Make an Impact?</h2>
          <p>Start your journey with our network of NGOs today</p>
          <button className="cta-button">Get Started</button>
        </section>
      </div>
    </div>
  );
};

export default NGOConnect;