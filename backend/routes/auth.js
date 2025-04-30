const express = require('express');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);

// Profile routes
router.patch('/update-profile', protect, profileController.updateProfile);
router.get('/stats', protect, profileController.getUserStats);

module.exports = router;
