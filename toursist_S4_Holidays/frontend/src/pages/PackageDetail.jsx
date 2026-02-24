// src/pages/PackageDetail.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './PackageDetail.css';
import ContactIcons from '../components/ContactIcons';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false); // ✅ Track hero image loading

  // ✅ NEW: WhatsApp business number (update with your actual number - India format without +)
  const WHATSAPP_NUMBER = "8904814416"; // Replace with your actual WhatsApp number

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [id]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || "http://localhost:5000";

  // ✅ OPTIMIZED: Memoized to prevent recalculation
  const getImageUrl = useMemo(() => {
    return (imagePath) => {
      if (!imagePath) return 'https://www.keralatourism.org/images/homecontentimage/desktop/backwater.jpg';
      const fixedPath = imagePath.replace(/\\/g, '/');
      if (fixedPath.startsWith('http')) return fixedPath;
      return `${SERVER_BASE}/${fixedPath}`;
    };
  }, [SERVER_BASE]);

  // ✅ NEW: WhatsApp click handler - sends package name + duration in pre-filled message
  const handleWhatsAppClick = () => {
    const message = `Hi, I'm interested in "${packageData?.title || 'this package'}" (${packageData?.duration || ''}). Please share pricing details!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // ✅ FIXED: Smart navigation - goes to category page if no history
  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      if (packageData) {
        const category = packageData.category?.toLowerCase();
        if (category === 'domestic' || category === 'international' || 
            category === 'pilgrimage' || category === 'group trip') {
          navigate(`/${category}`);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  };

  // ✅ OPTIMIZED: Memoized to prevent recalculation
  const getPricingNotes = useMemo(() => {
    if (!packageData) return [];
    
    if (packageData.pricingNotes && Array.isArray(packageData.pricingNotes)) {
      return packageData.pricingNotes.filter(note => note && note.trim());
    }
    if (packageData.priceNote && packageData.priceNote.trim()) {
      return packageData.priceNote.split(' | ').filter(note => note && note.trim());
    }
    return [];
  }, [packageData]);

  // ✅ OPTIMIZED: Memoized to prevent recalculation
  const { bookingPolicyNotes, generalNotes } = useMemo(() => {
    if (!packageData) return { bookingPolicyNotes: [], generalNotes: [] };

    const allNotes = getPricingNotes;
    let bookingPolicyNotes = [];
    let generalNotes = [];

    if (packageData.pricingNoteCategories && 
        (packageData.pricingNoteCategories.booking || packageData.pricingNoteCategories.notes)) {
      bookingPolicyNotes = packageData.pricingNoteCategories.booking || [];
      generalNotes = packageData.pricingNoteCategories.notes || [];
    } else {
      allNotes.forEach(note => {
        const lowerNote = note.toLowerCase();
        
        const isBookingPolicy = 
          lowerNote.includes('booking policy') ||
          lowerNote.includes('full payment for flights') ||
          lowerNote.includes('remaining balance must be cleared') ||
          lowerNote.includes('minimum of 50%') ||
          lowerNote.includes('at the time of booking to confirm') ||
          lowerNote.includes('prior to the departure date') ||
          (lowerNote.includes('payment') && lowerNote.includes('time of booking')) ||
          (lowerNote.includes('balance') && lowerNote.includes('30 days'));
        
        if (isBookingPolicy) {
          bookingPolicyNotes.push(note);
        } else {
          generalNotes.push(note);
        }
      });
    }

    return { bookingPolicyNotes, generalNotes };
  }, [packageData, getPricingNotes]);

  // ✅ OPTIMIZED: Memoized to prevent recalculation
  const shouldShowNotesSection = useMemo(() => {
    if (!packageData) return false;
    
    if (packageData.pricingNoteCategories && 
        (packageData.pricingNoteCategories.booking?.length > 0 || 
         packageData.pricingNoteCategories.notes?.length > 0)) {
      return true;
    }
    return getPricingNotes.length > 0;
  }, [packageData, getPricingNotes]);

  // ✅ OPTIMIZED: Fetch with timeout and error handling
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        
        // ✅ Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_URL}/packages/${id}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300' // ✅ Enable browser caching for 5 minutes
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Package not found`);
        }
        
        const data = await response.json();
        setPackageData(data);
        setError(null);
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('Request timeout. Please check your connection and try again.');
        } else {
          console.error('Error fetching package:', err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPackage();
  }, [id, API_URL]);

  // ✅ OPTIMIZED: Preload hero image
  useEffect(() => {
    if (packageData?.cardImage) {
      const img = new Image();
      img.src = getImageUrl(packageData.cardImage);
      img.onload = () => setImageLoaded(true);
    }
  }, [packageData, getImageUrl]);

  // ✅ OPTIMIZED: Memoized render functions
  const renderPriceDisplay = useMemo(() => {
    if (!packageData) return 'Contact for pricing';
    
    if (packageData.pricingMode === 'Structured' && 
        packageData.pricePerPerson && 
        packageData.pricePerPerson > 0) {
      return `₹${packageData.pricePerPerson.toLocaleString()} per person`;
    } 
    else if (packageData.pricingMode === 'Text' && 
             packageData.priceText && 
             packageData.priceText.trim() !== '') {
      return packageData.priceText;
    }
    return 'Contact for pricing';
  }, [packageData]);

  const renderHeroPricing = useMemo(() => {
    if (!packageData) return 'Contact for pricing';
    
    if (packageData.pricingMode === 'Structured' && 
        packageData.pricePerPerson && 
        packageData.pricePerPerson > 0) {
      return `₹${packageData.pricePerPerson.toLocaleString()}/person`;
    } 
    else if (packageData.pricingMode === 'Text' && 
             packageData.priceText && 
             packageData.priceText.trim() !== '') {
      return packageData.priceText;
    }
    return 'Contact for pricing';
  }, [packageData]);

  const getItineraryDescription = useMemo(() => {
    if (!packageData?.itinerary || packageData.itinerary.length === 0) return '';
    
    const days = packageData.itinerary.slice(0, 3).map(day => day.title).join(', ');
    return `${packageData.itinerary.length} day itinerary including ${days}`;
  }, [packageData]);

  // ✅ NEW: Check if price display needs WhatsApp link
  const isContactPricing = renderPriceDisplay === 'Contact for pricing';

  // ✅ OPTIMIZED: Show skeleton loader while loading
  if (loading) {
    return (
      <div className="package-detail-container">
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <span className="back-arrow">←</span>
            <span>Go Back</span>
          </button>
        </div>
        <div style={{ 
          textAlign: 'center', 
          padding: '100px 20px', 
          fontSize: '18px',
          color: '#666'
        }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #e81818',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading package details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="package-detail-container">
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate('/')}>
            <span className="back-arrow">←</span>
            <span>Go Back</span>
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ color: '#d32f2f', fontSize: '18px', marginBottom: '20px' }}>
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="package-detail-container">
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate('/')}>
            <span className="back-arrow">←</span>
            <span>Go Back</span>
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '18px' }}>No package data found.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{packageData?.title || 'Package Details'} - {packageData?.duration || 'Tour Package'} | S4 Holidays</title>
        <meta name="description" content={`Book ${packageData?.title} tour package with S4 Holidays. ${packageData?.duration ? `Duration: ${packageData.duration}.` : ''} ${renderPriceDisplay}. ${getItineraryDescription}`} />
        <meta name="keywords" content={`${packageData?.title}, ${packageData?.category} tour, ${packageData?.duration} trip, travel package, ${packageData?.state || packageData?.continent || 'tour'}, S4 Holidays`} />
        
        {/* ✅ OPTIMIZED: Preload hero image */}
        <link rel="preload" as="image" href={getImageUrl(packageData?.cardImage)} />
        
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://s4holidays.com/package/${id}`} />
        <meta property="og:title" content={packageData?.title} />
        <meta property="og:description" content={`Book ${packageData?.title} tour package. ${packageData?.duration}. ${renderPriceDisplay}`} />
        <meta property="og:image" content={getImageUrl(packageData?.cardImage)} />
        <meta property="og:site_name" content="S4 Holidays" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://s4holidays.com/package/${id}`} />
        <meta property="twitter:title" content={packageData?.title} />
        <meta property="twitter:description" content={`${packageData?.duration}. ${renderPriceDisplay}`} />
        <meta property="twitter:image" content={getImageUrl(packageData?.cardImage)} />
        
        <link rel="canonical" href={`https://s4holidays.com/package/${id}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            "name": packageData?.title,
            "description": `${packageData?.duration} tour package`,
            "image": getImageUrl(packageData?.cardImage),
            "itinerary": packageData?.itinerary?.map((day, index) => ({
              "@type": "TouristAttraction",
              "name": day.title,
              "description": day.activities?.join(', ')
            })),
            "offers": {
              "@type": "Offer",
              "price": packageData?.pricePerPerson || "Contact for pricing",
              "priceCurrency": packageData?.currency || "INR",
              "availability": "https://schema.org/InStock",
              "url": `https://s4holidays.com/package/${id}`
            },
            "provider": {
              "@type": "TravelAgency",
              "name": "S4 Holidays",
              "url": "https://s4holidays.com"
            },
            "touristType": packageData?.category,
            "arrivalTime": packageData?.departureDates?.[0] || null
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://s4holidays.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": packageData?.category?.charAt(0).toUpperCase() + packageData?.category?.slice(1),
                "item": `https://s4holidays.com/${packageData?.category}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": packageData?.title,
                "item": `https://s4holidays.com/package/${id}`
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="package-detail-container">
        
        <div className="back-button-container">
          <button className="back-button" onClick={handleGoBack}>
            <span className="back-arrow">←</span>
            <span>Go Back</span>
          </button>
        </div>

        {/* ✅ OPTIMIZED: Lazy load background image with loading placeholder */}
        <header style={{
          backgroundImage: imageLoaded ? `url("${getImageUrl(packageData.cardImage)}")` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 0.3s ease'
        }}>
          <div className="hero-text">
            <h1>{packageData.title || 'Travel Package'}</h1>
            {/* ✅ UPDATED: Hero pricing clickable */}
            <p>
              {packageData.duration} |{' '}
              {isContactPricing ? (
                <span 
                className="whatsapp-price-link"
                style={{
                  color: '#f1fff6',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                onClick={handleWhatsAppClick}
              >
                Contact for pricing
              </span>
              ) : (
                renderHeroPricing
              )}
            </p>
          </div>
        </header>

        <section className="section overview-section">
          <h2>Package Overview</h2>
          <div className="overview">
            <div><strong>Duration:</strong> {packageData.duration || 'Not specified'}</div>
            <div className="price">
              {/* ✅ UPDATED: Overview price clickable */}
              {isContactPricing ? (
                <button
                className="whatsapp-price-btn"
                onClick={handleWhatsAppClick}
              >
                Contact for Pricing
              </button>
              ) : (
                renderPriceDisplay
              )}
            </div>
          </div>
        </section>

        {packageData.departureDates && packageData.departureDates.length > 0 && 
         packageData.departureDates.some(date => date.trim()) && (
          <section className="section departure-section">
            <h2>Available Departure Dates</h2>
            <div className="departure-dates">
              {packageData.departureDates.filter(date => date.trim()).map((date, index) => (
                <div key={index} className="departure-date">
                  <span className="date-icon">📅</span>
                  <span className="date-text">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              ))}
            </div>
            <p className="departure-note">
              <em>More dates may be available upon request. Contact us for flexible scheduling.</em>
            </p>
          </section>
        )}

        <section className="section">
          <h2>Itinerary</h2>
          <div className="itinerary-box">
            {packageData.itinerary && packageData.itinerary.length > 0 ? (
              packageData.itinerary.map((day, index) => (
                <div key={index} className="day-card">
                  <h3>Day {day.day}: {day.title}</h3>
                  {day.activities && day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="point">
                      <span>✓</span>
                      {activity}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No itinerary details available</p>
            )}
          </div>
        </section>

        <section className="section">
          <h2>Details</h2>
          <div className="two-col">
            <div className="col">
              <h3>Inclusions</h3>
              {packageData.inclusions && packageData.inclusions.length > 0 ? (
                packageData.inclusions.map((inclusion, index) => (
                  <div key={index} className="point">
                    <span>+</span>
                    {inclusion}
                  </div>
                ))
              ) : (
                <p>No inclusions specified</p>
              )}
            </div>

            <div className="col exclusions">
              <h3>Exclusions</h3>
              {packageData.exclusions && packageData.exclusions.length > 0 ? (
                packageData.exclusions.map((exclusion, index) => (
                  <div key={index} className="point">
                    <span>-</span>
                    {exclusion}
                  </div>
                ))
              ) : (
                <p>No exclusions specified</p>
              )}
            </div>
          </div>
        </section>

        {shouldShowNotesSection && (
          <section className="section notes-split-section">
            <div className="split-boxes">
              {bookingPolicyNotes.length > 0 && (
                <div className="split-box booking-box">
                  <h3>📋 Booking Policy</h3>
                  <div className="box-content">
                    {bookingPolicyNotes.map((note, index) => (
                      <div key={index} className="note-line">
                        • {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {generalNotes.length > 0 && (
                <div className="split-box notes-box">
                  <h3>💰 Notes</h3>
                  <div className="box-content">
                    {generalNotes.map((note, index) => (
                      <div key={index} className="note-line">
                        • {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <ContactIcons />
        
      </div>

      {/* ✅ OPTIMIZED: Add CSS for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* ✅ NEW: Hover effect for WhatsApp pricing links */
        .whatsapp-price-link:hover {
          color: #128C7E !important;
          text-decoration: none !important;
        }
      `}</style>
    </>
  );
};

export default PackageDetail;
