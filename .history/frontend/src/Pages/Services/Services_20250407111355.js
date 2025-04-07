import React, { useEffect, useState } from "react";
import styles from "./Services.css"; // Importing CSS module
import { FaHeartbeat, FaUtensils, FaHandsHelping, FaQuoteLeft } from "react-icons/fa";

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    
    // For statistics count-up animation
    const statsElements = document.querySelectorAll(`.${styles.statNumber}`);
    statsElements.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      let count = 0;
      const interval = setInterval(() => {
        count += Math.ceil(target / 30);
        if (count >= target) {
          stat.textContent = target.toLocaleString();
          clearInterval(interval);
        } else {
          stat.textContent = count.toLocaleString();
        }
      }, 30);
    });
  }, []);

  return (
    <div className={styles.servicesPage}>
      <div className={`${styles.servicesHeader} ${isVisible ? styles.fadeIn : ''}`}>
        <h1 className={styles.servicesTitle}>Our Services</h1>
        <p className={styles.servicesMission}>
          ServiceXchange connects NGOs, restaurants, hospitals, and volunteers to provide essential services that create a meaningful impact.
        </p>
        <p className={styles.servicesSubtitle}>
          We believe in the power of community and collaboration to address critical needs and create lasting change.
        </p>
      </div>

      <div className={styles.servicesContainer}>
        <ServiceCard 
          icon={<FaUtensils size={35} color="#e74c3c" />} 
          title="Food Donation" 
          description="Restaurants and suppliers donate surplus food, which is distributed to NGOs and communities in need. We ensure safe handling and timely delivery to maximize freshness and impact."
          stats={[{ target: 5000, label: "Meals/Week" }, { target: 120, label: "Restaurants" }]}
          delay="1"
          isVisible={isVisible}
        />

        <ServiceCard 
          icon={<FaHeartbeat size={35} color="#e74c3c" />} 
          title="Blood Donation" 
          description="We bridge the gap between hospitals and blood donors, ensuring life-saving donations reach those in need quickly. Our digital platform connects donors with collection centers and tracks availability."
          stats={[{ target: 1250, label: "Units/Month" }, { target: 75, label: "Hospitals" }]}
          delay="2"
          isVisible={isVisible}
        />

        <ServiceCard 
          icon={<FaHandsHelping size={35} color="#e74c3c" />} 
          title="Volunteer Support" 
          description="Our dedicated volunteers help with food distribution and blood donation drives, making a real difference in communities. We provide training, resources, and a supportive network for all volunteers."
          stats={[{ target: 2500, label: "Volunteers" }, { target: 150, label: "Events/Month" }]}
          delay="3"
          isVisible={isVisible}
        />
      </div>

      <ImpactSection isVisible={isVisible} />
      <TestimonialSection />
      <PartnerSection />
      <CTASection />
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ icon, title, description, stats, delay, isVisible }) => (
  <div className={`${styles.serviceCard} ${isVisible ? `${styles.fadeIn} ${styles[`delay${delay}`]}` : ''}`}>
    <div className={styles.serviceIcon}>{icon}</div>
    <h2>{title}</h2>
    <p>{description}</p>
    <div className={styles.serviceStats}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.stat}>
          <div className={styles.statNumber} data-target={stat.target}>0</div>
          <div className={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// Impact Section Component
const ImpactSection = ({ isVisible }) => (
  <div className={`${styles.impactSection} ${isVisible ? styles.fadeIn : ''}`}>
    <h2 className={styles.impactTitle}>Our Impact</h2>
    <div className={styles.impactGrid}>
      {[
        { number: "250K+", label: "Meals Delivered" },
        { number: "45K+", label: "Blood Units Donated" },
        { number: "100+", label: "Communities Served" },
        { number: "35K+", label: "Volunteer Hours" }
      ].map((item, index) => (
        <div key={index} className={styles.impactItem}>
          <div className={styles.impactNumber}>{item.number}</div>
          <div className={styles.impactLabel}>{item.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// Testimonial Section Component
const TestimonialSection = () => (
  <div className={styles.testimonialSection}>
    <h2 className={styles.testimonialTitle}>What People Say</h2>
    <div className={styles.testimonialContainer}>
      {[
        { quote: "ServiceXchange has transformed the way our hospital manages blood donations.", author: "Dr. Sarah Johnson", role: "Chief Medical Officer, City General Hospital" },
        { quote: "As a restaurant owner, I'm thrilled to put our excess food to good use.", author: "Miguel Rodriguez", role: "Owner, Fresh Bites Café" },
        { quote: "Volunteering with ServiceXchange has been life-changing.", author: "Priya Sharma", role: "Volunteer, 2 years" }
      ].map((testimonial, index) => (
        <div key={index} className={styles.testimonialCard}>
          <FaQuoteLeft size={24} color="#e74c3c" style={{ opacity: 0.3, marginBottom: '15px' }} />
          <p className={styles.testimonialQuote}>{testimonial.quote}</p>
          <p className={styles.testimonialAuthor}>{testimonial.author}</p>
          <p className={styles.testimonialRole}>{testimonial.role}</p>
        </div>
      ))}
    </div>
  </div>
);

// Partner Section Component
const PartnerSection = () => (
  <div className={styles.partnerSection}>
    <h2 className={styles.partnerTitle}>Our Partners</h2>
    <div className={styles.partnerLogos}>
      {["Community Hospital", "FreshFoods Restaurant Group", "City Food Bank", "HealthFirst NGO"].map((partner, index) => (
        <div key={index} className={styles.partnerLogo}>{partner}</div>
      ))}
    </div>
  </div>
);

// CTA Section Component
const CTASection = () => (
  <div className={styles.ctaSection}>
    <p className={styles.ctaText}>Ready to make a difference with us?</p>
    <button className={styles.ctaButton}>Get Involved Today</button>
  </div>
);

export default Services;
