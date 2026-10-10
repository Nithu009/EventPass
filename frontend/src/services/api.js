import axios from 'axios';

// ---------------------------------------------------------------------------
// Base URL resolution
// ---------------------------------------------------------------------------
// VITE_API_BASE_URL must be set in the Vercel dashboard (Production scope) as:
//   https://eventpass-8c66.onrender.com/api
// In local dev, VITE_API_BASE_URL is not set; Vite proxies /api → localhost:8080.
// ---------------------------------------------------------------------------

const PRODUCTION_BACKEND = 'https://eventpass-8c66.onrender.com';

/**
 * Full API base URL including the /api segment.
 * Used as the axios baseURL for all REST calls.
 */
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL          // set by Vercel env var in production
  : import.meta.env.DEV
    ? '/api'                                    // local dev → Vite proxy → localhost:8080
    : `${PRODUCTION_BACKEND}/api`;             // hard production fallback (no localhost)

/**
 * Backend root URL (without /api) — used for root-level probes such as GET /healthz.
 * Derived from VITE_API_BASE_URL by stripping the trailing /api segment so that
 * the health check hits https://eventpass-8c66.onrender.com/healthz, not /api/healthz.
 */
export const backendBaseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')
  : import.meta.env.DEV
    ? ''          // dev: health check → same origin (proxied via /healthz isn't proxied, use /api/healthz)
    : PRODUCTION_BACKEND;

const api = axios.create({
  baseURL: apiBaseUrl,
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
