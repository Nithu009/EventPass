import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Local development uses the Vite dev server proxy at /api
  if (import.meta.env.DEV) {
    return '/api';
  }
  // Production fallback to the deployed Render backend
  return 'https://eventpass-8c66.onrender.com/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventpass_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global HTTP Errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        localStorage.removeItem('eventpass_token');
        localStorage.removeItem('eventpass_user');
        window.dispatchEvent(new Event('eventpass_auth_expired'));
      }
      return Promise.reject(error.response.data || error.message);
    }
    return Promise.reject({ message: 'Network connection error. Please verify the backend is running.' });
  }
);

export default api;
