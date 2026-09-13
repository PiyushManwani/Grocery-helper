import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const pantryService = {
  getItems: async (category = null) => {
    const query = category ? `?category=${category}` : '';
    return axios.get(`${API_URL}/pantry${query}`, {
      headers: getAuthHeader()
    });
  },
  addItem: async (itemData) => {
    return axios.post(`${API_URL}/pantry`, itemData, {
      headers: getAuthHeader()
    });
  },
  updateItem: async (id, itemData) => {
    return axios.put(`${API_URL}/pantry/${id}`, itemData, {
      headers: getAuthHeader()
    });
  },
  deleteItem: async (id) => {
    return axios.delete(`${API_URL}/pantry/${id}`, {
      headers: getAuthHeader()
    });
  },
  getExpiringItems: async (days = 7) => {
    return axios.get(`${API_URL}/pantry/expiring?days=${days}`, {
      headers: getAuthHeader()
    });
  }
};

export const budgetService = {
  getBudget: async () => {
    return axios.get(`${API_URL}/budget`, {
      headers: getAuthHeader()
    });
  },
  setBudgetLimit: async (limit) => {
    return axios.post(`${API_URL}/budget/set-limit`, { budgetLimit: limit }, {
      headers: getAuthHeader()
    });
  },
  addExpense: async (expenseData) => {
    return axios.post(`${API_URL}/budget/add-expense`, expenseData, {
      headers: getAuthHeader()
    });
  },
  getBudgetSummary: async () => {
    return axios.get(`${API_URL}/budget/summary`, {
      headers: getAuthHeader()
    });
  }
};

export const shoppingListService = {
  getLists: async () => {
    return axios.get(`${API_URL}/shopping`, {
      headers: getAuthHeader()
    });
  },
  createList: async (listData) => {
    return axios.post(`${API_URL}/shopping`, listData, {
      headers: getAuthHeader()
    });
  },
  updateList: async (id, listData) => {
    return axios.put(`${API_URL}/shopping/${id}`, listData, {
      headers: getAuthHeader()
    });
  },
  deleteList: async (id) => {
    return axios.delete(`${API_URL}/shopping/${id}`, {
      headers: getAuthHeader()
    });
  },
  addItem: async (listId, itemData) => {
    return axios.post(`${API_URL}/shopping/${listId}/items`, itemData, {
      headers: getAuthHeader()
    });
  },
  updateItem: async (listId, itemId, itemData) => {
    return axios.put(`${API_URL}/shopping/${listId}/items/${itemId}`, itemData, {
      headers: getAuthHeader()
    });
  },
  deleteItem: async (listId, itemId) => {
    return axios.delete(`${API_URL}/shopping/${listId}/items/${itemId}`, {
      headers: getAuthHeader()
    });
  }
};

export const aiService = {
  getRecipeSuggestions: async () => {
    return axios.post(`${API_URL}/ai/recipes`, {}, {
      headers: getAuthHeader()
    });
  },
  getBudgetTips: async () => {
    return axios.post(`${API_URL}/ai/budget-tips`, {}, {
      headers: getAuthHeader()
    });
  },
  getSmartShopping: async () => {
    return axios.post(`${API_URL}/ai/smart-shopping`, {}, {
      headers: getAuthHeader()
    });
  },
  getMealPlan: async (days = 7) => {
    return axios.post(`${API_URL}/ai/meal-plan`, {}, {
      headers: getAuthHeader(),
      params: { days }
    });
  }
};

export default {
  pantryService,
  budgetService,
  shoppingListService,
  aiService
};
