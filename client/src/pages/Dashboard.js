import React, { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import FrequencyGenerator from '../components/Audio/FrequencyGenerator';
import AudioVisualizer from '../components/Audio/AudioVisualizer';
import LightPatterns from '../components/Light/LightPatterns';
import FibonacciGenerator from '../components/Fibonacci/FibonacciGenerator';
import SessionLogger from '../components/Session/SessionLogger';
import PresetCard from '../components/Presets/PresetCard';
import { presetsAPI } from '../services/api';
import { PlayIcon, StopIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { isPlaying, playFrequencies, stopAll } = useAudio();
  const { startSession, endSession, currentSession } = useSession();
  const { user } = useAuth();
  
  const [currentFrequencies, setCurrentFrequencies] = useState([]);
  const [currentLightPattern, setCurrentLightPattern] = useState(null);
  const [featuredPresets, setFeaturedPresets] = useState([]);
  const [activeTab, setActiveTab] = useState('generator');

  useEffect(() => {
    loadFeaturedPresets();
  }, []);

  const loadFeaturedPresets = async () => {
    try {
      const response = await presetsAPI.getPresets({ 
        limit: 6, 
        category: 'healing,meditation,focus',
        isPublic: true 
      });
      setFeaturedPresets(response.presets);
    } catch (error) {
      console.error('Failed to load featured presets:', error);
    }
  };

  const handlePlayPreset = async (preset) => {
    try {
      // Start session if user is logged in
      if (user && !currentSession) {
        const sessionData = {
          presetId: preset._id,
          name: `Session: ${preset.name}`,
          sessionData: {
            frequencies: preset.frequencies,
            lightPattern: preset.lightPattern,
            settings: {
              volume: 0.5,
              duration: preset.duration || 300,
              binauralMode: false,
              modulation: { enabled: false, type: 'AM', rate: 1 }
            }
          }
        };
        await startSession(sessionData);
      }

      // Play the preset
      await playFrequencies(preset.frequencies);
      setCurrentFrequencies(preset.frequencies);
      setCurrentLightPattern(preset.lightPattern);
      
      // Increment usage count
      await presetsAPI.incrementUsage(preset._id);
      
      toast.success(`Playing: ${preset.name}`);
    } catch (error) {
      console.error('Failed to play preset:', error);
      toast.error('Failed to play preset');
    }
  };

  const handleStop = async () => {
    stopAll();
    setCurrentFrequencies([]);
    setCurrentLightPattern(null);
    
    // End session if active
    if (currentSession) {
      await endSession(currentSession._id);
    }
  };

  const handleFrequenciesChange = (frequencies) => {
    setCurrentFrequencies(frequencies);
  };

  const handleLightPatternChange = (lightPattern) => {
    setCurrentLightPattern(lightPattern);
  };

  const tabs = [
    { id: 'generator', name: 'Generator', icon: PlayIcon },
    { id: 'fibonacci', name: 'Fibonacci', icon: ChartBarIcon },
    { id: 'presets', name: 'Presets', icon: ClockIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Frequency Studio</h1>
          <p className="text-gray-400 mt-1">Create, experiment, and heal with sound frequencies</p>
        </div>
        
        {currentSession && (
          <div className="flex items-center space-x-2 text-sm text-primary-400">
            <ClockIcon className="w-4 h-4" />
            <span>Session Active</span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'generator' && (
          <>
            {/* Frequency Generator */}
            <FrequencyGenerator onFrequenciesChange={handleFrequenciesChange} />
            
            {/* Audio Visualizer */}
            <AudioVisualizer />
            
            {/* Light Patterns */}
            <LightPatterns onLightPatternChange={handleLightPatternChange} />
            
            {/* Session Logger */}
            {user && (
              <SessionLogger 
                frequencies={currentFrequencies}
                lightPattern={currentLightPattern}
                currentSession={currentSession}
              />
            )}
          </>
        )}

        {activeTab === 'fibonacci' && (
          <FibonacciGenerator onFrequenciesChange={handleFrequenciesChange} />
        )}

        {activeTab === 'presets' && (
          <div className="space-y-6">
            {/* Featured Presets */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Featured Presets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPresets.map((preset) => (
                  <PresetCard
                    key={preset._id}
                    preset={preset}
                    onPlay={handlePlayPreset}
                    onStop={handleStop}
                    isPlaying={isPlaying && currentFrequencies.length > 0}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;