import api from './api';

const shoppingListService = {
  getShoppingLists: (status) => {
    const url = status ? `/shopping?status=${status}` : '/shopping';
    return api.get(url);
  },

  createList: (listData) =>
    api.post('/shopping', listData),

  updateList: (id, listData) =>
    api.put(`/shopping/${id}`, listData),

  deleteList: (id) =>
    api.delete(`/shopping/${id}`),

  addItem: (listId, itemData) =>
    api.post(`/shopping/${listId}/items`, itemData),

  updateItem: (listId, itemId, itemData) =>
    api.put(`/shopping/${listId}/items/${itemId}`, itemData),

  deleteItem: (listId, itemId) =>
    api.delete(`/shopping/${listId}/items/${itemId}`)
};

export default shoppingListService;
