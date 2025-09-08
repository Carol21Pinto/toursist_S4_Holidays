import React, { useEffect, useState } from 'react';
import './Domestic.css';
import { useNavigate } from 'react-router-dom';

export default function Domestic() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Constants
  const SERVER_BASE = 'http://localhost:5000';
  const FALLBACK = '/images/placeholder-card.jpg'; // file in frontend/public/images [public path]

  // Safely pick a primary image path from a package (string only)
  const pickPrimaryImagePath = (pkg) => {
    // cardImage can be string or array
    const fromCard = Array.isArray(pkg?.cardImage)
      ? pkg.cardImage.find(p => typeof p === 'string' && p.trim())
      : (typeof pkg?.cardImage === 'string' && pkg.cardImage.trim() ? pkg.cardImage : null);

    if (fromCard) return fromCard;

    // images can be string or array
    const imgs = pkg?.images;
    if (Array.isArray(imgs)) {
      const first = imgs.find(p => typeof p === 'string' && p.trim());
      if (first) return first;
    } else if (typeof imgs === 'string' && imgs.trim()) {
      return imgs;
    }

    return null; // none found
  };

  // Build a usable URL only from string paths; otherwise return local fallback
  const getImageUrl = (path) => {
    if (typeof path !== 'string' || !path.trim()) return FALLBACK; // guard + fallback

    // Fix Windows backslashes safely (string only)
    const fixed = path.replace(/\\/g, '/');

    // If absolute URL, return as is
    if (/^https?:\/\//i.test(fixed)) return fixed;

    // If relative path from backend (e.g., uploads/abc.jpg)
    return `${SERVER_BASE}/${fixed.startsWith('/') ? fixed.slice(1) : fixed}`;
  };

  // Reusable local-fallback handler (never calls external DNS)
  const applyFallback = (e) => {
    e.currentTarget.onerror = null;       // prevent loop
    e.currentTarget.src = FALLBACK;       // local placeholder
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
              packages.map((pkg) => {
                const primaryPath = pickPrimaryImagePath(pkg);
                const imgUrl = getImageUrl(primaryPath);

                return (
                  <div key={pkg._id} className="destination-card">
                    <div className="card-image">
                      <img
                        src={imgUrl}
                        alt={pkg.title}
                        onError={applyFallback}
                      />
                      
                      
                    </div>

                    <div className="card-content">
                      <h3>{pkg.title}</h3>
                      <div className="card-details">
                      <div className="price-block">
                        <span className="label">From</span>
                        <div className="amount">{pkg.currency}{pkg.pricePerPerson.toLocaleString()}</div>
                      </div>
                      <div className="duration">
                        {pkg.itinerary && pkg.itinerary.length > 0
                          ? `${pkg.itinerary.length} Days`
                          : '7 Days'
                        }
                      </div>
                     </div>


                      

                      {/* <div className="best-time">
                        <span className="time-icon">🗓️</span>
                        Best Time: Oct-Mar
                      </div> */}

                      <button
                        className="explore-btn"
                        onClick={() => navigate(`/package/${pkg._id}`)}
                      >
                        Explore Tour
                      </button>
                    </div>
                  </div>
                );
              })
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
