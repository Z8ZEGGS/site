import React, { useRef, useEffect } from 'react';
import { useAudio } from '../../contexts/AudioContext';

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const { isPlaying, getAnalyserData, startVisualization, stopVisualization } = useAudio();

  useEffect(() => {
    if (isPlaying) {
      startVisualization(draw);
    } else {
      stopVisualization();
      // Clear canvas when stopped
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    return () => {
      stopVisualization();
    };
  }, [isPlaying, startVisualization, stopVisualization]);

  const draw = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    // Draw frequency bars
    const barWidth = width / data.length;
    const barMaxHeight = height * 0.8;

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * barMaxHeight;
      
      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(0.5, '#8b5cf6');
      gradient.addColorStop(1, '#ec4899');

      ctx.fillStyle = gradient;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }

    // Draw waveform overlay
    drawWaveform(ctx, data, width, height);
  };

  const drawWaveform = (ctx, data, width, height) => {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const sliceWidth = width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 255.0;
      const y = height - (v * height);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();
  };

  return (
    <div className="waveform-container">
      <h3 className="text-lg font-semibold text-white mb-4">Audio Visualizer</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-48 bg-gray-800 rounded-lg border border-gray-600"
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="w-16 h-16 mx-auto mb-2 border-4 border-gray-600 border-t-primary-500 rounded-full animate-spin"></div>
              <p>Start playing frequencies to see visualization</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioVisualizer;