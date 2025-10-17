import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PackageDetail.css';
import ContactIcons from '../components/ContactIcons';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FIXED: Environment-based API URLs
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || "http://localhost:5000";

  // ✅ FIXED: SMART image URL generation (removed currentIP reference)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://www.keralatourism.org/images/homecontentimage/desktop/backwater.jpg';
    const fixedPath = imagePath.replace(/\\/g, '/');
    if (fixedPath.startsWith('http')) return fixedPath;
    return `${SERVER_BASE}/${fixedPath}`;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Helper function to get ALL pricing notes
  const getPricingNotes = () => {
    if (packageData.pricingNotes && Array.isArray(packageData.pricingNotes)) {
      return packageData.pricingNotes.filter(note => note && note.trim());
    }
    if (packageData.priceNote && packageData.priceNote.trim()) {
      return packageData.priceNote.split(' | ').filter(note => note && note.trim());
    }
    return [];
  };

  // ✅ UPDATED: Read categorized notes from backend OR auto-categorize for old packages
  const splitNotesIntoColumns = () => {
    const allNotes = getPricingNotes();
    let bookingPolicyNotes = [];
    let generalNotes = [];

    // Check if backend sent categorized notes (new format)
    if (packageData.pricingNoteCategories && 
        (packageData.pricingNoteCategories.booking || packageData.pricingNoteCategories.notes)) {
      bookingPolicyNotes = packageData.pricingNoteCategories.booking || [];
      generalNotes = packageData.pricingNoteCategories.notes || [];
      
      console.log('✅ Using categorized notes from backend');
      console.log('Booking Policy:', bookingPolicyNotes);
      console.log('Notes:', generalNotes);
    } else {
      // Fallback: Auto-categorize for old packages (backward compatibility)
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

  // Check if notes section should be displayed
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

  // Loading state
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

  // Error state
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

  // No data state
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

  // Helper function to render pricing
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

  // Helper function for hero section pricing
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

  // Get split notes
  const { bookingPolicyNotes, generalNotes } = splitNotesIntoColumns();

  return (
    <div className="package-detail-container">
      
      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={handleGoBack}>
          <span className="back-arrow">←</span>
          <span>Go Back</span>
        </button>
      </div>

      {/* Hero Section */}
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

      {/* Package Overview */}
      <section className="section overview-section">
        <h2>Package Overview</h2>
        <div className="overview">
          <div><strong>Duration:</strong> {packageData.duration || 'Not specified'}</div>
          <div className="price">{renderPriceDisplay()}</div>
        </div>
      </section>

      {/* Departure Dates */}
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

      {/* Itinerary */}
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

      {/* Inclusions & Exclusions */}
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

      {/* ✅ Two-Box Split Layout - Booking Policy & Notes */}
      {shouldShowNotesSection() && (
        <section className="section notes-split-section">
          <div className="split-boxes">
            {/* Left Box - Booking Policy */}
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

            {/* Right Box - Notes */}
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
  );
};

export default PackageDetail;
