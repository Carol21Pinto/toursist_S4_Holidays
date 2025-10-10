import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import './AddPackage.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${SERVER_BASE}/${cleanPath}`;
};

const convertCategoryToFrontend = (dbCategory) => {
  if (!dbCategory) return 'Domestic';
  const categoryMap = {
    'domestic': 'Domestic',
    'international': 'International',
    'pilgrimage': 'Pilgrimage',
    'group': 'Group'
  };
  return categoryMap[dbCategory.toLowerCase()] || 'Domestic';
};

const convertCategoryToDatabase = (frontendCategory) => {
  const categoryMap = {
    'Domestic': 'domestic',
    'International': 'international',
    'Pilgrimage': 'pilgrimage',
    'Group': 'group'
  };
  return categoryMap[frontendCategory] || 'domestic';
};

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  // ✅ NEW: Pricing notes with categories
  const [pricingNotes, setPricingNotes] = useState(['']);
  const [pricingNoteCategories, setPricingNoteCategories] = useState(['booking']);
  
  const [itinerary, setItinerary] = useState([{ day: 1, title: '', activities: [''] }]);
  const [inclusions, setInclusions] = useState(['']);
  const [exclusions, setExclusions] = useState(['']);
  const [departureDates, setDepartureDates] = useState(['']);
  const [cardImage, setCardImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState('');

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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

  // ✅ UPDATED: Fetch package with categorized notes support
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/packages/${id}`);
        if (response.ok) {
          const packageData = await response.json();
          
          console.log('=== EDIT PACKAGE DEBUG ===');
          console.log('Package data:', packageData);
          console.log('Pricing Note Categories:', packageData.pricingNoteCategories);
          
          const categoryForFrontend = convertCategoryToFrontend(packageData.category);
          
          setFormData({
            name: packageData.title || '',
            category: categoryForFrontend,
            duration: packageData.duration || '',
            pricePerPerson: packageData.pricePerPerson || '',
            currency: packageData.currency || 'INR',
            priceText: packageData.priceText || '',
            state: packageData.state || '',
            continent: packageData.continent || '',
            groupType: packageData.groupType || ''
          });

          setPricingMode(packageData.pricingMode || 'Structured');
          
          // ✅ NEW: Load categorized notes if available
          if (packageData.pricingNoteCategories && 
              (packageData.pricingNoteCategories.booking || packageData.pricingNoteCategories.notes)) {
            // New format with categories
            const bookingNotes = packageData.pricingNoteCategories.booking || [];
            const generalNotes = packageData.pricingNoteCategories.notes || [];
            
            const allNotes = [];
            const allCategories = [];
            
            // Add booking notes
            bookingNotes.forEach(note => {
              allNotes.push(note);
              allCategories.push('booking');
            });
            
            // Add general notes
            generalNotes.forEach(note => {
              allNotes.push(note);
              allCategories.push('notes');
            });
            
            setPricingNotes(allNotes.length ? allNotes : ['']);
            setPricingNoteCategories(allCategories.length ? allCategories : ['booking']);
            
            console.log('✅ Loaded categorized notes:', { allNotes, allCategories });
          } else if (packageData.pricingNotes && Array.isArray(packageData.pricingNotes)) {
            // Array format without categories - default all to 'notes'
            setPricingNotes(packageData.pricingNotes.length ? packageData.pricingNotes : ['']);
            setPricingNoteCategories(packageData.pricingNotes.map(() => 'notes'));
          } else if (packageData.priceNote) {
            // Legacy format - split by pipe
            const notesFromString = packageData.priceNote.split(' | ').filter(note => note.trim());
            setPricingNotes(notesFromString.length ? notesFromString : ['']);
            setPricingNoteCategories(notesFromString.map(() => 'notes'));
          } else {
            setPricingNotes(['']);
            setPricingNoteCategories(['booking']);
          }
          
          setItinerary(packageData.itinerary?.length ? packageData.itinerary : [{ day: 1, title: '', activities: [''] }]);
          setInclusions(packageData.inclusions?.length ? packageData.inclusions : ['']);
          setExclusions(packageData.exclusions?.length ? packageData.exclusions : ['']);
          setDepartureDates(packageData.departureDates?.length ? packageData.departureDates : ['']);
          setExistingImage(packageData.cardImage || '');
        } else {
          showError('❌ Package not found. Redirecting...');
          setTimeout(() => navigate('/admin/packages'), 2000);
        }
      } catch (error) {
        console.error('Error fetching package:', error);
        showError('❌ Error loading package data.');
        setTimeout(() => navigate('/admin/packages'), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPackage();
  }, [id, navigate]);

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
    setPricingNoteCategories([...pricingNoteCategories, 'notes']);
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

  const handleCardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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

  const updatePackage = async (packageData, cardImage) => {
    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      
      if (cardImage) {
        formDataToSend.append("card_image", cardImage);
      }

      formDataToSend.append("data", JSON.stringify(packageData));

      const response = await fetch(`${API_URL}/packages/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedPackage = await response.json();
        console.log('Package updated:', updatedPackage);
        
        showSuccess("✅ Package updated successfully!");
        
        localStorage.setItem('dashboardRefresh', Date.now().toString());
        window.dispatchEvent(new CustomEvent('dashboardRefresh'));
        
        setTimeout(() => {
          navigate('/admin/packages');
        }, 2000);
        
        return updatedPackage;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating package:", error);
      showError(`❌ Failed to update: ${error.message}`);
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

    const categoryForDatabase = convertCategoryToDatabase(formData.category);
    
    const packageData = {
      ...formData,
      category: categoryForDatabase,
      pricingMode,
      pricingNotes: pricingNotes.filter(note => note.trim()),
      pricingNoteCategories: categorizedNotes, // ✅ NEW: Send categorized structure
      priceNote: pricingNotes.filter(note => note.trim()).join(' | '),
      itinerary: itinerary.filter(day => day.title && day.activities.some(act => act)),
      inclusions: inclusions.filter(inc => inc.trim()),
      exclusions: exclusions.filter(exc => exc.trim()),
      departureDates: departureDates.filter(date => date.trim())
    };

    console.log('Submitting package data:', packageData);
    console.log('Categorized Notes:', categorizedNotes);

    await updatePackage(packageData, cardImage);
  };

  if (loading) {
    return (
      <div className="add-package-container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading package data...</h2>
      </div>
    );
  }
  // ... continuing from Part 1

  return (
    <div className="add-package-container">
      <div className="add-package-header">
        <h1>Edit Package</h1>
        <p>Update your travel package details</p>
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
                />
              </div>
              {departureDates.length > 1 && (
                <button type="button" onClick={() => removeDepartureDate(index)} className="remove-date-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addDepartureDate} className="add-date-btn">
            📅 Add Departure Date
          </button>
        </div>

        {/* Pricing Section with Categorized Notes */}
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

              {/* ✅ NEW: Categorized Pricing Notes Section */}
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
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handlePricingNoteChange(index, e.target.value)}
                        placeholder={index === 0 ? 'e.g., Booking Policy' : 'Add pricing note...'}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e1e5e9',
                          fontSize: '0.95rem',
                          width: '100%'
                        }}
                      />
                    </div>
                    
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
            <label>Card image</label>
            
            {existingImage && !imagePreview && (
              <div className="image-preview">
                <img 
                  src={getImageUrl(existingImage)} 
                  alt="Current"
                  style={{
                    maxWidth: '300px',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef'
                  }}
                />
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '8px 0' }}>
                  Current image
                </p>
              </div>
            )}
            
            {imagePreview && (
              <div className="image-preview">
                <img 
                  src={imagePreview} 
                  alt="New"
                  style={{
                    maxWidth: '300px',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    border: '2px solid #4ecdc4'
                  }}
                />
                <p style={{ color: '#4ecdc4', fontSize: '0.9rem', margin: '8px 0', fontWeight: '600' }}>
                  ✅ New image selected
                </p>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={handleCardImageChange}
              id="cardImage"
              style={{ marginTop: '15px' }}
            />
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

        {/* Submit Buttons */}
        <div className="submit-section">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/admin/packages')}
            disabled={isSubmitting}
            style={{
              background: '#f5f5f5',
              color: '#666',
              border: '2px solid #ddd',
              padding: '16px 30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginRight: '15px'
            }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Updating Package...' : '💾 Update Package'}
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            fontSize: '1rem',
            fontWeight: 500,
            '& .MuiAlert-icon': { fontSize: '1.2rem' },
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            borderRadius: '12px'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditPackage;
