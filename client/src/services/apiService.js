import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const pantryService = {
  getItems: (category = null) => {
    let url = `${API_URL}/pantry`;
    if (category) url += `?category=${category}`;
    return axios.get(url, { headers: getAuthHeader() });
  },
  addItem: (itemData) =>
    axios.post(`${API_URL}/pantry`, itemData, { headers: getAuthHeader() }),
  updateItem: (id, itemData) =>
    axios.put(`${API_URL}/pantry/${id}`, itemData, { headers: getAuthHeader() }),
  deleteItem: (id) =>
    axios.delete(`${API_URL}/pantry/${id}`, { headers: getAuthHeader() }),
  getExpiringItems: (days = 7) =>
    axios.get(`${API_URL}/pantry/expiring?days=${days}`, { headers: getAuthHeader() })
};

export const budgetService = {
  getBudget: () =>
    axios.get(`${API_URL}/budget`, { headers: getAuthHeader() }),
  setBudgetLimit: (budgetLimit) =>
    axios.post(`${API_URL}/budget/set-limit`, { budgetLimit }, { headers: getAuthHeader() }),
  addExpense: (expenseData) =>
    axios.post(`${API_URL}/budget/add-expense`, expenseData, { headers: getAuthHeader() }),
  getBudgetSummary: () =>
    axios.get(`${API_URL}/budget/summary`, { headers: getAuthHeader() })
};

export const shoppingListService = {
  getLists: () =>
    axios.get(`${API_URL}/shopping`, { headers: getAuthHeader() }),
  createList: (listData) =>
    axios.post(`${API_URL}/shopping`, listData, { headers: getAuthHeader() }),
  updateList: (id, listData) =>
    axios.put(`${API_URL}/shopping/${id}`, listData, { headers: getAuthHeader() }),
  deleteList: (id) =>
    axios.delete(`${API_URL}/shopping/${id}`, { headers: getAuthHeader() }),
  addItem: (listId, itemData) =>
    axios.post(`${API_URL}/shopping/${listId}/items`, itemData, { headers: getAuthHeader() }),
  updateItem: (listId, itemId, itemData) =>
    axios.put(`${API_URL}/shopping/${listId}/items/${itemId}`, itemData, { headers: getAuthHeader() }),
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
  getMealPlan: (days = 7) =>
    axios.post(`${API_URL}/ai/meal-plan`, { days }, { headers: getAuthHeader() })
};
