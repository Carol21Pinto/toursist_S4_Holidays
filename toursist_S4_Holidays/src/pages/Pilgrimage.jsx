import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pilgrimage.css';

export default function Pilgrimage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Helper function to get correct image URL with backslash fix
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/350x240/cccccc/666666?text=No+Image';
    const fixedPath = imagePath.replace(/\\/g, '/');
    if (fixedPath.startsWith('http')) return fixedPath;
    return `http://localhost:5000/${fixedPath}`;
  };

  // Scroll to top when component loads
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
      {/* Hero Section */}
      <section className="sacred-hero">
        <div className="hero-content">
          <h1 className="hero-title">Worldwide Pilgrimage Tours</h1>
        </div>
      </section>

      {/* Sacred Experiences */}
      <section className="sacred-experiences">
        <div className="container">
          <h2 className="section-title">Spiritual Experiences</h2>
          <div className="experiences-grid">
            {sacredExperiences.map((experience) => (
              <div key={experience.id} className="experience-card">
                <div className="experience-symbol">{experience.symbol}</div>
                <h3>{experience.title}</h3>
                <p>{experience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Destinations */}
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
              {packages.map((pkg) => (
                <div key={pkg._id} className="destination-card">
                  <div className="card-image">
                    <img 
                      src={getImageUrl(pkg.cardImage || (pkg.images && pkg.images[0]))}
                      alt={pkg.title}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/350x240/D4AF37/FFFFFF?text=Sacred+Site'; }}
                    />
                    <div className="faith-badge">🕉️</div>
                    <div className="rating-badge">⭐ 4.8</div>
                  </div>
                  <div className="card-content">
                    <h3>{pkg.title}</h3>
                    <div className="sacred-name">{pkg.title}</div>
                    <div className="card-details">
                      <div className="price">{formatPrice(pkg.pricePerPerson, pkg.currency)}</div>
                      <div className="duration">{formatDuration(pkg)}</div>
                    </div>
                    <div className="highlights">
                      {pkg.inclusions && pkg.inclusions.slice(0, 3).map((inclusion, index) => (
                        <span key={index} className="highlight-tag">{inclusion}</span>
                      ))}
                    </div>
                    <button 
                      className="pilgrimage-btn"
                      onClick={() => navigate(`/package/${pkg._id}`)}
                    >
                      Begin Sacred Journey
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="sacred-cta">
        <div className="container">
          <h2>Begin Your Sacred Journey</h2>
          <p>Experience divine blessings, inner peace, and spiritual awakening</p>
          <div className="cta-buttons">
            <button className="btn-primary">Plan Pilgrimage</button>
            <button className="btn-secondary">Contact Expert</button>
          </div>
        </div>
      </section>
    </div>
  );
}
