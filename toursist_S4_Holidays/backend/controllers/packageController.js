const Package = require('../models/Package');

// Safely parse JSON from multipart FormData
function parseMaybeJSON(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return value;
}

// NEW: Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find({}).sort({ createdAt: -1 });
    console.log('All packages fetched:', packages.length);
    return res.json(packages);
  } catch (err) {
    console.error('GET_ALL_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Create new package
exports.createPackage = async (req, res) => {
  try {
    const packageData = JSON.parse(req.body.data);
    const cardImage = req.file ? req.file.path : '';
    
    // Debug logging
    console.log('=== CREATE PACKAGE DEBUG ===');
    console.log('Received packageData:', packageData);
    console.log('Category:', packageData.category);
    console.log('GroupType:', packageData.groupType);
    console.log('State:', packageData.state);
    console.log('Continent:', packageData.continent);
    console.log('Departure Dates:', packageData.departureDates); // NEW: Log departure dates
    
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
      
      // NEW: Add departure dates
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
    
    // Debug logging
    console.log('Package saved successfully:');
    console.log('ID:', newPackage._id);
    console.log('Title:', newPackage.title);
    console.log('Category:', newPackage.category);
    console.log('GroupType:', newPackage.groupType);
    console.log('State:', newPackage.state);
    console.log('Continent:', newPackage.continent);
    console.log('Departure Dates:', newPackage.departureDates); // NEW: Log saved departure dates
    console.log('=== END CREATE DEBUG ===');
    
    console.log('Package created successfully:', newPackage._id, 'at', newPackage.createdAt);
    return res.status(201).json(newPackage);
  } catch (err) {
    console.error('CREATE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Update package
exports.updatePackage = async (req, res) => {
  try {
    console.log('UPDATE REQUEST - Package ID:', req.params.id);
    console.log('UPDATE REQUEST - Body:', req.body);
    console.log('UPDATE REQUEST - File:', req.file);

    const packageData = JSON.parse(req.body.data);
    console.log('Parsed package data:', packageData);
    console.log('Departure Dates in update:', packageData.departureDates); // NEW: Log departure dates

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
      
      // NEW: Add departure dates
      departureDates: packageData.departureDates || [],
      
      itinerary: packageData.itinerary || [],
      inclusions: packageData.inclusions || [],
      exclusions: packageData.exclusions || [],
    };

    if (req.file) {
      updates.cardImage = req.file.path;
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
    console.log('Departure Dates:', pkg.departureDates); // NEW: Log updated departure dates

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
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    return res.json(pkg);
  } catch (err) {
    console.error('GET_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deletePackage = async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    console.log('Package deleted:', req.params.id);
    return res.json({ message: 'Package deleted' });
  } catch (err) {
    console.error('DELETE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Stats
exports.getPackageStats = async (req, res) => {
  try {
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
