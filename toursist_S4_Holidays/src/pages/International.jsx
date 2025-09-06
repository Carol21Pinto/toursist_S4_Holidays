import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './International.css';

export default function International() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Constants
  const SERVER_BASE = 'http://localhost:5000';
  const FALLBACK = '/images/placeholder-card.jpg';

  // Enhanced picker that handles strings AND objects
  const pickPrimaryImagePath = (pkg) => {
    const extractPath = (p) => {
      if (typeof p === 'string' && p.trim()) return p.trim();
      if (typeof p === 'object' && p) return p.url || p.path || null;
      return null;
    };

    const cardImage = pkg?.cardImage;
    if (Array.isArray(cardImage)) {
      for (const p of cardImage) {
        const path = extractPath(p);
        if (path) return path;
      }
    } else {
      const path = extractPath(cardImage);
      if (path) return path;
    }

    const imgs = pkg?.images;
    if (Array.isArray(imgs)) {
      for (const p of imgs) {
        const path = extractPath(p);
        if (path) return path;
      }
    } else {
      const path = extractPath(imgs);
      if (path) return path;
    }

    return null;
  };

  const getImageUrl = (path) => {
    if (typeof path !== 'string' || !path.trim()) return FALLBACK;
    const fixed = path.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(fixed)) return fixed;
    return `${SERVER_BASE}/${fixed.startsWith('/') ? fixed.slice(1) : fixed}`;
  };

  const applyFallback = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages/category/international`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
        console.log('Fetched international packages:', data);
      } else {
        console.error('Failed to fetch international packages');
      }
    } catch (error) {
      console.error('Error fetching international packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price, currency = '₹') => `From ${currency}${price.toLocaleString()}`;
  const formatDuration = (pkg) => {
    if (pkg.itinerary && pkg.itinerary.length > 0) {
      return `${pkg.itinerary.length} ${pkg.itinerary.length === 1 ? 'Day' : 'Days'}`;
    }
    return '7 Days';
  };

  return (
    
    <div className="international-tours">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-subtitle">S4 HOLIDAYS</h1>
          <h1 className="hero-title">International Tours</h1>
        </div>
      </section>

      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular International Destinations</h2>
            <p className="section-subtitle">Explore our handpicked destinations around the globe</p>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading international packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
              No international packages found. Add some packages in the admin panel!
            </div>
          ) : (
            <div className="destinations-grid">
              {packages.map(pkg => {
                const primaryPath = pickPrimaryImagePath(pkg);
                const imgUrl = getImageUrl(primaryPath);
                console.log('[IMG DEBUG]', pkg.title, { primaryPath, imgUrl });
                
                return (
                  <div key={pkg._id} className="destination-card">
                    <div className="card-image">
                      <img 
                        src={imgUrl}
                        alt={pkg.title}
                        onError={applyFallback}
                      />
                      <div className="card-overlay">
                        <div className="rating">
                          <span className="stars">★★★★★</span>
                          <span className="rating-number">4.8</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-content">
                      <h3 className="destination-name">{pkg.title}</h3>
                      <p className="destination-description">
                        {pkg.description ? pkg.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 'Explore this amazing destination'}
                      </p>
                      <div className="card-details">
                        <div className="price">{formatPrice(pkg.pricePerPerson, pkg.currency)}</div>
                        <div className="duration">{formatDuration(pkg)}</div>
                      </div>
                      <button 
                        className="explore-btn"
                        onClick={() => navigate(`/package/${pkg._id}`)}
                      >
                        Explore Package
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features & CTA Sections */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item"><div className="feature-icon">✈️</div><h3>Global Coverage</h3><p>We cover 50+ countries worldwide with comprehensive travel packages</p></div>
            <div className="feature-item"><div className="feature-icon">🎫</div><h3>All-Inclusive Packages</h3><p>Flights, hotels, meals, and guided tours all included in one price</p></div>
            <div className="feature-item"><div className="feature-icon">🏆</div><h3>Award-Winning Service</h3><p>Recognized as the best international tour operator for 3 years running</p></div>
            <div className="feature-item"><div className="feature-icon">📞</div><h3>24/7 Support</h3><p>Round-the-clock assistance throughout your international journey</p></div>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore the World?</h2>
            <p>Let us create unforgettable memories for you across continents</p>
            {/*<div className="cta-buttons">
              <button className="btn-primary">Plan My Trip</button>
              <button className="btn-secondary">Contact Expert</button>
            </div>*/}
          </div>
        </div>
      </section>
    </div>
  );
}
