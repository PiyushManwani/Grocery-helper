import express from 'express';
import {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getExpiringItems,
  getByCategory
} from '../controllers/pantryController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', getItems);
router.post('/', addItem);
router.get('/expiring', getExpiringItems);
router.get('/category/:category', getByCategory);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
