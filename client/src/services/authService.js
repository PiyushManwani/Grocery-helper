import api from './api';

const authService = {
  register: (name, email, password, confirmPassword) =>
    api.post('/auth/register', { name, email, password, confirmPassword }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    api.get('/auth/me'),

  updatePreferences: (preferences) =>
    api.put('/auth/preferences', preferences),

  verifyToken: () =>
    api.get('/auth/verify'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
