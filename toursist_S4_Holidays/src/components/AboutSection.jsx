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
    const duration = 2500;
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

  return (
    <section id="about" className="about-section" ref={aboutRef}>
      <div className="about-container">
        {/* Header */}
        <div className="about-header">
          <h2 className="about-title">About S4 Holidays</h2>
          <p className="about-subtitle">
            Your trusted partner for creating unforgettable travel experiences across India and beyond
          </p>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">{counters.years}+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{counters.destinations}+</div>
            <div className="stat-label">Destinations</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{counters.customers}+</div>
            <div className="stat-label">Happy Travelers</div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mission-section">
          <h3>Our Mission</h3>
          <p>
            At S4 Holidays, we believe travel is more than just visiting places – it's about creating 
            memories that last a lifetime. We specialize in all types of tour programs - whether it's 
            exploring domestic wonders, international adventures, spiritual pilgrimages, or group celebrations. 
            From planning to execution, we handle every detail of your travel dreams.
          </p>
        </div>

        {/* Services Banner */}
        <div className="services-banner">
          <h3>🌟 Complete Tour Services 🌟</h3>
          <p>
            <strong>We take ALL types of tour programs:</strong> Domestic explorations across India's diverse landscapes, 
            International adventures to global destinations, Sacred pilgrimage journeys, and memorable Group trips.
          </p>
        </div>
      </div>
    </section>
  );
}
