import React, { useState, useEffect, useRef } from 'react';
import './AboutSection.css';

export default function AboutSection() {
  const [counters, setCounters] = useState({ years: 0, destinations: 0, customers: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const aboutRef = useRef(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, [hasAnimated]);

  // Counter animation function
  const animateCounters = () => {
    const targets = { years: 5, destinations: 50, customers: 1000 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        years: Math.floor(targets.years * progress),
        destinations: Math.floor(targets.destinations * progress),
        customers: Math.floor(targets.customers * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, increment);
  };

  const services = [
    {
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Domestic Tours",
      description: "Explore India's incredible destinations - from Kashmir's mountains to Kerala's backwaters. We organize all types of domestic tour programs.",
      programs: ["Hill Stations", "Beach Destinations", "Cultural Heritage", "Adventure Tours", "Wildlife Safaris"],
      gradient: "linear-gradient(135deg, rgba(255, 152, 0, 0.85) 0%, rgba(255, 87, 34, 0.85) 100%)"
    },
    {
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "International",
      description: "Discover the world beyond with our expertly planned global adventures. We handle all types of international tour programs.",
      programs: ["Europe Tours", "Asian Adventures", "Americas Exploration", "Africa Safaris", "Cruise Packages"],
      gradient: "linear-gradient(135deg, rgba(78, 205, 196, 0.85) 0%, rgba(69, 183, 209, 0.85) 100%)"
    },
    {
      image: "https://images.unsplash.com/photo-1582639590920-0819ba7cb93b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Pilgrimage",
      description: "Sacred journeys to spiritual destinations with devotion and care. We organize comprehensive pilgrimage tour programs.",
      programs: ["Char Dham Yatra", "South India Temples", "Buddhist Circuit", "Sikh Heritage", "Jain Pilgrimages"],
      gradient: "linear-gradient(135deg, rgba(156, 39, 176, 0.85) 0%, rgba(103, 58, 183, 0.85) 100%)"
    },
    {
      image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Group Adventures",
      description: "Travel with friends, family, or like-minded explorers. We specialize in all types of group tour programs for memorable experiences.",
      programs: ["Corporate Tours", "Family Reunions", "Friends Getaways", "Educational Tours", "Honeymoon Packages"],
      gradient: "linear-gradient(135deg, rgba(244, 67, 54, 0.85) 0%, rgba(233, 30, 99, 0.85) 100%)"
    }
  ];

  return (
    <section id="about" className="about-section" ref={aboutRef}>
      {/* Animated Waves */}
      <div className="waves-container">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
      </div>

      {/* Flying Seagulls */}
      <div className="seagulls-container">
        <div className="seagull seagull-1">🕊️</div>
        <div className="seagull seagull-2">🕊️</div>
        <div className="seagull seagull-3">🕊️</div>
      </div>

      {/* Floating Particles */}
      <div className="water-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`water-drop drop-${i}`}></div>
        ))}
      </div>

      <div className="about-container">
        {/* Header */}
        <div className="about-header">
          <h2 className="about-title">About S4 Holidays</h2>
          <p className="about-subtitle">
            Your trusted partner for creating unforgettable travel experiences across India and beyond. 
            We provide comprehensive services for Domestic, International, Pilgrimage, and Group trips - 
            taking care of all types of tour programs.
          </p>
        </div>

        {/* Service Huts on Stilts */}
        <div className="beach-huts">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="beach-hut"
              style={{ '--hut-gradient': service.gradient }}
            >
              {/* Wooden Stilts */}
              <div className="hut-stilts">
                <div className="stilt stilt-left"></div>
                <div className="stilt stilt-right"></div>
              </div>

              {/* Water Reflection */}
              <div className="water-reflection"></div>
              
              {/* Main Hut */}
              <div className="hut-structure">
                <div className="hut-image-container">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="hut-image"
                  />
                  <div className="hut-overlay"></div>
                </div>
                
                <div className="hut-content">
                  <h3 className="hut-title">{service.title}</h3>
                  <p className="hut-description">{service.description}</p>
                  
                  {/* Tour Programs List */}
                  <div className="programs-list">
                    <h4>Tour Programs:</h4>
                    <ul>
                      {service.programs.map((program, idx) => (
                        <li key={idx}>{program}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Stats on Palm Leaf */}
        <div className="stats-palm-leaf">
          <div className="palm-leaf-bg">🌿</div>
          <div className="stats-content">
            <div className="stat-item">
              <div className="stat-number">{counters.years}+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-divider">🌊</div>
            <div className="stat-item">
              <div className="stat-number">{counters.destinations}+</div>
              <div className="stat-label">Destinations</div>
            </div>
            <div className="stat-divider">🌊</div>
            <div className="stat-item">
              <div className="stat-number">{counters.customers}+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
          </div>
        </div>

        {/* Mission Message in a Bottle */}
        <div className="message-bottle">
          <div className="bottle-container">
            <div className="bottle-cork"></div>
            <div className="bottle-glass">
              <div className="message-scroll">
                <h3>Our Mission</h3>
                <p>
                  Like waves bringing treasures to shore, S4 Holidays brings you the finest travel experiences. 
                  We specialize in all types of tour programs - whether it's exploring domestic wonders, 
                  international adventures, spiritual pilgrimages, or group celebrations. Every journey 
                  with us is crafted with the precision of ocean tides and the warmth of tropical sunshine.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Services Section */}
        <div className="services-banner">
          <div className="banner-content">
            <h3>🌴 Complete Tour Services 🌴</h3>
            <p>
              <strong>We take ALL types of tour programs:</strong> Domestic explorations across India's diverse landscapes, 
              International adventures to global destinations, Sacred pilgrimage journeys, and memorable Group trips. 
              From planning to execution, we handle every detail of your travel dreams.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
