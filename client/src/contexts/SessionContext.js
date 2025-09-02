import React, { createContext, useContext, useState, useCallback } from 'react';
import { sessionAPI } from '../services/api';
import toast from 'react-hot-toast';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const startSession = useCallback(async (sessionData) => {
    try {
      setLoading(true);
      const session = await sessionAPI.createSession(sessionData);
      setCurrentSession(session);
      toast.success('Session started');
      return { success: true, session };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to start session';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const endSession = useCallback(async (sessionId) => {
    try {
      setLoading(true);
      const session = await sessionAPI.endSession(sessionId);
      setCurrentSession(null);
      toast.success('Session ended');
      return { success: true, session };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to end session';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const addFeedback = useCallback(async (sessionId, feedback) => {
    try {
      setLoading(true);
      const session = await sessionAPI.addFeedback(sessionId, feedback);
      toast.success('Feedback added');
      return { success: true, session };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add feedback';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getSessions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await sessionAPI.getSessions(params);
      setSessions(response.sessions);
      return { success: true, ...response };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch sessions';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getSessionStats = useCallback(async (period = '30') => {
    try {
      setLoading(true);
      const stats = await sessionAPI.getSessionStats(period);
      return { success: true, ...stats };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch session stats';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const exportSessions = useCallback(async (format = 'json', params = {}) => {
    try {
      setLoading(true);
      const data = await sessionAPI.exportSessions(format, params);
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to export sessions';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSession = useCallback(async (sessionId) => {
    try {
      setLoading(true);
      await sessionAPI.deleteSession(sessionId);
      setSessions(prev => prev.filter(session => session._id !== sessionId));
      toast.success('Session deleted');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete session';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    currentSession,
    sessions,
    loading,
    startSession,
    endSession,
    addFeedback,
    getSessions,
    getSessionStats,
    exportSessions,
    deleteSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};