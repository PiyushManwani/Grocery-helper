import api from './api';

const pantryService = {
  getItems: (category = null) => {
    const params = category ? `?category=${category}` : '';
    return api.get(`/pantry${params}`);
  },

  addItem: (itemData) => {
    return api.post('/pantry', itemData);
  },

  updateItem: (itemId, itemData) => {
    return api.put(`/pantry/${itemId}`, itemData);
  },

  deleteItem: (itemId) => {
    return api.delete(`/pantry/${itemId}`);
  },

  getExpiringItems: (days = 7) => {
    return api.get(`/pantry/expiring?days=${days}`);
  },

  getByCategory: (category) => {
    return api.get(`/pantry/category/${category}`);
  }
};

export default pantryService;
