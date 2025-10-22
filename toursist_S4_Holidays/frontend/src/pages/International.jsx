import React, { useEffect, useState } from 'react';
import './International.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ContactIcons from '../components/ContactIcons';
import { fetchWithCache } from '../utils/fetchWithCache';
// ⚡ Simple cache utility


export default function International() {
  const [continentsData, setContinentsData] = useState([]);
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
    fetchContinentsData();
  }, []);

  const fetchContinentsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ⚡ Use cached fetch
      const data = await fetchWithCache(`${API_URL}/packages/grouped-by-continent`);
      
      const filteredData = data.filter(continent => continent.continent !== 'Unknown');
      setContinentsData(filteredData);
      console.log('Fetched continents data:', filteredData);
    } catch (error) {
      console.error('Error fetching continents data:', error);
      setError('Failed to load destinations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinentClick = (continentName) => {
    navigate(`/international/${continentName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <>
      <Helmet>
        <title>International Tour Packages | Europe, Asia, Middle East Tours | S4 Holidays</title>
        <meta name="description" content="Book international tour packages with S4 Holidays. Explore destinations across Europe, Asia, Middle East, Africa, and more. Customized travel packages with expert planning." />
        <meta name="keywords" content="international tours, Europe tour packages, Asia tours, Middle East travel, international vacation packages, overseas tours, foreign travel packages, world tour packages" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://s4holidays.com/international" />
        <meta property="og:title" content="International Tour Packages | S4 Holidays" />
        <meta property="og:description" content="Book international tour packages to Europe, Asia, Middle East and beyond with S4 Holidays" />
        <meta property="og:image" content="https://s4holidays.com/og-international.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://s4holidays.com/international" />
        <meta property="twitter:title" content="International Tour Packages | S4 Holidays" />
        
        <link rel="canonical" href="https://s4holidays.com/international" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "S4 Holidays - International Tours",
            "description": "International tour packages worldwide",
            "url": "https://s4holidays.com/international",
            "areaServed": ["Europe", "Asia", "Middle East", "Africa", "North America", "South America", "Oceania"]
          })}
        </script>
      </Helmet>

      <div className="international-tours">
        <section className="international-hero contain-hero">
          <div className="hero-content hero-chip">
            <div className="namaste-greeting">S4 HOLIDAYS</div>
            <h1 className="hero-title">
              <span className="english-text">International Tours</span>
            </h1>
          </div>
        </section>

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
              ) : error ? (
                <div className="error-message">
                  <div className="error-icon">⚠️</div>
                  <h3>Oops! Something went wrong</h3>
                  <p>{error}</p>
                  <button onClick={fetchContinentsData} className="retry-button">
                    Try Again
                  </button>
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
                      key={`${continent.continent}-${index}`}
                      className="continent-card"
                      onClick={() => handleContinentClick(continent.continent)}
                    >
                      <div className="continent-card-image">
                        <img
                                src={imgUrl}
                                alt={`${continent.continent} Tours`}
                                loading="lazy"
                                decoding="async"
                                width="400"
                                height="300"
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

        {/* <section className="features-section">
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
        </section> */}

        <section className="international-cta simple-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Explore the World?</h2>
              <p>Let us create unforgettable memories for you across continents</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
