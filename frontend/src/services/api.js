import axios from 'axios';

// ---------------------------------------------------------------------------
// API Base URL — single source of truth
// ---------------------------------------------------------------------------
// STRATEGY:
//   Development  → '/api'  (Vite dev-server proxy forwards to localhost:8080)
//   Production   → absolute Render URL  (never relies on an env var that could
//                  accidentally contain "localhost")
//
// WHY NOT VITE_API_BASE_URL?
//   If the Vercel dashboard env var is accidentally set to http://localhost:8080/api
//   (copied from .env.example), it overrides the .env.production file and bakes
//   localhost into the production bundle.  By resolving the URL in code using
//   import.meta.env.DEV (which Vite bakes in at build time as a boolean), we
//   guarantee the correct URL regardless of any dashboard variable.
// ---------------------------------------------------------------------------

/** Deployed Render backend — no trailing slash. */
const RENDER_BACKEND = 'https://eventpass-8c66.onrender.com';

/**
 * Base URL for all /api/* REST calls.
 *  - DEV build  → '/api'  (Vite proxy rewrites to http://localhost:8080/api)
 *  - PROD build → 'https://eventpass-8c66.onrender.com/api'
 */
const API_BASE = import.meta.env.DEV
  ? '/api'
  : `${RENDER_BACKEND}/api`;

/**
 * Backend root (no /api suffix) — used for the root-level health probe /healthz.
 *  - DEV build  → '' (relative, handled via Vite proxy at /api/healthz)
 *  - PROD build → 'https://eventpass-8c66.onrender.com'
 */
export const BACKEND_ORIGIN = import.meta.env.DEV ? '' : RENDER_BACKEND;

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT Bearer token if present
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

// Response interceptor — unwrap data; handle 401 globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('eventpass_token');
        localStorage.removeItem('eventpass_user');
        window.dispatchEvent(new Event('eventpass_auth_expired'));
      }
      return Promise.reject(error.response.data || error.message);
    }
    // Network error / CORS failure / backend offline
    return Promise.reject({
      message: 'Network connection error. Please verify the backend is running.',
    });
  }
);

export default api;
