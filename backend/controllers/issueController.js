import { dataHelpers } from '../utils/mockData.js';
import { paginate, sortData, searchData, filterByDateRange } from '../utils/helpers.js';

/**
 * @desc    Get all issues with filters
 * @route   GET /api/issues
 * @access  Private
 */
const getIssues = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      hostel,
      search,
      startDate,
      endDate,
      sortBy = 'reportedDate',
      order = 'desc',
    } = req.query;

    let issues = dataHelpers.getAllIssues();

    // Filter by user role
    if (req.user.role === 'student') {
      // Students can only see their own issues and public issues
      issues = issues.filter(
        issue => issue.reporterId === req.user.id || issue.visibility === 'public'
      );
    }

    // Apply filters
    if (status) {
      issues = issues.filter(issue => issue.status === status);
    }

    if (priority) {
      issues = issues.filter(issue => issue.priority === priority);
    }

    if (category) {
      issues = issues.filter(issue => issue.category === category);
    }

    if (hostel) {
      issues = issues.filter(issue => issue.hostel === hostel);
    }

    // Date range filter
    if (startDate || endDate) {
      issues = filterByDateRange(issues, 'reportedDate', startDate, endDate);
    }

    // Search
    if (search) {
      issues = searchData(issues, search, ['title', 'description', 'reporter', 'room']);
    }

    // Sort
    issues = sortData(issues, sortBy, order);

    // Paginate
    const result = paginate(issues, page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single issue by ID
 * @route   GET /api/issues/:id
 * @access  Private
 */
const getIssueById = async (req, res, next) => {
  try {
    const issue = dataHelpers.getIssueById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    // Check permission
    if (req.user.role === 'student' && issue.reporterId !== req.user.id && issue.visibility !== 'public') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this issue',
      });
    }

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new issue
 * @route   POST /api/issues
 * @access  Private
 */
const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, priority, hostel, block, room, visibility = 'public' } = req.body;

    const issueData = {
      title,
      description,
      category,
      priority,
      hostel,
      block,
      room,
      reporterId: req.user.id,
      reporter: req.user.name,
      visibility,
    };

    const newIssue = dataHelpers.createIssue(issueData);

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('issue:created', newIssue);

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      data: newIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update issue status
 * @route   PUT /api/issues/:id/status
 * @access  Private (Admin only)
 */
const updateIssueStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;

    const issue = dataHelpers.getIssueById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    // Add comment if provided
    if (comment) {
      const newComment = {
        id: `CMT${Date.now()}`,
        userId: req.user.id,
        userName: req.user.name,
        comment,
        createdAt: new Date(),
      };

      issue.comments = issue.comments || [];
      issue.comments.push(newComment);
    }

    // Update issue
    const updatedIssue = dataHelpers.updateIssue(req.params.id, {
      status,
      comments: issue.comments,
    });

    // Emit socket event
    const io = req.app.get('io');
    io.emit('issue:updated', updatedIssue);
    io.emit('issue:status-changed', {
      issueId: updatedIssue.id,
      status,
      updatedBy: req.user.name,
    });

    res.status(200).json({
      success: true,
      message: 'Issue status updated successfully',
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign issue to admin
 * @route   PUT /api/issues/:id/assign
 * @access  Private (Admin only)
 */
const assignIssue = async (req, res, next) => {
  try {
    const { assignedTo, assignedToId } = req.body;

    const issue = dataHelpers.getIssueById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    const updatedIssue = dataHelpers.updateIssue(req.params.id, {
      assignedTo,
      assignedToId,
      status: 'assigned',
    });

    // Emit socket event
    const io = req.app.get('io');
    io.emit('issue:assigned', updatedIssue);

    res.status(200).json({
      success: true,
      message: 'Issue assigned successfully',
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add comment to issue
 * @route   POST /api/issues/:id/comment
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;

    const issue = dataHelpers.getIssueById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    const newComment = {
      id: `CMT${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      comment,
      createdAt: new Date(),
    };

    issue.comments = issue.comments || [];
    issue.comments.push(newComment);

    const updatedIssue = dataHelpers.updateIssue(req.params.id, {
      comments: issue.comments,
    });

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete issue
 * @route   DELETE /api/issues/:id
 * @access  Private (Owner or Admin)
 */
const deleteIssue = async (req, res, next) => {
  try {
    const issue = dataHelpers.getIssueById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    // Check permission
    if (req.user.role !== 'admin' && issue.reporterId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this issue',
      });
    }

    dataHelpers.deleteIssue(req.params.id);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('issue:deleted', { issueId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get issue statistics
 * @route   GET /api/issues/stats
 * @access  Private (Admin only)
 */
const getIssueStats = async (req, res, next) => {
  try {
    const issues = dataHelpers.getAllIssues();

    const stats = {
      total: issues.length,
      byStatus: {},
      byPriority: {},
      byCategory: {},
      byHostel: {},
    };

    // Count by status
    issues.forEach(issue => {
      stats.byStatus[issue.status] = (stats.byStatus[issue.status] || 0) + 1;
      stats.byPriority[issue.priority] = (stats.byPriority[issue.priority] || 0) + 1;
      stats.byCategory[issue.category] = (stats.byCategory[issue.category] || 0) + 1;
      stats.byHostel[issue.hostel] = (stats.byHostel[issue.hostel] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  assignIssue,
  addComment,
  deleteIssue,
  getIssueStats,
};
