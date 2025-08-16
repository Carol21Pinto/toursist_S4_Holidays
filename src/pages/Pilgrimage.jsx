import React, { useState, useEffect } from 'react';
import './Pilgrimage.css';

export default function Pilgrimage() {
  const [selectedReligion, setSelectedReligion] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [destinationsPerPage] = useState(6);

  // Scroll to top when component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Religious categories with sacred symbols
  const religiousCategories = [
    { 
      id: 'all', 
      name: 'All Faiths', 
      symbol: '☪️🕉️✝️🔯☸️', 
      color: '#D4AF37',
      greeting: 'Peace be with you',
      sanskrit: 'सर्वे भवन्तु सुखिनः'
    },
    { 
      id: 'hindu', 
      name: 'Hindu Pilgrimage', 
      symbol: '🕉️', 
      color: '#FF7722',
      greeting: 'Namaste',
      sanskrit: 'नमस्ते'
    },
    { 
      id: 'buddhist', 
      name: 'Buddhist Sites', 
      symbol: '☸️', 
      color: '#8B4513',
      greeting: 'May you be happy',
      sanskrit: 'सर्वे भवन्तु सुखिनः'
    },
    { 
      id: 'christian', 
      name: 'Christian Pilgrimage', 
      symbol: '✝️', 
      color: '#4682B4',
      greeting: 'Peace be with you',
      sanskrit: 'Pax vobiscum'
    },
    { 
      id: 'islamic', 
      name: 'Islamic Holy Sites', 
      symbol: '☪️', 
      color: '#228B22',
      greeting: 'As-salamu alaikum',
      sanskrit: 'السَّلاَمُ عَلَيْكُمْ'
    },
    { 
      id: 'sikh', 
      name: 'Sikh Sacred Places', 
      symbol: '☬', 
      color: '#FF8C00',
      greeting: 'Sat Sri Akal',
      sanskrit: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ'
    },
    { 
      id: 'jewish', 
      name: 'Jewish Heritage', 
      symbol: '🔯', 
      color: '#191970',
      greeting: 'Shalom',
      sanskrit: 'שָׁלוֹם'
    }
  ];

  // Sacred experiences
  const sacredExperiences = [
    {
      id: 1,
      title: 'Temple Worship',
      symbol: '🛕',
      description: 'Participate in sacred rituals and prayers',
      languages: 'Sanskrit, Pali, Hebrew, Arabic'
    },
    {
      id: 2,
      title: 'Meditation Retreats',
      symbol: '🧘‍♀️',
      description: 'Find inner peace through guided meditation',
      languages: 'All traditions welcome'
    },
    {
      id: 3,
      title: 'Sacred Ceremonies',
      symbol: '🕯️',
      description: 'Witness ancient religious ceremonies',
      languages: 'Original sacred languages'
    },
    {
      id: 4,
      title: 'Spiritual Healing',
      symbol: '🙏',
      description: 'Experience traditional healing practices',
      languages: 'Multiple faith traditions'
    }
  ];

  // Extended pilgrimage destinations for pagination
  const pilgrimageDestinations = [
    // Hindu Pilgrimage Sites
    {
      id: 1,
      name: 'Varanasi - Kashi Vishwanath',
      religion: 'hindu',
      country: 'India',
      price: 'From ₹25,000',
      duration: '7 Days',
      image: '/images/varanasi.jpg',
      highlights: ['Ganga Aarti', 'Ancient Temples', 'Spiritual Discourses'],
      bestTime: 'Oct-Mar',
      rating: 4.9,
      sacred_name: 'काशी विश्वनाथ',
      description: 'The spiritual capital of India'
    },
    {
      id: 2,
      name: 'Kedarnath Dham',
      religion: 'hindu', 
      country: 'India',
      price: 'From ₹35,000',
      duration: '10 Days',
      image: '/images/kedarnath.jpg',
      highlights: ['Shiva Temple', 'Himalayan Trek', 'Sacred Prayers'],
      bestTime: 'May-Oct',
      rating: 4.8,
      sacred_name: 'केदारनाथ धाम',
      description: 'Lord Shiva\'s sacred abode'
    },
    {
      id: 3,
      name: 'Tirupati Balaji',
      religion: 'hindu',
      country: 'India', 
      price: 'From ₹20,000',
      duration: '5 Days',
      image: '/images/tirupati.jpg',
      highlights: ['Venkateswara Temple', 'Laddu Prasadam', 'Darshan'],
      bestTime: 'Sep-Mar',
      rating: 4.7,
      sacred_name: 'तिरुपति बालाजी',
      description: 'Lord Venkateswara\'s blessed temple'
    },

    // Buddhist Sites
    {
      id: 4,
      name: 'Lumbini - Buddha\'s Birthplace',
      religion: 'buddhist',
      country: 'Nepal',
      price: 'From ₹30,000', 
      duration: '8 Days',
      image: '/images/lumbini.jpg',
      highlights: ['Maya Devi Temple', 'Sacred Garden', 'Meditation'],
      bestTime: 'Oct-Apr',
      rating: 4.8,
      sacred_name: 'लुम्बिनी',
      description: 'Where Lord Buddha was born'
    },
    {
      id: 5,
      name: 'Bodh Gaya - Enlightenment Site',
      religion: 'buddhist',
      country: 'India',
      price: 'From ₹28,000',
      duration: '7 Days', 
      image: '/images/bodhgaya.jpg',
      highlights: ['Bodhi Tree', 'Mahabodhi Temple', 'Meditation'],
      bestTime: 'Oct-Mar',
      rating: 4.9,
      sacred_name: 'बोधगया',
      description: 'Buddha\'s enlightenment place'
    },

    // Christian Pilgrimage
    {
      id: 6,
      name: 'Vatican City',
      religion: 'christian',
      country: 'Italy',
      price: 'From ₹85,000',
      duration: '8 Days',
      image: '/images/vatican.jpg',
      highlights: ['St. Peter\'s Basilica', 'Sistine Chapel', 'Papal Audience'],
      bestTime: 'Apr-Oct',
      rating: 4.9,
      sacred_name: 'Città del Vaticano',
      description: 'Heart of Catholic Christianity'
    },
    {
      id: 7,
      name: 'Jerusalem - Holy Land',
      religion: 'christian',
      country: 'Israel',
      price: 'From ₹95,000',
      duration: '10 Days',
      image: '/images/jerusalem-christian.jpg',
      highlights: ['Church of Holy Sepulchre', 'Via Dolorosa', 'Bethlehem'],
      bestTime: 'Mar-May, Sep-Nov',
      rating: 4.8,
      sacred_name: 'ירושלים',
      description: 'Where Jesus walked'
    },

    // Islamic Holy Sites
    {
      id: 8,
      name: 'Mecca & Medina',
      religion: 'islamic',
      country: 'Saudi Arabia',
      price: 'From ₹1,50,000',
      duration: '15 Days',
      image: '/images/mecca.jpg',
      highlights: ['Hajj Pilgrimage', 'Kaaba', 'Prophet\'s Mosque'],
      bestTime: 'Year-round',
      rating: 5.0,
      sacred_name: 'مكة المكرمة والمدينة المنورة',
      description: 'Islam\'s holiest cities'
    },
    {
      id: 9,
      name: 'Istanbul - Spiritual Heritage',
      religion: 'islamic',
      country: 'Turkey',
      price: 'From ₹65,000',
      duration: '7 Days',
      image: '/images/istanbul.jpg',
      highlights: ['Hagia Sophia', 'Blue Mosque', 'Sufi Heritage'],
      bestTime: 'Apr-Oct',
      rating: 4.7,
      sacred_name: 'إسطنبول',
      description: 'Bridge between worlds'
    },

    // Sikh Sacred Places
    {
      id: 10,
      name: 'Golden Temple Amritsar',
      religion: 'sikh',
      country: 'India',
      price: 'From ₹18,000',
      duration: '5 Days',
      image: '/images/golden-temple.jpg',
      highlights: ['Harmandir Sahib', 'Langar Service', 'Kirtan'],
      bestTime: 'Oct-Mar',
      rating: 4.9,
      sacred_name: 'ਹਰਿਮੰਦਰ ਸਾਹਿਬ',
      description: 'Sikhism\'s holiest shrine'
    },

    // Jewish Heritage
    {
      id: 11,
      name: 'Jerusalem - Western Wall',
      religion: 'jewish',
      country: 'Israel',
      price: 'From ₹90,000',
      duration: '9 Days',
      image: '/images/western-wall.jpg',
      highlights: ['Western Wall', 'Jewish Quarter', 'Synagogues'],
      bestTime: 'Mar-May, Sep-Nov', 
      rating: 4.8,
      sacred_name: 'הכותל המערבי',
      description: 'Judaism\'s holiest prayer site'
    },

    // Multi-faith Sites
    {
      id: 12,
      name: 'Mount Kailash Mansarovar',
      religion: 'all',
      country: 'Tibet/China',
      price: 'From ₹2,50,000',
      duration: '21 Days',
      image: '/images/kailash.jpg',
      highlights: ['Sacred Mountain', 'Lake Mansarovar', 'Kora Pilgrimage'],
      bestTime: 'May-Oct',
      rating: 5.0,
      sacred_name: 'कैलाश मानसरोवर',
      description: 'Sacred to multiple faiths'
    }
  ];

  // Filter destinations based on religion
  const filteredDestinations = selectedReligion === 'all' 
    ? pilgrimageDestinations 
    : pilgrimageDestinations.filter(dest => dest.religion === selectedReligion);

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

  // Reset pagination when religion changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedReligion]);

  return (
    <div className="pilgrimage-tours">
      {/* Sacred Hero Section */}
      <section className="sacred-hero">
        <div className="sacred-pattern-overlay"></div>
        <div className="hero-content">
          {/* <div className="universal-symbols">
            <span className="sacred-symbol">🕉️</span>
            <span className="sacred-symbol">✝️</span>
            <span className="sacred-symbol">☪️</span>
            <span className="sacred-symbol">🔯</span>
            <span className="sacred-symbol">☸️</span>
            <span className="sacred-symbol">☬</span>
          </div> */}
          
          <h1 className="hero-title">
            <span className="spiritual-greeting">🙏 Sacred Journeys</span>
            <span className="main-title">Worldwide Pilgrimage Tours</span>
          </h1>
          
          <p className="hero-subtitle">
            Embark on spiritual journeys to the world's most sacred places
            <br />
            Experience divine peace, ancient wisdom, and universal love across all faiths
          </p>
          
          <div className="spiritual-stats">
            <div className="stat-sacred">
              <div className="stat-symbol">🌍</div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Sacred Sites</div>
            </div>
            <div className="stat-sacred">
              <div className="stat-symbol">🛐</div>
              <div className="stat-number">7</div>
              <div className="stat-label">Major Faiths</div>
            </div>
            <div className="stat-sacred">
              <div className="stat-symbol">🕯️</div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Spiritual Guide</div>
            </div>
          </div>
        </div>
      </section>

      {/* Religious Categories Selector
      <section className="religion-selector">
        <div className="container">
          <h2 className="section-title">
            <span className="title-sacred">Choose Your Spiritual Path</span>
            <span className="title-subtitle">All paths lead to the Divine</span>
          </h2>
          
          <div className="religions-grid">
            {religiousCategories.map((religion) => (
              <div 
                key={religion.id}
                className={`religion-card ${selectedReligion === religion.id ? 'active' : ''}`}
                onClick={() => setSelectedReligion(religion.id)}
                style={{ '--religion-color': religion.color }}
              >
                <div className="religion-symbol">{religion.symbol}</div>
                <h3>{religion.name}</h3>
                <div className="sacred-greeting">
                  <span className="greeting-text">{religion.greeting}</span>
                  <span className="original-text">{religion.sanskrit}</span>
                </div>
                <div className="mandala-pattern"></div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Sacred Experiences */}
      <section className="sacred-experiences">
        <div className="container">
          <h2 className="section-title">
            <span className="title-sacred">Spiritual Experiences</span>
            <span className="title-subtitle">Connect with the Divine</span>
          </h2>
          
          <div className="experiences-grid">
            {sacredExperiences.map((experience) => (
              <div key={experience.id} className="experience-card">
                <div className="experience-symbol">{experience.symbol}</div>
                <h3>{experience.title}</h3>
                <p>{experience.description}</p>
                <div className="languages-supported">{experience.languages}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Destinations with Pagination */}
      <section className="destinations-section">
        <div className="container">
          <h2 className="section-title">
            <span className="title-sacred">Sacred Destinations</span>
            <span className="title-subtitle">Journey to Holiness</span>
          </h2>
          
          <div className="destinations-info">
            <p>Showing {indexOfFirstDestination + 1}-{Math.min(indexOfLastDestination, filteredDestinations.length)} of {filteredDestinations.length} sacred destinations</p>
          </div>
          
          <div className="destinations-grid">
            {currentDestinations.map((destination) => (
              <div key={destination.id} className="destination-card">
                <div className="card-image">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/350x240/D4AF37/FFFFFF?text=Sacred+Destination';
                    }}
                  />
                  <div className="faith-badge">{religiousCategories.find(r => r.id === destination.religion)?.symbol}</div>
                  <div className="rating-badge">
                    <span className="stars">⭐</span>
                    <span>{destination.rating}</span>
                  </div>
                </div>
                
                <div className="card-content">
                  <h3>{destination.name}</h3>
                  <div className="sacred-name">{destination.sacred_name}</div>
                  <div className="destination-country">📍 {destination.country}</div>
                  <p className="description">{destination.description}</p>
                  
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
                    Auspicious Time: {destination.bestTime}
                  </div>
                  
                  <button className="pilgrimage-btn">
                    <span>Begin Sacred Journey</span>
                    <span className="btn-blessing">🙏</span>
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

      {/* Universal Message */}
      <section className="universal-message">
        <div className="container">
          <h2 className="unity-title">One Love, Many Paths</h2>
          <p className="unity-message">
            "Truth is one, sages call it by many names" - Rig Veda
            <br />
            Experience the universal love that connects all sacred traditions
          </p>
          
          <div className="faith-unity">
            <div className="unity-symbols">
              <span>🕉️ ✝️ ☪️ 🔯 ☸️ ☬</span>
            </div>
            <div className="unity-text">All Paths Lead to Divine Light</div>
          </div>
        </div>
      </section>

      {/* Sacred CTA */}
      <section className="sacred-cta">
        <div className="container">
          <div className="cta-content">
            <h2>
              <span className="cta-blessing">🙏 Begin Your Sacred Journey</span>
              <span className="cta-main">Pilgrimage Tours Await</span>
            </h2>
            <p>Experience divine blessings, inner peace, and spiritual awakening</p>
            <div className="cta-buttons">
              <button className="btn-primary">Plan Pilgrimage</button>
              <button className="btn-secondary">Spiritual Guidance</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
