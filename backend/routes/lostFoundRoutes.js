import express from 'express';
const router = express.Router();
import {
  getLostFoundItems,
  getLostFoundItemById,
  createLostFoundItem,
  updateLostFoundItem,
  markAsClaimed,
  deleteLostFoundItem,
  getLostFoundStats,
} from '../controllers/lostFoundController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateCreateLostFound, validateId } from '../middleware/validators.js';

// All routes require authentication
router.use(protect);

// Statistics (admin only)
router.get('/stats', authorize('admin'), getLostFoundStats);

// Get all lost & found items
router.get('/', getLostFoundItems);

// Create new item
router.post('/', validateCreateLostFound, createLostFoundItem);

// Get single item
router.get('/:id', validateId, getLostFoundItemById);

// Update item
router.put('/:id', validateId, updateLostFoundItem);

// Mark as claimed
router.put('/:id/claim', validateId, markAsClaimed);

// Delete item
router.delete('/:id', validateId, deleteLostFoundItem);

export default router;
