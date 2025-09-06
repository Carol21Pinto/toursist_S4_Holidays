const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware'); // Import your auth middleware

router.post('/login', adminController.login);
router.post('/register', adminController.register); // Use only once, then disable!

// NEW: Logout route (protected)
router.post('/logout', authMiddleware, adminController.logout);

module.exports = router;
