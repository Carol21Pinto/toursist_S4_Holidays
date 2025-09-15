import React, { useEffect, useState } from 'react';
import './Domestic.css';
import { useNavigate } from 'react-router-dom';
import ContactIcons from '../components/ContactIcons';

export default function Domestic() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stateFilterExpanded, setStateFilterExpanded] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Constants
  const SERVER_BASE = 'http://localhost:5000';
  const FALLBACK = '/images/placeholder-card.jpg';

  // All 28 Indian States with their major cities/destinations
  const stateWithCities = {
    'Andhra Pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Amaravati'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Tezu', 'Seppa'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Barpeta', 'Kaziranga', 'Majuli'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Bodhgaya'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Calangute', 'Baga', 'Anjuna', 'Arambol', 'Colva'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Anand', 'Nadiad', 'Dwarka', 'Somnath'],
    'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Una', 'Bilaspur', 'Hamirpur', 'Kullu', 'Manali', 'Dalhousie', 'Kasauli'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar'],
    'Karnataka': ['Bangalore', 'Bengaluru', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Ooty', 'Coorg'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Malappuram', 'Kannur', 'Munnar', 'Alleppey', 'Wayanad', 'Thekkady'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Khajuraho'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Virar', 'Kolhapur', 'Lonavala', 'Mahabaleshwar'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Ukhrul', 'Senapati', 'Tamenglong'],
    'Meghalaya': ['Shillong', 'Tura', 'Cherrapunji', 'Jowai', 'Nongpoh', 'Baghmara', 'Williamnagar', 'Nongstoin'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Mamit', 'Lawngtlai'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Kiphire', 'Longleng', 'Peren', 'Mon'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Konark'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur', 'Batala', 'Pathankot', 'Moga'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pushkar', 'Jaisalmer'],
    'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Jorethang', 'Nayazangmu', 'Rangpo', 'Singtam'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Ranipet', 'Nagercoil', 'Thanjavur', 'Ooty', 'Kodaikanal'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahabubnagar', 'Nalgonda', 'Adilabad', 'Suryapet'],
    'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar', 'Belonia', 'Khowai', 'Pratapgarh', 'Ranir Bazar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad', 'Mathura', 'Ayodhya'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Nainital', 'Mussoorie', 'Jim Corbett'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda', 'Bardhaman', 'Barasat', 'Raiganj', 'Kharagpur', 'Darjeeling']
  };

  const indianStates = Object.keys(stateWithCities);

  // Enhanced filter function that matches state and cities
  const isPackageInState = (pkg, stateName) => {
    if (!stateName || stateName === '') return true;

    const searchTerms = [
      stateName.toLowerCase(),
      ...stateWithCities[stateName]?.map(city => city.toLowerCase()) || []
    ];

    const packageText = [
      pkg.title?.toLowerCase() || '',
      pkg.description?.toLowerCase() || '',
      pkg.state?.toLowerCase() || '',
      pkg.destination?.toLowerCase() || '',
      pkg.location?.toLowerCase() || '',
      pkg.city?.toLowerCase() || '',
      ...(pkg.highlights || []).map(h => h.toLowerCase()),
      ...(pkg.itinerary || []).map(day => 
        `${day.title?.toLowerCase() || ''} ${day.description?.toLowerCase() || ''} ${day.location?.toLowerCase() || ''}`
      ).join(' ')
    ].join(' ');

    // Check if any of the search terms (state name + cities) are found in package text
    return searchTerms.some(term => 
      packageText.includes(term) || 
      packageText.match(new RegExp(`\\b${term}\\b`, 'i'))
    );
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

  // Build a usable URL only from string paths; otherwise return local fallback
  const getImageUrl = (path) => {
    if (typeof path !== 'string' || !path.trim()) return FALLBACK;
    const fixed = path.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(fixed)) return fixed;
    return `${SERVER_BASE}/${fixed.startsWith('/') ? fixed.slice(1) : fixed}`;
  };

  // Reusable local-fallback handler
  const applyFallback = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [packages, selectedState]);

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

  const applyFilters = () => {
    let filtered = [...packages];

    // Filter by state using enhanced matching
    if (selectedState) {
      filtered = filtered.filter(pkg => isPackageInState(pkg, selectedState));
    }

    setFilteredPackages(filtered);
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    console.log(`Selected state: ${state}, filtering packages...`);
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    // Collapse the filter after selection
    if (state !== '') {
      setStateFilterExpanded(false);
    }
  };

  const toggleStateFilter = () => {
    setStateFilterExpanded(!stateFilterExpanded);
  };

  const clearFilters = () => {
    setSelectedState('');
    setStateFilterExpanded(false);
  };

  // Calculate package count for each state
  const getPackageCountForState = (stateName) => {
    if (stateName === '') return packages.length;
    return packages.filter(pkg => isPackageInState(pkg, stateName)).length;
  };

  const displayPackages = filteredPackages.length > 0 ? filteredPackages : packages;

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
          
          {selectedState && (
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
              <span className="filter-icon">🔍</span>
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
            {/* Expandable State Filter */}
            <div className="filter-section">
              <button 
                className={`filter-header ${stateFilterExpanded ? 'expanded' : ''}`}
                onClick={toggleStateFilter}
              >
                <div className="filter-header-content">
                  <span className="filter-title">Select State</span>
                  {selectedState && (
                    <span className="selected-filter">{selectedState}</span>
                  )}
                </div>
                <span className={`expand-icon ${stateFilterExpanded ? 'rotated' : ''}`}>
                  ▼
                </span>
              </button>

              <div className={`filter-content ${stateFilterExpanded ? 'expanded' : ''}`}>
                <div className="states-list">
                  {/* All States Option */}
                  <button
                    className={`state-option ${selectedState === '' ? 'active' : ''}`}
                    onClick={() => handleStateSelect('')}
                  >
                    <span className="state-name">All States</span>
                    <span className="package-count">({packages.length})</span>
                  </button>

                  {/* Individual States */}
                  {indianStates.map(state => {
                    const statePackageCount = getPackageCountForState(state);

                    return (
                      <button
                        key={state}
                        className={`state-option ${selectedState === state ? 'active' : ''} ${statePackageCount === 0 ? 'disabled' : ''}`}
                        onClick={() => handleStateSelect(state)}
                        disabled={statePackageCount === 0}
                      >
                        <span className="state-name">{state}</span>
                        <span className="package-count">({statePackageCount})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="content-area">
          {/* Popular Destinations */}
          <section className="destinations-section">
            <div className="container">
              <h2 className="section-title">
                <span className="title-hindi">लोकप्रिय गंतव्य</span>
                <span className="title-english">Popular Destinations</span>
                {selectedState && (
                  <span className="filter-info">
                    Showing results for: <strong>{selectedState}</strong> 
                    <span className="results-count">({displayPackages.length} packages found)</span>
                  </span>
                )}
              </h2>

              <div className="destinations-grid">
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    Loading domestic packages...
                  </div>
                ) : displayPackages.length === 0 ? (
                  <div className="no-packages">
                    <div className="no-results-icon">🔍</div>
                    <h3>No packages found</h3>
                    <p>
                      No packages found for <strong>{selectedState}</strong>. 
                      <br />
                      Try selecting a different state or view all packages!
                    </p>
                    <button className="reset-btn" onClick={clearFilters}>
                      View All Packages
                    </button>
                  </div>
                ) : (
                  displayPackages.map((pkg) => {
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
                          {selectedState && (
                            <div className="state-badge">{selectedState}</div>
                          )}
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
        </main>
      </div>

      <ContactIcons />

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
