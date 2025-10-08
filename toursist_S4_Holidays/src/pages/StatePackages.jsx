import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StatePackages.css';
import ContactIcons from '../components/ContactIcons';

export default function StatePackages() {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ SMART IP DETECTION - Works with ANY IP automatically!
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const currentIP = isLocalhost ? 'localhost' : window.location.hostname;

  const API_URL = import.meta.env.VITE_API_URL || `http://${currentIP}:5000/api`;
  const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || `http://${currentIP}:5000`;

  const FALLBACK = '/images/placeholder-card.jpg';

  // Convert URL param back to proper state name (e.g., "himachal-pradesh" -> "Himachal Pradesh")
  const getStateNameFromParam = (param) => {
    return param
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const displayStateName = getStateNameFromParam(stateName);

  // Build a usable URL only from string paths; otherwise return local fallback
  const getImageUrl = (path) => {
    if (typeof path !== 'string' || !path.trim()) return FALLBACK;
    const fixed = path.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(fixed)) return fixed;
    return `${SERVER_BASE}/${fixed.startsWith('/') ? fixed.slice(1) : fixed}`;
  };

  // Safely pick a primary image path from a package (string only)
  const pickPrimaryImagePath = (pkg) => {
    const fromCard = Array.isArray(pkg?.cardImage)
      ? pkg.cardImage.find(p => typeof p === 'string' && p.trim())
      : (typeof pkg?.cardImage === 'string' && pkg.cardImage.trim() ? pkg.cardImage : null);

    if (fromCard) return fromCard;

    const imgs = pkg?.images;
    if (Array.isArray(imgs)) {
      const first = imgs.find(p => typeof p === 'string' && p.trim());
      if (first) return first;
    } else if (typeof imgs === 'string' && imgs.trim()) {
      return imgs;
    }

    return null;
  };

  // Reusable local-fallback handler
  const applyFallback = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackagesByState();
  }, [stateName]);

  const fetchPackagesByState = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages/category/domestic`);
      if (response.ok) {
        const data = await response.json();
        
        // Filter packages by state name
        const filteredPackages = data.filter(pkg => 
          pkg.state && pkg.state.toLowerCase() === displayStateName.toLowerCase()
        );
        
        // Sort alphabetically by title
        const sortedPackages = filteredPackages.sort((a, b) => 
          a.title.localeCompare(b.title, undefined, { 
            sensitivity: 'base',
            numeric: true 
          })
        );
        
        setPackages(sortedPackages);
        console.log(`Fetched ${sortedPackages.length} packages for ${displayStateName}`);
      } else {
        console.error('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/domestic');
  };

  return (
    <div className="state-packages-container">
      {/* Hero Section with High-Res Background - NO BACK BUTTON */}
      <section className="state-hero">
        <div className="state-hero-content">
          <h1 className="state-title">{displayStateName}</h1>
          <p className="state-subtitle">
            {packages.length} {packages.length === 1 ? 'Package' : 'Packages'} Available
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="packages-section">
        <div className="container">
          <div className="packages-grid">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Loading packages...
              </div>
            ) : packages.length === 0 ? (
              <div className="no-packages">
                <div className="no-results-icon">🔍</div>
                <h3>No packages found</h3>
                <p>No packages available for {displayStateName} at the moment.</p>
                <button className="back-btn" onClick={handleGoBack}>
                  Back to All States
                </button>
              </div>
            ) : (
              packages.map((pkg) => {
                const primaryPath = pickPrimaryImagePath(pkg);
                const imgUrl = getImageUrl(primaryPath);

                return (
                  <div key={pkg._id} className="package-card">
                    <div className="package-card-image">
                      <img
                        src={imgUrl}
                        alt={pkg.title}
                        onError={applyFallback}
                      />
                    </div>

                    <div className="package-card-content">
                      <h3>{pkg.title}</h3>
                      <div className="package-card-details">
                        <div className="duration">
                          {pkg.itinerary && pkg.itinerary.length > 0
                            ? `${pkg.itinerary.length} Days`
                            : '7 Days'
                          }
                        </div>
                      </div>

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

      <ContactIcons />

      {/* CTA */}
      <section className="state-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore {displayStateName}?</h2>
            <p>Contact us to customize your perfect journey</p>
          </div>
        </div>
      </section>
    </div>
  );
}
