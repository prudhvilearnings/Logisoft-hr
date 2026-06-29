import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.hrms.local/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Auth Token if exists in store
api.interceptors.request.use(
  (config) => {
    // Retrievable from Zustand store or localStorage
    const token = localStorage.getItem('hrms_auth_token') || sessionStorage.getItem('hrms_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling (401, 403, 500)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Unauthorized - handle logout or redirection
        localStorage.removeItem('hrms_auth_token');
      } else if (status === 403) {
        // Forbidden
        console.warn('Forbidden access attempted.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
