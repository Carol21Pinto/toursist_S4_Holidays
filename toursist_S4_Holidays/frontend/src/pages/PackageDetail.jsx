import React, { useState, useEffect } from 'react';
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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || "http://localhost:5000";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://www.keralatourism.org/images/homecontentimage/desktop/backwater.jpg';
    const fixedPath = imagePath.replace(/\\/g, '/');
    if (fixedPath.startsWith('http')) return fixedPath;
    return `${SERVER_BASE}/${fixedPath}`;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getPricingNotes = () => {
    if (packageData.pricingNotes && Array.isArray(packageData.pricingNotes)) {
      return packageData.pricingNotes.filter(note => note && note.trim());
    }
    if (packageData.priceNote && packageData.priceNote.trim()) {
      return packageData.priceNote.split(' | ').filter(note => note && note.trim());
    }
    return [];
  };

  const splitNotesIntoColumns = () => {
    const allNotes = getPricingNotes();
    let bookingPolicyNotes = [];
    let generalNotes = [];

    if (packageData.pricingNoteCategories && 
        (packageData.pricingNoteCategories.booking || packageData.pricingNoteCategories.notes)) {
      bookingPolicyNotes = packageData.pricingNoteCategories.booking || [];
      generalNotes = packageData.pricingNoteCategories.notes || [];
      
      console.log('✅ Using categorized notes from backend');
      console.log('Booking Policy:', bookingPolicyNotes);
      console.log('Notes:', generalNotes);
    } else {
      console.log('⚠️ No categorized notes found, using auto-detection');
      
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
  };

  const shouldShowNotesSection = () => {
    if (packageData.pricingNoteCategories && 
        (packageData.pricingNoteCategories.booking?.length > 0 || 
         packageData.pricingNoteCategories.notes?.length > 0)) {
      return true;
    }
    const notes = getPricingNotes();
    return notes.length > 0;
  };

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/packages/${id}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Package not found`);
        }
        const data = await response.json();
        console.log('📦 Package data received:', data);
        console.log('📝 Pricing Note Categories:', data.pricingNoteCategories);
        setPackageData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPackage();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="package-detail-container">
        <div className="back-button-container">
          <button className="back-button" onClick={handleGoBack}>
            <span className="back-arrow">←</span>
            <span>Go Back</span>
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
          Loading package details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="package-detail-container">
        <div className="back-button-container">
          <button className="back-button" onClick={handleGoBack}>
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
          <button className="back-button" onClick={handleGoBack}>
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

  const renderPriceDisplay = () => {
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
  };

  const renderHeroPricing = () => {
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
  };

  // Helper to create itinerary description for SEO
  const getItineraryDescription = () => {
    if (packageData.itinerary && packageData.itinerary.length > 0) {
      const days = packageData.itinerary.slice(0, 3).map(day => day.title).join(', ');
      return `${packageData.itinerary.length} day itinerary including ${days}`;
    }
    return '';
  };

  const { bookingPolicyNotes, generalNotes } = splitNotesIntoColumns();

  return (
    <>
      <Helmet>
        <title>{packageData?.title || 'Package Details'} - {packageData?.duration || 'Tour Package'} | S4 Holidays</title>
        <meta name="description" content={`Book ${packageData?.title} tour package with S4 Holidays. ${packageData?.duration ? `Duration: ${packageData.duration}.` : ''} ${renderPriceDisplay()}. ${getItineraryDescription()}`} />
        <meta name="keywords" content={`${packageData?.title}, ${packageData?.category} tour, ${packageData?.duration} trip, travel package, ${packageData?.state || packageData?.continent || 'tour'}, S4 Holidays`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://s4holidays.com/package/${id}`} />
        <meta property="og:title" content={packageData?.title} />
        <meta property="og:description" content={`Book ${packageData?.title} tour package. ${packageData?.duration}. ${renderPriceDisplay()}`} />
        <meta property="og:image" content={getImageUrl(packageData?.cardImage)} />
        <meta property="og:site_name" content="S4 Holidays" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://s4holidays.com/package/${id}`} />
        <meta property="twitter:title" content={packageData?.title} />
        <meta property="twitter:description" content={`${packageData?.duration}. ${renderPriceDisplay()}`} />
        <meta property="twitter:image" content={getImageUrl(packageData?.cardImage)} />
        
        <link rel="canonical" href={`https://s4holidays.com/package/${id}`} />
        
        {/* Structured Data - TouristTrip Schema */}
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

        {/* Breadcrumb Schema */}
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

        <header style={{
          backgroundImage: `url("${getImageUrl(packageData.cardImage)}")`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="hero-text">
            <h1>{packageData.title || 'Travel Package'}</h1>
            <p>{packageData.duration} | {renderHeroPricing()}</p>
          </div>
        </header>

        <section className="section overview-section">
          <h2>Package Overview</h2>
          <div className="overview">
            <div><strong>Duration:</strong> {packageData.duration || 'Not specified'}</div>
            <div className="price">{renderPriceDisplay()}</div>
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

        {shouldShowNotesSection() && (
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
    </>
  );
};

export default PackageDetail;
