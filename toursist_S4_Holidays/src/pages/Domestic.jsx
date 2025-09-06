import React, { useEffect, useState } from 'react';
import './Domestic.css';
import { useNavigate } from 'react-router-dom';

export default function Domestic() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Helper function to get correct image URL with backslash fix
  const getImageUrl = (imagePath) => {
    console.log('Original imagePath:', imagePath);
    
    if (!imagePath) {
      console.log('No image path, using placeholder');
      return 'https://via.placeholder.com/350x240/cccccc/666666?text=No+Image';
    }
    
    // Fix Windows backslashes to forward slashes
    const fixedPath = imagePath.replace(/\\/g, '/');
    console.log('Fixed path:', fixedPath);
    
    // If it's already a full URL, return as is
    if (fixedPath.startsWith('http')) {
      return fixedPath;
    }
    
    // Build full URL with server base
    const serverBase = 'http://localhost:5000';
    const fullUrl = `${serverBase}/${fixedPath}`;
    console.log('Built full URL:', fullUrl);
    return fullUrl;
  };

  useEffect(() => { 
    window.scrollTo(0, 0); 
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages/category/domestic`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
        console.log('Fetched domestic packages:', data);
      } else {
        console.error('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
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

      {/* Popular Destinations */}
      <section className="destinations-section">
        <div className="container">
          <h2 className="section-title">
            <span className="title-hindi">लोकप्रिय गंतव्य</span>
            <span className="title-english">Popular Destinations</span>
          </h2>

          <div className="destinations-grid">
            {loading ? (
              <div className="loading-spinner" style={{ 
                textAlign: 'center', 
                padding: '50px', 
                fontSize: '18px',
                gridColumn: '1 / -1' 
              }}>
                Loading domestic packages...
              </div>
            ) : packages.length === 0 ? (
              <div className="no-packages" style={{ 
                textAlign: 'center', 
                padding: '50px', 
                fontSize: '18px',
                gridColumn: '1 / -1' 
              }}>
                No domestic packages found. Add some packages in the admin panel!
              </div>
            ) : (
              packages.map((pkg) => (
                <div key={pkg._id} className="destination-card">
                  <div className="card-image">
                    <img
                      src={getImageUrl(pkg.cardImage || (pkg.images && pkg.images[0]))}
                      alt={pkg.title}
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src);
                        e.target.src = 'https://via.placeholder.com/350x240/cccccc/666666?text=Package+Image';
                      }}
                    />
                    <div className="region-badge">{pkg.category}</div>
                    <div className="rating-badge">
                      <span className="stars">⭐</span>
                      <span>4.8</span>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>{pkg.title}</h3>
                    <div className="card-details">
                      <div className="price">From {pkg.currency}{pkg.pricePerPerson.toLocaleString()}</div>
                      <div className="duration">
                        {pkg.itinerary && pkg.itinerary.length > 0 
                          ? `${pkg.itinerary.length} Days` 
                          : '7 Days'
                        }
                      </div>
                    </div>

                    {pkg.inclusions && pkg.inclusions.length > 0 && (
                      <div className="highlights">
                        {pkg.inclusions.slice(0, 3).map((inclusion, i) => (
                          <span key={i} className="highlight-tag">{inclusion}</span>
                        ))}
                      </div>
                    )}

                    <div className="best-time">
                      <span className="time-icon">🗓️</span>
                      Best Time: Oct-Mar
                    </div>

                        <button 
                          className="explore-btn"
                          onClick={() => navigate(`/package/${pkg._id}`)}
                        >
                          Explore Tour
                        </button>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

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
