export const API_BASE_URL = 'http://localhost:5000/api'; // Change base URL for backend integration

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },
  EMPLOYEES: {
    BASE: `${API_BASE_URL}/employees`,
    DETAIL: (id: string) => `${API_BASE_URL}/employees/${id}`,
  },
  PROJECTS: {
    BASE: `${API_BASE_URL}/projects`,
    DETAIL: (id: string) => `${API_BASE_URL}/projects/${id}`,
  },
  TASKS: {
    BASE: `${API_BASE_URL}/tasks`,
    DETAIL: (id: string) => `${API_BASE_URL}/tasks/${id}`,
    STATUS: (id: string) => `${API_BASE_URL}/tasks/${id}/status`,
  },
  LEAVES: {
    BASE: `${API_BASE_URL}/leaves`,
    DETAIL: (id: string) => `${API_BASE_URL}/leaves/${id}`,
  },
  DEPARTMENTS: `${API_BASE_URL}/departments`,
  ACTIVITY_LOGS: `${API_BASE_URL}/activity-logs`,
  CHAT: `${API_BASE_URL}/chat/message`,
};

export default API_ENDPOINTS;
