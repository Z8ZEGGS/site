const Preset = require('../models/Preset');

const createPreset = async (req, res) => {
  try {
    const presetData = {
      ...req.body,
      userId: req.user._id
    };

    const preset = new Preset(presetData);
    await preset.save();

    res.status(201).json({
      message: 'Preset created successfully',
      preset
    });
  } catch (error) {
    console.error('Create preset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPresets = async (req, res) => {
  try {
    const { category, isPublic, search, page = 1, limit = 20 } = req.query;
    const query = {};

    // Build query based on user authentication
    if (req.user) {
      // Authenticated user can see their own presets and public ones
      query.$or = [
        { userId: req.user._id },
        { isPublic: true }
      ];
    } else {
      // Guest user can only see public presets
      query.isPublic = true;
    }

    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }

    const presets = await Preset.find(query)
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Preset.countDocuments(query);

    res.json({
      presets,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get presets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPresetById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: id };

    // Check if user can access this preset
    if (req.user) {
      query.$or = [
        { userId: req.user._id },
        { isPublic: true }
      ];
    } else {
      query.isPublic = true;
    }

    const preset = await Preset.findOne(query).populate('userId', 'name');
    
    if (!preset) {
      return res.status(404).json({ message: 'Preset not found' });
    }

    res.json({ preset });
  } catch (error) {
    console.error('Get preset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePreset = async (req, res) => {
  try {
    const { id } = req.params;
    
    const preset = await Preset.findOne({ _id: id, userId: req.user._id });
    if (!preset) {
      return res.status(404).json({ message: 'Preset not found or access denied' });
    }

    const updatedPreset = await Preset.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Preset updated successfully',
      preset: updatedPreset
    });
  } catch (error) {
    console.error('Update preset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePreset = async (req, res) => {
  try {
    const { id } = req.params;
    
    const preset = await Preset.findOne({ _id: id, userId: req.user._id });
    if (!preset) {
      return res.status(404).json({ message: 'Preset not found or access denied' });
    }

    await Preset.findByIdAndDelete(id);

    res.json({ message: 'Preset deleted successfully' });
  } catch (error) {
    console.error('Delete preset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const duplicatePreset = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: id };

    // Check if user can access this preset
    if (req.user) {
      query.$or = [
        { userId: req.user._id },
        { isPublic: true }
      ];
    } else {
      query.isPublic = true;
    }

    const originalPreset = await Preset.findOne(query);
    if (!originalPreset) {
      return res.status(404).json({ message: 'Preset not found' });
    }

    // Create duplicate with new owner
    const duplicateData = originalPreset.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    duplicateData.userId = req.user._id;
    duplicateData.name = `${originalPreset.name} (Copy)`;
    duplicateData.isPublic = false;

    const duplicate = new Preset(duplicateData);
    await duplicate.save();

    res.status(201).json({
      message: 'Preset duplicated successfully',
      preset: duplicate
    });
  } catch (error) {
    console.error('Duplicate preset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const incrementUsage = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Preset.findByIdAndUpdate(id, { $inc: { usageCount: 1 } });
    
    res.json({ message: 'Usage count updated' });
  } catch (error) {
    console.error('Increment usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPreset,
  getPresets,
  getPresetById,
  updatePreset,
  deletePreset,
  duplicatePreset,
  incrementUsage
};