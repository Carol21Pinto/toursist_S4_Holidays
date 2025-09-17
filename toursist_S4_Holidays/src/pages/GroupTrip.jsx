import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupTrip.css';
import ContactIcons from '../components/ContactIcons';

export default function GroupTrip() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroupType, setSelectedGroupType] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Safe image handling
  const SERVER_BASE = 'http://localhost:5000';
  const FALLBACK = '/images/placeholder-card.jpg';

  // Group types for filtering
  const groupTypes = ['Domestic', 'International', 'Pilgrimage'];

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

  // Strict filtering - only match exact groupType
  const isPackageInGroupType = (pkg, groupType) => {
    if (!groupType || groupType === '') return true;
    
    // Only return true if the groupType matches exactly
    if (pkg.groupType) {
      return pkg.groupType.toLowerCase() === groupType.toLowerCase();
    }
    
    // If no groupType is set, don't show it for any specific filter
    return false;
  };

  // Calculate package count for each group type
  const getPackageCountForGroupType = (groupType) => {
    if (groupType === '') return packages.length;
    return packages.filter(pkg => isPackageInGroupType(pkg, groupType)).length;
  };

  // Get sorted group types by package count (highest to lowest)
  const getSortedGroupTypes = () => {
    return groupTypes
      .map(type => ({
        name: type,
        count: getPackageCountForGroupType(type)
      }))
      .sort((a, b) => b.count - a.count);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [packages, selectedGroupType]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages/category/group`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
        console.log('Fetched group packages:', data);
      } else {
        console.error('Failed to fetch group packages');
      }
    } catch (error) {
      console.error('Error fetching group packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...packages];

    if (selectedGroupType) {
      filtered = filtered.filter(pkg => isPackageInGroupType(pkg, selectedGroupType));
    }

    setFilteredPackages(filtered);
  };

  const handleGroupTypeSelect = (type) => {
    setSelectedGroupType(type);
    console.log(`Selected group type: ${type}`);
    
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const clearFilters = () => {
    setSelectedGroupType('');
    setShowAllTypes(false);
  };

  const formatPrice = (price, currency) => `From ${currency}${price.toLocaleString()}/person`;
  const formatDuration = (pkg) =>
    (pkg.itinerary && pkg.itinerary.length > 0)
      ? `${pkg.itinerary.length} ${pkg.itinerary.length === 1 ? 'Day' : 'Days'}`
      : '4 Days';

  const displayPackages = filteredPackages.length > 0 ? filteredPackages : packages;
  const sortedGroupTypes = getSortedGroupTypes();
  const visibleGroupTypes = showAllTypes ? sortedGroupTypes : sortedGroupTypes.slice(0, 3);

  return (
    <>
      <div className="group-trip">
        {/* Hero Section */}
        <section className="group-hero">
          <div className="hero-background"></div>
          <div className="hero-content">
            <div className="hero-subtitle">S4 HOLIDAYS</div>
            <h1 className="hero-title">
              <span className="title-part">Group</span>
              <span className="title-part highlight">Adventures</span>
              <span className="title-part">Await!</span>
            </h1>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="main-content">
          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-toggle">
            <button 
              className="filter-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="filter-icon">⚙️</span>
              Sort & Filter
            </button>
            
            {selectedGroupType && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>

          {/* Sidebar Overlay for Mobile */}
          {sidebarOpen && <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)}></div>}
          
          {/* Left Sidebar Filter */}
          <aside className={`filter-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3 className="sidebar-title">
                <span className="filter-icon">👥</span>
                Filters
              </h3>
              <button 
                className="close-sidebar"
                onClick={() => setSidebarOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="sidebar-content">
              {/* Group Type Filter Section */}
              <div className="filter-section">
                <h4 className="filter-section-title">Select Group Type</h4>
                
                <div className="group-types-list">
                  {/* All Types Option */}
                  <button
                    className={`group-type-option ${selectedGroupType === '' ? 'active' : ''}`}
                    onClick={() => handleGroupTypeSelect('')}
                  >
                    <span className="group-type-name">All Types</span>
                    <span className="package-count">({packages.length})</span>
                  </button>

                  {/* Individual Group Types (Sorted by Package Count) */}
                  {visibleGroupTypes.map(type => (
                    <button
                      key={type.name}
                      className={`group-type-option ${selectedGroupType === type.name ? 'active' : ''} ${type.count === 0 ? 'disabled' : ''}`}
                      onClick={() => handleGroupTypeSelect(type.name)}
                      disabled={type.count === 0}
                    >
                      <span className="group-type-name">{type.name}</span>
                      <span className="package-count">({type.count})</span>
                    </button>
                  ))}

                  {/* Show More Button */}
                  {sortedGroupTypes.length > 3 && (
                    <button
                      className="show-more-btn"
                      onClick={() => setShowAllTypes(!showAllTypes)}
                    >
                      {showAllTypes ? 'Show less' : `Show more (${sortedGroupTypes.length - 3})`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="content-area">
            {/* Popular Group Destinations */}
            <section className="group-destinations">
              <div className="container">
                <h2 className="section-title">
                  Popular Group Destinations
                  {selectedGroupType && (
                    <span className="filter-info">
                      Showing results for: <strong>{selectedGroupType}</strong> 
                      <span className="results-count">({displayPackages.length} packages found)</span>
                    </span>
                  )}
                </h2>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
                    Loading group packages...
                  </div>
                ) : displayPackages.length === 0 ? (
                  <div className="no-packages">
                    <div className="no-results-icon">👥</div>
                    <h3>No packages found</h3>
                    <p>
                      {selectedGroupType ? (
                        <>
                          No packages found for <strong>{selectedGroupType}</strong>. 
                          <br />
                          Try selecting a different type or view all packages!
                        </>
                      ) : (
                        'No group packages found. Add some packages in the admin panel!'
                      )}
                    </p>
                    {selectedGroupType && (
                      <button className="reset-btn" onClick={clearFilters}>
                        View All Packages
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="destinations-grid">
                    {displayPackages.map((pkg) => {
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
                            <div className="group-size-badge">6-15 people</div>
                            {pkg.groupType && (
                              <div className="group-type-badge">{pkg.groupType}</div>
                            )}
                          </div>

                          <div className="card-content">
                            <h3>{pkg.title}</h3>
                            <div className="card-details">
                              <div className="price">
                                {formatPrice(pkg.pricePerPerson, pkg.currency)}
                              </div>
                              <div className="duration">{formatDuration(pkg)}</div>
                            </div>

                            <div className="activities-list">
                              {pkg.inclusions &&
                                pkg.inclusions.slice(0, 3).map((inclusion, index) => (
                                  <span key={index} className="activity-tag">
                                    {inclusion}
                                  </span>
                                ))}
                            </div>

                            <button
                              className="book-group-btn"
                              onClick={() => navigate(`/package/${pkg._id}`)}
                            >
                              Book for Group
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
      
      <ContactIcons />
      
      {/* Footer */}
      <footer className="simple-footer">
        <p>"The world is waiting — pack your bags!"</p>
      </footer>
    </>
  );
}
