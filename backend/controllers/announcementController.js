import { v4 as uuidv4 } from 'uuid';

const announcements = [];

export const getAnnouncements = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = announcements.find(a => a.id === req.params.id);
    
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

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, priority } = req.body;

    const announcement = {
      id: uuidv4(),
      title,
      content,
      priority: priority || 'normal',
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
    };

    announcements.push(announcement);

    const io = req.app.get('io');
    if (io) {
      io.emit('newAnnouncement', announcement);
    }

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const index = announcements.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    const { title, content, priority } = req.body;
    if (title) announcements[index].title = title;
    if (content) announcements[index].content = content;
    if (priority) announcements[index].priority = priority;
    announcements[index].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcements[index],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const index = announcements.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    announcements.splice(index, 1);

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
