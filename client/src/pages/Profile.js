import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSession } from '../contexts/SessionContext';
import { 
  UserIcon, 
  SunIcon, 
  MoonIcon, 
  ChartBarIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { getSessionStats } = useSession();
  
  const [profileData, setProfileData] = useState({
    name: '',
    preferences: {
      theme: 'dark',
      defaultVolume: 0.5,
      autoSave: true
    }
  });
  const [sessionStats, setSessionStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        preferences: {
          theme: user.preferences?.theme || 'dark',
          defaultVolume: user.preferences?.defaultVolume || 0.5,
          autoSave: user.preferences?.autoSave !== false
        }
      });
    }
  }, [user]);

  useEffect(() => {
    loadSessionStats();
  }, []);

  const loadSessionStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getSessionStats('30');
      if (response.success) {
        setSessionStats(response);
      }
    } catch (error) {
      console.error('Failed to load session stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const result = await updateProfile(profileData);
      if (result.success) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    handleInputChange('preferences.theme', newTheme);
    toggleTheme();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <UserIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-field w-full bg-gray-700 text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Member Since
                </label>
                <input
                  type="text"
                  value={new Date(user.createdAt).toLocaleDateString()}
                  disabled
                  className="input-field w-full bg-gray-700 text-gray-400"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Preferences</h2>
            
            <div className="space-y-6">
              {/* Theme */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Theme</h3>
                  <p className="text-xs text-gray-500">Choose your preferred color scheme</p>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="w-4 h-4" />
                  ) : (
                    <MoonIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm text-gray-300">
                    {theme === 'dark' ? 'Light' : 'Dark'} Mode
                  </span>
                </button>
              </div>

              {/* Default Volume */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Volume: {Math.round(profileData.preferences.defaultVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={profileData.preferences.defaultVolume}
                  onChange={(e) => handleInputChange('preferences.defaultVolume', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Auto Save Sessions</h3>
                  <p className="text-xs text-gray-500">Automatically save your frequency sessions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.autoSave}
                    onChange={(e) => handleInputChange('preferences.autoSave', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Session Statistics */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Session Stats
            </h2>
            
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : sessionStats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Sessions</span>
                  <span className="text-lg font-semibold text-white">
                    {sessionStats.stats.totalSessions}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Duration</span>
                  <span className="text-lg font-semibold text-white">
                    {Math.round(sessionStats.stats.totalDuration / 60)}m
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Avg Duration</span>
                  <span className="text-lg font-semibold text-white">
                    {Math.round(sessionStats.stats.avgDuration / 60)}m
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Completed</span>
                  <span className="text-lg font-semibold text-white">
                    {sessionStats.stats.completedSessions}
                  </span>
                </div>
                
                {sessionStats.stats.avgRating > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Avg Rating</span>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-white mr-1">
                        {sessionStats.stats.avgRating.toFixed(1)}
                      </span>
                      <HeartIcon className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClockIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No session data yet</p>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Account</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">User ID</span>
                <span className="text-xs text-gray-500 font-mono">
                  {user._id.slice(-8)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;