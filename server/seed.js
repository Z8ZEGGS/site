const mongoose = require('mongoose');
require('dotenv').config();

const Preset = require('./models/Preset');

// Research-based frequency presets
const defaultPresets = [
  // Solfeggio Frequencies
  {
    name: "174 Hz - Foundation",
    description: "Foundation frequency for pain relief and cellular healing",
    frequencies: [{ value: 174, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#8B4513', flashRate: 174, pattern: 'pulse' },
    category: 'healing',
    tags: ['solfeggio', 'pain-relief', 'foundation'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Solfeggio Frequencies', research: 'Ancient healing frequencies' }
  },
  {
    name: "285 Hz - Quantum Cognition",
    description: "Quantum cognition and tissue healing frequency",
    frequencies: [{ value: 285, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#4B0082', flashRate: 285, pattern: 'spiral' },
    category: 'healing',
    tags: ['solfeggio', 'quantum', 'tissue-healing'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Solfeggio Frequencies', research: 'Quantum field healing' }
  },
  {
    name: "396 Hz - Liberation",
    description: "Liberation from fear, guilt, and negative emotions",
    frequencies: [{ value: 396, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FF4500', flashRate: 396, pattern: 'wave' },
    category: 'healing',
    tags: ['solfeggio', 'liberation', 'fear-release'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Solfeggio Frequencies', research: 'Emotional healing' }
  },
  {
    name: "417 Hz - Facilitating Change",
    description: "Facilitating change and undoing situations",
    frequencies: [{ value: 417, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FFD700', flashRate: 417, pattern: 'mandala' },
    category: 'healing',
    tags: ['solfeggio', 'change', 'transformation'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Solfeggio Frequencies', research: 'Change facilitation' }
  },
  {
    name: "528 Hz - Love Frequency",
    description: "The love frequency for DNA repair and transformation",
    frequencies: [{ value: 528, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#00FF00', flashRate: 528, pattern: 'pulse' },
    category: 'healing',
    tags: ['solfeggio', 'love', 'dna-repair'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Solfeggio Frequencies', research: 'DNA repair studies' }
  },
  {
    name: "639 Hz - Relationships",
    description: "Connection and relationships frequency",
    frequencies: [{ value: 639, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FF69B4', flashRate: 639, pattern: 'wave' },
    category: 'healing',
    tags: ['solfeggio', 'relationships', 'connection'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Solfeggio Frequencies', research: 'Social bonding' }
  },
  {
    name: "741 Hz - Expression",
    description: "Expression and solutions frequency",
    frequencies: [{ value: 741, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#00CED1', flashRate: 741, pattern: 'spiral' },
    category: 'healing',
    tags: ['solfeggio', 'expression', 'solutions'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Solfeggio Frequencies', research: 'Creative expression' }
  },
  {
    name: "852 Hz - Intuition",
    description: "Intuition and inner strength frequency",
    frequencies: [{ value: 852, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#9370DB', flashRate: 852, pattern: 'mandala' },
    category: 'healing',
    tags: ['solfeggio', 'intuition', 'inner-strength'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Solfeggio Frequencies', research: 'Intuitive development' }
  },
  {
    name: "963 Hz - Pineal Gland",
    description: "Pineal gland activation and connection to source",
    frequencies: [{ value: 963, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FF1493', flashRate: 963, pattern: 'pulse' },
    category: 'healing',
    tags: ['solfeggio', 'pineal-gland', 'spiritual'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Solfeggio Frequencies', research: 'Pineal activation' }
  },

  // Schumann Resonance
  {
    name: "7.83 Hz - Schumann Resonance",
    description: "Earth's natural frequency for grounding and balance",
    frequencies: [{ value: 7.83, volume: 0.5, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#8B4513', flashRate: 7.83, pattern: 'pulse' },
    category: 'meditation',
    tags: ['schumann', 'grounding', 'earth-frequency'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Schumann Resonance', research: 'Earth-ionosphere cavity' }
  },

  // Brainwave Entrainment
  {
    name: "40 Hz - Gamma Waves",
    description: "Gamma brainwaves for enhanced cognition and awareness",
    frequencies: [{ value: 40, volume: 0.5, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FFFFFF', flashRate: 40, pattern: 'pulse' },
    category: 'focus',
    tags: ['gamma', 'cognition', 'awareness'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Brainwave Research', research: 'Gamma wave studies' }
  },
  {
    name: "10 Hz - Alpha Waves",
    description: "Alpha brainwaves for relaxation and creativity",
    frequencies: [{ value: 10, volume: 0.5, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#87CEEB', flashRate: 10, pattern: 'wave' },
    category: 'meditation',
    tags: ['alpha', 'relaxation', 'creativity'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Brainwave Research', research: 'Alpha wave studies' }
  },
  {
    name: "4 Hz - Theta Waves",
    description: "Theta brainwaves for deep meditation and healing",
    frequencies: [{ value: 4, volume: 0.5, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#4169E1', flashRate: 4, pattern: 'spiral' },
    category: 'meditation',
    tags: ['theta', 'meditation', 'healing'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Brainwave Research', research: 'Theta wave studies' }
  },
  {
    name: "0.5 Hz - Delta Waves",
    description: "Delta brainwaves for deep sleep and regeneration",
    frequencies: [{ value: 0.5, volume: 0.4, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#191970', flashRate: 0.5, pattern: 'pulse' },
    category: 'sleep',
    tags: ['delta', 'sleep', 'regeneration'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Brainwave Research', research: 'Delta wave studies' }
  },

  // Fibonacci Frequencies
  {
    name: "89 Hz - Fibonacci Healing",
    description: "Fibonacci sequence frequency for natural healing",
    frequencies: [{ value: 89, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FF6347', flashRate: 89, pattern: 'spiral' },
    category: 'fibonacci',
    tags: ['fibonacci', 'natural-healing', 'golden-ratio'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Fibonacci Research', research: 'Golden ratio healing' }
  },
  {
    name: "144 Hz - Fibonacci Harmony",
    description: "Fibonacci harmony frequency for balance",
    frequencies: [{ value: 144, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#32CD32', flashRate: 144, pattern: 'mandala' },
    category: 'fibonacci',
    tags: ['fibonacci', 'harmony', 'balance'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Fibonacci Research', research: 'Harmonic balance' }
  },
  {
    name: "233 Hz - Fibonacci Growth",
    description: "Fibonacci growth frequency for development",
    frequencies: [{ value: 233, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FFD700', flashRate: 233, pattern: 'wave' },
    category: 'fibonacci',
    tags: ['fibonacci', 'growth', 'development'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Fibonacci Research', research: 'Growth patterns' }
  },

  // Rife Frequencies
  {
    name: "20 Hz - Rife Pain Relief",
    description: "Rife frequency for pain relief and inflammation",
    frequencies: [{ value: 20, volume: 0.5, waveType: 'square' }],
    lightPattern: { enabled: true, color: '#FF0000', flashRate: 20, pattern: 'pulse' },
    category: 'healing',
    tags: ['rife', 'pain-relief', 'inflammation'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Rife Research', research: 'Pain frequency studies' }
  },
  {
    name: "727 Hz - Rife Healing",
    description: "Rife frequency for general healing",
    frequencies: [{ value: 727, volume: 0.5, waveType: 'square' }],
    lightPattern: { enabled: true, color: '#00FF00', flashRate: 727, pattern: 'pulse' },
    category: 'healing',
    tags: ['rife', 'healing', 'cellular'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Rife Research', research: 'Cellular healing' }
  },

  // Chromotherapy Frequencies
  {
    name: "Red Light - 630nm",
    description: "Red light therapy simulation for circulation",
    frequencies: [{ value: 1, volume: 0.3, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FF0000', flashRate: 1, pattern: 'solid' },
    category: 'healing',
    tags: ['chromotherapy', 'red-light', 'circulation'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Chromotherapy', research: 'Red light therapy' }
  },
  {
    name: "Blue Light - 470nm",
    description: "Blue light therapy simulation for calm",
    frequencies: [{ value: 1, volume: 0.3, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#0000FF', flashRate: 1, pattern: 'solid' },
    category: 'meditation',
    tags: ['chromotherapy', 'blue-light', 'calm'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Chromotherapy', research: 'Blue light therapy' }
  },
  {
    name: "Green Light - 530nm",
    description: "Green light therapy simulation for balance",
    frequencies: [{ value: 1, volume: 0.3, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#00FF00', flashRate: 1, pattern: 'solid' },
    category: 'healing',
    tags: ['chromotherapy', 'green-light', 'balance'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Chromotherapy', research: 'Green light therapy' }
  },

  // AVE (Audio-Visual Entrainment) Combinations
  {
    name: "40 Hz AVE - Focus",
    description: "Audio-visual entrainment for enhanced focus",
    frequencies: [{ value: 40, volume: 0.5, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FFFFFF', flashRate: 40, pattern: 'pulse' },
    category: 'focus',
    tags: ['ave', 'focus', 'entrainment'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'AVE Research', research: 'Audio-visual entrainment' }
  },
  {
    name: "10 Hz AVE - Relaxation",
    description: "Audio-visual entrainment for deep relaxation",
    frequencies: [{ value: 10, volume: 0.5, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#87CEEB', flashRate: 10, pattern: 'wave' },
    category: 'meditation',
    tags: ['ave', 'relaxation', 'entrainment'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'AVE Research', research: 'Relaxation entrainment' }
  },

  // Binaural Beats
  {
    name: "10 Hz Binaural - Alpha",
    description: "Binaural beats for alpha state induction",
    frequencies: [
      { value: 200, volume: 0.4, waveType: 'sine', isBinaural: true, binauralOffset: -5 },
      { value: 210, volume: 0.4, waveType: 'sine', isBinaural: true, binauralOffset: 5 }
    ],
    lightPattern: { enabled: true, color: '#87CEEB', flashRate: 10, pattern: 'wave' },
    category: 'meditation',
    tags: ['binaural', 'alpha', 'entrainment'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Binaural Research', research: 'Alpha entrainment' }
  },
  {
    name: "4 Hz Binaural - Theta",
    description: "Binaural beats for theta state induction",
    frequencies: [
      { value: 200, volume: 0.4, waveType: 'sine', isBinaural: true, binauralOffset: -2 },
      { value: 204, volume: 0.4, waveType: 'sine', isBinaural: true, binauralOffset: 2 }
    ],
    lightPattern: { enabled: true, color: '#4169E1', flashRate: 4, pattern: 'spiral' },
    category: 'meditation',
    tags: ['binaural', 'theta', 'entrainment'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Binaural Research', research: 'Theta entrainment' }
  },

  // Energy and Chakra Frequencies
  {
    name: "Root Chakra - 256 Hz",
    description: "Root chakra frequency for grounding and stability",
    frequencies: [{ value: 256, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FF0000', flashRate: 256, pattern: 'pulse' },
    category: 'energy',
    tags: ['chakra', 'root', 'grounding'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Chakra Research', research: 'Root chakra studies' }
  },
  {
    name: "Sacral Chakra - 288 Hz",
    description: "Sacral chakra frequency for creativity and passion",
    frequencies: [{ value: 288, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FF8C00', flashRate: 288, pattern: 'wave' },
    category: 'energy',
    tags: ['chakra', 'sacral', 'creativity'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Chakra Research', research: 'Sacral chakra studies' }
  },
  {
    name: "Solar Plexus - 320 Hz",
    description: "Solar plexus chakra frequency for personal power",
    frequencies: [{ value: 320, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FFD700', flashRate: 320, pattern: 'mandala' },
    category: 'energy',
    tags: ['chakra', 'solar-plexus', 'power'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Chakra Research', research: 'Solar plexus studies' }
  },
  {
    name: "Heart Chakra - 341 Hz",
    description: "Heart chakra frequency for love and compassion",
    frequencies: [{ value: 341, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#00FF00', flashRate: 341, pattern: 'pulse' },
    category: 'energy',
    tags: ['chakra', 'heart', 'love'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Chakra Research', research: 'Heart chakra studies' }
  },
  {
    name: "Throat Chakra - 384 Hz",
    description: "Throat chakra frequency for communication",
    frequencies: [{ value: 384, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#00CED1', flashRate: 384, pattern: 'wave' },
    category: 'energy',
    tags: ['chakra', 'throat', 'communication'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Chakra Research', research: 'Throat chakra studies' }
  },
  {
    name: "Third Eye - 448 Hz",
    description: "Third eye chakra frequency for intuition",
    frequencies: [{ value: 448, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#4B0082', flashRate: 448, pattern: 'spiral' },
    category: 'energy',
    tags: ['chakra', 'third-eye', 'intuition'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Chakra Research', research: 'Third eye studies' }
  },
  {
    name: "Crown Chakra - 480 Hz",
    description: "Crown chakra frequency for spiritual connection",
    frequencies: [{ value: 480, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#9370DB', flashRate: 480, pattern: 'mandala' },
    category: 'energy',
    tags: ['chakra', 'crown', 'spiritual'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Chakra Research', research: 'Crown chakra studies' }
  },

  // Sleep and Relaxation
  {
    name: "Deep Sleep - 0.5 Hz",
    description: "Ultra-low frequency for deep sleep induction",
    frequencies: [{ value: 0.5, volume: 0.3, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#191970', flashRate: 0.5, pattern: 'pulse' },
    category: 'sleep',
    tags: ['sleep', 'deep-sleep', 'regeneration'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Sleep Research', research: 'Deep sleep induction' }
  },
  {
    name: "Insomnia Relief - 2 Hz",
    description: "Frequency for insomnia relief and sleep quality",
    frequencies: [{ value: 2, volume: 0.4, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#4169E1', flashRate: 2, pattern: 'wave' },
    category: 'sleep',
    tags: ['sleep', 'insomnia', 'relief'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Sleep Research', research: 'Insomnia treatment' }
  },

  // Focus and Productivity
  {
    name: "Laser Focus - 40 Hz",
    description: "High-frequency focus enhancement",
    frequencies: [{ value: 40, volume: 0.5, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FFFFFF', flashRate: 40, pattern: 'pulse' },
    category: 'focus',
    tags: ['focus', 'productivity', 'concentration'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Focus Research', research: 'Attention enhancement' }
  },
  {
    name: "Study Mode - 20 Hz",
    description: "Beta frequency for study and learning",
    frequencies: [{ value: 20, volume: 0.5, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#87CEEB', flashRate: 20, pattern: 'wave' },
    category: 'focus',
    tags: ['study', 'learning', 'beta'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Learning Research', research: 'Study enhancement' }
  },

  // Pain Management
  {
    name: "Pain Relief - 20 Hz",
    description: "Frequency for general pain relief",
    frequencies: [{ value: 20, volume: 0.5, waveType: 'square' }],
    lightPattern: { enabled: true, color: '#FF0000', flashRate: 20, pattern: 'pulse' },
    category: 'healing',
    tags: ['pain-relief', 'analgesic', 'comfort'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Pain Research', research: 'Pain frequency studies' }
  },
  {
    name: "Migraine Relief - 10 Hz",
    description: "Frequency for migraine and headache relief",
    frequencies: [{ value: 10, volume: 0.4, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#87CEEB', flashRate: 10, pattern: 'wave' },
    category: 'healing',
    tags: ['migraine', 'headache', 'relief'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Headache Research', research: 'Migraine frequency studies' }
  },

  // Mood Enhancement
  {
    name: "Happiness Boost - 528 Hz",
    description: "Love frequency for mood enhancement",
    frequencies: [{ value: 528, volume: 0.6, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#FFD700', flashRate: 528, pattern: 'pulse' },
    category: 'energy',
    tags: ['happiness', 'mood', 'love-frequency'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Mood Research', research: 'Happiness frequency studies' }
  },
  {
    name: "Anxiety Relief - 4 Hz",
    description: "Theta frequency for anxiety and stress relief",
    frequencies: [{ value: 4, volume: 0.5, waveType: 'sine' }],
    lightPattern: { enabled: true, color: '#4169E1', flashRate: 4, pattern: 'spiral' },
    category: 'meditation',
    tags: ['anxiety', 'stress-relief', 'calm'],
    isPublic: true,
    isDefault: true,
    metadata: { source: 'Anxiety Research', research: 'Stress reduction studies' }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anu-frequency', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing default presets
    await Preset.deleteMany({ isDefault: true });
    console.log('Cleared existing default presets');

    // Insert new presets
    await Preset.insertMany(defaultPresets);
    console.log(`Seeded ${defaultPresets.length} default presets`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { defaultPresets, seedDatabase };