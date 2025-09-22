import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './International.css';
import ContactIcons from '../components/ContactIcons';

export default function International() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAllRegions, setShowAllRegions] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost 
  ? "http://localhost:5000/api"
  : "http://192.168.1.5:5000/api";  // Changed to .5

const SERVER_BASE = isLocalhost
  ? 'http://localhost:5000'
  : 'http://192.168.1.5:5000';      // Changed to .5
  
  
  const FALLBACK = '/images/placeholder-card.jpg';

  // Destinations list (only used for legacy text-search fallback)
  const internationalDestinations = {
    Asia: [
      'Thailand','Singapore','Malaysia','Indonesia','Vietnam','Cambodia','Philippines',
      'Bali','Phuket','Bangkok','Kuala Lumpur','Japan','South Korea','China',
      'Hong Kong','Taiwan','Tokyo','Seoul','Beijing','Shanghai',
      'Nepal','Bhutan','Sri Lanka','Maldives','Kathmandu','Colombo'
    ],
    Europe: [
      'Switzerland','France','Germany','Italy','Spain','Netherlands','Belgium',
      'Paris','Rome','Amsterdam','Barcelona','Zurich','UK','Ireland','Norway',
      'Sweden','Denmark','Finland','London','Dublin','Stockholm',
      'Czech Republic','Poland','Hungary','Croatia','Greece','Prague','Budapest','Athens'
    ],
    'North America': [
      'USA','Canada','Mexico','Costa Rica','Guatemala','New York','Los Angeles',
      'Toronto','Vancouver','Cancun'
    ],
    'Middle East': [
      'UAE','Qatar','Saudi Arabia','Oman','Jordan','Israel','Turkey',
      'Dubai','Abu Dhabi','Doha','Istanbul'
    ],
    Africa: [
      'South Africa','Egypt','Morocco','Kenya','Tanzania','Botswana','Namibia',
      'Cairo','Cape Town','Marrakech'
    ],
    Oceania: [
      'Australia','New Zealand','Fiji','Tahiti','Papua New Guinea',
      'Sydney','Melbourne','Auckland'
    ],
    'South America': [
      'Brazil','Argentina','Chile','Peru','Colombia','Ecuador','Bolivia',
      'Rio de Janeiro','Buenos Aires','Lima'
    ]
  };
  
  const regions = Object.keys(internationalDestinations);

  // Enhanced filter function
  const isPackageInRegion = (pkg, region) => {
    if (!region) return true;
    if (pkg.continent) return pkg.continent.toLowerCase() === region.toLowerCase();

    // Fallback text search for old records
    const haystack = (
      pkg.title + ' ' + pkg.description + ' ' +
      (pkg.destination || '') + ' ' + (pkg.location || '') + ' ' +
      (pkg.country || '') + ' ' + (pkg.city || '') + ' ' +
      (pkg.itinerary || []).map(d => `${d.title} ${d.description} ${d.location}`).join(' ')
    ).toLowerCase();

    return internationalDestinations[region]
      .map((d) => d.toLowerCase())
      .some((term) => haystack.includes(term));
  };

  // Calculate package count for each region
  const getPackageCountForRegion = (regionName) => {
    if (regionName === '') return packages.length;
    return packages.filter(pkg => isPackageInRegion(pkg, regionName)).length;
  };

  // Get sorted regions by package count (highest to lowest) - SHOW ALL REGIONS
  const getSortedRegions = () => {
    return regions
      .map(region => ({
        name: region,
        count: getPackageCountForRegion(region)
      }))
      .sort((a, b) => b.count - a.count); // Sort by count (highest first) - DON'T filter out 0-count regions
  };

  // Helper functions
  const pickPrimaryImagePath = (pkg) => {
    const extract = (p) =>
      typeof p === 'string' && p.trim()
        ? p.trim()
        : typeof p === 'object' && p
        ? p.url || p.path || null
        : null;

    const tryArr = (arr) => {
      if (Array.isArray(arr)) {
        for (const p of arr) {
          const res = extract(p);
          if (res) return res;
        }
      } else {
        const res = extract(arr);
        if (res) return res;
      }
      return null;
    };

    return tryArr(pkg.cardImage) || tryArr(pkg.images) || null;
  };

  const imgUrl = (p) => {
    if (!p || typeof p !== 'string') return FALLBACK;
    const fixed = p.replace(/\\/g, '/');
    return /^https?:\/\//i.test(fixed)
      ? fixed
      : `${SERVER_BASE}/${fixed.startsWith('/') ? fixed.slice(1) : fixed}`;
  };

  // Fetch packages
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/packages/category/international`);
        const data = res.ok ? await res.json() : [];
        setPackages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setFilteredPackages(
      selectedRegion
        ? packages.filter((p) => isPackageInRegion(p, selectedRegion))
        : packages
    );
  }, [packages, selectedRegion]);

  // UI handlers
  const clearFilters = () => {
    setSelectedRegion('');
    setShowAllRegions(false);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    console.log(`Selected region: ${region}, filtering packages...`);
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const displayPackages = filteredPackages.length > 0 ? filteredPackages : packages;
  const sortedRegions = getSortedRegions();
  const visibleRegions = showAllRegions ? sortedRegions : sortedRegions.slice(0, 5);

  console.log('Total regions:', sortedRegions.length);
  console.log('Visible regions:', visibleRegions.length);
  console.log('Show all regions:', showAllRegions);

  return (
    <div className="international-tours">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-subtitle">S4 HOLIDAYS</h1>
          <h1 className="hero-title">International Tours</h1>
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
          
          {selectedRegion && (
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
              <span className="filter-icon">🌍</span>
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
            {/* Region Filter Section */}
            <div className="filter-section">
              <h4 className="filter-section-title">Select Region</h4>
              
              <div className="regions-list">
                {/* All Regions Option */}
                <button
                  className={`region-option ${selectedRegion === '' ? 'active' : ''}`}
                  onClick={() => handleRegionSelect('')}
                >
                  <span className="region-name">All Regions</span>
                  <span className="package-count">({packages.length})</span>
                </button>

                {/* Individual Regions (Sorted by Package Count) */}
                {visibleRegions.map(region => (
                  <button
                    key={region.name}
                    className={`region-option ${selectedRegion === region.name ? 'active' : ''} ${region.count === 0 ? 'disabled' : ''}`}
                    onClick={() => handleRegionSelect(region.name)}
                    disabled={region.count === 0}
                  >
                    <span className="region-name">{region.name}</span>
                    <span className="package-count">({region.count})</span>
                  </button>
                ))}

                {/* Show More Button */}
                {sortedRegions.length > 5 && (
                  <button
                    className="show-more-btn"
                    onClick={() => setShowAllRegions(!showAllRegions)}
                  >
                    {showAllRegions ? 'Show less' : `Show more (${sortedRegions.length - 5})`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="content-area">
          <section className="destinations-section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title"> International Destinations</h2>
                <p className="section-subtitle">Explore our handpicked destinations around the globe</p>
                {selectedRegion && (
                  <div className="filter-info">
                    Showing results for: <strong>{selectedRegion}</strong> 
                    <span className="results-count">({displayPackages.length} packages found)</span>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner" />
                  <p>Loading international packages…</p>
                </div>
              ) : displayPackages.length === 0 ? (
                <div className="no-packages">
                  <div className="no-results-icon">🌍</div>
                  <h3>No packages found</h3>
                  <p>
                    No packages found for <strong>{selectedRegion}</strong>. 
                    <br />
                    Try selecting a different region or view all packages!
                  </p>
                  <button className="reset-btn" onClick={clearFilters}>
                    View All Packages
                  </button>
                </div>
              ) : (
                <div className="destinations-grid">
                  {displayPackages.map((pkg) => {
                    const img = imgUrl(pickPrimaryImagePath(pkg));
                    return (
                      <div key={pkg._id} className="destination-card">
                        <div className="card-image">
                          <img src={img} alt={pkg.title} onError={(e) => (e.currentTarget.src = FALLBACK)} />
                          {selectedRegion && (
                            <div className="region-badge">{selectedRegion}</div>
                          )}
                        </div>
                        <div className="card-content">
                          <h3 className="destination-name">{pkg.title}</h3>
                          <div className="card-details">
                            <div className="price">
                              {/* <span className="from">From</span>
                              <span className="amount">
                                {pkg.currency}{pkg.pricePerPerson.toLocaleString()}
                              </span> */}
                            </div>
                            <div className="duration">
                              {pkg.itinerary?.length ? `${pkg.itinerary.length} Days` : '7 Days'}
                            </div>
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

      <ContactIcons />

      {/* Features & CTA Sections */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item"><div className="feature-icon">✈️</div><h3>Global Coverage</h3><p>We cover 50+ countries worldwide with comprehensive travel packages</p></div>
            <div className="feature-item"><div className="feature-icon">🎫</div><h3>All-Inclusive Packages</h3><p>Flights, hotels, meals, and guided tours all included in one price</p></div>
            <div className="feature-item"><div className="feature-icon">🏆</div><h3>Award-Winning Service</h3><p>Recognized as the best international tour operator for 3 years running</p></div>
            <div className="feature-item"><div className="feature-icon">📞</div><h3>24/7 Support</h3><p>Round-the-clock assistance throughout your international journey</p></div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore the World?</h2>
            <p>Let us create unforgettable memories for you across continents</p>
          </div>
        </div>
      </section>
    </div>
  );
}
