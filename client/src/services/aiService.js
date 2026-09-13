import api from './api';

const aiService = {
  getRecipeSuggestions: () => {
    return api.post('/ai/recipes');
  },

  getBudgetTips: () => {
    return api.post('/ai/budget-tips');
  },

  getSmartShopping: () => {
    return api.post('/ai/smart-shopping');
  },

  getMealPlan: (days = 7) => {
    return api.post(`/ai/meal-plan?days=${days}`);
  }
};

export default aiService;
