import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './Pilgrimage.css';
import ContactIcons from '../components/ContactIcons';
import { fetchWithCache } from '../utils/fetchWithCache'; // ⚡ Import cache utility

export default function Pilgrimage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || "http://localhost:5000";

  const FALLBACK = '/images/placeholder-card.jpg';

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
      setError(null);
      
      // ⚡ Use cached fetch
      const data = await fetchWithCache(`${API_URL}/packages/category/pilgrimage`);
      
      setPackages(data);
      console.log('Fetched pilgrimage packages:', data);
    } catch (error) {
      console.error('Error fetching pilgrimage packages:', error);
      setError('Failed to load packages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (pkg) => {
    if (pkg.itinerary && pkg.itinerary.length > 0) {
      return `${pkg.itinerary.length} ${pkg.itinerary.length === 1 ? 'Day' : 'Days'}`;
    }
    return '7 Days';
  };

  return (
    <>
      <Helmet>
        <title>Pilgrimage Tour Packages | Religious Tours India & Worldwide | S4 Holidays</title>
        <meta name="description" content="Book spiritual pilgrimage tour packages with S4 Holidays. Explore sacred destinations including Varanasi, Tirupati, Mecca, Jerusalem, Vatican & more. Customized religious tours worldwide." />
        <meta name="keywords" content="pilgrimage tours, religious tours, spiritual tours, Varanasi tours, Tirupati tours, Char Dham yatra, Kailash Mansarovar, Mecca pilgrimage, Jerusalem tours, Vatican tours" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://s4holidays.com/pilgrimage" />
        <meta property="og:title" content="Pilgrimage Tour Packages | S4 Holidays" />
        <meta property="og:description" content="Book spiritual pilgrimage tour packages to sacred destinations worldwide" />
        <meta property="og:image" content="https://s4holidays.com/og-pilgrimage.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://s4holidays.com/pilgrimage" />
        <meta property="twitter:title" content="Pilgrimage Tour Packages | S4 Holidays" />
        
        <link rel="canonical" href="https://s4holidays.com/pilgrimage" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "S4 Holidays - Pilgrimage Tours",
            "description": "Spiritual pilgrimage tour packages worldwide",
            "url": "https://s4holidays.com/pilgrimage",
            "areaServed": "Worldwide"
          })}
        </script>
      </Helmet>

      <div className="pilgrimage-tours">
        <section className="sacred-hero">
          <div className="hero-content">
            <h2 className="hero-subtitle">S4 HOLIDAYS</h2>
            <h1 className="hero-title">Worldwide Pilgrimage Tours</h1>
          </div>
        </section>

        <section className="destinations-section">
          <div className="container">
            <h2 className="section-title">Sacred Destinations</h2>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Loading pilgrimage packages...
              </div>
            ) : error ? (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button onClick={fetchPackages} className="retry-button">
                  Try Again
                </button>
              </div>
            ) : packages.length === 0 ? (
              <div className="no-packages">
                <div className="no-results-icon">🕉️</div>
                <h3>No packages available</h3>
                <p>No pilgrimage packages found. Add some packages in the admin panel!</p>
              </div>
            ) : (
              <div className="destinations-grid">
                {packages.map((pkg) => {
                  const primaryPath = pickPrimaryImagePath(pkg);
                  const imgUrl = getImageUrl(primaryPath);
                  
                  return (
                    <div key={pkg._id} className="destination-card">
                      <div className="card-image">
                        {imgUrl ? (
                          <img 
                            src={imgUrl} 
                            alt={pkg.title} 
                            loading="lazy"
                            onError={applyFallback} 
                          />
                        ) : (
                          <div className="image-placeholder">Image coming soon</div>
                        )}
                      </div>

                      <div className="card-content">
                        <h3 className="destination-name">{pkg.title}</h3>

                        <div className="card-details">
                          <div className="duration">{formatDuration(pkg)}</div>
                        </div>

                        <button
                          className="pilgrimage-btn"
                          onClick={() => navigate(`/package/${pkg._id}`)}
                        >
                          Begin Sacred Journey
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        
        <ContactIcons />
        
        <section className="sacred-cta">
          <div className="container">
            <h2>Begin Your Sacred Journey</h2>
            <p>Experience divine blessings, inner peace, and spiritual awakening</p>
          </div>
        </section>
      </div>
    </>
  );
}
