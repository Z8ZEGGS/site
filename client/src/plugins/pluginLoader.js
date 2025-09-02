// Plugin system for AnuFrequency Studio
// This allows for modular expansion of functionality

const plugins = new Map();

export const registerPlugin = (name, plugin) => {
  if (plugins.has(name)) {
    console.warn(`Plugin ${name} is already registered`);
    return false;
  }

  // Validate plugin structure
  if (!plugin.name || !plugin.version || !plugin.initialize) {
    console.error(`Plugin ${name} is missing required properties`);
    return false;
  }

  plugins.set(name, {
    ...plugin,
    loaded: false,
    error: null
  });

  console.log(`Plugin ${name} registered successfully`);
  return true;
};

export const loadPlugin = async (name) => {
  const plugin = plugins.get(name);
  if (!plugin) {
    throw new Error(`Plugin ${name} not found`);
  }

  if (plugin.loaded) {
    return plugin;
  }

  try {
    await plugin.initialize();
    plugin.loaded = true;
    plugin.error = null;
    console.log(`Plugin ${name} loaded successfully`);
    return plugin;
  } catch (error) {
    plugin.error = error;
    console.error(`Failed to load plugin ${name}:`, error);
    throw error;
  }
};

export const loadPlugins = async () => {
  const pluginPromises = Array.from(plugins.keys()).map(name => 
    loadPlugin(name).catch(error => {
      console.error(`Failed to load plugin ${name}:`, error);
      return null;
    })
  );

  const results = await Promise.all(pluginPromises);
  const loadedPlugins = results.filter(Boolean);
  
  console.log(`Loaded ${loadedPlugins.length}/${plugins.size} plugins`);
  return loadedPlugins;
};

export const getPlugin = (name) => {
  return plugins.get(name);
};

export const getAllPlugins = () => {
  return Array.from(plugins.values());
};

export const unloadPlugin = (name) => {
  const plugin = plugins.get(name);
  if (plugin && plugin.cleanup) {
    plugin.cleanup();
  }
  plugins.delete(name);
};

// Core plugins that are always available
export const corePlugins = {
  LightPatterns: {
    name: 'LightPatterns',
    version: '1.0.0',
    description: 'Canvas-based light pattern generation',
    category: 'visualization',
    initialize: async () => {
      // Light patterns are already integrated
      console.log('LightPatterns plugin initialized');
    }
  },
  
  FibonacciGenerator: {
    name: 'FibonacciGenerator',
    version: '1.0.0',
    description: 'Fibonacci sequence frequency generation',
    category: 'generation',
    initialize: async () => {
      // Fibonacci generator is already integrated
      console.log('FibonacciGenerator plugin initialized');
    }
  }
};

// Register core plugins
Object.values(corePlugins).forEach(plugin => {
  registerPlugin(plugin.name, plugin);
});

// Plugin stubs for future expansion
export const pluginStubs = {
  AIOptimizer: {
    name: 'AIOptimizer',
    version: '0.1.0',
    description: 'AI-powered frequency optimization using TensorFlow.js',
    category: 'ai',
    dependencies: ['tensorflow'],
    initialize: async () => {
      console.log('AIOptimizer plugin stub - not implemented yet');
      // Future implementation would load TensorFlow.js and AI models
    }
  },
  
  VRModule: {
    name: 'VRModule',
    version: '0.1.0',
    description: 'VR light immersion and spatial audio',
    category: 'vr',
    dependencies: ['webxr'],
    initialize: async () => {
      console.log('VRModule plugin stub - not implemented yet');
      // Future implementation would initialize WebXR
    }
  },
  
  HardwareInterface: {
    name: 'HardwareInterface',
    version: '0.1.0',
    description: 'Interface with external frequency devices',
    category: 'hardware',
    dependencies: ['serialport'],
    initialize: async () => {
      console.log('HardwareInterface plugin stub - not implemented yet');
      // Future implementation would connect to hardware devices
    }
  },
  
  Biofeedback: {
    name: 'Biofeedback',
    version: '0.1.0',
    description: 'Real-time biofeedback integration',
    category: 'biofeedback',
    dependencies: ['web-bluetooth'],
    initialize: async () => {
      console.log('Biofeedback plugin stub - not implemented yet');
      // Future implementation would connect to biofeedback devices
    }
  }
};

// Register plugin stubs
Object.values(pluginStubs).forEach(plugin => {
  registerPlugin(plugin.name, plugin);
});

export default {
  registerPlugin,
  loadPlugin,
  loadPlugins,
  getPlugin,
  getAllPlugins,
  unloadPlugin,
  corePlugins,
  pluginStubs
};