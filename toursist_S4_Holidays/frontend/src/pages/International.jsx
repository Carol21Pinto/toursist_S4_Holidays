import React, { useEffect, useState } from 'react';
import './International.css';
import { useNavigate } from 'react-router-dom';
import ContactIcons from '../components/ContactIcons';

export default function International() {
  const [continentsData, setContinentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ SMART IP DETECTION - Works with ANY IP automatically!
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const currentIP = isLocalhost ? 'localhost' : window.location.hostname;

  const API_URL = import.meta.env.VITE_API_URL || `http://${currentIP}:5000/api`;
  const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || `http://${currentIP}:5000`;

  const FALLBACK = '/images/placeholder-card.jpg';

  // Build a usable URL only from string paths; otherwise return local fallback
  const getImageUrl = (path) => {
    if (typeof path !== 'string' || !path.trim()) return FALLBACK;
    const fixed = path.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(fixed)) return fixed;
    return `${SERVER_BASE}/${fixed.startsWith('/') ? fixed.slice(1) : fixed}`;
  };

  // Reusable local-fallback handler
  const applyFallback = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchContinentsData();
  }, []);

  const fetchContinentsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages/grouped-by-continent`);
      if (response.ok) {
        const data = await response.json();
        // Filter out "Unknown" continent from display
        const filteredData = data.filter(continent => continent.continent !== 'Unknown');
        setContinentsData(filteredData);
        console.log('Fetched continents data:', filteredData);
      } else {
        console.error('Failed to fetch continents data');
      }
    } catch (error) {
      console.error('Error fetching continents data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinentClick = (continentName) => {
    // Navigate to continent-specific packages page
    navigate(`/international/${continentName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="international-tours">
      {/* Hero Section */}
      <section className="international-hero contain-hero">
        <div className="hero-content hero-chip">
          <div className="namaste-greeting">S4 HOLIDAYS</div>
          <h1 className="hero-title">
            <span className="english-text">International Tours</span>
          </h1>
        </div>
      </section>

      {/* Main Content - Continent Cards */}
      <section className="destinations-section">
        <div className="container">
          <h2 className="section-title">
            <span className="title-english">Explore World Destinations</span>
          </h2>
          <p className="section-subtitle">
            Discover amazing destinations across continents with our curated tour packages!
          </p>

          <div className="continents-grid">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Loading destinations...
              </div>
            ) : continentsData.length === 0 ? (
              <div className="no-packages">
                <div className="no-results-icon">🌍</div>
                <h3>No destinations available</h3>
                <p>No international packages have been added yet. Check back soon!</p>
              </div>
            ) : (
              continentsData.map((continent, index) => {
                const imgUrl = getImageUrl(continent.image);

                return (
                  <div 
                    key={index} 
                    className="continent-card"
                    onClick={() => handleContinentClick(continent.continent)}
                  >
                    <div className="continent-card-image">
                      <img
                        src={imgUrl}
                        alt={continent.continent}
                        onError={applyFallback}
                      />
                    </div>

                    <div className="continent-card-content">
                      <h3 className="continent-name">{continent.continent}</h3>
                      <div className="continent-stats">
                        <span className="tour-count">{continent.tourCount} {continent.tourCount === 1 ? 'Tour' : 'Tours'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <ContactIcons />

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✈️</div>
              <h3>Global Coverage</h3>
              <p>We cover 50+ countries worldwide with comprehensive travel packages</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎫</div>
              <h3>All-Inclusive Packages</h3>
              <p>Flights, hotels, meals, and guided tours all included in one price</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏆</div>
              <h3>Award-Winning Service</h3>
              <p>Recognized as the best international tour operator for 3 years running</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock assistance throughout your international journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="international-cta simple-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore the World?</h2>
            <p>Let us create unforgettable memories for you across continents</p>
          </div>
        </div>
      </section>
    </div>
  );
}
