import express from 'express';
const router = express.Router();
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateCreateAnnouncement, validateId } from '../middleware/validators.js';

// All routes require authentication
router.use(protect);

// Get all announcements
router.get('/', getAnnouncements);

// Get single announcement
router.get('/:id', validateId, getAnnouncementById);

// Admin only routes
router.post('/', authorize('admin'), validateCreateAnnouncement, createAnnouncement);
router.put('/:id', authorize('admin'), validateId, updateAnnouncement);
router.delete('/:id', authorize('admin'), validateId, deleteAnnouncement);

export default router;
