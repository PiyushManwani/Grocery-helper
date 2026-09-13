import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updatePreferences,
  verifyToken
} from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/preferences', authMiddleware, updatePreferences);
router.get('/verify', authMiddleware, verifyToken);

export default router;
