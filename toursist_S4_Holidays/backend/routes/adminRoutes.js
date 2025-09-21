const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { otpRequestLimiter, otpVerifyLimiter } = require('../middleware/rateLimiter'); // NEW

// EXISTING ROUTES - UNCHANGED
router.post('/login', adminController.login);
router.post('/register', adminController.register);
router.post('/logout', authMiddleware, adminController.logout);

// NEW: SECURE OTP-BASED FORGOT PASSWORD ROUTES
router.post('/forgot-password/request-otp', otpRequestLimiter, adminController.forgotPasswordRequestOTP);
router.post('/forgot-password/verify-otp', otpVerifyLimiter, adminController.forgotPasswordVerifyOTP);
router.post('/forgot-password/reset', adminController.forgotPasswordReset);

// OLD ROUTE - Keep for backward compatibility (but deprecated)
router.post('/forgot-password', adminController.forgotPassword);

module.exports = router;
