import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await api.post('/auth/refresh');
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }).then(res => res.data),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }).then(res => res.data),
  getProfile: () => api.get('/auth/profile').then(res => res.data.user),
  updateProfile: (data) => api.put('/auth/profile', data).then(res => res.data.user),
  refreshToken: () => api.post('/auth/refresh').then(res => res.data),
};

// Presets API
export const presetsAPI = {
  getPresets: (params = {}) => api.get('/presets', { params }).then(res => res.data),
  getPresetById: (id) => api.get(`/presets/${id}`).then(res => res.data.preset),
  createPreset: (data) => api.post('/presets', data).then(res => res.data.preset),
  updatePreset: (id, data) => api.put(`/presets/${id}`, data).then(res => res.data.preset),
  deletePreset: (id) => api.delete(`/presets/${id}`).then(res => res.data),
  duplicatePreset: (id) => api.post(`/presets/${id}/duplicate`).then(res => res.data.preset),
  incrementUsage: (id) => api.post(`/presets/${id}/increment-usage`).then(res => res.data),
};

// Sessions API
export const sessionAPI = {
  createSession: (data) => api.post('/sessions', data).then(res => res.data.session),
  getSessions: (params = {}) => api.get('/sessions', { params }).then(res => res.data),
  getSessionById: (id) => api.get(`/sessions/${id}`).then(res => res.data.session),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data).then(res => res.data.session),
  endSession: (id) => api.put(`/sessions/${id}/end`).then(res => res.data.session),
  addFeedback: (id, feedback) => api.post(`/sessions/${id}/feedback`, feedback).then(res => res.data.session),
  deleteSession: (id) => api.delete(`/sessions/${id}`).then(res => res.data),
  getSessionStats: (period = '30') => api.get('/sessions/stats', { params: { period } }).then(res => res.data),
  exportSessions: (format = 'json', params = {}) => {
    if (format === 'csv') {
      return api.get('/sessions/export', { 
        params: { format, ...params },
        responseType: 'blob'
      }).then(res => {
        const blob = new Blob([res.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sessions.csv';
        link.click();
        window.URL.revokeObjectURL(url);
        return { success: true };
      });
    } else {
      return api.get('/sessions/export', { params: { format, ...params } }).then(res => res.data);
    }
  },
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile').then(res => res.data.user),
  updateProfile: (data) => api.put('/users/profile', data).then(res => res.data.user),
};

export default api;