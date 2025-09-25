import { useState, useEffect, useRef } from 'react';
import './About.css';

const About = () => {
  const [activeDestination, setActiveDestination] = useState(0);
  const [globeRotation, setGlobeRotation] = useState({ x: -10, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isGlobeInteractive, setIsGlobeInteractive] = useState(true);
  const [visiblePins, setVisiblePins] = useState(new Set());
  const globeRef = useRef(null);

  // S4 Holidays Real Destinations
  const destinations = [
    {
      id: 'kerala',
      name: "Kerala",
      tagline: "God's Own Country",
      position: { x: 76.2, y: 15.3 },
      stories: 250,
      families: 180,
      color: "#4ECDC4",
      icon: "🌴",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      highlights: ["Backwaters", "Hill Stations", "Beaches", "Ayurveda"],
      testimonial: "Kerala with S4 was magical! The houseboats were amazing! - Sharma Family"
    },
    {
      id: 'rajasthan',
      name: "Rajasthan", 
      tagline: "Land of Kings",
      position: { x: 74.5, y: 27.0 },
      stories: 320,
      families: 280,
      color: "#FF6B6B", 
      icon: "🏰",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      highlights: ["Palaces", "Desert Safari", "Forts", "Culture"],
      testimonial: "Royal treatment in Rajasthan! Felt like kings and queens! - Patel Family"
    },
    {
      id: 'goa',
      name: "Goa",
      tagline: "Beach Paradise", 
      position: { x: 74.1, y: 15.3 },
      stories: 400,
      families: 350,
      color: "#FFE66D",
      icon: "🏖️",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      highlights: ["Beaches", "Water Sports", "Nightlife", "Seafood"],
      testimonial: "Perfect beach getaway! Kids loved the water sports! - Mehta Family"
    },
    {
      id: 'himachal',
      name: "Himachal Pradesh",
      tagline: "Dev Bhoomi",
      position: { x: 77.1, y: 31.1 },
      stories: 180,
      families: 120,
      color: "#A8E6CF",
      icon: "🏔️", 
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      highlights: ["Mountains", "Adventure", "Snow", "Trekking"],
      testimonial: "Breathtaking mountains! Adventure of a lifetime! - Singh Family"
    }
  ];

  // Handle mouse movement for globe rotation
  const handleGlobeMove = (e) => {
    if (!isGlobeInteractive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;
    
    setMousePos({ x: mouseX, y: mouseY });
    
    setGlobeRotation({
      x: -10 + (mouseY / centerY) * 15,
      y: (mouseX / centerX) * 20
    });
  };

  // Auto-rotate through destinations
  useEffect(() => {
    const interval = setInterval(() => {
      if (isGlobeInteractive) {
        setActiveDestination((prev) => (prev + 1) % destinations.length);
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isGlobeInteractive, destinations.length]);

  // Animate pins appearing
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisiblePins(new Set(destinations.map((_, index) => index)));
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [destinations]);

  return (
    <div className="s4-about-page">
      {/* Space Background */}
      <div className="s4-space-bg">
        <div className="s4-stars"></div>
      </div>

      {/* Hero Section */}
      <section className="s4-globe-hero">
        <div className="s4-hero-content">
          <div className="s4-hero-badge">
            <span className="s4-badge-glow"></span>
            <span className="s4-badge-text">🌍 Explore Our World</span>
          </div>
          
          <h1 className="s4-hero-title">
            Discovering India
            <br />
            <span className="s4-gradient-text">One Story at a Time</span>
          </h1>
          
          <p className="s4-hero-subtitle">
            From the backwaters of Kerala to the deserts of Rajasthan, explore how S4 Holidays has created 1300+ magical stories across incredible India.
          </p>
        </div>

        {/* Interactive Globe */}
        <div 
          className="s4-interactive-globe-container"
          onMouseMove={handleGlobeMove}
          onMouseEnter={() => setIsGlobeInteractive(true)}
          onMouseLeave={() => setIsGlobeInteractive(false)}
          ref={globeRef}
        >
          <div 
            className="s4-interactive-globe"
            style={{ 
              transform: `
                perspective(1000px)
                rotateX(${globeRotation.x}deg) 
                rotateY(${globeRotation.y}deg)
                scale(${isGlobeInteractive ? 1.05 : 1})
              `
            }}
          >
            <div className="s4-india-map-3d">
              {destinations.map((dest, index) => (
                <div
                  key={dest.id}
                  className={`s4-destination-pin ${
                    visiblePins.has(index) ? 's4-visible' : ''
                  } ${index === activeDestination ? 's4-active' : ''}`}
                  style={{
                    left: `${(dest.position.x - 68) * 1.8 + 50}%`,
                    top: `${(dest.position.y - 8) * 2.2 + 20}%`,
                    '--s4-pin-color': dest.color,
                    animationDelay: `${index * 0.3}s`
                  }}
                  onClick={() => setActiveDestination(index)}
                >
                  <div className="s4-pin-glow" style={{ backgroundColor: dest.color }}></div>
                  <div className="s4-pin-icon">
                    <span>{dest.icon}</span>
                  </div>
                  <div className="s4-pin-ripple"></div>
                  <div className={`s4-pin-info ${index === activeDestination ? 's4-show' : ''}`}>
                    <div className="s4-pin-info-content">
                      <h4>{dest.name}</h4>
                      <p>{dest.tagline}</p>
                      <div className="s4-pin-stats">
                        <span>{dest.families} Families</span>
                        <span>{dest.stories} Stories</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destination Navigation */}
      <section className="s4-destination-showcase">
        <div className="s4-showcase-container">
          <div className="s4-destination-navigation">
            {destinations.map((dest, index) => (
              <button
                key={dest.id}
                className={`s4-nav-dot ${index === activeDestination ? 's4-active' : ''}`}
                onClick={() => setActiveDestination(index)}
                style={{ '--s4-dot-color': dest.color }}
              >
                <span className="s4-dot-icon">{dest.icon}</span>
                <span className="s4-dot-name">{dest.name}</span>
              </button>
            ))}
          </div>

          {/* Active Destination Details */}
          <div className="s4-destination-details">
            {destinations.map((dest, index) => (
              <div
                key={dest.id}
                className={`s4-destination-card ${index === activeDestination ? 's4-active' : ''}`}
                style={{
                  transform: `
                    translateX(${(index - activeDestination) * 100}%)
                    scale(${index === activeDestination ? 1 : 0.9})
                  `,
                  opacity: Math.abs(index - activeDestination) <= 1 ? 1 : 0
                }}
              >
                <div className="s4-card-image">
                  <img src={dest.image} alt={dest.name} />
                  <div className="s4-image-overlay">
                    <div className="s4-overlay-icon" style={{ color: dest.color }}>
                      {dest.icon}
                    </div>
                  </div>
                </div>
                
                <div className="s4-card-content">
                  <div className="s4-destination-header">
                    <h3>{dest.name}</h3>
                    <p className="s4-tagline">{dest.tagline}</p>
                  </div>
                  
                  <div className="s4-highlights">
                    <h4>What makes it special:</h4>
                    <div className="s4-highlight-tags">
                      {dest.highlights.map((highlight, hIndex) => (
                        <span key={hIndex} className="s4-highlight-tag">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="s4-destination-stats">
                    <div className="s4-stat">
                      <span className="s4-stat-number">{dest.families}</span>
                      <span className="s4-stat-label">Happy Families</span>
                    </div>
                    <div className="s4-stat">
                      <span className="s4-stat-number">{dest.stories}</span>
                      <span className="s4-stat-label">Beautiful Stories</span>
                    </div>
                  </div>
                  
                  <blockquote className="s4-testimonial">
                    "{dest.testimonial}"
                  </blockquote>
                  
                  <button className="s4-explore-destination-btn" style={{ backgroundColor: dest.color }}>
                    <span>Explore {dest.name}</span>
                    <span className="s4-btn-icon">✈️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Stats */}
      <section className="s4-global-stats">
        <div className="s4-stats-container">
          <h2>Our Journey Across India</h2>
          <div className="s4-stats-grid">
            <div className="s4-stat-item">
              <div className="s4-stat-icon">👨‍👩‍👧‍👦</div>
              <div className="s4-stat-number">1090+</div>
              <div className="s4-stat-label">Families Served</div>
            </div>
            <div className="s4-stat-item">
              <div className="s4-stat-icon">📸</div>
              <div className="s4-stat-number">1500+</div>
              <div className="s4-stat-label">Stories Created</div>
            </div>
            <div className="s4-stat-item">
              <div className="s4-stat-icon">⭐</div>
              <div className="s4-stat-number">4.9</div>
              <div className="s4-stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="s4-globe-cta">
        <div className="s4-cta-content">
          <div className="s4-cta-icon">
            <span>🌟</span>
          </div>
          <h2>Ready to Create Your Story?</h2>
          <p>Join 1000+ families who discovered incredible India with S4 Holidays</p>
          
          <div className="s4-cta-buttons">
            <button className="s4-btn-primary">
              <span>🚀</span>
              Plan Your Adventure
            </button>
            <button className="s4-btn-secondary">
              <span>📋</span>
              Browse Destinations
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
