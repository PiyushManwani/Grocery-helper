import api from './api';

const pantryService = {
  getItems: (category) => {
    const url = category ? `/pantry?category=${category}` : '/pantry';
    return api.get(url);
  },

  getExpiringItems: (days = 7) =>
    api.get(`/pantry/expiring?days=${days}`),

  getByCategory: (category) =>
    api.get(`/pantry/category/${category}`),

  addItem: (itemData) =>
    api.post('/pantry', itemData),

  updateItem: (id, itemData) =>
    api.put(`/pantry/${id}`, itemData),

  deleteItem: (id) =>
    api.delete(`/pantry/${id}`)
};

export default pantryService;
