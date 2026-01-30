import { dataHelpers } from '../utils/mockData.js';
import { paginate, sortData, searchData, filterByDateRange } from '../utils/helpers.js';

/**
 * @desc    Get all lost & found items
 * @route   GET /api/lost-found
 * @access  Private
 */
const getLostFoundItems = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      status,
      hostel,
      search,
      startDate,
      endDate,
      sortBy = 'date',
      order = 'desc',
    } = req.query;

    let items = dataHelpers.getAllLostFound();

    // Filter by user's hostel if student
    if (req.user.role === 'student' && req.user.hostel) {
      items = items.filter(item => item.hostel === req.user.hostel);
    }

    // Apply filters
    if (type) {
      items = items.filter(item => item.type === type);
    }

    if (category) {
      items = items.filter(item => item.category === category);
    }

    if (status) {
      items = items.filter(item => item.status === status);
    }

    if (hostel) {
      items = items.filter(item => item.hostel === hostel);
    }

    // Date range filter
    if (startDate || endDate) {
      items = filterByDateRange(items, 'date', startDate, endDate);
    }

    // Search
    if (search) {
      items = searchData(items, search, ['title', 'description', 'location', 'reporter']);
    }

    // Sort
    items = sortData(items, sortBy, order);

    // Paginate
    const result = paginate(items, page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single lost & found item
 * @route   GET /api/lost-found/:id
 * @access  Private
 */
const getLostFoundItemById = async (req, res, next) => {
  try {
    const item = dataHelpers.getLostFoundById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new lost & found item
 * @route   POST /api/lost-found
 * @access  Private
 */
const createLostFoundItem = async (req, res, next) => {
  try {
    const { title, description, type, category, location, hostel, phone } = req.body;

    const itemData = {
      title,
      description,
      type,
      category,
      location,
      hostel,
      reporterId: req.user.id,
      reporter: req.user.name,
      contact: req.user.email,
      phone: phone || req.user.phone,
    };

    const newItem = dataHelpers.createLostFound(itemData);

    res.status(201).json({
      success: true,
      message: 'Item posted successfully',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update lost & found item
 * @route   PUT /api/lost-found/:id
 * @access  Private
 */
const updateLostFoundItem = async (req, res, next) => {
  try {
    const item = dataHelpers.getLostFoundById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check permission
    if (req.user.role !== 'admin' && item.reporterId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }

    const { title, description, status } = req.body;

    const updatedItem = dataHelpers.updateLostFound(req.params.id, {
      title: title || item.title,
      description: description || item.description,
      status: status || item.status,
    });

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark item as claimed
 * @route   PUT /api/lost-found/:id/claim
 * @access  Private
 */
const markAsClaimed = async (req, res, next) => {
  try {
    const item = dataHelpers.getLostFoundById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const updatedItem = dataHelpers.updateLostFound(req.params.id, {
      status: 'claimed',
      claimedBy: req.user.name,
      claimedById: req.user.id,
      claimedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Item marked as claimed',
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete lost & found item
 * @route   DELETE /api/lost-found/:id
 * @access  Private
 */
const deleteLostFoundItem = async (req, res, next) => {
  try {
    const item = dataHelpers.getLostFoundById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check permission
    if (req.user.role !== 'admin' && item.reporterId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item',
      });
    }

    dataHelpers.deleteLostFound(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get lost & found statistics
 * @route   GET /api/lost-found/stats
 * @access  Private
 */
const getLostFoundStats = async (req, res, next) => {
  try {
    const items = dataHelpers.getAllLostFound();

    const stats = {
      total: items.length,
      lost: items.filter(i => i.type === 'lost').length,
      found: items.filter(i => i.type === 'found').length,
      active: items.filter(i => i.status === 'active').length,
      claimed: items.filter(i => i.status === 'claimed').length,
      byCategory: {},
    };

    // Count by category
    items.forEach(item => {
      stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
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
  getLostFoundItems,
  getLostFoundItemById,
  createLostFoundItem,
  updateLostFoundItem,
  markAsClaimed,
  deleteLostFoundItem,
  getLostFoundStats,
};
