import React, { useEffect, useState } from 'react';
import './Domestic.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ContactIcons from '../components/ContactIcons';
import { fetchWithCache } from '../utils/fetchWithCache';

// ⚡ Simple cache utility


export default function Domestic() {
  const [statesData, setStatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || "http://localhost:5000";

  const FALLBACK = '/images/placeholder-card.jpg';

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
    fetchStatesData();
  }, []);

  const fetchStatesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ⚡ Use cached fetch
      const data = await fetchWithCache(`${API_URL}/packages/grouped-by-state`);
      
      const filteredData = data.filter(state => state.state !== 'Unknown');
      setStatesData(filteredData);
      console.log('Fetched states data:', filteredData);
    } catch (error) {
      console.error('Error fetching states data:', error);
      setError('Failed to load destinations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStateClick = (stateName) => {
    navigate(`/domestic/${stateName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <>
      <Helmet>
        <title>Domestic Tour Packages India | Explore State-wise Travel | S4 Holidays</title>
        <meta name="description" content="Discover the best domestic tour packages across India. Explore state-wise travel packages including Kerala, Rajasthan, Himachal, Kashmir & more. Book affordable India tours with S4 Holidays." />
        <meta name="keywords" content="domestic tours India, state tour packages, India travel packages, domestic vacation, Kerala tours, Rajasthan tours, Himachal tours, Kashmir tours, India holiday packages" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://s4holidays.com/domestic" />
        <meta property="og:title" content="Domestic Tour Packages India | S4 Holidays" />
        <meta property="og:description" content="Explore the best domestic tour packages across India. Book state-wise travel packages with S4 Holidays." />
        <meta property="og:image" content="https://s4holidays.com/og-domestic.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://s4holidays.com/domestic" />
        <meta property="twitter:title" content="Domestic Tour Packages India | S4 Holidays" />
        <meta property="twitter:description" content="Explore the best domestic tour packages across India" />
        
        <link rel="canonical" href="https://s4holidays.com/domestic" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "S4 Holidays - Domestic Tours",
            "description": "Domestic tour packages across India",
            "url": "https://s4holidays.com/domestic",
            "areaServed": "India",
            "offers": {
              "@type": "AggregateOffer",
              "offerCount": statesData.length
            }
          })}
        </script>
      </Helmet>

      <div className="domestic-tours">
        <section className="indian-hero contain-hero">
          <div className="hero-content hero-chip">
            <div className="namaste-greeting">S4 HOLIDAYS</div>
            <h1 className="hero-title">
              <span className="english-text">Incredible India Tours</span>
            </h1>
          </div>
        </section>

        <section className="destinations-section">
          <div className="container">
            <h2 className="section-title">
              <span className="title-english">Domestic Holidays</span>
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
              ) : error ? (
                <div className="error-message">
                  <div className="error-icon">⚠️</div>
                  <h3>Oops! Something went wrong</h3>
                  <p>{error}</p>
                  <button onClick={fetchStatesData} className="retry-button">
                    Try Again
                  </button>
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
                      key={`${state.state}-${index}`}
                      className="state-card"
                      onClick={() => handleStateClick(state.state)}
                    >
                      <div className="state-card-image">
                        <img
                            src={imgUrl}
                            alt={`${state.state} Tours`}
                            loading="lazy"
                            decoding="async"
                            width="400"
                            height="300"
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

        <section className="indian-cta simple-cta">
          <div className="container">
            <div className="cta-content">
              <h2>
                <br />
                <span className="cta-english">Start Your India Journey Now</span>
              </h2>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
