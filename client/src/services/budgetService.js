import api from './api';

const budgetService = {
  getBudget: (month) => {
    const url = month ? `/budget?month=${month}` : '/budget';
    return api.get(url);
  },

  setBudgetLimit: (budgetLimit, month) =>
    api.post('/budget/set-limit', { budgetLimit, month }),

  addExpense: (amount, category, description, month) =>
    api.post('/budget/add-expense', { amount, category, description, month }),

  getBudgetSummary: (month) => {
    const url = month ? `/budget/summary?month=${month}` : '/budget/summary';
    return api.get(url);
  }
};

export default budgetService;
