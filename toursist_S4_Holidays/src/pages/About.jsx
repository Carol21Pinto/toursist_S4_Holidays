import { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" id="about">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span>✨ Since 2020</span>
          </div>
          <h1 className="hero-title">
            We Don't Just Plan Trips
            <br />
            <span className="gradient-text">We Create Memories</span>
          </h1>
          <p className="hero-subtitle">
            At S4 Holidays, every journey tells a story. We believe travel isn't just about destinations—it's about the moments that take your breath away.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Happy Travelers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Destinations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5+</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section - Enhanced with Your Image */}
      <section className="our-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <div className="section-badge">
                <span>🏔️ Our Journey</span>
              </div>
              <h2>Born from Passion for Travel</h2>
              <p>
                S4 Holidays was born from a simple belief: everyone deserves to explore the world and create unforgettable memories. What started as a passion project in 2020 has grown into a trusted travel companion for families across India.
              </p>
              <p>
                We understand that travel is more than just visiting places—it's about experiencing new cultures, creating bonds, and collecting stories that last a lifetime.
              </p>
              <div className="story-features">
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Personalized Experiences</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏆</span>
                  <span>Award-Winning Service</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💝</span>
                  <span>Unforgettable Moments</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Image Section with Your Photo */}
            <div className="story-image-enhanced">
              <div className="image-container">
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Travel Planning" 
                  className="main-image"
                />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <h3>Planning Your Perfect Journey</h3>
                    <p>Every detail matters when creating your dream vacation</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="floating-badge badge-1">
                <span>📍 Expert Planning</span>
              </div>
              <div className="floating-badge badge-2">
                <span>📷 Capture Moments</span>
              </div>
              <div className="floating-badge badge-3">
                <span>🗺️ Custom Routes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Enhanced */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>💎 Our Values</span>
            </div>
            <h2>What Drives Us Every Day</h2>
            <p>Our core values shape every experience we create for our travelers</p>
          </div>
          
          <div className="values-grid">
            <div className="value-card enhanced">
              <div className="value-icon">
                <span>🤝</span>
              </div>
              <h3>Trust & Transparency</h3>
              <p>We believe in honest communication and transparent pricing. No hidden fees, no surprises—just genuine care for your travel dreams.</p>
              <div className="card-glow"></div>
            </div>
            
            <div className="value-card enhanced center-highlight">
              <div className="value-icon">
                <span>⭐</span>
              </div>
              <h3>Excellence in Service</h3>
              <p>From the moment you contact us to your safe return home, we're committed to providing exceptional service at every step.</p>
              <div className="card-glow"></div>
            </div>
            
            <div className="value-card enhanced">
              <div className="value-icon">
                <span>🌍</span>
              </div>
              <h3>Sustainable Travel</h3>
              <p>We care about the places we visit. Our tours support local communities and promote responsible tourism practices.</p>
              <div className="card-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon">
              <span>✈️</span>
            </div>
            <h2>Ready to Create Your Story?</h2>
            <p>Join thousands of happy travelers who trusted us with their dreams</p>
            <div className="cta-buttons">
              <button className="btn-primary">
                <span>🌟</span>
                Start Planning
              </button>
              <button className="btn-secondary">
                <span>📋</span>
                View Packages
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
