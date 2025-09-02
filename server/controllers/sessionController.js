const Session = require('../models/Session');
const Preset = require('../models/Preset');

const createSession = async (req, res) => {
  try {
    const sessionData = {
      ...req.body,
      userId: req.user._id,
      startTime: new Date()
    };

    const session = new Session(sessionData);
    await session.save();

    res.status(201).json({
      message: 'Session created successfully',
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, completed, startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    if (completed !== undefined) {
      query.isCompleted = completed === 'true';
    }

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const sessions = await Session.find(query)
      .populate('presetId', 'name category')
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await Session.findOne({ _id: id, userId: req.user._id })
      .populate('presetId', 'name category frequencies lightPattern');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await Session.findOne({ _id: id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Session updated successfully',
      session: updatedSession
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const endSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await Session.findOne({ _id: id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.endTime = new Date();
    session.isCompleted = true;
    await session.save();

    res.json({
      message: 'Session ended successfully',
      session
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, effects, comments } = req.body;
    
    const session = await Session.findOne({ _id: id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.feedback = { rating, effects, comments };
    await session.save();

    res.json({
      message: 'Feedback added successfully',
      session
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await Session.findOne({ _id: id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await Session.findByIdAndDelete(id);

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSessionStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const stats = await Session.aggregate([
      {
        $match: {
          userId: req.user._id,
          startTime: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          avgDuration: { $avg: '$duration' },
          completedSessions: {
            $sum: { $cond: ['$isCompleted', 1, 0] }
          },
          avgRating: { $avg: '$feedback.rating' }
        }
      }
    ]);

    const categoryStats = await Session.aggregate([
      {
        $match: {
          userId: req.user._id,
          startTime: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'presets',
          localField: 'presetId',
          foreignField: '_id',
          as: 'preset'
        }
      },
      {
        $unwind: { path: '$preset', preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: '$preset.category',
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      stats: stats[0] || {
        totalSessions: 0,
        totalDuration: 0,
        avgDuration: 0,
        completedSessions: 0,
        avgRating: 0
      },
      categoryStats
    });
  } catch (error) {
    console.error('Get session stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const exportSessions = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const sessions = await Session.find(query)
      .populate('presetId', 'name category')
      .sort({ startTime: -1 });

    if (format === 'csv') {
      const csv = convertToCSV(sessions);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=sessions.csv');
      res.send(csv);
    } else {
      res.json({ sessions });
    }
  } catch (error) {
    console.error('Export sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const convertToCSV = (sessions) => {
  const headers = [
    'Date', 'Duration (min)', 'Preset', 'Category', 'Completed', 'Rating', 'Effects', 'Notes'
  ];
  
  const rows = sessions.map(session => [
    session.startTime.toISOString().split('T')[0],
    Math.round(session.duration / 60),
    session.presetId?.name || 'Custom',
    session.presetId?.category || 'custom',
    session.isCompleted ? 'Yes' : 'No',
    session.feedback?.rating || '',
    session.feedback?.effects?.join(', ') || '',
    session.notes || ''
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  endSession,
  addFeedback,
  deleteSession,
  getSessionStats,
  exportSessions
};