import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

// Auth Services
export const authService = {
  login: (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password }),
  register: (name, email, password, confirmPassword) =>
    axios.post(`${API_URL}/auth/register`, { name, email, password, confirmPassword }),
  getCurrentUser: () =>
    axios.get(`${API_URL}/auth/me`, { headers: getAuthHeader() }),
  verifyToken: () =>
    axios.get(`${API_URL}/auth/verify`, { headers: getAuthHeader() })
};

// Pantry Services
export const pantryService = {
  getItems: (category = null) =>
    axios.get(`${API_URL}/pantry${category ? `?category=${category}` : ''}`, {
      headers: getAuthHeader()
    }),
  addItem: (itemData) =>
    axios.post(`${API_URL}/pantry`, itemData, { headers: getAuthHeader() }),
  updateItem: (id, itemData) =>
    axios.put(`${API_URL}/pantry/${id}`, itemData, { headers: getAuthHeader() }),
  deleteItem: (id) =>
    axios.delete(`${API_URL}/pantry/${id}`, { headers: getAuthHeader() }),
  getExpiringItems: (days = 7) =>
    axios.get(`${API_URL}/pantry/expiring?days=${days}`, { headers: getAuthHeader() })
};

// Budget Services
export const budgetService = {
  getBudget: (month = null) =>
    axios.get(`${API_URL}/budget${month ? `?month=${month}` : ''}`, {
      headers: getAuthHeader()
    }),
  setBudgetLimit: (budgetLimit, month = null) =>
    axios.post(`${API_URL}/budget/set-limit`, { budgetLimit, month }, {
      headers: getAuthHeader()
    }),
  addExpense: (expenseData) =>
    axios.post(`${API_URL}/budget/add-expense`, expenseData, { headers: getAuthHeader() }),
  getBudgetSummary: (month = null) =>
    axios.get(`${API_URL}/budget/summary${month ? `?month=${month}` : ''}`, {
      headers: getAuthHeader()
    })
};

// Shopping List Services
export const shoppingListService = {
  getLists: (status = null) =>
    axios.get(`${API_URL}/shopping${status ? `?status=${status}` : ''}`, {
      headers: getAuthHeader()
    }),
  createList: (listData) =>
    axios.post(`${API_URL}/shopping`, listData, { headers: getAuthHeader() }),
  updateList: (id, listData) =>
    axios.put(`${API_URL}/shopping/${id}`, listData, { headers: getAuthHeader() }),
  deleteList: (id) =>
    axios.delete(`${API_URL}/shopping/${id}`, { headers: getAuthHeader() }),
  addItem: (listId, itemData) =>
    axios.post(`${API_URL}/shopping/${listId}/items`, itemData, { headers: getAuthHeader() }),
  updateItem: (listId, itemId, itemData) =>
    axios.put(`${API_URL}/shopping/${listId}/items/${itemId}`, itemData, {
      headers: getAuthHeader()
    }),
  deleteItem: (listId, itemId) =>
    axios.delete(`${API_URL}/shopping/${listId}/items/${itemId}`, { headers: getAuthHeader() })
};

// AI Services
export const aiService = {
  getRecipeSuggestions: () =>
    axios.post(`${API_URL}/ai/recipes`, {}, { headers: getAuthHeader() }),
  getBudgetTips: () =>
    axios.post(`${API_URL}/ai/budget-tips`, {}, { headers: getAuthHeader() }),
  getSmartShopping: () =>
    axios.post(`${API_URL}/ai/smart-shopping`, {}, { headers: getAuthHeader() }),
  getMealPlan: (days = 7) =>
    axios.post(`${API_URL}/ai/meal-plan?days=${days}`, {}, { headers: getAuthHeader() })
};
