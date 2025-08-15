import React, { useState, useEffect } from 'react';
import './Domestic.css';

export default function Domestic() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [destinationsPerPage] = useState(6);

  // Scroll to top when component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Indian regions
  const indianRegions = [
    { id: 'all', name: 'All India', icon: '🇮🇳', color: '#FF9933' },
    { id: 'north', name: 'North India', icon: '🏔️', color: '#138808' },
    { id: 'south', name: 'South India', icon: '🌴', color: '#FF6B35' },
    { id: 'west', name: 'West India', icon: '🏖️', color: '#4A90E2' },
    { id: 'east', name: 'East India', icon: '🌸', color: '#E74C3C' },
    { id: 'central', name: 'Central India', icon: '🐅', color: '#9B59B6' }
  ];

  // Seasonal tours
  const seasonalTours = [
    {
      id: 'summer',
      name: 'Summer Escapes',
      icon: '☀️',
      months: 'Mar-Jun',
      destinations: ['Shimla', 'Manali', 'Kashmir', 'Ooty'],
      color: '#FF6B35'
    },
    {
      id: 'monsoon',
      name: 'Monsoon Magic',
      icon: '🌧️', 
      months: 'Jul-Sep',
      destinations: ['Kerala', 'Goa', 'Udaipur', 'Munnar'],
      color: '#4A90E2'
    },
    {
      id: 'winter',
      name: 'Winter Wonders',
      icon: '❄️',
      months: 'Oct-Feb', 
      destinations: ['Rajasthan', 'Gujarat', 'Tamil Nadu', 'Karnataka'],
      color: '#9B59B6'
    }
  ];

  // Festival tours
  const festivalTours = [
    { name: 'Diwali Special', icon: '🪔', destination: 'Varanasi', color: '#FFD700' },
    { name: 'Holi Celebration', icon: '🎨', destination: 'Mathura', color: '#FF69B4' },
    { name: 'Dussehra Festival', icon: '🏹', destination: 'Mysore', color: '#FF4500' },
    { name: 'Durga Puja', icon: '🙏', destination: 'Kolkata', color: '#DC143C' }
  ];

  // Extended destinations for pagination
  const domesticDestinations = [
    {
      id: 1,
      name: 'Rajasthan Royal Tour',
      region: 'north',
      price: 'From ₹15,000',
      duration: '7 Days',
      image: '/images/rajasthan.jpg',
      highlights: ['Jaipur Palace', 'Udaipur Lakes', 'Jaisalmer Fort'],
      bestTime: 'Oct-Mar',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Kerala Backwaters',
      region: 'south',
      price: 'From ₹12,000',
      duration: '6 Days',
      image: '/images/kerala.jpg',
      highlights: ['Houseboat Cruise', 'Spice Gardens', 'Ayurveda'],
      bestTime: 'Oct-Feb',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Goa Beach Paradise',
      region: 'west',
      price: 'From ₹8,000',
      duration: '4 Days',
      image: '/images/goa.jpg',
      highlights: ['Beach Shacks', 'Water Sports', 'Nightlife'],
      bestTime: 'Nov-Feb',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Himachal Adventure',
      region: 'north',
      price: 'From ₹18,000',
      duration: '8 Days',
      image: '/images/himachal.jpg',
      highlights: ['Rohtang Pass', 'Solang Valley', 'Mall Road'],
      bestTime: 'Apr-Jun',
      rating: 4.8
    },
    {
      id: 5,
      name: 'Tamil Nadu Temples',
      region: 'south',
      price: 'From ₹14,000',
      duration: '6 Days',
      image: '/images/tamilnadu.jpg',
      highlights: ['Meenakshi Temple', 'Rameshwaram', 'Kanyakumari'],
      bestTime: 'Nov-Mar',
      rating: 4.6
    },
    {
      id: 6,
      name: 'Kashmir Valley',
      region: 'north',
      price: 'From ₹22,000',
      duration: '7 Days',
      image: '/images/kashmir.jpg',
      highlights: ['Dal Lake', 'Gulmarg', 'Pahalgam'],
      bestTime: 'May-Sep',
      rating: 4.9
    },
    {
      id: 7,
      name: 'West Bengal Culture',
      region: 'east',
      price: 'From ₹11,000',
      duration: '5 Days',
      image: '/images/westbengal.jpg',
      highlights: ['Victoria Memorial', 'Sundarbans', 'Darjeeling'],
      bestTime: 'Oct-Mar',
      rating: 4.5
    },
    {
      id: 8,
      name: 'Madhya Pradesh Wildlife',
      region: 'central',
      price: 'From ₹16,000',
      duration: '6 Days',
      image: '/images/madhyapradesh.jpg',
      highlights: ['Kanha National Park', 'Khajuraho', 'Sanchi'],
      bestTime: 'Oct-Apr',
      rating: 4.7
    },
    {
      id: 9,
      name: 'Gujarat Heritage',
      region: 'west',
      price: 'From ₹13,000',
      duration: '6 Days',
      image: '/images/gujarat.jpg',
      highlights: ['Rann of Kutch', 'Somnath', 'Dwarka'],
      bestTime: 'Nov-Feb',
      rating: 4.6
    },
    {
      id: 10,
      name: 'Karnataka Wonders',
      region: 'south',
      price: 'From ₹15,500',
      duration: '7 Days',
      image: '/images/karnataka.jpg',
      highlights: ['Mysore Palace', 'Hampi Ruins', 'Coorg Hills'],
      bestTime: 'Oct-Mar',
      rating: 4.8
    },
    {
      id: 11,
      name: 'Uttarakhand Spiritual',
      region: 'north',
      price: 'From ₹17,000',
      duration: '8 Days',
      image: '/images/uttarakhand.jpg',
      highlights: ['Rishikesh', 'Haridwar', 'Valley of Flowers'],
      bestTime: 'Apr-Jun',
      rating: 4.7
    },
    {
      id: 12,
      name: 'Odisha Golden Triangle',
      region: 'east',
      price: 'From ₹12,500',
      duration: '6 Days',
      image: '/images/odisha.jpg',
      highlights: ['Jagannath Temple', 'Konark Sun Temple', 'Chilika Lake'],
      bestTime: 'Oct-Mar',
      rating: 4.5
    }
  ];

  // Filter destinations based on region
  const filteredDestinations = selectedRegion === 'all' 
    ? domesticDestinations 
    : domesticDestinations.filter(dest => dest.region === selectedRegion);

  // Pagination logic
  const totalPages = Math.ceil(filteredDestinations.length / destinationsPerPage);
  const indexOfLastDestination = currentPage * destinationsPerPage;
  const indexOfFirstDestination = indexOfLastDestination - destinationsPerPage;
  const currentDestinations = filteredDestinations.slice(indexOfFirstDestination, indexOfLastDestination);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  // Generate page numbers
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

  // Reset pagination when region changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion]);

  return (
    <div className="domestic-tours">
      {/* Hero Section */}
      <section className="indian-hero">
        <div className="hero-pattern-overlay"></div>
        <div className="hero-content">
          <div className="namaste-greeting">🙏 नमस्ते</div>
          <h1 className="hero-title">
            <span className="hindi-text">भारत भ्रमण</span>
            <span className="english-text">Incredible India Tours</span>
          </h1>
          <p className="hero-subtitle">
            Discover the magnificent heritage, diverse cultures, and breathtaking landscapes
            <br />
            From the Himalayas to the backwaters - Experience भारत like never before!
          </p>
          
          <div className="india-stats">
            <div className="stat-card">
              <div className="stat-icon">🏛️</div>
              <div className="stat-number">28</div>
              <div className="stat-label">States & UTs</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎭</div>
              <div className="stat-number">1000+</div>
              <div className="stat-label">Cultural Sites</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🗺️</div>
              <div className="stat-number">5</div>
              <div className="stat-label">Diverse Regions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Selector */}
      <section className="region-selector">
        <div className="container">
          <h2 className="section-title">
            <span className="title-hindi">क्षेत्र चुनें</span>
            <span className="title-english">Choose Your Region</span>
          </h2>
          
          <div className="regions-grid">
            {indianRegions.map((region) => (
              <div 
                key={region.id}
                className={`region-card ${selectedRegion === region.id ? 'active' : ''}`}
                onClick={() => setSelectedRegion(region.id)}
                style={{ '--region-color': region.color }}
              >
                <div className="region-icon">{region.icon}</div>
                <h3>{region.name}</h3>
                <div className="region-pattern"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Tours */}
      <section className="seasonal-tours">
        <div className="container">
          <h2 className="section-title">
            <span className="title-hindi">मौसमी यात्राएं</span>
            <span className="title-english">Seasonal Tours</span>
          </h2>
          
          <div className="seasons-grid">
            {seasonalTours.map((season) => (
              <div 
                key={season.id}
                className="season-card"
                style={{ '--season-color': season.color }}
              >
                <div className="season-header">
                  <div className="season-icon">{season.icon}</div>
                  <div>
                    <h3>{season.name}</h3>
                    <div className="season-months">{season.months}</div>
                  </div>
                </div>
                
                <div className="season-destinations">
                  {season.destinations.map((dest, index) => (
                    <span key={index} className="destination-tag">{dest}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Tours */}
      <section className="festival-tours">
        <div className="container">
          <h2 className="section-title">
            <span className="title-hindi">त्योहारी यात्राएं</span>
            <span className="title-english">Festival Tours</span>
          </h2>
          
          <div className="festivals-grid">
            {festivalTours.map((festival, index) => (
              <div 
                key={index}
                className="festival-card"
                style={{ '--festival-color': festival.color }}
              >
                <div className="festival-icon">{festival.icon}</div>
                <h3>{festival.name}</h3>
                <div className="festival-destination">{festival.destination}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations with Pagination */}
      <section className="destinations-section">
        <div className="container">
          <h2 className="section-title">
            <span className="title-hindi">लोकप्रिय गंतव्य</span>
            <span className="title-english">Popular Destinations</span>
          </h2>
          
          <div className="destinations-info">
            <p>Showing {indexOfFirstDestination + 1}-{Math.min(indexOfLastDestination, filteredDestinations.length)} of {filteredDestinations.length} destinations</p>
          </div>
          
          <div className="destinations-grid">
            {currentDestinations.map((destination) => (
              <div key={destination.id} className="destination-card">
                <div className="card-image">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/350x240/FF9933/FFFFFF?text=Indian+Destination';
                    }}
                  />
                  <div className="region-badge">{indianRegions.find(r => r.id === destination.region)?.name}</div>
                  <div className="rating-badge">
                    <span className="stars">⭐</span>
                    <span>{destination.rating}</span>
                  </div>
                </div>
                
                <div className="card-content">
                  <h3>{destination.name}</h3>
                  <div className="card-details">
                    <div className="price">{destination.price}</div>
                    <div className="duration">{destination.duration}</div>
                  </div>
                  
                  <div className="highlights">
                    {destination.highlights.map((highlight, index) => (
                      <span key={index} className="highlight-tag">{highlight}</span>
                    ))}
                  </div>
                  
                  <div className="best-time">
                    <span className="time-icon">🗓️</span>
                    Best Time: {destination.bestTime}
                  </div>
                  
                  <button className="explore-btn">
                    <span>Explore Tour</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination">
                <button 
                  className={`pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <span>‹</span> Previous
                </button>

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

      {/* Cultural Experiences */}
      <section className="cultural-experiences">
        <div className="container">
          <h2 className="section-title">
            <span className="title-hindi">सांस्कृतिक अनुभव</span>
            <span className="title-english">Cultural Experiences</span>
          </h2>
          
          <div className="experiences-grid">
            <div className="experience-card">
              <div className="experience-icon">🍛</div>
              <h3>Food Tours</h3>
              <p>Taste authentic regional cuisines across India</p>
            </div>
            <div className="experience-card">
              <div className="experience-icon">🏛️</div>
              <h3>Heritage Walks</h3>
              <p>Explore ancient monuments and historical sites</p>
            </div>
            <div className="experience-card">
              <div className="experience-icon">🕉️</div>
              <h3>Spiritual Journeys</h3>
              <p>Visit sacred temples and spiritual centers</p>
            </div>
            <div className="experience-card">
              <div className="experience-icon">🎨</div>
              <h3>Art & Craft</h3>
              <p>Learn traditional Indian arts and crafts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="indian-cta">
        <div className="container">
          <div className="cta-content">
            <h2>
              <span className="cta-hindi">अपनी भारत यात्रा शुरू करें</span>
              <span className="cta-english">Start Your India Journey</span>
            </h2>
            <p>Experience the diversity, heritage, and warmth of Incredible India</p>
            <div className="cta-buttons">
              <button className="btn-primary">Plan India Tour</button>
              <button className="btn-secondary">Call Expert</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
