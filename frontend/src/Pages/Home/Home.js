import React, { useRef, useEffect, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const buttonsSectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState({
    categories: false,
    impact: false,
    testimonials: false,
    cta: false
  });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Testimonials data
  const testimonials = [
    {
      quote: "Connecting through this platform has allowed our hospital to receive critical volunteer support during peak times. The impact has been tremendous.",
      author: "Dr. Sarah Johnson",
      organization: "City General Hospital"
    },
    {
      quote: "We've been able to distribute excess food to those in need, reducing our waste and making a real difference in our community.",
      author: "Michael Chen",
      organization: "Fresh Eats Restaurant"
    },
    {
      quote: "The volunteer network we've built through this platform has enabled us to expand our reach to rural communities.",
      author: "Priya Sharma",
      organization: "Global Aid Initiative"
    }
  ];

  // Improved scroll function with console logs for debugging
  const scrollToButtons = () => {
    console.log("Scroll function triggered");
    console.log("Button section ref:", buttonsSectionRef.current);
    
    if (buttonsSectionRef.current) {
      buttonsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      console.log("Scrolling to button section");
    } else {
      console.error("Button section reference is not available");
    }
  };

  // Testimonial carousel automation
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  // Animation triggers based on scroll
  useEffect(() => {
    // Initialize animation for stat counters
    const statCounters = document.querySelectorAll('.stat-counter');
    
    // Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Get the section id from the entry target
        const id = entry.target.id;
        
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [id]: true }));
          
          // If impact section becomes visible, animate counters
          if (id === 'impact') {
            animateCounters();
          }
        }
      });
    }, { threshold: 0.2 });
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
    
    // Function to animate counters
    const animateCounters = () => {
      statCounters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const animate = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(animate);
          } else {
            counter.textContent = target;
          }
        };
        
        animate();
      });
    };
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-container">
      {/* Background Animation */}
      <div className="animated-background">
        <div className="gradient-bg"></div>
        <div className="particle-container">
          {[...Array(20)].map((_, index) => (
            <div 
              key={index} 
              className="particle" 
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                opacity: Math.random() * 0.5 + 0.1,
                backgroundColor: `hsl(${Math.random() * 60 + 210}, 70%, 60%)`,
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="circles">
          {[...Array(10)].map((_, index) => (
            <li key={index}></li>
          ))}
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="animate-text">Connecting</span>{' '}
            <span className="animate-text delay-1">Hearts,</span>{' '}
            <span className="animate-text delay-2">Building</span>{' '}
            <span className="animate-text delay-3">Futures</span>
          </h1>
          <p className="hero-subtitle">
            Join our community of changemakers and help create a world where everyone has access to the
            resources they need. Together, we can make a difference that lasts generations.
          </p>
          <button className="get-involved-btn" onClick={scrollToButtons}>
            <span className="btn-text">Get Involved</span>
          </button>
        </div>
        <div className="hero-shapes">
          <div className="hero-shape shape1"></div>
          <div className="hero-shape shape2"></div>
          <div className="hero-shape shape3"></div>
        </div>
      </section>

      {/* Category Buttons Section */}
      <section className="categories-section" ref={buttonsSectionRef} id="categories">
        <div className="section-blob"></div>
        <h2 className="section-title">How Would You Like to Help?</h2>
        <p className="section-subtitle">Choose your path to making a difference in our community</p>
        
        <div className="categories-grid">
          <Link to="/hospital" className="category-card">
            <div className="category-icon hospital-icon">
              <i className="fas fa-hospital"></i>
              <div className="icon-glow"></div>
            </div>
            <h3>Hospitals</h3>
            <p>Support healthcare facilities and patients in need</p>
            <div className="card-hover-effect"></div>
          </Link>
          
          <Link to="/volunteer" className="category-card">
            <div className="category-icon volunteer-icon">
              <i className="fas fa-hands-helping"></i>
              <div className="icon-glow"></div>
            </div>
            <h3>Volunteer</h3>
            <p>Offer your time and skills to community projects</p>
            <div className="card-hover-effect"></div>
          </Link>
          
          <Link to="/ngo-dashboard" className="category-card">
            <div className="category-icon ngo-icon">
              <i className="fas fa-globe-americas"></i>
              <div className="icon-glow"></div>
            </div>
            <h3>NGOs</h3>
            <p>Connect with organizations making global impact</p>
            <div className="card-hover-effect"></div>
          </Link>
          
          <Link to="/restaurant" className="category-card">
            <div className="category-icon restaurant-icon">
              <i className="fas fa-utensils"></i>
              <div className="icon-glow"></div>
            </div>
            <h3>Restaurants</h3>
            <p>Partner with food services to reduce waste and feed communities</p>
            <div className="card-hover-effect"></div>
          </Link>
        </div>
      </section>

      {/* Impact Section */}
      <div className="impact-section">
        <h2>Our Impact</h2>
        <div className="impact-stats">
          <div className="stat-box">
            <h3>10K+</h3>
            <p>Volunteers</p>
          </div>
          <div className="stat-box">
            <h3>250+</h3>
            <p>Partner NGOs</p>
          </div>
          <div className="stat-box">
            <h3>75+</h3>
            <p>Hospitals</p>
          </div>
          <div className="stat-box">
            <h3>120+</h3>
            <p>Restaurants</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="testimonial-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <h2 className="section-title">Voices of Change</h2>
        <div className="testimonial-slider">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}
            >
              <div className="quote-mark">"</div>
              <p>{testimonial.quote}</p>
              <div className="testimonial-author">
                <h4>{testimonial.author}</h4>
                <p>{testimonial.organization}</p>
              </div>
            </div>
          ))}
          <div className="testimonial-nav">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                className={`nav-dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Fixed with direct event handler */}
      <section className="cta-section" id="cta">
        <div className="cta-content">
          <div className="cta-glow"></div>
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of others who are already changing lives in their communities</p>
          {/* Fixed button with inline handler and increased z-index */}
          <button 
            className="primary-button" 
            // Using direct implementation for more reliability
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("CTA button clicked");
              if (buttonsSectionRef.current) {
                buttonsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
              } else {
                console.error("Button section reference is not available");
              }
            }}
            style={{ position: 'relative', zIndex: 10 }}
            aria-label="Start helping now"
          >
            <span className="btn-text">Start Now</span>
          </button>
        </div>
        <div className="cta-particles">
          {[...Array(15)].map((_, index) => (
            <div 
              key={index} 
              className="cta-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            ></div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;