import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AudioProvider } from './contexts/AudioContext';
import { SessionProvider } from './contexts/SessionContext';

// Components
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Presets from './pages/Presets';
import Sessions from './pages/Sessions';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Plugin system
import { loadPlugins } from './plugins/pluginLoader';

function AppContent() {
  const { user, loading } = useAuth();
  const [pluginsLoaded, setPluginsLoaded] = useState(false);

  useEffect(() => {
    const initializePlugins = async () => {
      try {
        await loadPlugins();
        setPluginsLoaded(true);
      } catch (error) {
        console.error('Failed to load plugins:', error);
        setPluginsLoaded(true); // Continue even if plugins fail
      }
    };

    initializePlugins();
  }, []);

  if (loading || !pluginsLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          {/* Protected routes */}
          <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="presets" element={<Presets />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AudioProvider>
          <SessionProvider>
            <AppContent />
          </SessionProvider>
        </AudioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;