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

  // ✅ SMART IP DETECTION - Works with ANY IP automatically!
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const currentIP = isLocalhost ? 'localhost' : window.location.hostname;

  const API_URL = import.meta.env.VITE_API_URL || `http://${currentIP}:5000/api`;
  const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || `http://${currentIP}:5000`;
  
  const FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTllY2VmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

  // Group types for filtering
  const groupTypes = ['Domestic', 'International', 'Pilgrimage'];

  const pickPrimaryImagePath = (pkg) => {
    console.log(`Picking image for ${pkg.title}:`, {
      cardImage: pkg.cardImage,
      images: pkg.images
    });

    const fromCard = Array.isArray(pkg?.cardImage)
      ? pkg.cardImage.find(p => typeof p === 'string' && p.trim())
      : (typeof pkg?.cardImage === 'string' && pkg.cardImage.trim() ? pkg.cardImage : null);

    if (fromCard) {
      console.log(`Using cardImage: ${fromCard}`);
      return fromCard;
    }

    const imgs = pkg?.images;
    if (Array.isArray(imgs)) {
      const first = imgs.find(p => typeof p === 'string' && p.trim());
      if (first) {
        console.log(`Using first image: ${first}`);
        return first;
      }
    } else if (typeof imgs === 'string' && imgs.trim()) {
      console.log(`Using images string: ${imgs}`);
      return imgs;
    }

    console.log(`No image found for ${pkg.title}, will use fallback`);
    return null;
  };

  const getImageUrl = (path) => {
    console.log(`Constructing URL for path: "${path}"`);
    console.log(`SERVER_BASE: "${SERVER_BASE}"`);
    
    if (typeof path !== 'string' || !path.trim()) {
      console.log(`Using fallback - invalid path`);
      return FALLBACK;
    }
    
    const fixed = path.replace(/\\/g, '/');
    
    if (/^https?:\/\//i.test(fixed)) {
      console.log(`Using external URL: ${fixed}`);
      return fixed;
    }
    
    const finalUrl = `${SERVER_BASE}/${fixed.startsWith('/') ? fixed.slice(1) : fixed}`;
    console.log(`Final constructed URL: ${finalUrl}`);
    
    return finalUrl;
  };

  const applyFallback = (e) => {
    console.log('Image failed to load:', e.currentTarget.src);
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK;
  };

  // Format departure dates for display (simplified)
  const formatDepartureDates = (dates) => {
    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return null;
    }

    const validDates = dates
      .filter(date => date && date.trim())
      .sort((a, b) => new Date(a) - new Date(b));

    if (validDates.length === 0) return null;

    const nextDate = validDates[0];
    const dateObj = new Date(nextDate);
    
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get total departure dates count
  const getDepartureDatesCount = (dates) => {
    if (!dates || !Array.isArray(dates)) return 0;
    return dates.filter(date => date && date.trim()).length;
  };

  // Strict filtering - only match exact groupType
  const isPackageInGroupType = (pkg, groupType) => {
    if (!groupType || groupType === '') return true;
    
    if (pkg.groupType) {
      return pkg.groupType.toLowerCase() === groupType.toLowerCase();
    }
    
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
        
        // ENHANCED DEBUG: Show detailed package information
        console.log('=== DETAILED PACKAGE DEBUG ===');
        console.log('Total packages fetched:', data.length);
        console.log('API_URL:', API_URL);
        console.log('SERVER_BASE:', SERVER_BASE);
        
        data.forEach((pkg, index) => {
          console.log(`\n--- Package ${index + 1}: ${pkg.title} ---`);
          console.log('Package ID:', pkg._id);
          console.log('cardImage:', pkg.cardImage);
          console.log('images:', pkg.images);
          console.log('category:', pkg.category);
          console.log('groupType:', pkg.groupType);
          console.log('pricePerPerson:', pkg.pricePerPerson);
          console.log('pricingMode:', pkg.pricingMode);
          console.log('priceText:', pkg.priceText);
          console.log('departureDates:', pkg.departureDates);
          
          // Test image URL construction
          const primaryPath = pickPrimaryImagePath(pkg);
          const imgUrl = getImageUrl(primaryPath);
          console.log('primaryPath:', primaryPath);
          console.log('Final imgUrl:', imgUrl);
        });
        
        console.log('=== END DETAILED DEBUG ===');
      } else {
        console.error('Failed to fetch group packages - Status:', response.status);
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
                  Group Destinations
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
                      
                      // Get departure dates info (simplified)
                      const formattedDate = formatDepartureDates(pkg.departureDates);
                      const totalDates = getDepartureDatesCount(pkg.departureDates);

                      // Format price display with debugging
                      const formatPrice = () => {
                        if (pkg.pricingMode === 'Text' && pkg.priceText) {
                          return pkg.priceText;
                        } else if (pkg.pricePerPerson) {
                          return `From ₹${pkg.pricePerPerson.toLocaleString()}/person`;
                        } else if (pkg.priceText) {
                          return pkg.priceText;
                        }
                        return 'Price on request';
                      };

                      return (
                        <div key={pkg._id} className="destination-card">
                          <div className="card-image">
                            <img
                              src={imgUrl}
                              alt={pkg.title}
                              onError={applyFallback}
                              style={{
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #e9ecef'
                              }}
                            />
                            {pkg.groupType && (
                              <div className="group-type-badge">{pkg.groupType}</div>
                            )}
                          </div>

                          <div className="card-content">
                            <h3>{pkg.title}</h3>
                            
                            {/* SIMPLIFIED: Duration, Price in one row */}
                            <div className="card-info">
                              <div className="duration-badge">{formatDuration(pkg)}</div>
                              <div className="price-info">{formatPrice()}</div>
                            </div>

                            {/* SIMPLIFIED: Departure dates (single line) */}
                            <div className="departure-info">
                              <span className="calendar-icon">📅</span>
                              {formattedDate ? (
                                <span className="date-text">
                                  {formattedDate}{totalDates > 1 && ` +${totalDates - 1} more`}
                                </span>
                              ) : (
                                <span className="date-text flexible">Flexible dates</span>
                              )}
                            </div>

                            <button
                              className="explore-btn"
                              onClick={() => navigate(`/package/${pkg._id}`)}
                            >
                              Explore Package
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
