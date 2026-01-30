import { dataHelpers } from '../utils/mockData.js';
import { paginate, sortData, searchData, filterByDateRange } from '../utils/helpers.js';

/**
 * @desc    Get all announcements
 * @route   GET /api/announcements
 * @access  Private
 */
const getAnnouncements = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      priority,
      hostel,
      search,
      startDate,
      endDate,
      sortBy = 'date',
      order = 'desc',
    } = req.query;

    let announcements = dataHelpers.getAllAnnouncements();

    // Filter by hostel if user is student
    if (req.user.role === 'student' && req.user.hostel) {
      announcements = announcements.filter(
        ann => ann.hostel === 'All Hostels' || ann.hostel.includes(req.user.hostel)
      );
    }

    // Apply filters
    if (priority) {
      announcements = announcements.filter(ann => ann.priority === priority);
    }

    if (hostel) {
      announcements = announcements.filter(ann => 
        ann.hostel === 'All Hostels' || ann.hostel.includes(hostel)
      );
    }

    // Date range filter
    if (startDate || endDate) {
      announcements = filterByDateRange(announcements, 'date', startDate, endDate);
    }

    // Search
    if (search) {
      announcements = searchData(announcements, search, ['title', 'content', 'author']);
    }

    // Sort
    announcements = sortData(announcements, sortBy, order);

    // Paginate
    const result = paginate(announcements, page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single announcement
 * @route   GET /api/announcements/:id
 * @access  Private
 */
const getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = dataHelpers.getAnnouncementById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new announcement
 * @route   POST /api/announcements
 * @access  Private (Admin only)
 */
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, priority, hostel, type } = req.body;

    const announcementData = {
      title,
      content,
      priority,
      hostel,
      type: type || 'general',
      authorId: req.user.id,
      author: req.user.name,
    };

    const newAnnouncement = dataHelpers.createAnnouncement(announcementData);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('announcement:created', newAnnouncement);

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: newAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update announcement
 * @route   PUT /api/announcements/:id
 * @access  Private (Admin only)
 */
const updateAnnouncement = async (req, res, next) => {
  try {
    const { title, content, priority, hostel, type } = req.body;

    const announcement = dataHelpers.getAnnouncementById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    const updatedAnnouncement = dataHelpers.updateAnnouncement(req.params.id, {
      title: title || announcement.title,
      content: content || announcement.content,
      priority: priority || announcement.priority,
      hostel: hostel || announcement.hostel,
      type: type || announcement.type,
    });

    // Emit socket event
    const io = req.app.get('io');
    io.emit('announcement:updated', updatedAnnouncement);

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: updatedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete announcement
 * @route   DELETE /api/announcements/:id
 * @access  Private (Admin only)
 */
const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = dataHelpers.getAnnouncementById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    dataHelpers.deleteAnnouncement(req.params.id);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('announcement:deleted', { announcementId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
