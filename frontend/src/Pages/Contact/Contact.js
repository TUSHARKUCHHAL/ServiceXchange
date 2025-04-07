import React, { useState } from "react";
import "./Contact.css";
// Import Font Awesome CSS
import "@fortawesome/fontawesome-free/css/all.min.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    
    try {
      // Send data to backend API using fetch instead of axios
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSuccessMessage("Thank you for reaching out! A confirmation email has been sent to your inbox. Our team will contact you shortly.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("There was an error submitting your request. Please try again later.");
    } finally {
      setLoading(false);
      
      // Clear success message after 5 seconds
      if (successMessage) {
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
    }
  };

  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer: "We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, we recommend calling our support line."
    },
    {
      question: "Do you offer virtual consultations?",
      answer: "Yes, we offer virtual consultations via Zoom, Google Meet, or Microsoft Teams. Simply mention your preference in the message field when submitting your contact form."
    },
    {
      question: "What information should I include in my message?",
      answer: "To help us assist you better, please include specific details about your inquiry, any relevant timeline, and your preferred method of communication."
    },
    {
      question: "Is my information secure when I submit this form?",
      answer: "Absolutely. We use industry-standard encryption to protect your data, and we never share your personal information with third parties without your consent."
    }
  ];

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          Have questions or want to discuss a project? We're here to help! Fill out the form below, and our team will get back to you as soon as possible.
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-form-wrapper">
          <div className="form-header">
            <h2>Send us a message</h2>
            <p>We'd love to hear from you. Complete the form below, and we'll respond promptly.</p>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        </div>

        <div className="contact-info-wrapper">
          <div className="contact-info">
            <h2>Contact Information</h2>
            
            <div className="contact-detail">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-text">
                <h3>Email Us</h3>
                <p>support@servicexchange.com</p>
              </div>
            </div>
            
            <div className="contact-detail">
              <div className="contact-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="contact-text">
                <h3>Call Us</h3>
                <p>+123 456 7890</p>
              </div>
            </div>
            
            <div className="contact-detail">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-text">
                <h3>Visit Us</h3>
                <p>123 Service Street, City, Country</p>
              </div>
            </div>
            
            <div className="contact-detail">
              <div className="contact-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="contact-text">
                <h3>Business Hours</h3>
                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="social-media">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="map-wrapper">
        <div className="map-placeholder">
          <p>Interactive Map Will Be Displayed Here</p>
        </div>
      </div>
      
      <div className="faq-section">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Find quick answers to common questions about contacting us.</p>
        </div>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <h3 className="faq-question">{faq.question}</h3>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;