const Package = require('../models/Package');

// Safely parse JSON from multipart FormData
function parseMaybeJSON(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return value;
}

// Create new package
exports.createPackage = async (req, res) => {
  try {
    // Parse the JSON data from FormData (your frontend sends it as 'data')
    const packageData = JSON.parse(req.body.data);
    
    // Handle single file upload (req.file, not req.files because route uses upload.single)
    const cardImage = req.file ? req.file.path : '';
    
    const newPackage = new Package({
      title: packageData.name,  // Map frontend 'name' to database 'title'
      category: packageData.category.toLowerCase(), // Ensure lowercase to match enum
      pricePerPerson: Number(packageData.pricePerPerson),
      currency: packageData.currency,
      priceNote: packageData.priceNote || '',
      duration: packageData.duration,
      pricingMode: packageData.pricingMode,
      priceText: packageData.priceText || '',
      cardImage: cardImage,
      images: [], // Start with empty array
      description: packageData.description || '', // Add description field
      itinerary: packageData.itinerary || [],
      inclusions: packageData.inclusions || [],
      exclusions: packageData.exclusions || [],
      contactNumbers: [], // Default empty
    });

    await newPackage.save();
    return res.status(201).json(newPackage);
  } catch (err) {
    console.error('CREATE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Update package - FIXED VERSION
exports.updatePackage = async (req, res) => {
  try {
    console.log('UPDATE REQUEST - Package ID:', req.params.id); // Debug log
    console.log('UPDATE REQUEST - Body:', req.body); // Debug log
    console.log('UPDATE REQUEST - File:', req.file); // Debug log

    // Parse the JSON data from FormData
    const packageData = JSON.parse(req.body.data);
    console.log('Parsed package data:', packageData); // Debug log

    const updates = {
      title: packageData.name,
      category: packageData.category.toLowerCase(),
      duration: packageData.duration,
      pricingMode: packageData.pricingMode,
      pricePerPerson: packageData.pricePerPerson ? Number(packageData.pricePerPerson) : undefined,
      currency: packageData.currency,
      priceNote: packageData.priceNote || '',
      priceText: packageData.priceText || '',
      itinerary: packageData.itinerary || [],
      inclusions: packageData.inclusions || [],
      exclusions: packageData.exclusions || [],
    };

    // Only update image if new one is provided
    if (req.file) {
      updates.cardImage = req.file.path;
      console.log('New image uploaded:', req.file.path); // Debug log
    }

    // Remove undefined fields
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    console.log('Final updates object:', updates); // Debug log

    const pkg = await Package.findByIdAndUpdate(req.params.id, updates, { new: true });
    
    if (!pkg) {
      console.log('Package not found with ID:', req.params.id); // Debug log
      return res.status(404).json({ message: 'Package not found' });
    }

    console.log('Package updated successfully:', pkg._id); // Debug log
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
    await Package.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Package deleted' });
  } catch (err) {
    console.error('DELETE_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Stats (existing)
exports.getPackageStats = async (req, res) => {
  try {
    const categories = ['domestic', 'international', 'pilgrimage', 'group'];
    const stats = {};
    for (const category of categories) {
      stats[category] = await Package.countDocuments({ category });
    }
    stats.total = await Package.countDocuments({});
    return res.json(stats);
  } catch (err) {
    console.error('STATS_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// NEW: Weekly counts for chart (last 7 days)
exports.getWeeklyCounts = async (req, res) => {
  try {
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
      out.push({ name: day, packages: found ? found.count : 0 });
    }
    return res.json(out);
  } catch (err) {
    console.error('WEEKLY_ERR:', err);
    return res.status(500).json({ message: err.message });
  }
};
