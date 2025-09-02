import React, { useState } from 'react';
import { useSession } from '../../contexts/SessionContext';
import { useAuth } from '../../contexts/AuthContext';
import { ClockIcon, PlayIcon, StopIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SessionLogger = ({ frequencies, lightPattern, currentSession }) => {
  const { startSession, endSession, addFeedback } = useSession();
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const handleStartSession = async () => {
    if (!frequencies || frequencies.length === 0) {
      toast.error('Please set frequencies before starting a session');
      return;
    }

    try {
      setIsLogging(true);
      const sessionData = {
        name: `Session ${new Date().toLocaleString()}`,
        sessionData: {
          frequencies,
          lightPattern,
          settings: {
            volume: 0.5,
            duration: 300,
            binauralMode: false,
            modulation: { enabled: false, type: 'AM', rate: 1 }
          }
        },
        notes
      };

      await startSession(sessionData);
      setNotes('');
      toast.success('Session started');
    } catch (error) {
      console.error('Failed to start session:', error);
      toast.error('Failed to start session');
    } finally {
      setIsLogging(false);
    }
  };

  const handleEndSession = async () => {
    if (!currentSession) return;

    try {
      setIsLogging(true);
      await endSession(currentSession._id);
      toast.success('Session ended');
    } catch (error) {
      console.error('Failed to end session:', error);
      toast.error('Failed to end session');
    } finally {
      setIsLogging(false);
    }
  };

  const handleAddFeedback = async (feedback) => {
    if (!currentSession) return;

    try {
      await addFeedback(currentSession._id, feedback);
      toast.success('Feedback added');
    } catch (error) {
      console.error('Failed to add feedback:', error);
      toast.error('Failed to add feedback');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <ClockIcon className="w-5 h-5 mr-2" />
          Session Logger
        </h2>
        <div className="flex items-center space-x-2">
          {currentSession ? (
            <button
              onClick={handleEndSession}
              disabled={isLogging}
              className="btn-danger flex items-center space-x-2"
            >
              <StopIcon className="w-4 h-4" />
              <span>End Session</span>
            </button>
          ) : (
            <button
              onClick={handleStartSession}
              disabled={isLogging || !frequencies || frequencies.length === 0}
              className="btn-primary flex items-center space-x-2"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Start Session</span>
            </button>
          )}
        </div>
      </div>

      {currentSession ? (
        <div className="space-y-4">
          {/* Active Session Info */}
          <div className="bg-primary-900 border border-primary-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-primary-200 mb-2">Active Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-primary-300">Started:</span>
                <span className="text-white ml-2">
                  {new Date(currentSession.startTime).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-primary-300">Duration:</span>
                <span className="text-white ml-2">
                  {Math.floor((Date.now() - new Date(currentSession.startTime)) / 1000)}s
                </span>
              </div>
              <div>
                <span className="text-primary-300">Frequencies:</span>
                <span className="text-white ml-2">
                  {currentSession.sessionData.frequencies.length}
                </span>
              </div>
              <div>
                <span className="text-primary-300">Light Pattern:</span>
                <span className="text-white ml-2">
                  {currentSession.sessionData.lightPattern?.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Session Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Session Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your experience..."
              className="input-field w-full h-24 resize-none"
            />
          </div>

          {/* Quick Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quick Feedback
            </label>
            <div className="flex flex-wrap gap-2">
              {['relaxation', 'energy', 'focus', 'sleep', 'pain_relief', 'mood_improvement'].map((effect) => (
                <button
                  key={effect}
                  onClick={() => handleAddFeedback({
                    rating: 4,
                    effects: [effect],
                    comments: `Quick feedback: ${effect}`
                  })}
                  className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {effect.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <DocumentTextIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            Start a session to track your frequency therapy experience
          </p>
          <p className="text-sm text-gray-500">
            Sessions help you track the effects of different frequencies and patterns
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionLogger;