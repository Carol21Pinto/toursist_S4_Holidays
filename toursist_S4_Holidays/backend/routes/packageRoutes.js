const express = require('express');
const router = express.Router();
const pkg = require('../controllers/packageController');
const upload = require('../config/multer');

// NEW: Get all packages route - MUST BE FIRST
router.get('/', pkg.getAllPackages);

// Specific routes FIRST (before /:id)
router.get('/category/:category', pkg.getPackagesByCategory);
router.get('/stats', pkg.getPackageStats);
router.get('/timeline', pkg.getPackageTimeline);
router.get('/weekly', pkg.getWeeklyCounts);

// Dynamic id route AFTER specifics
router.get('/:id', pkg.getPackage);

// Create (single card image + JSON data)
router.post(
  '/',
  upload.single('card_image'),
  pkg.createPackage
);

// Update (allow replacing single card image)
router.put(
  '/:id',
  upload.single('card_image'),
  pkg.updatePackage
);

// Delete
router.delete('/:id', pkg.deletePackage);

module.exports = router;
