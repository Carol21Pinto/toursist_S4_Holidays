const Package = require('../models/Package');
const mongoose = require('mongoose');
const { cloudinary } = require('../config/cloudinary');

// ✅ Helper to ensure MongoDB connection before queries
async function ensureConnection() {
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️ MongoDB disconnected, reconnecting...');
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
        maxPoolSize: 10,
      });
      console.log('✅ Reconnected to MongoDB');
    } catch (error) {
      console.error('❌ Reconnection failed:', error);
      throw error;
    }
  }
}

// Safely parse JSON from multipart FormData
function parseMaybeJSON(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return value;
}

// Helper function to extract Cloudinary public_id from URL
function getCloudinaryPublicId(imageUrl) {
  if (!imageUrl || !imageUrl.includes('cloudinary')) return null;
  
  try {
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload/' and before the file extension
    const pathParts = parts.slice(uploadIndex + 2); // Skip 'upload' and version number
    const publicId = pathParts.join('/').replace(/\.[^/.]+$/, ''); // Remove extension
    
    return publicId;
  } catch (err) {
    console.error('Error extracting public_id:', err);
    return null;
  }
}

// NEW: Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    const packages = await Package.find({}).sort({ createdAt: -1 });
    console.log('All packages fetched:', packages.length);
    return res.json(packages);
  } catch (err) {
    console.error('GET_ALL_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// NEW: Get packages grouped by state with statistics (only states with packages)
exports.getPackagesGroupedByState = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    console.log('=== GET PACKAGES GROUPED BY STATE ===');
    
    // Get all domestic packages
    const domesticPackages = await Package.find({ category: 'domestic' }).sort({ createdAt: -1 });
    
    console.log('Total domestic packages found:', domesticPackages.length);
    
    // Group packages by state
    const stateGroups = {};
    
    domesticPackages.forEach(pkg => {
      const stateName = pkg.state || 'Unknown';
      
      if (!stateGroups[stateName]) {
        stateGroups[stateName] = {
          state: stateName,
          packages: [],
          tourCount: 0,
          departures: 0,
          guestsCount: 0
        };
      }
      
      stateGroups[stateName].packages.push(pkg);
      stateGroups[stateName].tourCount++;
      
      // Calculate departures (count departure dates)
      if (pkg.departureDates && Array.isArray(pkg.departureDates)) {
        stateGroups[stateName].departures += pkg.departureDates.length;
      }
      
      // For now, guestsCount can be a placeholder or calculated based on your logic
      // You can update this based on actual booking data if available
      stateGroups[stateName].guestsCount += Math.floor(Math.random() * 1000) + 100; // Placeholder
    });
    
    // Convert to array and filter out states with 0 packages
    const result = Object.values(stateGroups)
      .filter(group => group.tourCount > 0)
      .map(group => ({
        state: group.state,
        tourCount: group.tourCount,
        departures: group.departures,
        guestsCount: group.guestsCount,
        // Pick a representative image from the first package
        image: group.packages[0]?.cardImage || group.packages[0]?.images?.[0] || null
      }))
      .sort((a, b) => b.tourCount - a.tourCount); // Sort by tour count (highest first)
    
    console.log('States with packages:', result.length);
    console.log('State groups:', result.map(r => `${r.state}: ${r.tourCount} tours`));
    console.log('=== END GROUPED BY STATE ===');
    
    return res.json(result);
  } catch (err) {
    console.error('GROUPED_BY_STATE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Create new package (Updated for Cloudinary)
exports.createPackage = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    const packageData = JSON.parse(req.body.data);
    // Cloudinary automatically provides the full URL in req.file.path
    const cardImage = req.file ? req.file.path : '';
    
    // Debug logging
    console.log('=== CREATE PACKAGE DEBUG ===');
    console.log('Received packageData:', packageData);
    console.log('Category:', packageData.category);
    console.log('GroupType:', packageData.groupType);
    console.log('State:', packageData.state);
    console.log('Continent:', packageData.continent);
    console.log('Departure Dates:', packageData.departureDates);
    console.log('Cloudinary Image URL:', cardImage);
    
    const newPackage = new Package({
      title: packageData.name,
      category: packageData.category.toLowerCase(),
      
      // Location fields
      groupType: packageData.groupType || null,
      state: packageData.state || null,
      continent: packageData.continent || null,
      
      pricePerPerson: Number(packageData.pricePerPerson),
      currency: packageData.currency,
      priceNote: packageData.priceNote || '',
      duration: packageData.duration,
      pricingMode: packageData.pricingMode,
      priceText: packageData.priceText || '',
      
      departureDates: packageData.departureDates || [],
      
      cardImage: cardImage, // Cloudinary URL
      images: [],
      description: packageData.description || '',
      itinerary: packageData.itinerary || [],
      inclusions: packageData.inclusions || [],
      exclusions: packageData.exclusions || [],
      contactNumbers: [],
    });

    await newPackage.save();
    
    // Debug logging
    console.log('Package saved successfully:');
    console.log('ID:', newPackage._id);
    console.log('Title:', newPackage.title);
    console.log('Category:', newPackage.category);
    console.log('GroupType:', newPackage.groupType);
    console.log('State:', newPackage.state);
    console.log('Continent:', newPackage.continent);
    console.log('Departure Dates:', newPackage.departureDates);
    console.log('Image URL:', newPackage.cardImage);
    console.log('=== END CREATE DEBUG ===');
    
    console.log('Package created successfully:', newPackage._id, 'at', newPackage.createdAt);
    return res.status(201).json(newPackage);
  } catch (err) {
    console.error('CREATE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Update package (Updated for Cloudinary)
exports.updatePackage = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    console.log('UPDATE REQUEST - Package ID:', req.params.id);
    console.log('UPDATE REQUEST - Body:', req.body);
    console.log('UPDATE REQUEST - File:', req.file);

    const packageData = JSON.parse(req.body.data);
    console.log('Parsed package data:', packageData);
    console.log('Departure Dates in update:', packageData.departureDates);

    const updates = {
      title: packageData.name,
      category: packageData.category.toLowerCase(),
      
      // Location fields
      groupType: packageData.groupType || null,
      state: packageData.state || null,
      continent: packageData.continent || null,
      
      duration: packageData.duration,
      pricingMode: packageData.pricingMode,
      pricePerPerson: packageData.pricePerPerson ? Number(packageData.pricePerPerson) : undefined,
      currency: packageData.currency,
      priceNote: packageData.priceNote || '',
      priceText: packageData.priceText || '',
      
      departureDates: packageData.departureDates || [],
      
      itinerary: packageData.itinerary || [],
      inclusions: packageData.inclusions || [],
      exclusions: packageData.exclusions || [],
    };

    // If new image uploaded
    if (req.file) {
      // Get old package to delete old image from Cloudinary
      const oldPackage = await Package.findById(req.params.id);
      
      if (oldPackage && oldPackage.cardImage) {
        // Delete old image from Cloudinary
        const publicId = getCloudinaryPublicId(oldPackage.cardImage);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log('Old Cloudinary image deleted:', publicId);
          } catch (deleteErr) {
            console.error('Error deleting old Cloudinary image:', deleteErr);
          }
        }
      }
      
      updates.cardImage = req.file.path; // New Cloudinary URL
      console.log('New image uploaded:', req.file.path);
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    console.log('Final updates object:', updates);

    const pkg = await Package.findByIdAndUpdate(req.params.id, updates, { new: true });
    
    if (!pkg) {
      console.log('Package not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Package not found' });
    }

    // Debug logging
    console.log('Package updated successfully:');
    console.log('ID:', pkg._id);
    console.log('GroupType:', pkg.groupType);
    console.log('State:', pkg.state);
    console.log('Continent:', pkg.continent);
    console.log('Departure Dates:', pkg.departureDates);
    console.log('Image URL:', pkg.cardImage);

    console.log('Package updated successfully:', pkg._id, 'at', pkg.updatedAt);
    return res.json(pkg);
  } catch (err) {
    console.error('UPDATE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Get all by category (latest first)
exports.getPackagesByCategory = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    const { category } = req.params;
    const packages = await Package.find({ category }).sort({ createdAt: -1 });
    return res.json(packages);
  } catch (err) {
    console.error('LIST_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Get single
exports.getPackage = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    return res.json(pkg);
  } catch (err) {
    console.error('GET_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Delete with Cloudinary cleanup
exports.deletePackage = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    const { id } = req.params;
    
    // First, find the package to get image URLs before deletion
    const packageToDelete = await Package.findById(id);
    
    if (!packageToDelete) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Collect all image URLs from the package
    const imageUrls = [];
    
    // Add cardImage (main package image)
    if (packageToDelete.cardImage) {
      imageUrls.push(packageToDelete.cardImage);
    }
    
    // Add images array (gallery images)
    if (packageToDelete.images && Array.isArray(packageToDelete.images)) {
      imageUrls.push(...packageToDelete.images);
    }
    
    // Add itinerary images if they exist
    if (packageToDelete.itinerary && Array.isArray(packageToDelete.itinerary)) {
      packageToDelete.itinerary.forEach(day => {
        if (day.image) {
          imageUrls.push(day.image);
        }
      });
    }
    
    // Delete package from database first
    const deletedPackage = await Package.findByIdAndDelete(id);
    
    // Now delete the associated images from Cloudinary
    let deletedFilesCount = 0;
    
    for (const imageUrl of imageUrls) {
      if (!imageUrl) continue;
      
      try {
        const publicId = getCloudinaryPublicId(imageUrl);
        
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          deletedFilesCount++;
          console.log(`Cloudinary image deleted: ${publicId}`);
        }
      } catch (fileError) {
        console.error(`Error deleting Cloudinary image ${imageUrl}:`, fileError.message);
      }
    }
    
    console.log('Package deleted:', id, `(${deletedFilesCount} Cloudinary images cleaned up)`);
    return res.json({ message: 'Package deleted' });
    
  } catch (err) {
    console.error('DELETE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Stats
exports.getPackageStats = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    const categories = ['domestic', 'international', 'pilgrimage', 'group'];
    const stats = {};
    for (const category of categories) {
      stats[category] = await Package.countDocuments({ category });
    }
    stats.total = await Package.countDocuments({});
    console.log('Stats generated:', stats);
    return res.json(stats);
  } catch (err) {
    console.error('STATS_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Real-time package timeline
exports.getPackageTimeline = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    console.log('=== PACKAGE TIMELINE DEBUG ===');
    
    const packages = await Package.find({})
      .select('title category createdAt')
      .sort({ createdAt: 1 });
    
    console.log('Total packages found:', packages.length);
    console.log('Packages:', packages.map(p => ({ title: p.title, created: p.createdAt })));
    
    if (packages.length === 0) {
      console.log('No packages found - returning empty timeline');
      const emptyTimeline = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString(undefined, { 
          month: 'short', 
          day: 'numeric' 
        });
        emptyTimeline.push({
          name: dayName,
          packages: 0,
          date: d.toISOString().slice(0, 10),
          added: 0
        });
      }
      return res.json(emptyTimeline);
    }

    const dateGroups = {};
    
    packages.forEach(pkg => {
      const date = pkg.createdAt.toISOString().slice(0, 10);
      if (!dateGroups[date]) {
        dateGroups[date] = 0;
      }
      dateGroups[date]++;
    });

    console.log('Date groups:', dateGroups);

    let cumulativeCount = 0;
    const sortedDates = Object.keys(dateGroups).sort();
    const timeline = [];
    
    sortedDates.forEach(date => {
      cumulativeCount += dateGroups[date];
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });
      
      timeline.push({
        name: dayName,
        packages: cumulativeCount,
        date: date,
        added: dateGroups[date]
      });
    });

    const finalTimeline = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });
      
      const existingPoint = timeline.find(point => point.date === key);
      
      if (existingPoint) {
        finalTimeline.push(existingPoint);
      } else {
        const lastCount = finalTimeline.length > 0 ? 
          finalTimeline[finalTimeline.length - 1].packages : 
          (timeline.length > 0 ? timeline[timeline.length - 1].packages : 0);
          
        finalTimeline.push({
          name: dayName,
          packages: lastCount,
          date: key,
          added: 0
        });
      }
    }

    console.log('Final timeline data:', finalTimeline);
    console.log('=== END PACKAGE TIMELINE DEBUG ===');
    
    return res.json(finalTimeline);
  } catch (err) {
    console.error('TIMELINE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Weekly counts for chart (backup)
exports.getWeeklyCounts = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    const today = new Date();
    const start = new Date(today);
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - 6);

    console.log('=== WEEKLY CHART DEBUG ===');
    console.log('Date range for weekly chart:', start, 'to', today);

    const allPackages = await Package.find({}).sort({ createdAt: -1 }).limit(10);
    console.log('Recent packages in database:');
    allPackages.forEach(pkg => {
      console.log(`- ${pkg.title} (${pkg.category}) created: ${pkg.createdAt}`);
    });

    const pipeline = [
      { $match: { createdAt: { $gte: start } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, date: "$_id", count: 1 } },
      { $sort: { date: 1 } }
    ];

    const rows = await Package.aggregate(pipeline);
    console.log('Aggregation results from MongoDB:', rows);

    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0,10);
      const found = rows.find(r => r.date === key);
      const day = d.toLocaleDateString(undefined, { weekday: "short" });
      out.push({ 
        name: day, 
        packages: found ? found.count : 0,
        date: key
      });
    }
    
    console.log('Final weekly chart data:', out);
    console.log('=== END WEEKLY CHART DEBUG ===');
    
    return res.json(out);
  } catch (err) {
    console.error('WEEKLY_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// NEW: Get packages grouped by continent with statistics (only continents with packages)
exports.getPackagesGroupedByContinent = async (req, res) => {
  try {
    await ensureConnection(); // ✅ Ensure connection
    console.log('=== GET PACKAGES GROUPED BY CONTINENT ===');
    
    // Get all international packages
    const internationalPackages = await Package.find({ category: 'international' }).sort({ createdAt: -1 });
    
    console.log('Total international packages found:', internationalPackages.length);
    
    // Group packages by continent
    const continentGroups = {};
    
    internationalPackages.forEach(pkg => {
      const continentName = pkg.continent || 'Unknown';
      
      if (!continentGroups[continentName]) {
        continentGroups[continentName] = {
          continent: continentName,
          packages: [],
          tourCount: 0
        };
      }
      
      continentGroups[continentName].packages.push(pkg);
      continentGroups[continentName].tourCount++;
    });
    
    // Convert to array and filter out continents with 0 packages
    const result = Object.values(continentGroups)
      .filter(group => group.tourCount > 0)
      .map(group => ({
        continent: group.continent,
        tourCount: group.tourCount,
        // Pick a representative image from the first package
        image: group.packages[0]?.cardImage || group.packages[0]?.images?.[0] || null
      }))
      .sort((a, b) => b.tourCount - a.tourCount); // Sort by tour count (highest first)
    
    console.log('Continents with packages:', result.length);
    console.log('Continent groups:', result.map(r => `${r.continent}: ${r.tourCount} tours`));
    console.log('=== END GROUPED BY CONTINENT ===');
    
    return res.json(result);
  } catch (err) {
    console.error('GROUPED_BY_CONTINENT_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};
