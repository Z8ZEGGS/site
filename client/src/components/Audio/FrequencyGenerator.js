import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { PlayIcon, StopIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const FrequencyGenerator = ({ onFrequenciesChange }) => {
  const { isPlaying, currentFrequencies, playFrequencies, stopAll, masterVolume, updateVolume } = useAudio();
  const [frequencies, setFrequencies] = useState([
    { value: 440, volume: 0.5, waveType: 'sine', isBinaural: false, binauralOffset: 0 }
  ]);

  useEffect(() => {
    if (onFrequenciesChange) {
      onFrequenciesChange(frequencies);
    }
  }, [frequencies, onFrequenciesChange]);

  const addFrequency = () => {
    if (frequencies.length < 5) {
      setFrequencies([...frequencies, {
        value: 440,
        volume: 0.5,
        waveType: 'sine',
        isBinaural: false,
        binauralOffset: 0
      }]);
    }
  };

  const removeFrequency = (index) => {
    if (frequencies.length > 1) {
      const newFrequencies = frequencies.filter((_, i) => i !== index);
      setFrequencies(newFrequencies);
    }
  };

  const updateFrequency = (index, field, value) => {
    const newFrequencies = [...frequencies];
    newFrequencies[index] = { ...newFrequencies[index], [field]: value };
    setFrequencies(newFrequencies);
  };

  const handlePlay = async () => {
    if (isPlaying) {
      stopAll();
    } else {
      await playFrequencies(frequencies);
    }
  };

  const formatFrequency = (freq) => {
    if (freq < 1) return `${freq.toFixed(2)} Hz`;
    if (freq < 1000) return `${freq.toFixed(1)} Hz`;
    return `${(freq / 1000).toFixed(1)} kHz`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Frequency Generator</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePlay}
            className={`btn-primary flex items-center space-x-2 ${
              isPlaying ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
          >
            {isPlaying ? (
              <>
                <StopIcon className="w-4 h-4" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4" />
                <span>Play</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Master Volume */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Master Volume: {Math.round(masterVolume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={(e) => updateVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Frequency Controls */}
      <div className="space-y-4">
        {frequencies.map((freq, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-white">Frequency {index + 1}</h3>
              {frequencies.length > 1 && (
                <button
                  onClick={() => removeFrequency(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Frequency Value */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Frequency
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.01"
                    max="20000"
                    step="0.01"
                    value={freq.value}
                    onChange={(e) => updateFrequency(index, 'value', parseFloat(e.target.value))}
                    className="input-field w-full pr-12"
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-400">Hz</span>
                </div>
                <div className="frequency-display text-center mt-2">
                  {formatFrequency(freq.value)}
                </div>
              </div>

              {/* Volume */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Volume: {Math.round(freq.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={freq.volume}
                  onChange={(e) => updateFrequency(index, 'volume', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Wave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Wave Type
                </label>
                <select
                  value={freq.waveType}
                  onChange={(e) => updateFrequency(index, 'waveType', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="sine">Sine</option>
                  <option value="square">Square</option>
                  <option value="sawtooth">Sawtooth</option>
                  <option value="triangle">Triangle</option>
                </select>
              </div>

              {/* Binaural Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Binaural Mode
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={freq.isBinaural}
                      onChange={(e) => updateFrequency(index, 'isBinaural', e.target.checked)}
                      className="rounded border-gray-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-300">Enable</span>
                  </label>
                  {freq.isBinaural && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Offset: {freq.binauralOffset} Hz
                      </label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="0.1"
                        value={freq.binauralOffset}
                        onChange={(e) => updateFrequency(index, 'binauralOffset', parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Frequency Button */}
      {frequencies.length < 5 && (
        <button
          onClick={addFrequency}
          className="btn-secondary flex items-center space-x-2 mt-4"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Frequency</span>
        </button>
      )}
    </div>
  );
};

export default FrequencyGenerator;