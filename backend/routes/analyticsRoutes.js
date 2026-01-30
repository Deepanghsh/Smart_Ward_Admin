import express from 'express';
const router = express.Router();
import {
  getDashboardAnalytics,
  getIssueTrends,
  getCategoryDistribution,
  getHostelStats,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Analytics routes
router.get('/dashboard', getDashboardAnalytics);
router.get('/trends', getIssueTrends);
router.get('/categories', getCategoryDistribution);
router.get('/hostels', getHostelStats);

export default router;
