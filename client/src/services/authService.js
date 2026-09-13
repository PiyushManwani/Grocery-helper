import apiInstance from './api';

const authService = {
  register: (name, email, password, confirmPassword) =>
    apiInstance.post('/auth/register', { name, email, password, confirmPassword }),

  login: (email, password) =>
    apiInstance.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    apiInstance.get('/auth/me'),

  updatePreferences: (preferences) =>
    apiInstance.put('/auth/preferences', preferences),

  verifyToken: () =>
    apiInstance.get('/auth/verify'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
