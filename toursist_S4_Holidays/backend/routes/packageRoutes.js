const express = require('express');
const router = express.Router();
const pkg = require('../controllers/packageController');
const upload = require('../config/multer'); // Use the existing multer config

// Specific routes FIRST (before /:id)
router.get('/category/:category', pkg.getPackagesByCategory);
router.get('/stats', pkg.getPackageStats);
router.get('/weekly', pkg.getWeeklyCounts);

// Dynamic id route AFTER specifics
router.get('/:id', pkg.getPackage);

// Create (multipart form-data: fields + files)
router.post(
  '/',
  upload.fields([
    { name: 'cardImage', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  pkg.createPackage
);

// Update (allow replacing images)
router.put(
  '/:id',
  upload.fields([
    { name: 'cardImage', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  pkg.updatePackage
);

// Delete
router.delete('/:id', pkg.deletePackage);

module.exports = router;
