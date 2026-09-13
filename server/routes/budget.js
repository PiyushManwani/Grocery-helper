import express from 'express';
import {
  getBudget,
  setBudgetLimit,
  addExpense,
  getBudgetSummary
} from '../controllers/budgetController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', getBudget);
router.post('/set-limit', setBudgetLimit);
router.post('/add-expense', addExpense);
router.get('/summary', getBudgetSummary);

export default router;
