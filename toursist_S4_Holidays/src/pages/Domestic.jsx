import React, { useEffect, useState } from 'react';
import './Domestic.css';
import { useNavigate } from 'react-router-dom';
import ContactIcons from '../components/ContactIcons';

export default function Domestic() {
  const [statesData, setStatesData] = useState([]);
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
    fetchStatesData();
  }, []);

  const fetchStatesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages/grouped-by-state`);
      if (response.ok) {
        const data = await response.json();
        // Filter out "Unknown" state from display
        const filteredData = data.filter(state => state.state !== 'Unknown');
        setStatesData(filteredData);
        console.log('Fetched states data:', filteredData);
      } else {
        console.error('Failed to fetch states data');
      }
    } catch (error) {
      console.error('Error fetching states data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStateClick = (stateName) => {
    // Navigate to state-specific packages page
    navigate(`/domestic/${stateName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="domestic-tours">
      {/* Hero Section */}
      <section className="indian-hero contain-hero">
        <div className="hero-content hero-chip">
          <div className="namaste-greeting">S4 HOLIDAYS</div>
          <h1 className="hero-title">
            <span className="hindi-text">भारत भ्रमण</span>
            <span className="english-text">Incredible India Tours</span>
          </h1>
        </div>
      </section>

      {/* Main Content - State Cards */}
      <section className="destinations-section">
        <div className="container">
          <h2 className="section-title">
            <span className="title-hindi">लोकप्रिय गंतव्य</span>
            <span className="title-english">Trending Group Holidays</span>
          </h2>
          <p className="section-subtitle">
            Discover iconic destinations across India and the world with our group tours!
          </p>

          <div className="states-grid">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Loading destinations...
              </div>
            ) : statesData.length === 0 ? (
              <div className="no-packages">
                <div className="no-results-icon">🔍</div>
                <h3>No destinations available</h3>
                <p>No domestic packages have been added yet. Check back soon!</p>
              </div>
            ) : (
              statesData.map((state, index) => {
                const imgUrl = getImageUrl(state.image);

                return (
                  <div 
                    key={index} 
                    className="state-card"
                    onClick={() => handleStateClick(state.state)}
                  >
                    <div className="state-card-image">
                      <img
                        src={imgUrl}
                        alt={state.state}
                        onError={applyFallback}
                      />
                    </div>

                    <div className="state-card-content">
                      <h3 className="state-name">{state.state}</h3>
                      <div className="state-stats">
                        <span className="tour-count">{state.tourCount} {state.tourCount === 1 ? 'Tour' : 'Tours'}</span>
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

      {/* CTA */}
      <section className="indian-cta simple-cta">
        <div className="container">
          <div className="cta-content">
            <h2>
              <span className="cta-hindi">अपनी भारत यात्रा शुरू करें</span>
              <br />
              <span className="cta-english">Start Your India Journey Now</span>
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
