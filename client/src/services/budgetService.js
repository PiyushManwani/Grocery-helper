import apiInstance from './api';

const budgetService = {
  getBudget: (month = null) => {
    const params = month ? `?month=${month}` : '';
    return apiInstance.get(`/budget${params}`);
  },

  setBudgetLimit: (budgetLimit, month = null) =>
    apiInstance.post('/budget/set-limit', { budgetLimit, month }),

  addExpense: (amount, category, description, month = null) =>
    apiInstance.post('/budget/add-expense', { amount, category, description, month }),

  getBudgetSummary: (month = null) => {
    const params = month ? `?month=${month}` : '';
    return apiInstance.get(`/budget/summary${params}`);
  }
};

export default budgetService;
