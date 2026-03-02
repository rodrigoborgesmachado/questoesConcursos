import axios from "axios";
import { API_BASE_URL } from './apiConfig';
import { authService } from './auth/authService';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
  const token = authService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

// Add an interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
      const isUnauthorized = error.response && error.response.status === 401;
      const isTokenRequest = error.config?.url?.includes('/Token');
      const hasAuthHeader = !!error.config?.headers?.Authorization;
      const hasActiveSession = authService.isAuthenticated();

      // Only force global logout/redirect when an authenticated request fails.
      // Public requests without a token should not redirect visitors.
      if (isUnauthorized && !isTokenRequest && hasAuthHeader && hasActiveSession) {
        authService.logout({ redirectToLogin: true, reason: 'session-expired' });
      }

      return Promise.reject(error);
  }
);

export default api;
