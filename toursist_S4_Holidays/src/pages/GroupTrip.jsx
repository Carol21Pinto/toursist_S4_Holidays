import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupTrip.css';

export default function GroupTrip() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroupType, setSelectedGroupType] = useState('family');
  const [groupSize, setGroupSize] = useState(4);
  const [activeActivity, setActiveActivity] = useState(0);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Helper function to get correct image URL with backslash fix
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/350x240/cccccc/666666?text=No+Image';
    const fixedPath = imagePath.replace(/\\/g, '/');
    if (fixedPath.startsWith('http')) return fixedPath;
    return `http://localhost:5000/${fixedPath}`;
  };

  // Scroll to top when component loads
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackages();
  }, []);

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

  // Group types with different pricing
  const groupTypes = [
    { 
      id: 'family', 
      name: 'Family Trips', 
      icon: '👨‍👩‍👧‍👦', 
      description: 'Perfect family bonding experiences',
      basePrice: 15000,
      color: '#ff6b6b'
    },
    { 
      id: 'friends', 
      name: 'Friends Getaway', 
      icon: '👥', 
      description: 'Adventure with your squad',
      basePrice: 12000,
      color: '#4ecdc4'
    },
    { 
      id: 'corporate', 
      name: 'Corporate Tours', 
      icon: '💼', 
      description: 'Team building & networking',
      basePrice: 18000,
      color: '#45b7d1'
    },
    { 
      id: 'wedding', 
      name: 'Wedding Groups', 
      icon: '💒', 
      description: 'Celebrate special moments',
      basePrice: 25000,
      color: '#f093fb'
    }
  ];

  // Group activities with animations
  const groupActivities = [
    {
      id: 1,
      title: 'Adventure Sports',
      icon: '🏄‍♂️',
      description: 'Thrilling activities like rafting, trekking, and paragliding',
      image: '/images/adventure.jpg'
    },
    {
      id: 2,
      title: 'Cultural Experiences',
      icon: '🎭',
      description: 'Local traditions, folk dances, and cultural immersion',
      image: '/images/culture.jpg'
    },
    {
      id: 3,
      title: 'Team Building',
      icon: '🤝',
      description: 'Games, workshops, and collaborative challenges',
      image: '/images/teambuilding.jpg'
    },
    {
      id: 4,
      title: 'Food Tours',
      icon: '🍽️',
      description: 'Culinary adventures and local cuisine experiences',
      image: '/images/food.jpg'
    }
  ];

  const formatPrice = (price, currency) => `From ${currency}${price.toLocaleString()}/person`;
  const formatDuration = (pkg) => {
    if (pkg.itinerary && pkg.itinerary.length > 0) {
      return `${pkg.itinerary.length} ${pkg.itinerary.length === 1 ? 'Day' : 'Days'}`;
    }
    return '4 Days';
  };

  // Calculate price based on group size and type
  const calculatePrice = () => {
    const selectedType = groupTypes.find(type => type.id === selectedGroupType);
    let basePrice = selectedType.basePrice;
    
    // Group size discounts
    if (groupSize >= 10) basePrice *= 0.85; // 15% discount
    else if (groupSize >= 6) basePrice *= 0.90; // 10% discount
    else if (groupSize >= 4) basePrice *= 0.95; // 5% discount
    
    return Math.round(basePrice);
  };

  // Auto-rotate activities
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveActivity((prev) => (prev + 1) % groupActivities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group-trip">
      {/* Hero Section */}
      <section className="group-hero">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="float-element">👥</div>
            <div className="float-element">🎉</div>
            <div className="float-element">🌟</div>
            <div className="float-element">🎒</div>
            <div className="float-element">📸</div>
          </div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-part">Group</span>
            <span className="title-part highlight">Adventures</span>
            <span className="title-part">Await!</span>
          </h1>
          <p className="hero-subtitle">
            Create unforgettable memories with your favorite people.
            <br />
            From family bonding to corporate retreats - we've got you covered!
          </p>
          
          <div className="hero-stats">
            <div className="stat-bubble">
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Groups</div>
            </div>
            <div className="stat-bubble">
              <div className="stat-number">50+</div>
              <div className="stat-label">Destinations</div>
            </div>
            <div className="stat-bubble">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Group Type Selector */}
      <section className="group-selector">
        <div className="container">
          <h2 className="section-title">Choose Your Group Type</h2>
          <div className="group-types">
            {groupTypes.map((type) => (
              <div 
                key={type.id}
                className={`group-type-card ${selectedGroupType === type.id ? 'active' : ''}`}
                onClick={() => setSelectedGroupType(type.id)}
                style={{ '--accent-color': type.color }}
              >
                <div className="type-icon">{type.icon}</div>
                <h3>{type.name}</h3>
                <p>{type.description}</p>
                <div className="base-price">From ₹{type.basePrice.toLocaleString()}/person</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Size Calculator */}
      <section className="group-calculator">
        <div className="container">
          <div className="calculator-card">
            <h2>Group Size & Pricing Calculator</h2>
            <div className="calculator-content">
              <div className="size-selector">
                <label>Number of People:</label>
                <div className="size-controls">
                  <button 
                    onClick={() => setGroupSize(Math.max(2, groupSize - 1))}
                    className="size-btn"
                  >
                    -
                  </button>
                  <span className="size-display">{groupSize}</span>
                  <button 
                    onClick={() => setGroupSize(Math.min(50, groupSize + 1))}
                    className="size-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="price-display">
                <div className="price-per-person">
                  <span className="price-label">Price per person:</span>
                  <span className="price-amount">₹{calculatePrice().toLocaleString()}</span>
                </div>
                <div className="total-price">
                  <span className="total-label">Total for {groupSize} people:</span>
                  <span className="total-amount">₹{(calculatePrice() * groupSize).toLocaleString()}</span>
                </div>
                
                {groupSize >= 4 && (
                  <div className="discount-badge">
                    🎉 {groupSize >= 10 ? '15%' : groupSize >= 6 ? '10%' : '5%'} Group Discount Applied!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Group Activities Showcase */}
      <section className="activities-showcase">
        <div className="container">
          <h2 className="section-title">Group Activities & Experiences</h2>
          <div className="activities-container">
            <div className="activity-tabs">
              {groupActivities.map((activity, index) => (
                <div 
                  key={activity.id}
                  className={`activity-tab ${activeActivity === index ? 'active' : ''}`}
                  onClick={() => setActiveActivity(index)}
                >
                  <span className="tab-icon">{activity.icon}</span>
                  <span className="tab-name">{activity.title}</span>
                </div>
              ))}
            </div>
            
            <div className="activity-content">
              <div className="activity-info">
                <h3>{groupActivities[activeActivity].title}</h3>
                <p>{groupActivities[activeActivity].description}</p>
              </div>
              <div className="activity-visual">
                <div className="activity-icon-large">
                  {groupActivities[activeActivity].icon}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Group Destinations */}
      <section className="group-destinations">
        <div className="container">
          <h2 className="section-title">Popular Group Destinations</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
              Loading group packages...
            </div>
          ) : packages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
              No group packages found. Add some packages in the admin panel!
            </div>
          ) : (
            <div className="destinations-grid">
              {packages.map((pkg) => (
                <div key={pkg._id} className="destination-card">
                  <div className="card-image">
                    <img 
                      src={getImageUrl(pkg.cardImage || (pkg.images && pkg.images[0]))} 
                      alt={pkg.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/350x240/cccccc/666666?text=Group+Destination';
                      }}
                    />
                    <div className="group-size-badge">6-15 people</div>
                  </div>
                  
                  <div className="card-content">
                    <h3>{pkg.title}</h3>
                    <div className="card-details">
                      <div className="price">{formatPrice(pkg.pricePerPerson, pkg.currency)}</div>
                      <div className="duration">{formatDuration(pkg)}</div>
                    </div>
                    
                    <div className="activities-list">
                      {pkg.inclusions && pkg.inclusions.slice(0, 3).map((inclusion, index) => (
                        <span key={index} className="activity-tag">{inclusion}</span>
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special Packages */}
      <section className="special-packages">
        <div className="container">
          <h2 className="section-title">Special Group Packages</h2>
          <div className="packages-grid">
            <div className="package-card premium">
              <div className="package-header">
                <h3>College Trip Special</h3>
                <div className="package-icon">🎓</div>
              </div>
              <div className="package-features">
                <ul>
                  <li>✨ Student-friendly pricing</li>
                  <li>🏨 Budget accommodations</li>
                  <li>🎉 Fun group activities</li>
                  <li>📸 Photography sessions</li>
                </ul>
              </div>
              <div className="package-price">Starting ₹8,000/person</div>
            </div>

            <div className="package-card premium">
              <div className="package-header">
                <h3>Corporate Retreat</h3>
                <div className="package-icon">🏢</div>
              </div>
              <div className="package-features">
                <ul>
                  <li>💼 Business facilities</li>
                  <li>🤝 Team building activities</li>
                  <li>🍽️ Conference dining</li>
                  <li>📊 Meeting arrangements</li>
                </ul>
              </div>
              <div className="package-price">Starting ₹20,000/person</div>
            </div>

            <div className="package-card premium">
              <div className="package-header">
                <h3>Wedding Group</h3>
                <div className="package-icon">👰‍♀️</div>
              </div>
              <div className="package-features">
                <ul>
                  <li>💒 Wedding venues</li>
                  <li>📷 Professional photography</li>
                  <li>🎊 Celebration arrangements</li>
                  <li>🚐 Group transportation</li>
                </ul>
              </div>
              <div className="package-price">Starting ₹35,000/person</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="group-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Plan Your Group Adventure?</h2>
            <p>Let's create memories that will last a lifetime!</p>
            <div className="cta-buttons">
              <button className="btn-primary">Get Group Quote</button>
              <button className="btn-secondary">Call Group Expert</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
