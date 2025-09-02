import React, { useState, useEffect } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { PlayIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const FibonacciGenerator = ({ onFrequenciesChange }) => {
  const { isPlaying, playFrequencies, stopAll } = useAudio();
  const [fibonacciSettings, setFibonacciSettings] = useState({
    startIndex: 1,
    endIndex: 20,
    baseFrequency: 1,
    multiplier: 1,
    maxFrequencies: 5,
    pattern: 'sequence', // 'sequence', 'golden_ratio', 'spiral'
    duration: 60, // seconds per frequency
    isPlaying: false
  });

  const [fibonacciSequence, setFibonacciSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Generate Fibonacci sequence
  const generateFibonacciSequence = (start, end) => {
    const sequence = [];
    let a = 0, b = 1;
    
    for (let i = 0; i <= end; i++) {
      if (i >= start) {
        sequence.push(b);
      }
      const temp = a + b;
      a = b;
      b = temp;
    }
    
    return sequence;
  };

  // Generate Golden Ratio sequence
  const generateGoldenRatioSequence = (start, end, baseFreq) => {
    const phi = 1.618033988749895; // Golden ratio
    const sequence = [];
    
    for (let i = start; i <= end; i++) {
      const frequency = baseFreq * Math.pow(phi, i);
      sequence.push(Math.round(frequency * 100) / 100);
    }
    
    return sequence;
  };

  // Generate Spiral sequence (Fibonacci with spiral pattern)
  const generateSpiralSequence = (start, end, baseFreq) => {
    const sequence = [];
    const fib = generateFibonacciSequence(0, end);
    
    for (let i = start; i <= end; i++) {
      const frequency = baseFreq * fib[i] * (1 + Math.sin(i * 0.5) * 0.1);
      sequence.push(Math.round(frequency * 100) / 100);
    }
    
    return sequence;
  };

  useEffect(() => {
    let sequence = [];
    
    switch (fibonacciSettings.pattern) {
      case 'sequence':
        sequence = generateFibonacciSequence(fibonacciSettings.startIndex, fibonacciSettings.endIndex);
        break;
      case 'golden_ratio':
        sequence = generateGoldenRatioSequence(fibonacciSettings.startIndex, fibonacciSettings.endIndex, fibonacciSettings.baseFrequency);
        break;
      case 'spiral':
        sequence = generateSpiralSequence(fibonacciSettings.startIndex, fibonacciSettings.endIndex, fibonacciSettings.baseFrequency);
        break;
      default:
        sequence = generateFibonacciSequence(fibonacciSettings.startIndex, fibonacciSettings.endIndex);
    }
    
    setFibonacciSequence(sequence);
  }, [fibonacciSettings.startIndex, fibonacciSettings.endIndex, fibonacciSettings.pattern, fibonacciSettings.baseFrequency]);

  // Auto-play through sequence
  useEffect(() => {
    let interval;
    
    if (isAutoPlaying && fibonacciSequence.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = (prev + 1) % fibonacciSequence.length;
          playCurrentFrequency(nextIndex);
          return nextIndex;
        });
      }, fibonacciSettings.duration * 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoPlaying, fibonacciSequence, fibonacciSettings.duration]);

  const playCurrentFrequency = (index) => {
    if (index >= fibonacciSequence.length) return;
    
    const frequency = fibonacciSequence[index] * fibonacciSettings.multiplier;
    const frequencies = [{
      value: frequency,
      volume: 0.5,
      waveType: 'sine',
      isBinaural: false,
      binauralOffset: 0
    }];
    
    playFrequencies(frequencies);
    if (onFrequenciesChange) {
      onFrequenciesChange(frequencies);
    }
  };

  const handlePlaySequence = async () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      stopAll();
    } else {
      setIsAutoPlaying(true);
      setCurrentIndex(0);
      playCurrentFrequency(0);
    }
  };

  const handlePlaySingle = async (index) => {
    setCurrentIndex(index);
    playCurrentFrequency(index);
  };

  const updateSettings = (field, value) => {
    setFibonacciSettings(prev => ({ ...prev, [field]: value }));
  };

  const formatFrequency = (freq) => {
    if (freq < 1) return `${freq.toFixed(2)} Hz`;
    if (freq < 1000) return `${freq.toFixed(1)} Hz`;
    return `${(freq / 1000).toFixed(1)} kHz`;
  };

  const getPatternDescription = (pattern) => {
    switch (pattern) {
      case 'sequence':
        return 'Classic Fibonacci sequence (1, 1, 2, 3, 5, 8, 13...)';
      case 'golden_ratio':
        return 'Golden ratio progression (φ, φ², φ³...)';
      case 'spiral':
        return 'Fibonacci with spiral modulation';
      default:
        return '';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Fibonacci Generator</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePlaySequence}
            className={`btn-primary flex items-center space-x-2 ${
              isAutoPlaying ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
          >
            {isAutoPlaying ? (
              <>
                <StopIcon className="w-4 h-4" />
                <span>Stop Sequence</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4" />
                <span>Play Sequence</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Start Index
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={fibonacciSettings.startIndex}
            onChange={(e) => updateSettings('startIndex', parseInt(e.target.value))}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            End Index
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={fibonacciSettings.endIndex}
            onChange={(e) => updateSettings('endIndex', parseInt(e.target.value))}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Base Frequency
          </label>
          <input
            type="number"
            min="0.01"
            max="1000"
            step="0.01"
            value={fibonacciSettings.baseFrequency}
            onChange={(e) => updateSettings('baseFrequency', parseFloat(e.target.value))}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Multiplier
          </label>
          <input
            type="number"
            min="0.01"
            max="100"
            step="0.01"
            value={fibonacciSettings.multiplier}
            onChange={(e) => updateSettings('multiplier', parseFloat(e.target.value))}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Duration (seconds)
          </label>
          <input
            type="number"
            min="1"
            max="300"
            value={fibonacciSettings.duration}
            onChange={(e) => updateSettings('duration', parseInt(e.target.value))}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Pattern
          </label>
          <select
            value={fibonacciSettings.pattern}
            onChange={(e) => updateSettings('pattern', e.target.value)}
            className="input-field w-full"
          >
            <option value="sequence">Fibonacci Sequence</option>
            <option value="golden_ratio">Golden Ratio</option>
            <option value="spiral">Spiral Pattern</option>
          </select>
        </div>
      </div>

      {/* Pattern Description */}
      <div className="mb-6 p-3 bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-300">
          <span className="font-medium text-primary-400">Pattern:</span> {getPatternDescription(fibonacciSettings.pattern)}
        </p>
      </div>

      {/* Fibonacci Sequence Display */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Generated Sequence</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {fibonacciSequence.map((value, index) => {
            const frequency = value * fibonacciSettings.multiplier;
            const isCurrent = index === currentIndex && isAutoPlaying;
            
            return (
              <button
                key={index}
                onClick={() => handlePlaySingle(index)}
                className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                  isCurrent
                    ? 'bg-primary-600 border-primary-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">#{index + fibonacciSettings.startIndex}</div>
                <div className="font-mono text-sm font-medium">{value}</div>
                <div className="text-xs text-gray-400 mt-1">{formatFrequency(frequency)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Frequency Display */}
      {isAutoPlaying && fibonacciSequence.length > 0 && (
        <div className="p-4 bg-primary-900 border border-primary-700 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-primary-300 mb-1">Currently Playing</div>
            <div className="frequency-display text-3xl">
              {formatFrequency(fibonacciSequence[currentIndex] * fibonacciSettings.multiplier)}
            </div>
            <div className="text-sm text-primary-300 mt-1">
              Fibonacci #{currentIndex + fibonacciSettings.startIndex}: {fibonacciSequence[currentIndex]}
            </div>
          </div>
        </div>
      )}

      {/* Golden Ratio Info */}
      {fibonacciSettings.pattern === 'golden_ratio' && (
        <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
          <div className="text-sm text-yellow-300">
            <span className="font-medium">Golden Ratio (φ):</span> 1.618033988749895
            <br />
            <span className="font-medium">Formula:</span> frequency = base × φ^n
          </div>
        </div>
      )}
    </div>
  );
};

export default FibonacciGenerator;