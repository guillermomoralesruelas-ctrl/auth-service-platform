import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Assume you have userId in localstorage or we extract it from decoded JWT
        const refreshToken = Cookies.get('refresh_token');
        const userId = localStorage.getItem('user_id'); // Temporary way to get userId
        
        if (!refreshToken || !userId) throw new Error('No refresh token');

        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/refresh`, {
          userId,
          refreshToken
        });

        Cookies.set('access_token', data.access_token);
        Cookies.set('refresh_token', data.refresh_token);

        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        localStorage.removeItem('user_id');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
