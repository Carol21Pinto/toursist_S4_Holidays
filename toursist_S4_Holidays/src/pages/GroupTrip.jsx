import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupTrip.css';

export default function GroupTrip() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroupType, setSelectedGroupType] = useState('family');
  const [groupSize, setGroupSize] = useState(4);
  const [activeActivity, setActiveActivity] = useState(0);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // FIXED: Safe image handling (same as Domestic)
  const SERVER_BASE = 'http://localhost:5000';
  const FALLBACK = '/images/placeholder-card.jpg';

  const pickPrimaryImagePath = (pkg) => {
    const fromCard = Array.isArray(pkg?.cardImage)
      ? pkg.cardImage.find(p => typeof p === 'string' && p.trim())
      : (typeof pkg?.cardImage === 'string' && pkg.cardImage.trim() ? pkg.cardImage : null);

    if (fromCard) return fromCard;

    const imgs = pkg?.images;
    if (Array.isArray(imgs)) {
      const first = imgs.find(p => typeof p === 'string' && p.trim());
      if (first) return first;
    } else if (typeof imgs === 'string' && imgs.trim()) {
      return imgs;
    }

    return null;
  };

  const getImageUrl = (path) => {
    if (typeof path !== 'string' || !path.trim()) return FALLBACK;
    const fixed = path.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(fixed)) return fixed;
    return `${SERVER_BASE}/${fixed.startsWith('/') ? fixed.slice(1) : fixed}`;
  };

  const applyFallback = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/packages/category/group`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
        console.log('Fetched group packages:', data);
      } else {
        console.error('Failed to fetch group packages');
      }
    } catch (error) {
      console.error('Error fetching group packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupTypes = [
    { id: 'family', name: 'Family Trips', icon: '👨‍👩‍👧‍👦', description: 'Perfect family bonding experiences', basePrice: 15000, color: '#ff6b6b' },
    { id: 'friends', name: 'Friends Getaway', icon: '👥', description: 'Adventure with your squad', basePrice: 12000, color: '#4ecdc4' },
    { id: 'corporate', name: 'Corporate Tours', icon: '💼', description: 'Team building & networking', basePrice: 18000, color: '#45b7d1' },
    { id: 'wedding', name: 'Wedding Groups', icon: '💒', description: 'Celebrate special moments', basePrice: 25000, color: '#f093fb' }
  ];

  const groupActivities = [
    { id: 1, title: 'Adventure Sports', icon: '🏄‍♂️', description: 'Thrilling activities like rafting, trekking, and paragliding', image: '/images/adventure.jpg' },
    { id: 2, title: 'Cultural Experiences', icon: '🎭', description: 'Local traditions, folk dances, and cultural immersion', image: '/images/culture.jpg' },
    { id: 3, title: 'Team Building', icon: '🤝', description: 'Games, workshops, and collaborative challenges', image: '/images/teambuilding.jpg' },
    { id: 4, title: 'Food Tours', icon: '🍽️', description: 'Culinary adventures and local cuisine experiences', image: '/images/food.jpg' }
  ];

  const formatPrice = (price, currency) => `From ${currency}${price.toLocaleString()}/person`;
  const formatDuration = (pkg) =>
    (pkg.itinerary && pkg.itinerary.length > 0)
      ? `${pkg.itinerary.length} ${pkg.itinerary.length === 1 ? 'Day' : 'Days'}`
      : '4 Days';

  const calculatePrice = () => {
    const selectedType = groupTypes.find(type => type.id === selectedGroupType);
    let basePrice = selectedType.basePrice;
    if (groupSize >= 10) basePrice *= 0.85;
    else if (groupSize >= 6) basePrice *= 0.90;
    else if (groupSize >= 4) basePrice *= 0.95;
    return Math.round(basePrice);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveActivity((prev) => (prev + 1) % groupActivities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="group-trip">
        {/* Hero Section */}
        <section className="group-hero"> <div className="hero-background"></div> <div className="hero-content"> <div className="hero-subtitle">S4 HOLIDAYS</div> <h1 className="hero-title"> <span className="title-part">Group</span> <span className="title-part highlight">Adventures</span> <span className="title-part">Await!</span> </h1> </div> </section>

        {/* Popular Group Destinations */}
        <section className="group-destinations">
          <div className="container">
            <h2 className="section-title">Popular Group Destinations</h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
                Loading group packages...
              </div>
            ) : packages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
                No group packages found. Add some packages in the admin panel!
              </div>
            ) : (
              <div className="destinations-grid">
                {packages.map((pkg) => {
                  // FIXED: Safe image extraction
                  const primaryPath = pickPrimaryImagePath(pkg);
                  const imgUrl = getImageUrl(primaryPath);
                  console.log('[IMG DEBUG]', pkg.title, { primaryPath, imgUrl });

                  return (
                    <div key={pkg._id} className="destination-card">
                      <div className="card-image">
                        <img
                          src={imgUrl}
                          alt={pkg.title}
                          onError={applyFallback}
                        />
                        <div className="group-size-badge">6-15 people</div>
                      </div>

                      <div className="card-content">
                        <h3>{pkg.title}</h3>
                        <div className="card-details">
                          <div className="price">
                            {formatPrice(pkg.pricePerPerson, pkg.currency)}
                          </div>
                          <div className="duration">{formatDuration(pkg)}</div>
                        </div>

                        <div className="activities-list">
                          {pkg.inclusions &&
                            pkg.inclusions.slice(0, 3).map((inclusion, index) => (
                              <span key={index} className="activity-tag">
                                {inclusion}
                              </span>
                            ))}
                        </div>

                        <button
                          className="book-group-btn"
                          onClick={() => navigate(`/package/${pkg._id}`)}
                        >
                          Book for Group
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div> {/* ✅ close wrapper */}

      {/* Footer */}
      {/* Footer */}
<footer className="simple-footer">
  <p>“The world is waiting — pack your bags!”</p>
</footer>

    </>
  );
}
