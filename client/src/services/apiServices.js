import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const authService = {
  register: (data) =>
    axios.post(`${API_URL}/auth/register`, data),
  login: (data) =>
    axios.post(`${API_URL}/auth/login`, data),
  getCurrentUser: () =>
    axios.get(`${API_URL}/auth/me`, { headers: getAuthHeader() }),
  updatePreferences: (data) =>
    axios.put(`${API_URL}/auth/preferences`, data, { headers: getAuthHeader() }),
  verifyToken: () =>
    axios.get(`${API_URL}/auth/verify`, { headers: getAuthHeader() })
};

export const pantryService = {
  getItems: (query) =>
    axios.get(`${API_URL}/pantry`, { params: query, headers: getAuthHeader() }),
  addItem: (data) =>
    axios.post(`${API_URL}/pantry`, data, { headers: getAuthHeader() }),
  updateItem: (id, data) =>
    axios.put(`${API_URL}/pantry/${id}`, data, { headers: getAuthHeader() }),
  deleteItem: (id) =>
    axios.delete(`${API_URL}/pantry/${id}`, { headers: getAuthHeader() }),
  getExpiringItems: (days) =>
    axios.get(`${API_URL}/pantry/expiring`, { params: { days }, headers: getAuthHeader() }),
  getByCategory: (category) =>
    axios.get(`${API_URL}/pantry/category/${category}`, { headers: getAuthHeader() })
};

export const budgetService = {
  getBudget: (month) =>
    axios.get(`${API_URL}/budget`, { params: { month }, headers: getAuthHeader() }),
  setBudgetLimit: (data) =>
    axios.post(`${API_URL}/budget/set-limit`, data, { headers: getAuthHeader() }),
  addExpense: (data) =>
    axios.post(`${API_URL}/budget/add-expense`, data, { headers: getAuthHeader() }),
  getBudgetSummary: (month) =>
    axios.get(`${API_URL}/budget/summary`, { params: { month }, headers: getAuthHeader() })
};

export const shoppingService = {
  getLists: () =>
    axios.get(`${API_URL}/shopping`, { headers: getAuthHeader() }),
  createList: (data) =>
    axios.post(`${API_URL}/shopping`, data, { headers: getAuthHeader() }),
  updateList: (id, data) =>
    axios.put(`${API_URL}/shopping/${id}`, data, { headers: getAuthHeader() }),
  deleteList: (id) =>
    axios.delete(`${API_URL}/shopping/${id}`, { headers: getAuthHeader() }),
  addItem: (listId, data) =>
    axios.post(`${API_URL}/shopping/${listId}/items`, data, { headers: getAuthHeader() }),
  updateItem: (listId, itemId, data) =>
    axios.put(`${API_URL}/shopping/${listId}/items/${itemId}`, data, { headers: getAuthHeader() }),
  deleteItem: (listId, itemId) =>
    axios.delete(`${API_URL}/shopping/${listId}/items/${itemId}`, { headers: getAuthHeader() })
};

export const aiService = {
  getRecipeSuggestions: () =>
    axios.post(`${API_URL}/ai/recipes`, {}, { headers: getAuthHeader() }),
  getBudgetTips: () =>
    axios.post(`${API_URL}/ai/budget-tips`, {}, { headers: getAuthHeader() }),
  getSmartShopping: () =>
    axios.post(`${API_URL}/ai/smart-shopping`, {}, { headers: getAuthHeader() }),
  getMealPlan: (days) =>
    axios.post(`${API_URL}/ai/meal-plan`, { days }, { headers: getAuthHeader() })
};
