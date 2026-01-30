import express from 'express';
const router = express.Router();
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  addComment,
  deleteIssue,
  getIssueStats,
} from '../controllers/issueController.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  validateCreateIssue,
  validateUpdateStatus,
  validateId,
} from '../middleware/validators.js';

// All routes require authentication
router.use(protect);

// Issue statistics (admin only)
router.get('/stats', authorize('admin'), getIssueStats);

// Get all issues (with filters)
router.get('/', getIssues);

// Create new issue
router.post('/', validateCreateIssue, createIssue);

// Get single issue
router.get('/:id', validateId, getIssueById);

// Update issue (admin only)
router.put('/:id', authorize('admin'), validateUpdateStatus, updateIssue);

// Add comment to issue
router.post('/:id/comments', validateId, addComment);

// Delete issue (admin only)
router.delete('/:id', authorize('admin'), validateId, deleteIssue);

export default router;
