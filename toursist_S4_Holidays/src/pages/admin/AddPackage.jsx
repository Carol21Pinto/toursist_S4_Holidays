import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import './AddPackage.css';

const AddPackage = () => {
  // Form state with new location fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Domestic',
    duration: '',
    pricePerPerson: '',
    currency: 'INR',
    priceNote: '',
    priceText: '',
    // New location fields
    state: '',        // For Domestic packages
    continent: ''     // For International packages
  });

  const [pricingMode, setPricingMode] = useState('Structured');
  const [itinerary, setItinerary] = useState([
    { day: 1, title: '', activities: [''] }
  ]);
  
  const [inclusions, setInclusions] = useState(['']);
  const [exclusions, setExclusions] = useState(['']);
  const [cardImage, setCardImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Location data
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const continents = [
    'Asia', 'Europe', 'North America', 'Middle East', 
    'Africa', 'Oceania', 'South America'
  ];

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Show success snackbar
  const showSuccess = (message) => {
    setSnackbar({
      open: true,
      message: message,
      severity: 'success'
    });
  };

  // Show error snackbar
  const showError = (message) => {
    setSnackbar({
      open: true,
      message: message,
      severity: 'error'
    });
  };

  // Handle basic form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear location fields when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        state: '',
        continent: ''
      }));
    }
  };

  // Handle pricing mode change
  const handlePricingModeChange = (mode) => {
    setPricingMode(mode);
  };

  // Handle card image upload and preview
  const handleCardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle itinerary changes
  const handleItineraryChange = (dayIndex, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex][field] = value;
    setItinerary(newItinerary);
  };

  const handleActivityChange = (dayIndex, activityIndex, value) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities[activityIndex] = value;
    setItinerary(newItinerary);
  };

  const addActivity = (dayIndex) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.push('');
    setItinerary(newItinerary);
  };

  // Remove activity function
  const removeActivity = (dayIndex, activityIndex) => {
    const newItinerary = [...itinerary];
    if (newItinerary[dayIndex].activities.length > 1) {
      newItinerary[dayIndex].activities.splice(activityIndex, 1);
      setItinerary(newItinerary);
    }
  };

  const addDay = () => {
    setItinerary([...itinerary, {
      day: itinerary.length + 1,
      title: '',
      activities: ['']
    }]);
  };

  // Remove day function
  const removeDay = (dayIndex) => {
    if (itinerary.length > 1) {
      const newItinerary = [...itinerary];
      newItinerary.splice(dayIndex, 1);
      const renumberedItinerary = newItinerary.map((day, index) => ({
        ...day,
        day: index + 1
      }));
      setItinerary(renumberedItinerary);
    }
  };

  // Handle inclusions/exclusions
  const handleArrayChange = (index, value, type) => {
    if (type === 'inclusions') {
      const newInclusions = [...inclusions];
      newInclusions[index] = value;
      setInclusions(newInclusions);
    } else if (type === 'exclusions') {
      const newExclusions = [...exclusions];
      newExclusions[index] = value;
      setExclusions(newExclusions);
    }
  };

  const addArrayItem = (type) => {
    if (type === 'inclusions') {
      setInclusions([...inclusions, '']);
    } else if (type === 'exclusions') {
      setExclusions([...exclusions, '']);
    }
  };

  // Remove inclusion function
  const removeInclusion = (index) => {
    if (inclusions.length > 1) {
      const newInclusions = [...inclusions];
      newInclusions.splice(index, 1);
      setInclusions(newInclusions);
    }
  };

  // Remove exclusion function
  const removeExclusion = (index) => {
    if (exclusions.length > 1) {
      const newExclusions = [...exclusions];
      newExclusions.splice(index, 1);
      setExclusions(newExclusions);
    }
  };

  // Enhanced dashboard refresh function
  const triggerDashboardRefresh = () => {
    console.log('Triggering dashboard refresh for real-time chart update...');
    
    localStorage.setItem('dashboardRefresh', Date.now().toString());
    window.dispatchEvent(new CustomEvent('dashboardRefresh'));
    
    setTimeout(() => {
      localStorage.setItem('dashboardRefresh', (Date.now() + 1).toString());
    }, 100);
    
    setTimeout(() => {
      localStorage.setItem('dashboardRefresh', (Date.now() + 2).toString());
    }, 500);
  };

  // Submit form
  const addPackage = async (packageData, cardImage) => {
    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      
      if (cardImage) {
        formDataToSend.append("card_image", cardImage);
      }

      formDataToSend.append("data", JSON.stringify(packageData));

      console.log('Sending package data:', packageData);

      const response = await fetch("http://localhost:5000/api/packages", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const newPackage = await response.json();
        console.log('Package created successfully:', newPackage);
        
        showSuccess("🎉 Package added successfully! Your dashboard will update automatically.");
        triggerDashboardRefresh();
        
        setTimeout(() => {
          setFormData({
            name: '',
            category: 'Domestic',
            duration: '',
            pricePerPerson: '',
            currency: 'INR',
            priceNote: '',
            priceText: '',
            state: '',
            continent: ''
          });
          setItinerary([{ day: 1, title: '', activities: [''] }]);
          setInclusions(['']);
          setExclusions(['']);
          setCardImage(null);
          setImagePreview(null);
          setPricingMode('Structured');
        }, 1500);
        
        return newPackage;
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || `HTTP ${response.status}: Server Error`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error adding package:", error);
      showError(`❌ Failed to add package: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const packageData = {
      ...formData,
      pricingMode,
      itinerary: itinerary.filter(day => day.title && day.activities.some(act => act)),
      inclusions: inclusions.filter(inc => inc.trim()),
      exclusions: exclusions.filter(exc => exc.trim())
    };

    await addPackage(packageData, cardImage);
  };

  return (
    <div className="add-package-container">
      <div className="add-package-header">
        <h1>Travel Admin Panel</h1>
        <p>Add a new package - your chart will update in real-time!</p>
      </div>

      <form onSubmit={handleSubmit} className="add-package-form">
        {/* Basic Info Section */}
        <div className="form-section">
          <h2>Basic Info</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Package Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="India gate"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
                <option value="Pilgrimage">Pilgrimage</option>
                <option value="Group">Group</option>
              </select>
            </div>
          </div>

          {/* Location Selection Based on Category */}
          <div className="form-row">
            {formData.category === 'Domestic' && (
              <div className="form-group">
                <label>Select State <span style={{color: '#e74c3c'}}>*</span></label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  style={{
                    background: formData.state ? '#e8f5e8' : 'white',
                    borderColor: formData.state ? '#28a745' : '#e1e5e9'
                  }}
                >
                  <option value="">Choose State...</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.category === 'International' && (
              <div className="form-group">
                <label>Select Continent/Region <span style={{color: '#e74c3c'}}>*</span></label>
                <select
                  name="continent"
                  value={formData.continent}
                  onChange={handleInputChange}
                  required
                  style={{
                    background: formData.continent ? '#e8f5e8' : 'white',
                    borderColor: formData.continent ? '#28a745' : '#e1e5e9'
                  }}
                >
                  <option value="">Choose Continent/Region...</option>
                  {continents.map(continent => (
                    <option key={continent} value={continent}>{continent}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 5 Days 4 Nights"
              />
            </div>
          </div>

          {/* Location Info Helper */}
          {formData.category === 'Domestic' && formData.state && (
            <div className="location-info">
              <span className="info-icon">ℹ️</span>
              <span>Selected State: <strong>{formData.state}</strong> - This will help users find your package easily!</span>
            </div>
          )}

          {formData.category === 'International' && formData.continent && (
            <div className="location-info">
              <span className="info-icon">🌍</span>
              <span>Selected Region: <strong>{formData.continent}</strong> - This will help users find your package easily!</span>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="form-section">
          <h2>Pricing</h2>
          
          <div className="pricing-mode">
            <label>Mode:</label>
            <button 
              type="button" 
              className={`mode-btn ${pricingMode === 'Structured' ? 'active' : ''}`}
              onClick={() => handlePricingModeChange('Structured')}
            >
              Structured
            </button>
            <button 
              type="button" 
              className={`mode-btn ${pricingMode === 'Text' ? 'active' : ''}`}
              onClick={() => handlePricingModeChange('Text')}
            >
              Text
            </button>
          </div>

          {pricingMode === 'Structured' ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Price per person (optional)</label>
                  <input
                    type="number"
                    name="pricePerPerson"
                    value={formData.pricePerPerson}
                    onChange={handleInputChange}
                    placeholder="2000"
                    // No required attribute - making it optional
                  />
                </div>
                
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Price note (optional)</label>
                <input
                  type="text"
                  name="priceNote"
                  value={formData.priceNote}
                  onChange={handleInputChange}
                  placeholder="e.g., With flights ex Bangalore"
                />
              </div>
            </>
          ) : (
            <div className="form-group full-width">
              <label>Price Text</label>
              <textarea
                name="priceText"
                value={formData.priceText}
                onChange={handleInputChange}
                placeholder="Starting from ₹25,000 per person"
                rows="3"
                className="price-text-area"
              />
            </div>
          )}
        </div>

        {/* Images Section */}
        <div className="form-section">
          <h2>Images</h2>
          
          <div className="image-upload-section">
            <div className="form-group">
              <label>Card image (required)</label>
              <div className="file-input-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCardImageChange}
                  id="cardImage"
                  className="file-input"
                  required
                />
                <label htmlFor="cardImage" className="file-input-label">
                  Choose File
                </label>
              </div>
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Card preview" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Day-wise Itinerary Section with Activities Remove Buttons */}
        <div className="form-section">
          <h2>Day-wise Itinerary</h2>
          
          {itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="itinerary-day">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Day {day.day}</h3>
                {itinerary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDay(dayIndex)}
                    style={{
                      background: '#ffebee',
                      color: '#d32f2f',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Remove Day
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => handleItineraryChange(dayIndex, 'title', e.target.value)}
                  placeholder="e.g., Arrive Cochin"
                />
              </div>

              <div className="form-group">
                <label>Activities</label>
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={activity}
                      onChange={(e) => handleActivityChange(dayIndex, actIndex, e.target.value)}
                      placeholder="Activity description"
                      className="activity-input"
                      style={{ flex: 1 }}
                    />
                    {/* Remove Activity Button - only show if more than 1 activity */}
                    {day.activities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeActivity(dayIndex, actIndex)}
                        style={{
                          background: '#ffebee',
                          color: '#d32f2f',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          minWidth: 'auto'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addActivity(dayIndex)}
                  className="add-btn small"
                >
                  + Add Activity
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addDay}
            className="add-btn full-width"
          >
            + Add Day
          </button>
        </div>

        {/* Inclusions Section with Remove Buttons */}
        <div className="form-section">
          <h2>Inclusions</h2>
          
          {inclusions.map((inclusion, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <input
                  type="text"
                  value={inclusion}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'inclusions')}
                  placeholder="Inclusion item"
                />
              </div>
              {inclusions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInclusion(index)}
                  style={{
                    background: '#ffebee',
                    color: '#d32f2f',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    alignSelf: 'center'
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('inclusions')}
            className="add-btn"
          >
            + Add Inclusion
          </button>
        </div>

        {/* Exclusions Section with Remove Buttons */}
        <div className="form-section">
          <h2>Exclusions</h2>
          
          {exclusions.map((exclusion, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <input
                  type="text"
                  value={exclusion}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'exclusions')}
                  placeholder="Exclusion item"
                />
              </div>
              {exclusions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExclusion(index)}
                  style={{
                    background: '#ffebee',
                    color: '#d32f2f',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    alignSelf: 'center'
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('exclusions')}
            className="add-btn"
          >
            + Add Exclusion
          </button>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button 
            type="submit" 
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Saving Package...' : '💾 Save Package & Update Chart'}
          </button>
        </div>
      </form>

      {/* Beautiful Snackbar for Success/Error Messages */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ zIndex: 9999 }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            fontSize: '1rem',
            fontWeight: 500,
            '& .MuiAlert-icon': { fontSize: '1.2rem' },
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddPackage;
