import React, { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useAuth } from '../contexts/AuthContext';
import { presetsAPI } from '../services/api';
import PresetCard from '../components/Presets/PresetCard';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Presets = () => {
  const { isPlaying, playFrequencies, stopAll } = useAudio();
  const { user } = useAuth();
  
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPlayingPreset, setCurrentPlayingPreset] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'healing', label: 'Healing' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'focus', label: 'Focus' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'energy', label: 'Energy' },
    { value: 'fibonacci', label: 'Fibonacci' },
    { value: 'custom', label: 'Custom' },
    { value: 'research', label: 'Research' }
  ];

  useEffect(() => {
    loadPresets();
  }, [searchTerm, selectedCategory, currentPage]);

  const loadPresets = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm,
        category: selectedCategory
      };

      const response = await presetsAPI.getPresets(params);
      setPresets(response.presets);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load presets:', error);
      toast.error('Failed to load presets');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPreset = async (preset) => {
    try {
      if (currentPlayingPreset === preset._id) {
        // Stop current preset
        stopAll();
        setCurrentPlayingPreset(null);
      } else {
        // Play new preset
        await playFrequencies(preset.frequencies);
        setCurrentPlayingPreset(preset._id);
        
        // Increment usage count
        await presetsAPI.incrementUsage(preset._id);
        
        toast.success(`Playing: ${preset.name}`);
      }
    } catch (error) {
      console.error('Failed to play preset:', error);
      toast.error('Failed to play preset');
    }
  };

  const handleStop = () => {
    stopAll();
    setCurrentPlayingPreset(null);
  };

  const handleDuplicatePreset = async (preset) => {
    try {
      const duplicatedPreset = await presetsAPI.duplicatePreset(preset._id);
      toast.success('Preset duplicated successfully');
      loadPresets(); // Reload to show the new preset
    } catch (error) {
      console.error('Failed to duplicate preset:', error);
      toast.error('Failed to duplicate preset');
    }
  };

  const handleDeletePreset = async (presetId) => {
    try {
      await presetsAPI.deletePreset(presetId);
      toast.success('Preset deleted successfully');
      loadPresets(); // Reload to remove the deleted preset
    } catch (error) {
      console.error('Failed to delete preset:', error);
      toast.error('Failed to delete preset');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Presets Library</h1>
          <p className="text-gray-400 mt-1">Explore research-based frequency presets</p>
        </div>
        
        {user && (
          <button className="btn-primary flex items-center space-x-2">
            <PlusIcon className="w-4 h-4" />
            <span>Create Preset</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search presets..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field w-full pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing {presets.length} preset{presets.length !== 1 ? 's' : ''}
        {searchTerm && ` for "${searchTerm}"`}
        {selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
      </div>

      {/* Presets Grid */}
      {presets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {presets.map((preset) => (
              <PresetCard
                key={preset._id}
                preset={preset}
                onPlay={handlePlayPreset}
                onStop={handleStop}
                onDuplicate={handleDuplicatePreset}
                onDelete={handleDeletePreset}
                isPlaying={currentPlayingPreset === preset._id}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;
                  const isNearCurrent = Math.abs(page - currentPage) <= 2;
                  const isFirstOrLast = page === 1 || page === totalPages;
                  
                  if (!isNearCurrent && !isFirstOrLast) {
                    if (page === currentPage - 3 || page === currentPage + 3) {
                      return <span key={page} className="text-gray-400">...</span>;
                    }
                    return null;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        isCurrentPage
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No presets found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search or filters'
                : 'No presets available at the moment'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Presets;