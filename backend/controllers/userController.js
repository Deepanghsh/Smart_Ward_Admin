import { mockUsers } from '../utils/mockData.js';
import { sanitizeUser } from '../utils/helpers.js';

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;

    let users = [...mockUsers];

    // Filter by role if provided
    if (role) {
      users = users.filter(user => user.role === role);
    }

    // Remove passwords
    users = users.map(user => sanitizeUser(user));

    res.status(200).json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private (Admin only or own profile)
 */
const getUserById = async (req, res, next) => {
  try {
    const user = mockUsers.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check permission
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user',
      });
    }

    res.status(200).json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private (Admin only)
 */
const updateUser = async (req, res, next) => {
  try {
    const user = mockUsers.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, email, phone, role, hostel, block, room } = req.body;

    // Update user data (in real app, update in database)
    const updatedUser = {
      ...user,
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      role: role || user.role,
      ...(user.role === 'student' && {
        hostel: hostel || user.hostel,
        block: block || user.block,
        room: room || user.room,
      }),
    };

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: sanitizeUser(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res, next) => {
  try {
    const userIndex = mockUsers.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // In real app, delete from database
    // mockUsers.splice(userIndex, 1);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/users/stats
 * @access  Private (Admin only)
 */
const getUserStats = async (req, res, next) => {
  try {
    const stats = {
      total: mockUsers.length,
      students: mockUsers.filter(u => u.role === 'student').length,
      admins: mockUsers.filter(u => u.role === 'admin').length,
      byDepartment: {},
      byHostel: {},
    };

    // Count by department
    mockUsers.forEach(user => {
      if (user.department) {
        stats.byDepartment[user.department] = (stats.byDepartment[user.department] || 0) + 1;
      }
      if (user.hostel) {
        stats.byHostel[user.hostel] = (stats.byHostel[user.hostel] || 0) + 1;
      }
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
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
};
