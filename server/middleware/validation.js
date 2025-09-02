const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Auth validation schemas
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Preset validation schemas
const frequencySchema = Joi.object({
  value: Joi.number().min(0.01).max(20000).required(),
  volume: Joi.number().min(0).max(1).default(0.5),
  waveType: Joi.string().valid('sine', 'square', 'sawtooth', 'triangle').default('sine'),
  isBinaural: Joi.boolean().default(false),
  binauralOffset: Joi.number().min(-50).max(50).default(0)
});

const lightPatternSchema = Joi.object({
  enabled: Joi.boolean().default(false),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#ffffff'),
  flashRate: Joi.number().min(0.1).max(100).default(1),
  pattern: Joi.string().valid('solid', 'pulse', 'spiral', 'mandala', 'wave', 'random').default('pulse'),
  intensity: Joi.number().min(0).max(1).default(0.5),
  syncToAudio: Joi.boolean().default(true)
});

const presetSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().max(500).allow(''),
  frequencies: Joi.array().items(frequencySchema).min(1).max(5).required(),
  lightPattern: lightPatternSchema,
  duration: Joi.number().min(1).max(3600).default(300),
  category: Joi.string().valid('healing', 'meditation', 'focus', 'sleep', 'energy', 'custom', 'fibonacci', 'research').default('custom'),
  tags: Joi.array().items(Joi.string().trim().max(20)).max(10),
  isPublic: Joi.boolean().default(false),
  metadata: Joi.object({
    source: Joi.string().allow(''),
    research: Joi.string().allow(''),
    notes: Joi.string().allow('')
  })
});

// Session validation schemas
const sessionDataSchema = Joi.object({
  frequencies: Joi.array().items(Joi.object({
    value: Joi.number().required(),
    volume: Joi.number().min(0).max(1).default(0.5),
    waveType: Joi.string().valid('sine', 'square', 'sawtooth', 'triangle').default('sine'),
    duration: Joi.number().min(1).default(60)
  })).min(1).max(5).required(),
  lightPattern: Joi.object({
    enabled: Joi.boolean().default(false),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#ffffff'),
    flashRate: Joi.number().min(0.1).max(100).default(1),
    pattern: Joi.string().valid('solid', 'pulse', 'spiral', 'mandala', 'wave', 'random').default('pulse'),
    intensity: Joi.number().min(0).max(1).default(0.5)
  }),
  settings: Joi.object({
    volume: Joi.number().min(0).max(1).default(0.5),
    duration: Joi.number().min(1).max(3600).default(300),
    binauralMode: Joi.boolean().default(false),
    modulation: Joi.object({
      enabled: Joi.boolean().default(false),
      type: Joi.string().valid('AM', 'FM').default('AM'),
      rate: Joi.number().min(0.1).max(100).default(1)
    })
  })
});

const sessionSchema = Joi.object({
  presetId: Joi.string().allow(null),
  name: Joi.string().trim().max(100).allow(''),
  sessionData: sessionDataSchema.required(),
  notes: Joi.string().trim().max(1000).allow(''),
  tags: Joi.array().items(Joi.string().trim().max(20)).max(10)
});

const feedbackSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  effects: Joi.array().items(Joi.string().valid('relaxation', 'energy', 'focus', 'sleep', 'pain_relief', 'mood_improvement', 'none', 'other')).min(1).required(),
  comments: Joi.string().trim().max(500).allow('')
});

module.exports = {
  validateRequest,
  registerSchema,
  loginSchema,
  presetSchema,
  sessionSchema,
  feedbackSchema
};