import { v4 as uuidv4 } from 'uuid';

const lostFoundItems = [];

export const getLostFoundItems = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    let filtered = [...lostFoundItems];

    if (type) filtered = filtered.filter(item => item.type === type);
    if (status) filtered = filtered.filter(item => item.status === status);

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};

export const getLostFoundItemById = async (req, res, next) => {
  try {
    const item = lostFoundItems.find(i => i.id === req.params.id);

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

export const createLostFoundItem = async (req, res, next) => {
  try {
    const { title, description, type, location, contactInfo } = req.body;

    const item = {
      id: uuidv4(),
      title,
      description,
      type,
      location,
      contactInfo,
      status: 'unclaimed',
      userId: req.user.id,
      createdAt: new Date().toISOString(),
    };

    lostFoundItems.push(item);

    const io = req.app.get('io');
    if (io) {
      io.emit('newLostFoundItem', item);
    }

    res.status(201).json({
      success: true,
      message: 'Item posted successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLostFoundItem = async (req, res, next) => {
  try {
    const index = lostFoundItems.findIndex(i => i.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const { title, description, location, contactInfo } = req.body;
    if (title) lostFoundItems[index].title = title;
    if (description) lostFoundItems[index].description = description;
    if (location) lostFoundItems[index].location = location;
    if (contactInfo) lostFoundItems[index].contactInfo = contactInfo;
    lostFoundItems[index].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: lostFoundItems[index],
    });
  } catch (error) {
    next(error);
  }
};

export const markAsClaimed = async (req, res, next) => {
  try {
    const index = lostFoundItems.findIndex(i => i.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    lostFoundItems[index].status = 'claimed';
    lostFoundItems[index].claimedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Item marked as claimed',
      data: lostFoundItems[index],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLostFoundItem = async (req, res, next) => {
  try {
    const index = lostFoundItems.findIndex(i => i.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    lostFoundItems.splice(index, 1);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getLostFoundStats = async (req, res, next) => {
  try {
    const stats = {
      total: lostFoundItems.length,
      lost: lostFoundItems.filter(i => i.type === 'lost').length,
      found: lostFoundItems.filter(i => i.type === 'found').length,
      claimed: lostFoundItems.filter(i => i.status === 'claimed').length,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
