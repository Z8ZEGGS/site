const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const { validateRequest, presetSchema } = require('../middleware/validation');
const {
  createPreset,
  getPresets,
  getPresetById,
  updatePreset,
  deletePreset,
  duplicatePreset,
  incrementUsage
} = require('../controllers/presetController');

// All routes use optional auth (guests can view public presets)
router.use(optionalAuth);

// Public routes (with optional auth)
router.get('/', getPresets);
router.get('/:id', getPresetById);
router.post('/:id/duplicate', auth, duplicatePreset);
router.post('/:id/increment-usage', incrementUsage);

// Protected routes (require authentication)
router.post('/', auth, validateRequest(presetSchema), createPreset);
router.put('/:id', auth, updatePreset);
router.delete('/:id', auth, deletePreset);

module.exports = router;