import express from 'express';
const router = express.Router();
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateId } from '../middleware/validators.js';

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User statistics
router.get('/stats', getUserStats);

// Get all users
router.get('/', getAllUsers);

// Get, update, delete user by ID
router.get('/:id', validateId, getUserById);
router.put('/:id', validateId, updateUser);
router.delete('/:id', validateId, deleteUser);

export default router;
