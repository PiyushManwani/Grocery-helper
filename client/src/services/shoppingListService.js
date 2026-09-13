import api from './api';

const shoppingListService = {
  getShoppingLists: (status = null) => {
    const params = status ? `?status=${status}` : '';
    return api.get(`/shopping${params}`);
  },

  createShoppingList: (listData) => {
    return api.post('/shopping', listData);
  },

  updateShoppingList: (listId, listData) => {
    return api.put(`/shopping/${listId}`, listData);
  },

  deleteShoppingList: (listId) => {
    return api.delete(`/shopping/${listId}`);
  },

  addItemToList: (listId, itemData) => {
    return api.post(`/shopping/${listId}/items`, itemData);
  },

  updateListItem: (listId, itemId, itemData) => {
    return api.put(`/shopping/${listId}/items/${itemId}`, itemData);
  },

  deleteListItem: (listId, itemId) => {
    return api.delete(`/shopping/${listId}/items/${itemId}`);
  }
};

export default shoppingListService;
