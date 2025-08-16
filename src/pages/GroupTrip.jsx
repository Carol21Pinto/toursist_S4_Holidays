import React, { useState, useEffect } from 'react';
import './GroupTrip.css';

export default function GroupTrip() {
  const [selectedGroupType, setSelectedGroupType] = useState('family');
  const [groupSize, setGroupSize] = useState(4);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeActivity, setActiveActivity] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [destinationsPerPage] = useState(4); // Show 4 destinations per page

  // Scroll to top when component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Extended Popular group destinations for pagination
  const groupDestinations = [
    {
      id: 1,
      name: 'Goa Beach Resort',
      groupSize: '6-15 people',
      price: 'From ₹12,000/person',
      image: '/images/goa-group.jpg',
      activities: ['Beach Sports', 'Water Activities', 'Nightlife'],
      duration: '4 Days'
    },
    {
      id: 2,
      name: 'Manali Adventure Camp',
      groupSize: '8-20 people',
      price: 'From ₹15,000/person',
      image: '/images/manali-group.jpg',
      activities: ['Trekking', 'River Rafting', 'Camping'],
      duration: '5 Days'
    },
    {
      id: 3,
      name: 'Rajasthan Cultural Tour',
      groupSize: '10-25 people',
      price: 'From ₹18,000/person',
      image: '/images/rajasthan-group.jpg',
      activities: ['Palace Tours', 'Camel Safari', 'Folk Shows'],
      duration: '6 Days'
    },
    {
      id: 4,
      name: 'Kerala Houseboat Experience',
      groupSize: '4-12 people',
      price: 'From ₹20,000/person',
      image: '/images/kerala-group.jpg',
      activities: ['Backwater Cruise', 'Spice Tours', 'Ayurveda'],
      duration: '5 Days'
    },
    // Additional destinations for pagination
    {
      id: 5,
      name: 'Shimla Hill Station',
      groupSize: '6-18 people',
      price: 'From ₹14,000/person',
      image: '/images/shimla-group.jpg',
      activities: ['Toy Train', 'Mall Road', 'Snow Activities'],
      duration: '4 Days'
    },
    {
      id: 6,
      name: 'Agra Heritage Tour',
      groupSize: '8-22 people',
      price: 'From ₹16,000/person',
      image: '/images/agra-group.jpg',
      activities: ['Taj Mahal', 'Red Fort', 'Local Markets'],
      duration: '3 Days'
    },
    {
      id: 7,
      name: 'Rishikesh Spiritual Retreat',
      groupSize: '5-15 people',
      price: 'From ₹13,000/person',
      image: '/images/rishikesh-group.jpg',
      activities: ['Yoga Sessions', 'River Rafting', 'Temple Visits'],
      duration: '4 Days'
    },
    {
      id: 8,
      name: 'Jaipur Royal Experience',
      groupSize: '8-20 people',
      price: 'From ₹17,000/person',
      image: '/images/jaipur-group.jpg',
      activities: ['City Palace', 'Elephant Ride', 'Shopping'],
      duration: '4 Days'
    },
    {
      id: 9,
      name: 'Ooty Hill Station',
      groupSize: '6-16 people',
      price: 'From ₹15,500/person',
      image: '/images/ooty-group.jpg',
      activities: ['Toy Train', 'Tea Gardens', 'Lake Boating'],
      duration: '5 Days'
    },
    {
      id: 10,
      name: 'Andaman Island Adventure',
      groupSize: '8-18 people',
      price: 'From ₹25,000/person',
      image: '/images/andaman-group.jpg',
      activities: ['Scuba Diving', 'Beach Hopping', 'Water Sports'],
      duration: '6 Days'
    }
  ];

  // Pagination Logic
  const totalPages = Math.ceil(groupDestinations.length / destinationsPerPage);
  const indexOfLastDestination = currentPage * destinationsPerPage;
  const indexOfFirstDestination = indexOfLastDestination - destinationsPerPage;
  const currentDestinations = groupDestinations.slice(indexOfFirstDestination, indexOfLastDestination);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to destinations section
    document.querySelector('.group-destinations').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
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

      {/* Popular Group Destinations with Pagination */}
      <section className="group-destinations">
        <div className="container">
          <h2 className="section-title">Popular Group Destinations</h2>
          <div className="destinations-info">
            <p>Showing {indexOfFirstDestination + 1}-{Math.min(indexOfLastDestination, groupDestinations.length)} of {groupDestinations.length} destinations</p>
          </div>
          
          <div className="destinations-grid">
            {currentDestinations.map((destination) => (
              <div key={destination.id} className="destination-card">
                <div className="card-image">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/350x240/cccccc/666666?text=Group+Destination';
                    }}
                  />
                  <div className="group-size-badge">{destination.groupSize}</div>
                </div>
                
                <div className="card-content">
                  <h3>{destination.name}</h3>
                  <div className="card-details">
                    <div className="price">{destination.price}</div>
                    <div className="duration">{destination.duration}</div>
                  </div>
                  
                  <div className="activities-list">
                    {destination.activities.map((activity, index) => (
                      <span key={index} className="activity-tag">{activity}</span>
                    ))}
                  </div>
                  
                  <button className="book-group-btn">Book for Group</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination">
                {/* Previous Button */}
                <button 
                  className={`pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <span>‹</span> Previous
                </button>

                {/* Page Numbers */}
                <div className="page-numbers">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="pagination-dots">...</span>
                      ) : (
                        <button
                          className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                          onClick={() => paginate(page)}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Next Button */}
                <button 
                  className={`pagination-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next <span>›</span>
                </button>
              </div>
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
