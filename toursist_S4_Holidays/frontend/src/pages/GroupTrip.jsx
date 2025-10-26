import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './GroupTrip.css';
import ContactIcons from '../components/ContactIcons';
import { fetchWithCache } from '../utils/fetchWithCache';

export default function GroupTrip() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGroupType, setSelectedGroupType] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || "http://localhost:5000";
  
  const FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTllY2VmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

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

  const isPackageInGroupType = (pkg, groupType) => {
    if (!groupType || groupType === '') return true;
    
    if (pkg.groupType) {
      return pkg.groupType.toLowerCase() === groupType.toLowerCase();
    }
    
    return false;
  };

  const getPackageCountForGroupType = (groupType) => {
    if (groupType === '') return packages.length;
    return packages.filter(pkg => isPackageInGroupType(pkg, groupType)).length;
  };

  const getSortedGroupTypes = () => {
    return groupTypes
      .map(type => ({
        name: type,
        count: getPackageCountForGroupType(type)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const sortPackagesAlphabetically = (packagesArray) => {
    return [...packagesArray].sort((a, b) => {
      return a.title.localeCompare(b.title, undefined, { 
        sensitivity: 'base',
        numeric: true 
      });
    });
  };

  useEffect(() => {
  const savedType = localStorage.getItem('group_filter');
  if (savedType !== null && savedType !== undefined) {
    setSelectedGroupType(savedType);
  }
}, []);


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
      setError(null);
      
      const data = await fetchWithCache(`${API_URL}/packages/category/group`);
      
      const sortedData = sortPackagesAlphabetically(data);
      setPackages(sortedData);
      
      console.log('Group packages fetched:', sortedData.length);
    } catch (error) {
      console.error('Error fetching group packages:', error);
      setError('Failed to load packages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...packages];

    if (selectedGroupType) {
      filtered = filtered.filter(pkg => isPackageInGroupType(pkg, selectedGroupType));
    }

    const sortedFiltered = sortPackagesAlphabetically(filtered);
    setFilteredPackages(sortedFiltered);
  };

  const handleGroupTypeSelect = (type) => {
  setSelectedGroupType(type);
  localStorage.setItem('group_filter', type); // <-- Add this line
  console.log(`Selected group type: ${type}`);
  if (window.innerWidth < 768) {
    setSidebarOpen(false);
  }
};


  const clearFilters = () => {
    setSelectedGroupType('');
    setShowAllTypes(false);
    localStorage.removeItem('group_filter'); // <-- Add this line
  };

  const formatDuration = (pkg) =>
    (pkg.itinerary && pkg.itinerary.length > 0)
      ? `${pkg.itinerary.length} ${pkg.itinerary.length === 1 ? 'Day' : 'Days'}`
      : '4 Days';

  const displayPackages = sortPackagesAlphabetically(
    filteredPackages.length > 0 ? filteredPackages : packages
  );
  const sortedGroupTypes = getSortedGroupTypes();
  const visibleGroupTypes = showAllTypes ? sortedGroupTypes : sortedGroupTypes.slice(0, 3);

  return (
    <>
      <Helmet>
        <title>Group Tour Packages | Domestic, International & Pilgrimage Group Tours | S4 Holidays</title>
        <meta name="description" content="Book exciting group tour packages with S4 Holidays. Explore domestic, international, and pilgrimage group adventures. Perfect for families, friends, and corporate groups. Best group travel deals." />
        <meta name="keywords" content="group tours, group travel packages, group trips, family group tours, corporate group tours, group adventure trips, group travel deals, organized group tours" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://s4holidays.com/group" />
        <meta property="og:title" content="Group Tour Packages | S4 Holidays" />
        <meta property="og:description" content="Book exciting group tour packages for domestic, international, and pilgrimage adventures" />
        <meta property="og:image" content="https://s4holidays.com/og-group.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://s4holidays.com/group" />
        <meta property="twitter:title" content="Group Tour Packages | S4 Holidays" />
        
        <link rel="canonical" href="https://s4holidays.com/group" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "S4 Holidays - Group Tours",
            "description": "Group tour packages for domestic, international, and pilgrimage destinations",
            "url": "https://s4holidays.com/group",
            "offers": {
              "@type": "AggregateOffer",
              "offerCount": packages.length
            }
          })}
        </script>
      </Helmet>

      <div className="group-trip">
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

        <div className="main-content">
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

          {sidebarOpen && <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)}></div>}
          
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
              <div className="filter-section">
                <h4 className="filter-section-title">Select Group Type</h4>
                
                <div className="group-types-list">
                  <button
                    className={`group-type-option ${selectedGroupType === '' ? 'active' : ''}`}
                    onClick={() => handleGroupTypeSelect('')}
                  >
                    <span className="group-type-name">All Types</span>
                    <span className="package-count">({packages.length})</span>
                  </button>

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

          <main className="content-area">
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
                  <small className="sort-info"></small>
                </h2>

                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    Loading group packages...
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

                      const formatPrice = () => {
                        if (pkg.pricingMode === 'Text' && pkg.priceText) {
                          return pkg.priceText;
                        } else if (pkg.pricePerPerson) {
                          return ` ₹${pkg.pricePerPerson.toLocaleString()}/person`;
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
                              loading="lazy"
                              decoding="async"
                              width="400"
                              height="300"
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
                            
                            <div className="card-info">
                              <div className="duration-badge">{formatDuration(pkg)}</div>
                              <div className="price-info">{formatPrice()}</div>
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
      
      <footer className="simple-footer">
        <p>"The world is waiting — pack your bags!"</p>
      </footer>
    </>
  );
}
