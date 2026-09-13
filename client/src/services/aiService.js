import api from './api';

const aiService = {
  getRecipeSuggestions: () =>
    api.post('/ai/recipes', {}),

  getBudgetTips: () =>
    api.post('/ai/budget-tips', {}),

  getSmartShopping: () =>
    api.post('/ai/smart-shopping', {}),

  getMealPlan: (days = 7) =>
    api.post(`/ai/meal-plan?days=${days}`, {})
};

export default aiService;
