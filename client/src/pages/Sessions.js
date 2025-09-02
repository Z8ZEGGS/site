import React, { useState, useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ClockIcon, 
  PlayIcon, 
  TrashIcon, 
  DownloadIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Sessions = () => {
  const { sessions, loading, getSessions, deleteSession, exportSessions } = useSession();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user, searchTerm, selectedStatus, startDate, endDate, currentPage]);

  const loadSessions = async () => {
    const params = {
      page: currentPage,
      limit: 10,
      completed: selectedStatus === 'completed' ? true : selectedStatus === 'active' ? false : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    };

    const response = await getSessions(params);
    if (response.success) {
      setTotalPages(response.totalPages);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      const result = await deleteSession(sessionId);
      if (result.success) {
        loadSessions(); // Reload sessions
      }
    }
  };

  const handleExportSessions = async (format = 'json') => {
    try {
      const params = {
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };
      
      const result = await exportSessions(format, params);
      if (result.success) {
        toast.success(`Sessions exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed');
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusColor = (isCompleted) => {
    return isCompleted 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusText = (isCompleted) => {
    return isCompleted ? 'Completed' : 'Active';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <ClockIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Please log in to view your sessions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Session History</h1>
          <p className="text-gray-400 mt-1">Track your frequency therapy sessions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExportSessions('csv')}
            className="btn-secondary flex items-center space-x-2"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExportSessions('json')}
            className="btn-secondary flex items-center space-x-2"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">All Sessions</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : sessions.length > 0 ? (
        <>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session._id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {session.name || 'Untitled Session'}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(session.isCompleted)}`}>
                        {getStatusText(session.isCompleted)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Started:</span>
                        <div className="text-white">
                          {new Date(session.startTime).toLocaleString()}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <div className="text-white">
                          {formatDuration(session.duration)}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400">Frequencies:</span>
                        <div className="text-white">
                          {session.sessionData.frequencies.length}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400">Light Pattern:</span>
                        <div className="text-white">
                          {session.sessionData.lightPattern?.enabled ? 'Enabled' : 'Disabled'}
                        </div>
                      </div>
                    </div>

                    {session.notes && (
                      <div className="mt-3">
                        <span className="text-gray-400 text-sm">Notes:</span>
                        <p className="text-gray-300 text-sm mt-1">{session.notes}</p>
                      </div>
                    )}

                    {session.feedback && (
                      <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4 text-sm">
                          <div>
                            <span className="text-gray-400">Rating:</span>
                            <span className="text-white ml-1">{session.feedback.rating}/5</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Effects:</span>
                            <span className="text-white ml-1">
                              {session.feedback.effects.join(', ')}
                            </span>
                          </div>
                        </div>
                        {session.feedback.comments && (
                          <p className="text-gray-300 text-sm mt-2">
                            {session.feedback.comments}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleDeleteSession(session._id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete session"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(currentPage + 1)}
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
          <ClockIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No sessions found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedStatus || startDate || endDate
              ? 'Try adjusting your search or filters'
              : 'Start a session to see your history here'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Sessions;