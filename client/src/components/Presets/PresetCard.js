import React from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { useAuth } from '../../contexts/AuthContext';
import { PlayIcon, StopIcon, HeartIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const PresetCard = ({ preset, onPlay, onStop, onDelete, onDuplicate, isPlaying = false }) => {
  const { user } = useAuth();

  const handlePlay = () => {
    if (onPlay) {
      onPlay(preset);
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    }
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(preset);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this preset?')) {
      onDelete(preset._id);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      healing: 'bg-red-100 text-red-800 border-red-200',
      meditation: 'bg-blue-100 text-blue-800 border-blue-200',
      focus: 'bg-green-100 text-green-800 border-green-200',
      sleep: 'bg-purple-100 text-purple-800 border-purple-200',
      energy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      custom: 'bg-gray-100 text-gray-800 border-gray-200',
      fibonacci: 'bg-orange-100 text-orange-800 border-orange-200',
      research: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[category] || colors.custom;
  };

  const formatFrequencies = (frequencies) => {
    if (!frequencies || frequencies.length === 0) return 'No frequencies';
    
    if (frequencies.length === 1) {
      const freq = frequencies[0];
      return `${freq.value}${freq.value < 1000 ? ' Hz' : ' kHz'}`;
    }
    
    return `${frequencies.length} frequencies`;
  };

  const isOwner = user && preset.userId && preset.userId._id === user._id;

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{preset.name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(preset.category)}`}>
              {preset.category}
            </span>
            {preset.isDefault && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Default
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {preset.usageCount > 0 && (
            <span className="text-xs text-gray-400">
              {preset.usageCount} uses
            </span>
          )}
          {preset.rating > 0 && (
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <HeartSolidIcon
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.round(preset.rating) ? 'text-red-500' : 'text-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {preset.description && (
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{preset.description}</p>
      )}

      {/* Frequencies */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Frequencies:</div>
        <div className="text-sm text-white font-mono">{formatFrequencies(preset.frequencies)}</div>
      </div>

      {/* Light Pattern */}
      {preset.lightPattern && preset.lightPattern.enabled && (
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">Light Pattern:</div>
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full border border-gray-600"
              style={{ backgroundColor: preset.lightPattern.color }}
            />
            <span className="text-sm text-white capitalize">{preset.lightPattern.pattern}</span>
          </div>
        </div>
      )}

      {/* Tags */}
      {preset.tags && preset.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {preset.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
            {preset.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                +{preset.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Author */}
      {preset.userId && (
        <div className="text-xs text-gray-400 mb-4">
          by {preset.userId.name}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isPlaying ? (
            <button
              onClick={handleStop}
              className="btn-danger flex items-center space-x-1"
            >
              <StopIcon className="w-4 h-4" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="btn-primary flex items-center space-x-1"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Play</span>
            </button>
          )}
          
          {!isOwner && (
            <button
              onClick={handleDuplicate}
              className="btn-secondary flex items-center space-x-1"
            >
              <ShareIcon className="w-4 h-4" />
              <span>Copy</span>
            </button>
          )}
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 p-1"
            title="Delete preset"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PresetCard;