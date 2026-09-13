import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000
  });

  // Add token to requests
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle responses
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createAxiosInstance();

export default api;
