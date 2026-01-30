import { v4 as uuidv4 } from 'uuid';

// In-memory storage
const issues = [];

/**
 * @desc Get all issues
 * @route GET /api/issues
 * @access Private
 */
export const getIssues = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;
    
    let filteredIssues = [...issues];

    // Filter by status
    if (status) {
      filteredIssues = filteredIssues.filter(issue => issue.status === status);
    }

    // Filter by category
    if (category) {
      filteredIssues = filteredIssues.filter(issue => issue.category === category);
    }

    // Filter by priority
    if (priority) {
      filteredIssues = filteredIssues.filter(issue => issue.priority === priority);
    }

    res.status(200).json({
      success: true,
      count: filteredIssues.length,
      data: filteredIssues,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single issue
 * @route GET /api/issues/:id
 * @access Private
 */
export const getIssueById = async (req, res, next) => {
  try {
    const issue = issues.find(i => i.id === req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
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
 * @desc Create new issue
 * @route POST /api/issues
 * @access Private
 */
export const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, priority, location } = req.body;

    const issue = {
      id: uuidv4(),
      title,
      description,
      category,
      priority: priority || 'medium',
      location,
      status: 'pending',
      userId: req.user.id,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    issues.push(issue);

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('newIssue', issue);
    }

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update issue
 * @route PUT /api/issues/:id
 * @access Private (Admin)
 */
export const updateIssue = async (req, res, next) => {
  try {
    const issueIndex = issues.findIndex(i => i.id === req.params.id);

    if (issueIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    const { status, priority, assignedTo } = req.body;

    if (status) issues[issueIndex].status = status;
    if (priority) issues[issueIndex].priority = priority;
    if (assignedTo) issues[issueIndex].assignedTo = assignedTo;
    
    issues[issueIndex].updatedAt = new Date().toISOString();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('issueUpdated', issues[issueIndex]);
    }

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: issues[issueIndex],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Add comment to issue
 * @route POST /api/issues/:id/comments
 * @access Private
 */
export const addComment = async (req, res, next) => {
  try {
    const issueIndex = issues.findIndex(i => i.id === req.params.id);

    if (issueIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    const comment = {
      id: uuidv4(),
      text: req.body.comment,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
    };

    issues[issueIndex].comments.push(comment);
    issues[issueIndex].updatedAt = new Date().toISOString();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: issues[issueIndex],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete issue
 * @route DELETE /api/issues/:id
 * @access Private (Admin)
 */
export const deleteIssue = async (req, res, next) => {
  try {
    const issueIndex = issues.findIndex(i => i.id === req.params.id);

    if (issueIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    issues.splice(issueIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get issue statistics
 * @route GET /api/issues/stats
 * @access Private (Admin)
 */
export const getIssueStats = async (req, res, next) => {
  try {
    const stats = {
      total: issues.length,
      pending: issues.filter(i => i.status === 'pending').length,
      'in-progress': issues.filter(i => i.status === 'in-progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
      byCategory: {},
    };

    // Count by category
    issues.forEach(issue => {
      if (!stats.byCategory[issue.category]) {
        stats.byCategory[issue.category] = 0;
      }
      stats.byCategory[issue.category]++;
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
