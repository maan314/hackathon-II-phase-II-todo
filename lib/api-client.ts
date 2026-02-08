import axios from 'axios';

// Create an axios instance with base configuration
const baseURL = (process.env.NEXT_PUBLIC_API_URL || 'https://maan143-hackathon-ii-phase-ii-backend.hf.space')
  .replace('http://', 'https://');

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
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

// Response interceptor to handle token expiration or other auth issues
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - possibly token expired
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem('token');
      // Optionally redirect to login page
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Export utility functions for common operations
export const api = {
  get: <T>(url: string, config?: any) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: any) => apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: any) => apiClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: any) => apiClient.delete<T>(url, config),
  patch: <T>(url: string, data?: any, config?: any) => apiClient.patch<T>(url, data, config),
};