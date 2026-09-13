import apiInstance from './api';

const pantryService = {
  getItems: (category = null) => {
    const params = category ? `?category=${category}` : '';
    return apiInstance.get(`/pantry${params}`);
  },

  addItem: (itemData) =>
    apiInstance.post('/pantry', itemData),

  updateItem: (id, itemData) =>
    apiInstance.put(`/pantry/${id}`, itemData),

  deleteItem: (id) =>
    apiInstance.delete(`/pantry/${id}`),

  getExpiringItems: (days = 7) =>
    apiInstance.get(`/pantry/expiring?days=${days}`),

  getByCategory: (category) =>
    apiInstance.get(`/pantry/category/${category}`)
};

export default pantryService;
