import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import './PackageDetail.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PackageDetail() {
  const { id } = useParams(); // Get package ID from URL
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fix Windows backslashes in image paths
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x600/cccccc/666666?text=No+Image';
    
    const fixedPath = imagePath.replace(/\\/g, '/');
    if (fixedPath.startsWith('http')) return fixedPath;
    
    return `http://localhost:5000/${fixedPath}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPackageData(data);
        console.log('Fetched package details:', data);
      } else {
        console.error('Package not found');
      }
    } catch (error) {
      console.error('Error fetching package:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all images (cardImage + images array)
  const getAllImages = () => {
    if (!packageData) return [];
    
    const images = [];
    
    // Add cardImage first if it exists
    if (packageData.cardImage) {
      images.push(packageData.cardImage);
    }
    
    // Add all images from images array
    if (packageData.images && packageData.images.length > 0) {
      images.push(...packageData.images);
    }
    
    return images;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
        Loading package details...
      </div>
    );
  }

  if (!packageData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Package not found</h2>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  const allImages = getAllImages();

  return (
    <div className="package-detail">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="back-btn"
          style={{ 
            padding: '10px 20px', 
            marginBottom: '20px', 
            background: '#1976d2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Back to Packages
        </button>

        {/* Package Header */}
        <div className="package-header" style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{packageData.title}</h1>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ 
              background: '#1976d2', 
              color: 'white', 
              padding: '5px 15px', 
              borderRadius: '20px',
              textTransform: 'capitalize'
            }}>
              {packageData.category}
            </span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {packageData.currency}{packageData.pricePerPerson.toLocaleString()}/person
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="image-gallery" style={{ marginBottom: '40px' }}>
            <div className="main-image" style={{ marginBottom: '15px' }}>
              <img 
                src={getImageUrl(allImages[selectedImage])} 
                alt={`${packageData.title} - Image ${selectedImage + 1}`}
                style={{ 
                  width: '100%', 
                  height: '400px', 
                  objectFit: 'cover', 
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400/cccccc/666666?text=Package+Image';
                }}
              />
            </div>
            
            {allImages.length > 1 && (
              <div className="thumbnail-strip" style={{ 
                display: 'flex', 
                gap: '10px', 
                overflowX: 'auto', 
                padding: '10px 0' 
              }}>
                {allImages.map((img, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{ 
                      cursor: 'pointer',
                      border: selectedImage === index ? '3px solid #1976d2' : '3px solid transparent',
                      borderRadius: '5px',
                      minWidth: '100px'
                    }}
                  >
                    <img 
                      src={getImageUrl(img)} 
                      alt={`Thumbnail ${index + 1}`}
                      style={{ 
                        width: '100px', 
                        height: '70px', 
                        objectFit: 'cover',
                        borderRadius: '5px'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x70/cccccc/666666?text=Img';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Package Details */}
        <div className="package-details" style={{ display: 'grid', gap: '30px' }}>
          {/* Description */}
          <div className="detail-section">
            <h2 style={{ color: '#333', marginBottom: '15px' }}>Description</h2>
            <div 
              dangerouslySetInnerHTML={{ __html: packageData.description }} 
              style={{ lineHeight: '1.6', color: '#666' }}
            />
          </div>

          {/* Inclusions */}
          {packageData.inclusions && packageData.inclusions.length > 0 && (
            <div className="detail-section">
              <h2 style={{ color: '#333', marginBottom: '15px' }}>What's Included</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {packageData.inclusions.map((inclusion, index) => (
                  <li key={index} style={{ 
                    padding: '8px 0', 
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#4caf50', marginRight: '10px' }}>✓</span>
                    {inclusion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exclusions */}
          {packageData.exclusions && packageData.exclusions.length > 0 && (
            <div className="detail-section">
              <h2 style={{ color: '#333', marginBottom: '15px' }}>What's Not Included</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {packageData.exclusions.map((exclusion, index) => (
                  <li key={index} style={{ 
                    padding: '8px 0', 
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#f44336', marginRight: '10px' }}>✗</span>
                    {exclusion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Itinerary */}
          {packageData.itinerary && packageData.itinerary.length > 0 && (
            <div className="detail-section">
              <h2 style={{ color: '#333', marginBottom: '15px' }}>Itinerary</h2>
              <div className="itinerary">
                {packageData.itinerary.map((day, index) => (
                  <div key={index} style={{ 
                    padding: '20px', 
                    marginBottom: '15px', 
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    borderLeft: '4px solid #1976d2'
                  }}>
                    <h3 style={{ color: '#1976d2', marginBottom: '8px' }}>
                      Day {day.day}
                    </h3>
                    <h4 style={{ marginBottom: '10px' }}>{day.title}</h4>
                    {day.activities && day.activities.length > 0 && (
                      <ul style={{ marginLeft: '20px' }}>
                        {day.activities.map((activity, i) => (
                          <li key={i} style={{ marginBottom: '5px' }}>{activity}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="contact-section" style={{ 
          background: '#1976d2', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '10px',
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Ready to Book This Package?</h2>
          {packageData.contactNumbers && packageData.contactNumbers.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '10px' }}>Contact us:</p>
              {packageData.contactNumbers.map((number, index) => (
                <a 
                  key={index} 
                  href={`tel:${number}`} 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    display: 'inline-block',
                    margin: '5px 10px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px'
                  }}
                >
                  📞 {number}
                </a>
              ))}
            </div>
          )}
          <button style={{ 
            background: 'white', 
            color: '#1976d2', 
            padding: '15px 30px', 
            border: 'none', 
            borderRadius: '25px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
