import apiInstance from './api';

const shoppingListService = {
  getShoppingLists: (status = null) => {
    const params = status ? `?status=${status}` : '';
    return apiInstance.get(`/shopping${params}`);
  },

  createShoppingList: (listData) =>
    apiInstance.post('/shopping', listData),

  updateShoppingList: (id, listData) =>
    apiInstance.put(`/shopping/${id}`, listData),

  deleteShoppingList: (id) =>
    apiInstance.delete(`/shopping/${id}`),

  addItemToList: (listId, itemData) =>
    apiInstance.post(`/shopping/${listId}/items`, itemData),

  updateListItem: (listId, itemId, itemData) =>
    apiInstance.put(`/shopping/${listId}/items/${itemId}`, itemData),

  deleteListItem: (listId, itemId) =>
    apiInstance.delete(`/shopping/${listId}/items/${itemId}`)
};

export default shoppingListService;
