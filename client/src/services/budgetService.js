import api from './api';

const budgetService = {
  getBudget: (month = null) => {
    const params = month ? `?month=${month}` : '';
    return api.get(`/budget${params}`);
  },

  setBudgetLimit: (budgetLimit, month = null) => {
    return api.post('/budget/set-limit', { budgetLimit, month });
  },

  addExpense: (expenseData) => {
    return api.post('/budget/add-expense', expenseData);
  },

  getBudgetSummary: (month = null) => {
    const params = month ? `?month=${month}` : '';
    return api.get(`/budget/summary${params}`);
  }
};

export default budgetService;
