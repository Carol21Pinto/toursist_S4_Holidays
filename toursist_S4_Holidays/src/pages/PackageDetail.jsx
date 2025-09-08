import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PackageDetail.css';
import ContactIcons from '../components/ContactIcons'; // adjust path if needed

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PackageDetail = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://www.keralatourism.org/images/homecontentimage/desktop/backwater.jpg';
    const fixedPath = imagePath.replace(/\\/g, '/');
    if (fixedPath.startsWith('http')) return fixedPath;
    return `http://localhost:5000/${fixedPath}`;
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
        console.log('Package data received:', data);
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
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
        Loading package details...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: '#d32f2f', fontSize: '18px', marginBottom: '20px' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  // No data state
  if (!packageData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px' }}>No package data found.</div>
      </div>
    );
  }

  // Helper function to render pricing
  const renderPriceDisplay = () => {
    if (packageData.pricingMode === 'Structured' && packageData.pricePerPerson) {
      return `₹${packageData.pricePerPerson} per person`;
    } else if (packageData.pricingMode === 'Text' && packageData.priceText) {
      return packageData.priceText;
    }
    return 'Contact for pricing';
  };

  return (
    <div className="package-detail-container">
      
      {/* Hero Section */}
      <header style={{
        backgroundImage: `url("${getImageUrl(packageData.cardImage)}")`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="hero-text">
          <h1>{packageData.title || 'Travel Package'}</h1>
          <p>{packageData.duration} | {renderPriceDisplay()}</p>
        </div>
      </header>

      {/* Package Overview */}
      <section className="section overview-section">
        <h2>Package Overview</h2>
        <div className="overview">
          <div><strong>Duration:</strong> {packageData.duration || 'Not specified'}</div>
          <div><strong>Cost:</strong> {packageData.priceNote || 'All inclusive'}</div>
          <div className="price">{renderPriceDisplay()}</div>
        </div>
      </section>

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
          {/* Inclusions */}
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

          {/* Exclusions */}
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
<ContactIcons />
      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Kerala Tours. All Rights Reserved.</p>
      </footer>

    </div>
  );
};

export default PackageDetail;
