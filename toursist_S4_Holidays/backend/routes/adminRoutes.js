const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// EXISTING ROUTES - UNCHANGED
router.post('/login', adminController.login);
router.post('/register', adminController.register);
router.post('/logout', authMiddleware, adminController.logout);

// NEW: FORGOT PASSWORD ROUTE - ADD THIS LINE
router.post('/forgot-password', adminController.forgotPassword);

module.exports = router;
