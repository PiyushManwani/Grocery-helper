import express from 'express';
import {
  getShoppingLists,
  createShoppingList,
  addItemToList,
  updateListItem,
  deleteListItem,
  updateShoppingList,
  deleteShoppingList
} from '../controllers/shoppingListController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', getShoppingLists);
router.post('/', createShoppingList);
router.put('/:id', updateShoppingList);
router.delete('/:id', deleteShoppingList);
router.post('/:id/items', addItemToList);
router.put('/:id/items/:itemId', updateListItem);
router.delete('/:id/items/:itemId', deleteListItem);

export default router;
