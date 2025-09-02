const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/authController');

// All routes require authentication
router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;