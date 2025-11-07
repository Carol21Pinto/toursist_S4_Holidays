// src/components/PackageCard.jsx
import React from 'react';
import './PackageCard.css';
import { getDuration } from '../utils/durationHelper';

const PackageCard = ({ package: pkg, onExplore }) => {
  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000";
  
  // Image source with fallback
  const getImageSrc = () => {
    if (pkg.cardImage) {
      return pkg.cardImage.startsWith('http') 
        ? pkg.cardImage 
        : `${API_BASE}/${pkg.cardImage}`;
    }
    return '/images/placeholder-card.jpg'; // fallback image
  };

  const formatPrice = (price, currency) => {
    return `From ${currency}${price.toLocaleString()}`;
  };

  const formatDuration = (days) => {
    return `${days} ${days === 1 ? 'Day' : 'Days'}`;
  };

  return (
    <div className="package-card">
      <div className="card-image">
        <img 
          src={getImageSrc()} 
          alt={pkg.title}
          onError={(e) => {
            e.target.src = '/images/placeholder-card.jpg';
          }}
        />
        <div className="category-badge">{pkg.category}</div>
        <div className="rating-badge">
          <span className="stars">⭐</span>
          <span>4.8</span>
        </div>
      </div>
      
      <div className="card-content">
        <h3>{pkg.title}</h3>
        <div className="card-details">
          <div className="price">{formatPrice(pkg.pricePerPerson, pkg.currency)}</div>
          <div className="duration">{getDuration(pkg.title, pkg.duration)}</div>
        </div>
        
        {pkg.inclusions && pkg.inclusions.length > 0 && (
          <div className="highlights">
            {pkg.inclusions.slice(0, 3).map((inclusion, i) => (
              <span key={i} className="highlight-tag">{inclusion}</span>
            ))}
          </div>
        )}
        
        <button className="explore-btn" onClick={() => onExplore(pkg)}>
          Explore Tour
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
