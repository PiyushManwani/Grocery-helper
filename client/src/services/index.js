import api from './api';

// Auth API calls
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  verifyToken: () => api.get('/auth/verify'),
  updatePreferences: (data) => api.put('/auth/preferences', data)
};

// Pantry API calls
export const pantryService = {
  getItems: (category) => api.get('/pantry', { params: { category } }),
  addItem: (data) => api.post('/pantry', data),
  updateItem: (id, data) => api.put(`/pantry/${id}`, data),
  deleteItem: (id) => api.delete(`/pantry/${id}`),
  getExpiringItems: (days) => api.get('/pantry/expiring', { params: { days } }),
  getByCategory: (category) => api.get(`/pantry/category/${category}`)
};

// Budget API calls
export const budgetService = {
  getBudget: (month) => api.get('/budget', { params: { month } }),
  setBudgetLimit: (data) => api.post('/budget/set-limit', data),
  addExpense: (data) => api.post('/budget/add-expense', data),
  getSummary: (month) => api.get('/budget/summary', { params: { month } })
};

// Shopping List API calls
export const shoppingService = {
  getLists: (status) => api.get('/shopping', { params: { status } }),
  createList: (data) => api.post('/shopping', data),
  updateList: (id, data) => api.put(`/shopping/${id}`, data),
  deleteList: (id) => api.delete(`/shopping/${id}`),
  addItem: (listId, data) => api.post(`/shopping/${listId}/items`, data),
  updateItem: (listId, itemId, data) => api.put(`/shopping/${listId}/items/${itemId}`, data),
  deleteItem: (listId, itemId) => api.delete(`/shopping/${listId}/items/${itemId}`)
};

// AI API calls
export const aiService = {
  getRecipeSuggestions: () => api.post('/ai/recipes'),
  getBudgetTips: () => api.post('/ai/budget-tips'),
  getSmartShopping: () => api.post('/ai/smart-shopping'),
  getMealPlan: (days) => api.post(`/ai/meal-plan?days=${days}`)
};
