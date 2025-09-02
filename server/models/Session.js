const mongoose = require('mongoose');

const sessionDataSchema = new mongoose.Schema({
  frequencies: [{
    value: Number,
    volume: Number,
    waveType: String,
    duration: Number
  }],
  lightPattern: {
    enabled: Boolean,
    color: String,
    flashRate: Number,
    pattern: String,
    intensity: Number
  },
  settings: {
    volume: Number,
    duration: Number,
    binauralMode: Boolean,
    modulation: {
      enabled: Boolean,
      type: String,
      rate: Number
    }
  }
});

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  presetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Preset',
    default: null
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Session name cannot exceed 100 characters']
  },
  sessionData: sessionDataSchema,
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    effects: [{
      type: String,
      enum: ['relaxation', 'energy', 'focus', 'sleep', 'pain_relief', 'mood_improvement', 'none', 'other']
    }],
    comments: {
      type: String,
      maxlength: [500, 'Feedback comments cannot exceed 500 characters']
    }
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }]
}, {
  timestamps: true
});

// Index for better query performance
sessionSchema.index({ userId: 1, startTime: -1 });
sessionSchema.index({ presetId: 1 });
sessionSchema.index({ isCompleted: 1 });

// Calculate duration before saving
sessionSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

module.exports = mongoose.model('Session', sessionSchema);