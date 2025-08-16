import React, { useState, useEffect } from 'react';
import './International.css';

export default function International() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePreview, setActivePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [packagesPerPage] = useState(6);

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Extended sample data - more packages for pagination demo
  const sampleDestinations = [
    {
      id: 1,
      name: 'Paris, France',
      image: '/images/paris.jpg',
      price: 85000,
      duration: 7,
      rating: 4.8,
      description: 'City of Light and Romance',
      currency: '₹'
    },
    {
      id: 2,
      name: 'Bali, Indonesia',
      image: '/images/bali.jpg',
      price: 65000,
      duration: 6,
      rating: 4.9,
      description: 'Tropical Paradise',
      currency: '₹'
    },
    {
      id: 3,
      name: 'Dubai, UAE',
      image: '/images/dubai.jpg',
      price: 55000,
      duration: 5,
      rating: 4.7,
      description: 'Modern Marvel',
      currency: '₹'
    },
    {
      id: 4,
      name: 'Tokyo, Japan',
      image: '/images/tokyo.jpg',
      price: 95000,
      duration: 8,
      rating: 4.8,
      description: 'Land of Rising Sun',
      currency: '₹'
    },
    {
      id: 5,
      name: 'London, UK',
      image: '/images/london.jpg',
      price: 90000,
      duration: 7,
      rating: 4.6,
      description: 'Royal Heritage',
      currency: '₹'
    },
    {
      id: 6,
      name: 'New York, USA',
      image: '/images/newyork.jpg',
      price: 110000,
      duration: 9,
      rating: 4.7,
      description: 'The Big Apple',
      currency: '₹'
    },
    {
      id: 7,
      name: 'Switzerland',
      image: '/images/switzerland.jpg',
      price: 120000,
      duration: 8,
      rating: 4.9,
      description: 'Alpine Paradise',
      currency: '₹'
    },
    {
      id: 8,
      name: 'Maldives',
      image: '/images/maldives.jpg',
      price: 150000,
      duration: 6,
      rating: 4.8,
      description: 'Island Paradise',
      currency: '₹'
    },
    {
      id: 9,
      name: 'Thailand',
      image: '/images/thailand.jpg',
      price: 45000,
      duration: 5,
      rating: 4.7,
      description: 'Land of Smiles',
      currency: '₹'
    },
    {
      id: 10,
      name: 'Australia',
      image: '/images/australia.jpg',
      price: 130000,
      duration: 10,
      rating: 4.6,
      description: 'Down Under Adventure',
      currency: '₹'
    },
    {
      id: 11,
      name: 'Italy',
      image: '/images/italy.jpg',
      price: 95000,
      duration: 8,
      rating: 4.8,
      description: 'Roman Legacy',
      currency: '₹'
    },
    {
      id: 12,
      name: 'Canada',
      image: '/images/canada.jpg',
      price: 105000,
      duration: 9,
      rating: 4.7,
      description: 'Great White North',
      currency: '₹'
    },
    {
      id: 13,
      name: 'Singapore',
      image: '/images/singapore.jpg',
      price: 75000,
      duration: 5,
      rating: 4.8,
      description: 'Garden City',
      currency: '₹'
    },
    {
      id: 14,
      name: 'South Korea',
      image: '/images/korea.jpg',
      price: 85000,
      duration: 7,
      rating: 4.7,
      description: 'Korean Culture',
      currency: '₹'
    }
  ];

  // Quick preview destinations for hero section
  const quickPreviews = [
    { name: 'Paris', icon: '🗼', position: { top: '20%', left: '15%' } },
    { name: 'Bali', icon: '🏝️', position: { top: '60%', left: '25%' } },
    { name: 'Dubai', icon: '🏗️', position: { top: '30%', right: '20%' } },
    { name: 'Tokyo', icon: '🗾', position: { top: '70%', right: '15%' } }
  ];

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setDestinations(sampleDestinations);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading destinations:', error);
      setLoading(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(destinations.length / packagesPerPage);
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = destinations.slice(indexOfFirstPackage, indexOfLastPackage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to destinations section
    document.querySelector('.destinations-section').scrollIntoView({ 
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
    const delta = 2; // Number of pages to show around current page
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

  const formatPrice = (price, currency = '₹') => {
    return `From ${currency}${price.toLocaleString()}`;
  };

  const formatDuration = (days) => {
    return `${days} ${days === 1 ? 'Day' : 'Days'}`;
  };

  return (
    <div className="international-tours">
      {/* Enhanced Hero Section */}
      <section className="hero-section">
        {/* Floating Particles */}
        <div className="floating-particles">
          <div className="particle particle-1">✈️</div>
          <div className="particle particle-2">🌍</div>
          <div className="particle particle-3">🧳</div>
          <div className="particle particle-4">📸</div>
          <div className="particle particle-5">🗺️</div>
          <div className="particle particle-6">🎒</div>
        </div>

        {/* Glass Morphism Overlay */}
        <div className="hero-glass-container">
          <div className="glass-card main-content">
            <h1 className="hero-title">International Tours</h1>
            <p className="hero-subtitle">
              Discover the world with our carefully curated international packages.
              <br />
              All flights, hotels, and guided tours included - Your global adventure awaits!
            </p>
            
            {/* Quick Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Countries</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Happy Travelers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>

          {/* Quick Preview Cards */}
          {quickPreviews.map((preview, index) => (
            <div 
              key={index}
              className="preview-card glass-card"
              style={preview.position}
              onClick={() => setActivePreview(activePreview === index ? null : index)}
            >
              <div className="preview-icon">{preview.icon}</div>
              <div className="preview-name">{preview.name}</div>
              
              {activePreview === index && (
                <div className="preview-details">
                  <div className="preview-price">From ₹55,000</div>
                  <div className="preview-duration">5-7 Days</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Animated Background Elements */}
        <div className="bg-elements">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>
      </section>

      {/* Destinations Section with Pagination */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular International Destinations</h2>
            <p className="section-subtitle">
              Explore our handpicked destinations around the globe
            </p>
            <div className="packages-info">
              <p>Showing {indexOfFirstPackage + 1}-{Math.min(indexOfLastPackage, destinations.length)} of {destinations.length} packages</p>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading destinations...</p>
            </div>
          ) : (
            <>
              <div className="destinations-grid">
                {currentPackages.map(destination => (
                  <div key={destination.id} className="destination-card">
                    <div className="card-image">
                      <img 
                        src={destination.image} 
                        alt={destination.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/350x240/cccccc/666666?text=Image+Not+Found';
                        }}
                      />
                      <div className="card-overlay">
                        <div className="rating">
                          <span className="stars">★★★★★</span>
                          <span className="rating-number">{destination.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-content">
                      <h3 className="destination-name">{destination.name}</h3>
                      <p className="destination-description">{destination.description}</p>
                      <div className="card-details">
                        <div className="price">{formatPrice(destination.price, destination.currency)}</div>
                        <div className="duration">{formatDuration(destination.duration)}</div>
                      </div>
                      <button 
                        className="explore-btn"
                        onClick={() => {
                          console.log(`Exploring package for ${destination.name}`);
                        }}
                      >
                        Explore Package
                      </button>
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
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✈️</div>
              <h3>Global Coverage</h3>
              <p>We cover 50+ countries worldwide with comprehensive travel packages</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎫</div>
              <h3>All-Inclusive Packages</h3>
              <p>Flights, hotels, meals, and guided tours all included in one price</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏆</div>
              <h3>Award-Winning Service</h3>
              <p>Recognized as the best international tour operator for 3 years running</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock assistance throughout your international journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore the World?</h2>
            <p>Let us create unforgettable memories for you across continents</p>
            <div className="cta-buttons">
              <button className="btn-primary">Plan My Trip</button>
              <button className="btn-secondary">Contact Expert</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
