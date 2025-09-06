import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import './AddPackage.css'; // Reuse the same CSS

const EditPackage = () => {
  const { id } = useParams(); // Get package ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Domestic',
    duration: '',
    pricePerPerson: '',
    currency: 'INR',
    priceNote: '',
    priceText: ''
  });

  const [pricingMode, setPricingMode] = useState('Structured');
  const [itinerary, setItinerary] = useState([
    { day: 1, title: '', activities: [''] }
  ]);
  
  const [inclusions, setInclusions] = useState(['']);
  const [exclusions, setExclusions] = useState(['']);
  const [cardImage, setCardImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingCardImage, setExistingCardImage] = useState('');

  // Load existing package data
  useEffect(() => {
    const loadPackage = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/packages/${id}`);
        if (response.ok) {
          const packageData = await response.json();
          
          // Populate form with existing data
          setFormData({
            name: packageData.title || '',
            category: packageData.category || 'Domestic',
            duration: packageData.duration || '',
            pricePerPerson: packageData.pricePerPerson || '',
            currency: packageData.currency || 'INR',
            priceNote: packageData.priceNote || '',
            priceText: packageData.priceText || ''
          });

          setPricingMode(packageData.pricingMode || 'Structured');
          setItinerary(packageData.itinerary && packageData.itinerary.length > 0 
            ? packageData.itinerary 
            : [{ day: 1, title: '', activities: [''] }]
          );
          setInclusions(packageData.inclusions && packageData.inclusions.length > 0 
            ? packageData.inclusions 
            : ['']
          );
          setExclusions(packageData.exclusions && packageData.exclusions.length > 0 
            ? packageData.exclusions 
            : ['']
          );
          
          // Set existing image
          if (packageData.cardImage) {
            setExistingCardImage(packageData.cardImage);
            setImagePreview(`http://localhost:5000/${packageData.cardImage}`);
          }
          
        } else {
          toast.error('Package not found');
          navigate('/admin');
        }
      } catch (error) {
        toast.error('Error loading package');
        console.error('Error loading package:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPackage();
    }
  }, [id, navigate]);

  // Handle basic form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const addDay = () => {
    setItinerary([...itinerary, {
      day: itinerary.length + 1,
      title: '',
      activities: ['']
    }]);
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

  // Update package
  const updatePackage = async (packageData, cardImage) => {
    try {
      const formDataToSend = new FormData();
      
      // Only append image if new one is selected
      if (cardImage) {
        formDataToSend.append("card_image", cardImage);
      }

      formDataToSend.append("data", JSON.stringify(packageData));

      const response = await fetch(`http://localhost:5000/api/packages/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedPackage = await response.json();
        toast.success("Package updated successfully!");
        
        // Signal dashboard to refresh
        localStorage.setItem('dashboardRefresh', Date.now().toString());
        
        return updatedPackage;
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating package:", error);
      toast.error(`Failed to update package: ${error.message}`);
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

    await updatePackage(packageData, cardImage);
  };

  if (loading) {
    return (
      <div className="add-package-container">
        <div className="add-package-header">
          <h1>Loading Package...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="add-package-container">
      <div className="add-package-header">
        <h1>Edit Package</h1>
        <p>Update package details and save changes.</p>
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
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
                <option value="pilgrimage">Pilgrimage</option>
                <option value="group">Group</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
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
                  <label>Price per person</label>
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
              <label>Card image</label>
              <div className="file-input-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCardImageChange}
                  id="cardImage"
                  className="file-input"
                />
                <label htmlFor="cardImage" className="file-input-label">
                  Choose New File
                </label>
              </div>
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Card preview" />
                  <p className="image-note">
                    {cardImage ? 'New image selected' : 'Current image'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Day-wise Itinerary Section */}
        <div className="form-section">
          <h2>Day-wise Itinerary</h2>
          
          {itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="itinerary-day">
              <h3>Day {day.day}</h3>
              
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
                  <input
                    key={actIndex}
                    type="text"
                    value={activity}
                    onChange={(e) => handleActivityChange(dayIndex, actIndex, e.target.value)}
                    placeholder="Activity description"
                    className="activity-input"
                  />
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

        {/* Inclusions Section */}
        <div className="form-section">
          <h2>Inclusions</h2>
          
          {inclusions.map((inclusion, index) => (
            <div key={index} className="form-group">
              <input
                type="text"
                value={inclusion}
                onChange={(e) => handleArrayChange(index, e.target.value, 'inclusions')}
                placeholder="Inclusion item"
              />
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

        {/* Exclusions Section */}
        <div className="form-section">
          <h2>Exclusions</h2>
          
          {exclusions.map((exclusion, index) => (
            <div key={index} className="form-group">
              <input
                type="text"
                value={exclusion}
                onChange={(e) => handleArrayChange(index, e.target.value, 'exclusions')}
                placeholder="Exclusion item"
              />
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
          <button type="submit" className="save-btn">
            💾 Update Package
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPackage;
