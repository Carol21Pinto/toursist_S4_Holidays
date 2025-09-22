import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pilgrimage.css';
import ContactIcons from '../components/ContactIcons'; // adjust path if needed

export default function Pilgrimage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost 
  ? "http://localhost:5000/api"
  : "http://192.168.1.5:5000/api";  // Changed to .5

const SERVER_BASE = isLocalhost
  ? 'http://localhost:5000'
  : 'http://192.168.1.5:5000';      // Changed to .5
 
 
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
      const response = await fetch(`${API_URL}/packages/category/pilgrimage`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
        console.log('Fetched pilgrimage packages:', data);
      } else {
        console.error('Failed to fetch pilgrimage packages');
      }
    } catch (error) {
      console.error('Error fetching pilgrimage packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const religiousCategories = [
    { id: 'hindu', symbol: '🕉️' },
    { id: 'buddhist', symbol: '☸️' },
    { id: 'christian', symbol: '✝️' },
    { id: 'islamic', symbol: '☪️' },
    { id: 'sikh', symbol: '☬' },
    { id: 'jewish', symbol: '🔯' }
  ];
  
  const sacredExperiences = [
    { id: 1, title: 'Temple Worship', symbol: '🛕', description: 'Participate in sacred rituals and prayers' },
    { id: 2, title: 'Meditation Retreats', symbol: '🧘‍♀️', description: 'Find inner peace through guided meditation' },
    { id: 3, title: 'Sacred Ceremonies', symbol: '🕯️', description: 'Witness ancient religious ceremonies' },
    { id: 4, title: 'Spiritual Healing', symbol: '🙏', description: 'Experience traditional healing practices' }
  ];

  const formatPrice = (price, currency) => `From ${currency}${price.toLocaleString()}`;
  const formatDuration = (pkg) => {
    if (pkg.itinerary && pkg.itinerary.length > 0) {
      return `${pkg.itinerary.length} ${pkg.itinerary.length === 1 ? 'Day' : 'Days'}`;
    }
    return '7 Days';
  };

  return (
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
             <div className="loading-spinner">Loading pilgrimage packages...</div>
          ) : packages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
              No pilgrimage packages found. Add some packages in the admin panel!
            </div>
          ) : (
            <div className="destinations-grid">
              {packages.map((pkg) => {
                const primaryPath = pickPrimaryImagePath(pkg);
                const imgUrl = getImageUrl(primaryPath);
                console.log('[IMG DEBUG]', pkg.title, { primaryPath, imgUrl });
                
                return (
                  <div key={pkg._id} className="destination-card">
                  <div className="card-image">
                    {imgUrl ? (
                      <img src={imgUrl} alt={pkg.title} onError={applyFallback} />
                    ) : (
                      <div className="image-placeholder">Image coming soon</div>
                    )}
                  </div>

                  <div className="card-content">
                    <h3 className="destination-name">{pkg.title}</h3>

                    <div className="card-details">
                      <div className="price">
                        {/* <span className="from">From</span> */}
                        {/* <span className="amount">
                          {pkg.currency}{pkg.pricePerPerson.toLocaleString()}
                        </span> */}
                      </div>
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
  );
}
