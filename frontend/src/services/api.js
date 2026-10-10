import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
