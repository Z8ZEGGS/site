const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateRequest, registerSchema, loginSchema } = require('../middleware/validation');
const {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken
} = require('../controllers/authController');

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/refresh', auth, refreshToken);

module.exports = router;