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
    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    const pathParts = parts.slice(uploadIndex + 2);
    const publicId = pathParts.join('/').replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (err) {
    console.error('Error extracting public_id:', err);
    return null;
  }
}

// ✅ OPTIMIZED: Get all packages (only essential fields)
exports.getAllPackages = async (req, res) => {
  try {
    await ensureConnection();
    
    // ⚡ Only select fields needed for listing
    const packages = await Package.find({})
      .select('title category duration state continent groupType pricePerPerson currency cardImage createdAt')
      .sort({ createdAt: -1 })
      .lean(); // ⚡ Faster than full Mongoose documents
    
    // ⚡ Add cache headers for 5 minutes
    res.set('Cache-Control', 'public, max-age=300');
    
    console.log('All packages fetched:', packages.length);
    return res.json(packages);
  } catch (err) {
    console.error('GET_ALL_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ OPTIMIZED: Get packages grouped by state (only states with packages)
exports.getPackagesGroupedByState = async (req, res) => {
  try {
    await ensureConnection();
    console.log('=== GET PACKAGES GROUPED BY STATE ===');
    
    // ⚡ Use aggregation for faster grouping
    const stateGroups = await Package.aggregate([
      { $match: { category: 'domestic', state: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$state',
          tourCount: { $sum: 1 },
          departures: { $sum: { $size: { $ifNull: ['$departureDates', []] } } },
          firstPackage: { $first: '$$ROOT' }
        }
      },
      {
        $project: {
          state: '$_id',
          tourCount: 1,
          departures: 1,
          guestsCount: { $add: [{ $multiply: ['$tourCount', 150] }, 100] }, // Placeholder calculation
          image: { $ifNull: ['$firstPackage.cardImage', '$firstPackage.images'] }
        }
      },
      { $sort: { tourCount: -1 } }
    ]);
    
    // ⚡ Add cache headers
    res.set('Cache-Control', 'public, max-age=600'); // 10 minutes
    
    console.log('States with packages:', stateGroups.length);
    console.log('=== END GROUPED BY STATE ===');
    
    return res.json(stateGroups);
  } catch (err) {
    console.error('GROUPED_BY_STATE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ OPTIMIZED: Get packages grouped by continent
exports.getPackagesGroupedByContinent = async (req, res) => {
  try {
    await ensureConnection();
    console.log('=== GET PACKAGES GROUPED BY CONTINENT ===');
    
    // ⚡ Use aggregation for faster grouping
    const continentGroups = await Package.aggregate([
      { $match: { category: 'international', continent: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$continent',
          tourCount: { $sum: 1 },
          firstPackage: { $first: '$$ROOT' }
        }
      },
      {
        $project: {
          continent: '$_id',
          tourCount: 1,
          image: { $ifNull: ['$firstPackage.cardImage', '$firstPackage.images'] }
        }
      },
      { $sort: { tourCount: -1 } }
    ]);
    
    // ⚡ Add cache headers
    res.set('Cache-Control', 'public, max-age=600');
    
    console.log('Continents with packages:', continentGroups.length);
    console.log('=== END GROUPED BY CONTINENT ===');
    
    return res.json(continentGroups);
  } catch (err) {
    console.error('GROUPED_BY_CONTINENT_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ OPTIMIZED: Get packages by category (only essential fields)
exports.getPackagesByCategory = async (req, res) => {
  try {
    await ensureConnection();
    const { category } = req.params;
    
    // ⚡ Only select needed fields
    const packages = await Package.find({ category })
      .select('title duration state continent groupType pricePerPerson currency cardImage departureDates description createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    // ⚡ Add cache headers
    res.set('Cache-Control', 'public, max-age=300');
    
    return res.json(packages);
  } catch (err) {
    console.error('LIST_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Get single package (full details)
exports.getPackage = async (req, res) => {
  try {
    await ensureConnection();
    const pkg = await Package.findById(req.params.id).lean(); // ⚡ Use lean
    
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    
    // ⚡ Cache individual package for 5 minutes
    res.set('Cache-Control', 'public, max-age=300');
    
    return res.json(pkg);
  } catch (err) {
    console.error('GET_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Create new package (unchanged logic)
exports.createPackage = async (req, res) => {
  try {
    await ensureConnection();
    const packageData = JSON.parse(req.body.data);
    const cardImage = req.file ? req.file.path : '';
    
    console.log('=== CREATE PACKAGE DEBUG ===');
    console.log('Received packageData:', packageData);
    console.log('Cloudinary Image URL:', cardImage);
    
    const newPackage = new Package({
      title: packageData.name,
      category: packageData.category.toLowerCase(),
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
      cardImage: cardImage,
      images: [],
      description: packageData.description || '',
      itinerary: packageData.itinerary || [],
      inclusions: packageData.inclusions || [],
      exclusions: packageData.exclusions || [],
      contactNumbers: [],
    });

    await newPackage.save();
    
    console.log('Package created successfully:', newPackage._id);
    console.log('=== END CREATE DEBUG ===');
    
    return res.status(201).json(newPackage);
  } catch (err) {
    console.error('CREATE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Update package (unchanged logic)
exports.updatePackage = async (req, res) => {
  try {
    await ensureConnection();
    console.log('UPDATE REQUEST - Package ID:', req.params.id);

    const packageData = JSON.parse(req.body.data);

    const updates = {
      title: packageData.name,
      category: packageData.category.toLowerCase(),
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

    if (req.file) {
      const oldPackage = await Package.findById(req.params.id);
      
      if (oldPackage && oldPackage.cardImage) {
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
      
      updates.cardImage = req.file.path;
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    const pkg = await Package.findByIdAndUpdate(req.params.id, updates, { new: true });
    
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    console.log('Package updated successfully:', pkg._id);
    return res.json(pkg);
  } catch (err) {
    console.error('UPDATE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Delete with Cloudinary cleanup (unchanged logic)
exports.deletePackage = async (req, res) => {
  try {
    await ensureConnection();
    const { id } = req.params;
    
    const packageToDelete = await Package.findById(id);
    
    if (!packageToDelete) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    const imageUrls = [];
    
    if (packageToDelete.cardImage) {
      imageUrls.push(packageToDelete.cardImage);
    }
    
    if (packageToDelete.images && Array.isArray(packageToDelete.images)) {
      imageUrls.push(...packageToDelete.images);
    }
    
    if (packageToDelete.itinerary && Array.isArray(packageToDelete.itinerary)) {
      packageToDelete.itinerary.forEach(day => {
        if (day.image) {
          imageUrls.push(day.image);
        }
      });
    }
    
    const deletedPackage = await Package.findByIdAndDelete(id);
    
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

// ✅ OPTIMIZED: Stats with caching
exports.getPackageStats = async (req, res) => {
  try {
    await ensureConnection();
    
    // ⚡ Use aggregation for faster counting
    const stats = await Package.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const result = {
      domestic: 0,
      international: 0,
      pilgrimage: 0,
      group: 0,
      total: 0
    };
    
    stats.forEach(stat => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });
    
    // ⚡ Cache for 10 minutes
    res.set('Cache-Control', 'public, max-age=600');
    
    console.log('Stats generated:', result);
    return res.json(result);
  } catch (err) {
    console.error('STATS_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Timeline (unchanged logic)
exports.getPackageTimeline = async (req, res) => {
  try {
    await ensureConnection();
    console.log('=== PACKAGE TIMELINE DEBUG ===');
    
    const packages = await Package.find({})
      .select('title category createdAt')
      .sort({ createdAt: 1 })
      .lean(); // ⚡ Use lean
    
    console.log('Total packages found:', packages.length);
    
    if (packages.length === 0) {
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
      const date = new Date(pkg.createdAt).toISOString().slice(0, 10);
      if (!dateGroups[date]) {
        dateGroups[date] = 0;
      }
      dateGroups[date]++;
    });

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

    // ⚡ Cache for 10 minutes
    res.set('Cache-Control', 'public, max-age=600');
    
    console.log('=== END PACKAGE TIMELINE DEBUG ===');
    
    return res.json(finalTimeline);
    } catch (err) {
      console.error('TIMELINE_ERR:', err.stack || err);
      return res.status(500).json({ error: err.message, stack: err.stack });
    }

};

// Weekly counts (unchanged logic)
exports.getWeeklyCounts = async (req, res) => {
  try {
    await ensureConnection();
    const today = new Date();
    const start = new Date(today);
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - 6);

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
    
    // ⚡ Cache for 10 minutes
    res.set('Cache-Control', 'public, max-age=600');
    
    return res.json(out);
  } catch (err) {
    console.error('WEEKLY_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};
