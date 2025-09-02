const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateRequest, sessionSchema, feedbackSchema } = require('../middleware/validation');
const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  endSession,
  addFeedback,
  deleteSession,
  getSessionStats,
  exportSessions
} = require('../controllers/sessionController');

// All routes require authentication
router.use(auth);

// Session management
router.post('/', validateRequest(sessionSchema), createSession);
router.get('/', getSessions);
router.get('/stats', getSessionStats);
router.get('/export', exportSessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.put('/:id/end', endSession);
router.post('/:id/feedback', validateRequest(feedbackSchema), addFeedback);
router.delete('/:id', deleteSession);

module.exports = router;