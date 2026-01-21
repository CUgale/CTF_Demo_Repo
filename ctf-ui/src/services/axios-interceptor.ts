import axios, { AxiosError } from 'axios';
import { APP_API_BASE_URL, SERVICE_ENDPOINT } from '../pages/shared/constants/service-endpoints';

let handlingUnauthorized = false;

// Separate client (no interceptors) to avoid recursive 401 loops during logout.
const logoutClient = axios.create({
  baseURL: APP_API_BASE_URL,
  timeout: 3000,
});

export const apiClient = axios.create({
  baseURL: APP_API_BASE_URL,
});

apiClient.defaults.headers.post['Content-Type'] = 'application/json';

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = String(error.config?.url ?? '');

    // Don't auto-logout on login failures; let the login flow handle it.
    const isLoginRequest = url.includes(SERVICE_ENDPOINT.LOGIN);
    const isLogoutRequest = url.includes(SERVICE_ENDPOINT.LOGOUT);

    if (status === 401 && !isLoginRequest && !isLogoutRequest && !handlingUnauthorized) {
      handlingUnauthorized = true;

      // Best-effort server-side logout; ignore any errors/timeouts.
      void logoutClient.post(SERVICE_ENDPOINT.LOGOUT).catch(() => undefined).finally(() => {
        try {
          localStorage.clear();
        } finally {
          // Hard redirect to reset Redux state cleanly.
          if (window.location.pathname !== '/login') {
            window.location.replace('/login');
          } else {
            // If already on login, allow future 401 handling.
            handlingUnauthorized = false;
          }
        }
      });
    }

    return Promise.reject(error);
  }
);

