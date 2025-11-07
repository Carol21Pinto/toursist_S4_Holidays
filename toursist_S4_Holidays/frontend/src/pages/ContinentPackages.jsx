import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ContinentPackages.css';
import ContactIcons from '../components/ContactIcons';
import { getDuration } from '../utils/durationHelper'; // ✅ NEW IMPORT

export default function ContinentPackages() {
  const { continentName } = useParams();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || "http://localhost:5000";

  const FALLBACK = '/images/placeholder-card.jpg';

  const getContinentNameFromParam = (param) => {
    return param
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const displayContinentName = getContinentNameFromParam(continentName);

  const getImageUrl = (path) => {
    if (typeof path !== 'string' || !path.trim()) return FALLBACK;
    const fixed = path.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(fixed)) return fixed;
    return `${SERVER_BASE}/${fixed.startsWith('/') ? fixed.slice(1) : fixed}`;
  };

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

  const applyFallback = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackagesByContinent();
  }, [continentName]);

  const fetchPackagesByContinent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages/category/international`);
      if (response.ok) {
        const data = await response.json();
        
        const filteredPackages = data.filter(pkg => 
          pkg.continent && pkg.continent.toLowerCase() === displayContinentName.toLowerCase()
        );
        
        const sortedPackages = filteredPackages.sort((a, b) => 
          a.title.localeCompare(b.title, undefined, { 
            sensitivity: 'base',
            numeric: true 
          })
        );
        
        setPackages(sortedPackages);
        console.log(`Fetched ${sortedPackages.length} packages for ${displayContinentName}`);
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
    navigate('/international');
  };

  return (
    <div className="continent-packages-container">
      {/* ✅ NEW: Simple Back Button */}
      <div className="back-button-container">
        <button className="simple-back-btn" onClick={handleGoBack}>
          ← Back
        </button>
      </div>

      {/* Hero Section */}
      <section className="continent-hero">
        <div className="continent-hero-content">
          <h1 className="continent-title">{displayContinentName}</h1>
          <p className="continent-subtitle">
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
                <p>No packages available for {displayContinentName} at the moment.</p>
                <button className="back-btn" onClick={handleGoBack}>
                  Back to All Continents
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
                        {/* ✅ FIXED: Dynamic duration */}
                        <div className="duration">
                          {getDuration(pkg.title, pkg.duration)}
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
      <section className="continent-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore {displayContinentName}?</h2>
            <p>Contact us to customize your perfect journey</p>
          </div>
        </div>
      </section>
    </div>
  );
}
