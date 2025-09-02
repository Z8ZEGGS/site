import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '../../contexts/AudioContext';

const LightPatterns = ({ onLightPatternChange }) => {
  const { isPlaying, currentFrequencies } = useAudio();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [lightPattern, setLightPattern] = useState({
    enabled: false,
    color: '#ffffff',
    flashRate: 1,
    pattern: 'pulse',
    intensity: 0.5,
    syncToAudio: true
  });

  useEffect(() => {
    if (onLightPatternChange) {
      onLightPatternChange(lightPattern);
    }
  }, [lightPattern, onLightPatternChange]);

  useEffect(() => {
    if (lightPattern.enabled && isPlaying) {
      startLightAnimation();
    } else {
      stopLightAnimation();
    }

    return () => {
      stopLightAnimation();
    };
  }, [lightPattern.enabled, isPlaying, lightPattern.pattern, lightPattern.flashRate, lightPattern.color, lightPattern.intensity]);

  const startLightAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Calculate flash rate based on audio sync or manual setting
      let flashRate = lightPattern.flashRate;
      if (lightPattern.syncToAudio && currentFrequencies.length > 0) {
        // Use the first frequency as the flash rate
        flashRate = Math.min(currentFrequencies[0].value, 100); // Cap at 100 Hz for visual comfort
      }

      const alpha = lightPattern.intensity * (0.5 + 0.5 * Math.sin(time * flashRate * 0.1));

      // Parse color
      const color = hexToRgb(lightPattern.color);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

      switch (lightPattern.pattern) {
        case 'solid':
          drawSolid(ctx, width, height);
          break;
        case 'pulse':
          drawPulse(ctx, width, height, time, flashRate);
          break;
        case 'spiral':
          drawSpiral(ctx, width, height, time, flashRate);
          break;
        case 'mandala':
          drawMandala(ctx, width, height, time, flashRate);
          break;
        case 'wave':
          drawWave(ctx, width, height, time, flashRate);
          break;
        case 'random':
          drawRandom(ctx, width, height, time, flashRate);
          break;
        default:
          drawPulse(ctx, width, height, time, flashRate);
      }

      time += 0.016; // ~60fps
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const stopLightAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const drawSolid = (ctx, width, height) => {
    ctx.fillRect(0, 0, width, height);
  };

  const drawPulse = (ctx, width, height, time, flashRate) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;
    const radius = maxRadius * (0.3 + 0.7 * Math.abs(Math.sin(time * flashRate * 0.1)));

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSpiral = (ctx, width, height, time, flashRate) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;

    ctx.beginPath();
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 4 + time * flashRate * 0.1;
      const radius = (i / 100) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const drawMandala = (ctx, width, height, time, flashRate) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;

    for (let ring = 0; ring < 5; ring++) {
      const radius = (ring + 1) * (maxRadius / 5);
      const petals = 6 + ring * 2;
      
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2 + time * flashRate * 0.05;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawWave = (ctx, width, height, time, flashRate) => {
    const amplitude = height * 0.3;
    const frequency = flashRate * 0.1;
    
    ctx.beginPath();
    for (let x = 0; x < width; x += 2) {
      const y = height / 2 + Math.sin((x / width) * Math.PI * 4 + time * frequency) * amplitude;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const drawRandom = (ctx, width, height, time, flashRate) => {
    const numPoints = 20;
    const seed = Math.floor(time * flashRate * 0.1);
    
    for (let i = 0; i < numPoints; i++) {
      const x = (Math.sin(seed + i) * 0.5 + 0.5) * width;
      const y = (Math.cos(seed + i * 1.3) * 0.5 + 0.5) * height;
      const size = (Math.sin(seed + i * 0.7) * 0.5 + 0.5) * 20 + 5;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const updateLightPattern = (field, value) => {
    setLightPattern(prev => ({ ...prev, [field]: value }));
  };

  const presetColors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ffffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a', '#008000'
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Light Patterns</h2>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={lightPattern.enabled}
            onChange={(e) => updateLightPattern('enabled', e.target.checked)}
            className="rounded border-gray-600 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-300">Enable Light Patterns</span>
        </label>
      </div>

      {lightPattern.enabled && (
        <>
          {/* Light Pattern Canvas */}
          <div className="light-pattern-container mb-6">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full h-64"
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color
              </label>
              <div className="space-y-3">
                <input
                  type="color"
                  value={lightPattern.color}
                  onChange={(e) => updateLightPattern('color', e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-600 cursor-pointer"
                />
                <div className="grid grid-cols-6 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateLightPattern('color', color)}
                      className={`w-8 h-8 rounded-lg border-2 ${
                        lightPattern.color === color ? 'border-white' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Pattern Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pattern
              </label>
              <select
                value={lightPattern.pattern}
                onChange={(e) => updateLightPattern('pattern', e.target.value)}
                className="input-field w-full"
              >
                <option value="solid">Solid</option>
                <option value="pulse">Pulse</option>
                <option value="spiral">Spiral</option>
                <option value="mandala">Mandala</option>
                <option value="wave">Wave</option>
                <option value="random">Random</option>
              </select>
            </div>

            {/* Flash Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Flash Rate: {lightPattern.flashRate.toFixed(1)} Hz
              </label>
              <input
                type="range"
                min="0.1"
                max="100"
                step="0.1"
                value={lightPattern.flashRate}
                onChange={(e) => updateLightPattern('flashRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Intensity: {Math.round(lightPattern.intensity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={lightPattern.intensity}
                onChange={(e) => updateLightPattern('intensity', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Audio Sync */}
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={lightPattern.syncToAudio}
                onChange={(e) => updateLightPattern('syncToAudio', e.target.checked)}
                className="rounded border-gray-600 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-300">
                Sync to Audio Frequency
                {lightPattern.syncToAudio && currentFrequencies.length > 0 && (
                  <span className="text-primary-400 ml-1">
                    ({currentFrequencies[0].value.toFixed(1)} Hz)
                  </span>
                )}
              </span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default LightPatterns;