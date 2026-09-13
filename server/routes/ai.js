import express from 'express';
import {
  getRecipeSuggestions,
  getBudgetTips,
  getSmartShopping,
  getMealPlanning
} from '../controllers/aiController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/recipes', getRecipeSuggestions);
router.post('/budget-tips', getBudgetTips);
router.post('/smart-shopping', getSmartShopping);
router.post('/meal-plan', getMealPlanning);

export default router;
