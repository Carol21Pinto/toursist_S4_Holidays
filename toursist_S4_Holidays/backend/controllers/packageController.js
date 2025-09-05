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
    const body = { ...req.body };

    body.itinerary = parseMaybeJSON(body.itinerary, []);
    body.inclusions = parseMaybeJSON(body.inclusions, []);
    body.exclusions = parseMaybeJSON(body.exclusions, []);
    body.contactNumbers = parseMaybeJSON(body.contactNumbers, []);

    if (body.pricePerPerson !== undefined && body.pricePerPerson !== null) {
      const n = Number(body.pricePerPerson);
      if (!Number.isNaN(n)) body.pricePerPerson = n;
    }

    // Multer fields -> arrays
    const cardImage = req.files?.cardImage?.[0]?.path || '';
    const images = req.files?.images ? req.files.images.map(f => f.path) : [];

    const newPackage = new Package({
      ...body,
      cardImage,
      images,
    });

    await newPackage.save();
    return res.status(201).json(newPackage);
  } catch (err) {
    console.error('CREATE_ERR:', err);
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

// Update
exports.updatePackage = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.itinerary !== undefined) updates.itinerary = parseMaybeJSON(updates.itinerary, []);
    if (updates.inclusions !== undefined) updates.inclusions = parseMaybeJSON(updates.inclusions, []);
    if (updates.exclusions !== undefined) updates.exclusions = parseMaybeJSON(updates.exclusions, []);
    if (updates.contactNumbers !== undefined) updates.contactNumbers = parseMaybeJSON(updates.contactNumbers, []);

    if (updates.pricePerPerson !== undefined && updates.pricePerPerson !== null) {
      const n = Number(updates.pricePerPerson);
      if (!Number.isNaN(n)) updates.pricePerPerson = n;
    }

    if (req.files?.cardImage?.[0]) {
      updates.cardImage = req.files.cardImage[0].path;
    }
    if (req.files?.images) {
      updates.images = req.files.images.map(file => file.path);
    }

    const pkg = await Package.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    return res.json(pkg);
  } catch (err) {
    console.error('UPDATE_ERR:', err);
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
