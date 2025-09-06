import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PackageDetail = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // USE YOUR WORKING IMAGE URL FUNCTION
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x600/cccccc/666666?text=No+Image';
    
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
        console.log('Package data received:', data); // Debug log
        setPackageData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id]);

  // Helper function to render different data types
  const renderValue = (key, value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="empty-value">Not provided</span>;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="empty-value">None</span>;
      }
      
      // Special handling for itinerary array
      if (key === 'itinerary') {
        return (
          <div className="itinerary-list">
            {value.map((day, index) => (
              <div key={index} className="itinerary-day">
                <h4>Day {day.day}: {day.title}</h4>
                {day.activities && day.activities.length > 0 && (
                  <ul>
                    {day.activities.map((activity, actIndex) => (
                      <li key={actIndex}>{activity}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      // Handle regular arrays (inclusions, exclusions, etc.)
      return (
        <ul className="list-items">
          {value.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    // Handle objects
    if (typeof value === 'object') {
      return <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        {JSON.stringify(value, null, 2)}
      </pre>;
    }

    // Handle regular values
    return <span>{value.toString()}</span>;
  };

  // Helper function to format field names
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/Id$/, 'ID');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
        Loading package details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: '#d32f2f', fontSize: '18px', marginBottom: '20px' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px' }}>No package data found.</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Package Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          {packageData.title || 'Untitled Package'}
        </h1>
        
        {/* USE YOUR WORKING IMAGE DISPLAY */}
        {packageData.cardImage && (
          <div style={{ margin: '20px 0' }}>
            <img 
              src={getImageUrl(packageData.cardImage)} 
              alt={packageData.title} 
              style={{ 
                maxWidth: '100%', 
                height: '400px', 
                objectFit: 'cover', 
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
              onError={(e) => {
                console.log('Image failed to load:', e.target.src);
                e.target.src = 'https://via.placeholder.com/800x400/cccccc/666666?text=Package+Image';
              }}
            />
          </div>
        )}
      </div>

      {/* All Package Fields */}
      <div>
        <h2 style={{ color: '#444', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
          Package Information
        </h2>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          {Object.entries(packageData)
            .filter(([key]) => key !== '_id' && key !== '__v') // Exclude MongoDB internal fields
            .map(([key, value]) => (
              <div key={key} style={{ 
                display: 'grid', 
                gridTemplateColumns: '200px 1fr', 
                gap: '15px', 
                padding: '10px', 
                border: '1px solid #eee', 
                borderRadius: '5px', 
                backgroundColor: '#fafafa' 
              }}>
                <div style={{ fontWeight: 'bold', color: '#555' }}>
                  {formatFieldName(key)}:
                </div>
                <div style={{ color: '#333' }}>
                  {renderValue(key, value)}
                </div>
              </div>
            ))}
        </div>

        {/* Raw Data Debug Section */}
        <details style={{ marginTop: '40px', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#666' }}>
            🔍 Raw Data (Debug)
          </summary>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '8px', 
            fontSize: '12px',
            overflow: 'auto',
            marginTop: '10px'
          }}>
            {JSON.stringify(packageData, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default PackageDetail;
