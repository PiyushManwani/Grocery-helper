import apiInstance from './api';

const aiService = {
  getRecipeSuggestions: () =>
    apiInstance.post('/ai/recipes'),

  getBudgetTips: () =>
    apiInstance.post('/ai/budget-tips'),

  getSmartShopping: () =>
    apiInstance.post('/ai/smart-shopping'),

  getMealPlan: (days = 7) =>
    apiInstance.post('/ai/meal-plan', { days })
};

export default aiService;
