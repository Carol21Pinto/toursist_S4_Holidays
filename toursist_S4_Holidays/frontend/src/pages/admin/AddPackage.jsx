import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import './AddPackage.css';

const AddPackage = () => {
  // Form state with new location fields and pricing notes
  const [formData, setFormData] = useState({
    name: '',
    category: 'Domestic',
    duration: '',
    pricePerPerson: '',
    currency: 'INR',
    priceText: '',
    state: '',
    continent: '',
    groupType: ''
  });

  const [pricingMode, setPricingMode] = useState('Structured');
  
  // Pricing notes with categories
  const [pricingNotes, setPricingNotes] = useState(['']);
  const [pricingNoteCategories, setPricingNoteCategories] = useState(['booking']); // Track category for each note
  
  const [itinerary, setItinerary] = useState([
    { day: 1, title: '', activities: [''] }
  ]);
  
  const [inclusions, setInclusions] = useState(['']);
  const [exclusions, setExclusions] = useState(['']);
  const [departureDates, setDepartureDates] = useState(['']);
  const [cardImage, setCardImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States and continents lists
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
    'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const continents = [
    'Asia', 'Europe', 'North America', 'Middle East', 
    'Africa', 'Oceania', 'South America'
  ];

  const groupTypes = ['Domestic', 'International', 'Pilgrimage'];

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Snackbar handlers
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showSuccess = (message) => {
    setSnackbar({ open: true, message: message, severity: 'success' });
  };

  const showError = (message) => {
    setSnackbar({ open: true, message: message, severity: 'error' });
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        state: '',
        continent: '',
        groupType: ''
      }));
    }
  };

  const handlePricingModeChange = (mode) => {
    setPricingMode(mode);
  };

  // ✅ NEW: Pricing notes with category handlers
  const handlePricingNoteChange = (index, value) => {
    const newNotes = [...pricingNotes];
    newNotes[index] = value;
    setPricingNotes(newNotes);
  };

  const handlePricingNoteCategoryChange = (index, category) => {
    const newCategories = [...pricingNoteCategories];
    newCategories[index] = category;
    setPricingNoteCategories(newCategories);
  };

  const addPricingNote = () => {
    setPricingNotes([...pricingNotes, '']);
    setPricingNoteCategories([...pricingNoteCategories, 'notes']); // Default to 'notes'
  };

  const removePricingNote = (index) => {
    if (pricingNotes.length > 1) {
      const newNotes = [...pricingNotes];
      const newCategories = [...pricingNoteCategories];
      newNotes.splice(index, 1);
      newCategories.splice(index, 1);
      setPricingNotes(newNotes);
      setPricingNoteCategories(newCategories);
    }
  };

  // Card image handlers
  const handleCardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Itinerary handlers
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

  // Departure dates handlers
  const handleDepartureDateChange = (index, value) => {
    const newDates = [...departureDates];
    newDates[index] = value;
    setDepartureDates(newDates);
  };

  const addDepartureDate = () => {
    setDepartureDates([...departureDates, '']);
  };

  const removeDepartureDate = (index) => {
    if (departureDates.length > 1) {
      const newDates = [...departureDates];
      newDates.splice(index, 1);
      setDepartureDates(newDates);
    }
  };

  // Inclusions/Exclusions handlers
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

  const removeInclusion = (index) => {
    if (inclusions.length > 1) {
      const newInclusions = [...inclusions];
      newInclusions.splice(index, 1);
      setInclusions(newInclusions);
    }
  };

  const removeExclusion = (index) => {
    if (exclusions.length > 1) {
      const newExclusions = [...exclusions];
      newExclusions.splice(index, 1);
      setExclusions(newExclusions);
    }
  };

  // Dashboard refresh
  const triggerDashboardRefresh = () => {
    console.log('Triggering dashboard refresh...');
    localStorage.setItem('dashboardRefresh', Date.now().toString());
    window.dispatchEvent(new CustomEvent('dashboardRefresh'));
    setTimeout(() => {
      localStorage.setItem('dashboardRefresh', (Date.now() + 1).toString());
    }, 100);
    setTimeout(() => {
      localStorage.setItem('dashboardRefresh', (Date.now() + 2).toString());
    }, 500);
  };

  // Submit handlers
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
        
        showSuccess("🎉 Package added successfully!");
        triggerDashboardRefresh();
        
        setTimeout(() => {
          // Reset form
          setFormData({
            name: '',
            category: 'Domestic',
            duration: '',
            pricePerPerson: '',
            currency: 'INR',
            priceText: '',
            state: '',
            continent: '',
            groupType: ''
          });
          setItinerary([{ day: 1, title: '', activities: [''] }]);
          setInclusions(['']);
          setExclusions(['']);
          setDepartureDates(['']);
          setPricingNotes(['']);
          setPricingNoteCategories(['booking']);
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
    
    // ✅ Create categorized notes object
    const categorizedNotes = {
      booking: [],
      notes: []
    };

    pricingNotes.forEach((note, index) => {
      if (note.trim()) {
        const category = pricingNoteCategories[index] || 'notes';
        categorizedNotes[category].push(note.trim());
      }
    });

    const packageData = {
      ...formData,
      pricingMode,
      // Send categorized notes
      pricingNotes: pricingNotes.filter(note => note.trim()),
      pricingNoteCategories: categorizedNotes, // NEW: Send categorized structure
      priceNote: pricingNotes.filter(note => note.trim()).join(' | '), // Legacy format
      itinerary: itinerary.filter(day => day.title && day.activities.some(act => act)),
      inclusions: inclusions.filter(inc => inc.trim()),
      exclusions: exclusions.filter(exc => exc.trim()),
      departureDates: departureDates.filter(date => date.trim())
    };

    await addPackage(packageData, cardImage);
  };
  // ... continuing from Part 1

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

          {/* Group Type Selection */}
          {formData.category === 'Group' && (
            <div className="form-row">
              <div className="form-group">
                <label>Group Type <span style={{color: '#e74c3c'}}>*</span></label>
                <select
                  name="groupType"
                  value={formData.groupType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choose Group Type...</option>
                  {groupTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Location Selection */}
          <div className="form-row">
            {formData.category === 'Domestic' && (
              <div className="form-group">
                <label>Select State/UT <span style={{color: '#e74c3c'}}>*</span></label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choose State/Union Territory...</option>
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
        </div>

        {/* Departure Dates Section */}
        <div className="form-section">
          <h2>Departure Dates <span style={{color: '#666', fontSize: '0.9rem', fontWeight: 'normal'}}>(Optional)</span></h2>
          
          {departureDates.map((date, index) => (
            <div key={index} className="departure-date-row">
              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => handleDepartureDateChange(index, e.target.value)}
                  className="departure-date-input"
                />
              </div>
              {departureDates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDepartureDate(index)}
                  className="remove-date-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addDepartureDate} className="add-date-btn">
            📅 Add Departure Date
          </button>
        </div>

        {/* Enhanced Pricing Section with Category Selection */}
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

              {/* ✅ NEW: Enhanced Pricing Notes with Category Selection */}
              <div className="form-group full-width">
                <label>
                  Pricing Notes <span style={{color: '#666', fontSize: '0.9rem', fontWeight: 'normal'}}>(Categorized)</span>
                </label>
                <p style={{color: '#666', fontSize: '0.9rem', margin: '0 0 15px 0'}}>
                  💡 Add notes and select if they're Booking Policy or General Notes
                </p>
                
                {pricingNotes.map((note, index) => (
                  <div key={index} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 200px auto', 
                    gap: '10px', 
                    marginBottom: '12px',
                    alignItems: 'start',
                    background: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e1e5e9'
                  }}>
                    {/* Note Input */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handlePricingNoteChange(index, e.target.value)}
                        placeholder={
                          index === 0 ? 'e.g., Booking Policy' : 
                          index === 1 ? 'e.g., Full payment for flights required' : 
                          'Add pricing note...'
                        }
                        style={{
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e1e5e9',
                          fontSize: '0.95rem',
                          width: '100%'
                        }}
                      />
                    </div>
                    
                    {/* Category Selector */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <select
                        value={pricingNoteCategories[index] || 'notes'}
                        onChange={(e) => handlePricingNoteCategoryChange(index, e.target.value)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '2px solid',
                          borderColor: pricingNoteCategories[index] === 'booking' ? '#2196F3' : '#ff9800',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          background: pricingNoteCategories[index] === 'booking' ? '#e3f2fd' : '#fff8e1',
                          color: pricingNoteCategories[index] === 'booking' ? '#1976D2' : '#f57f17',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        <option value="booking">📋 Booking Policy</option>
                        <option value="notes">💰 Notes</option>
                      </select>
                    </div>
                    
                    {/* Remove Button */}
                    {pricingNotes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePricingNote(index)}
                        style={{
                          background: '#ffebee',
                          color: '#d32f2f',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addPricingNote}
                  style={{
                    background: '#e8f5e8',
                    color: '#2e7d32',
                    border: '1px solid #4caf50',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginTop: '10px',
                    width: '100%'
                  }}
                >
                  ➕ Add Pricing Note
                </button>

                {/* Preview Categorized Notes */}
                {pricingNotes.some(note => note.trim()) && (
                  <div style={{
                    marginTop: '20px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px'
                  }}>
                    {/* Booking Policy Preview */}
                    {pricingNotes.some((note, i) => note.trim() && pricingNoteCategories[i] === 'booking') && (
                      <div style={{
                        background: '#e3f2fd',
                        border: '2px solid #2196F3',
                        borderRadius: '8px',
                        padding: '15px'
                      }}>
                        <span style={{ 
                          fontWeight: '600', 
                          color: '#1976D2',
                          display: 'block',
                          marginBottom: '10px',
                          fontSize: '0.95rem'
                        }}>
                          📋 Booking Policy Preview:
                        </span>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#333', fontSize: '0.9rem' }}>
                          {pricingNotes.map((note, i) => 
                            note.trim() && pricingNoteCategories[i] === 'booking' ? (
                              <li key={i} style={{ marginBottom: '5px' }}>{note}</li>
                            ) : null
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Notes Preview */}
                    {pricingNotes.some((note, i) => note.trim() && pricingNoteCategories[i] === 'notes') && (
                      <div style={{
                        background: '#fff8e1',
                        border: '2px solid #ff9800',
                        borderRadius: '8px',
                        padding: '15px'
                      }}>
                        <span style={{ 
                          fontWeight: '600', 
                          color: '#f57f17',
                          display: 'block',
                          marginBottom: '10px',
                          fontSize: '0.95rem'
                        }}>
                          💰 Notes Preview:
                        </span>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#333', fontSize: '0.9rem' }}>
                          {pricingNotes.map((note, i) => 
                            note.trim() && pricingNoteCategories[i] === 'notes' ? (
                              <li key={i} style={{ marginBottom: '5px' }}>{note}</li>
                            ) : null
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
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
              />
            </div>
          )}
        </div>

        {/* Images Section */}
        <div className="form-section">
          <h2>Images</h2>
          <div className="form-group">
            <label>Card image (required)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCardImageChange}
              id="cardImage"
              required
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px', borderRadius: '8px' }} />
              </div>
            )}
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="form-section">
          <h2>Day-wise Itinerary</h2>
          {itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="itinerary-day">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3>Day {day.day}</h3>
                {itinerary.length > 1 && (
                  <button type="button" onClick={() => removeDay(dayIndex)} className="remove-btn">
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
                      style={{ flex: 1 }}
                    />
                    {day.activities.length > 1 && (
                      <button type="button" onClick={() => removeActivity(dayIndex, actIndex)} className="remove-btn small">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addActivity(dayIndex)} className="add-btn small">
                  + Add Activity
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addDay} className="add-btn full-width">
            + Add Day
          </button>
        </div>

        {/* Inclusions Section */}
        <div className="form-section">
          <h2>Inclusions</h2>
          {inclusions.map((inclusion, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                value={inclusion}
                onChange={(e) => handleArrayChange(index, e.target.value, 'inclusions')}
                placeholder="Inclusion item"
                style={{ flex: 1 }}
              />
              {inclusions.length > 1 && (
                <button type="button" onClick={() => removeInclusion(index)} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('inclusions')} className="add-btn">
            + Add Inclusion
          </button>
        </div>

        {/* Exclusions Section */}
        <div className="form-section">
          <h2>Exclusions</h2>
          {exclusions.map((exclusion, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                value={exclusion}
                onChange={(e) => handleArrayChange(index, e.target.value, 'exclusions')}
                placeholder="Exclusion item"
                style={{ flex: 1 }}
              />
              {exclusions.length > 1 && (
                <button type="button" onClick={() => removeExclusion(index)} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('exclusions')} className="add-btn">
            + Add Exclusion
          </button>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            {isSubmitting ? '⏳ Saving Package...' : '💾 Save Package'}
          </button>
        </div>
      </form>

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddPackage;
