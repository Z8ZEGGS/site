const mongoose = require('mongoose');

const frequencySchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    min: 0.01,
    max: 20000
  },
  volume: {
    type: Number,
    default: 0.5,
    min: 0,
    max: 1
  },
  waveType: {
    type: String,
    enum: ['sine', 'square', 'sawtooth', 'triangle'],
    default: 'sine'
  },
  isBinaural: {
    type: Boolean,
    default: false
  },
  binauralOffset: {
    type: Number,
    default: 0,
    min: -50,
    max: 50
  }
});

const lightPatternSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffff'
  },
  flashRate: {
    type: Number,
    default: 1,
    min: 0.1,
    max: 100
  },
  pattern: {
    type: String,
    enum: ['solid', 'pulse', 'spiral', 'mandala', 'wave', 'random'],
    default: 'pulse'
  },
  intensity: {
    type: Number,
    default: 0.5,
    min: 0,
    max: 1
  },
  syncToAudio: {
    type: Boolean,
    default: true
  }
});

const presetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Preset name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  frequencies: [frequencySchema],
  lightPattern: lightPatternSchema,
  duration: {
    type: Number,
    default: 300, // 5 minutes in seconds
    min: 1,
    max: 3600 // 1 hour max
  },
  category: {
    type: String,
    enum: ['healing', 'meditation', 'focus', 'sleep', 'energy', 'custom', 'fibonacci', 'research'],
    default: 'custom'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  metadata: {
    source: String,
    research: String,
    notes: String
  }
}, {
  timestamps: true
});

// Index for better query performance
presetSchema.index({ userId: 1, category: 1 });
presetSchema.index({ isPublic: 1, category: 1 });
presetSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Preset', presetSchema);