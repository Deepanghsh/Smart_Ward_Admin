import bcrypt from 'bcryptjs';
import { dataHelpers } from '../utils/mockData.js';
import { generateToken, sanitizeUser } from '../utils/helpers.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, hostel, block, room, phone, department, year } = req.body;

    // Check if user already exists
    const existingUser = dataHelpers.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const newUser = {
      id: `${role === 'admin' ? 'ADM' : 'STU'}${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === 'student' && { hostel, block, room, year }),
      phone,
      department,
      createdAt: new Date(),
    };

    // In a real app, save to database
    // For now, we'll just return success with mock data

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        accessToken: token,
        user: sanitizeUser(newUser),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = dataHelpers.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, hostel, block, room } = req.body;

    // Get current user
    const user = dataHelpers.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update user data
    const updatedUser = {
      ...user,
      name: name || user.name,
      phone: phone || user.phone,
      ...(user.role === 'student' && {
        hostel: hostel || user.hostel,
        block: block || user.block,
        room: room || user.room,
      }),
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: sanitizeUser(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user
    const user = dataHelpers.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // In real app, update password in database
    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    const user = dataHelpers.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email',
      });
    }

    // In real app, send password reset email
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    // In real app with refresh tokens, invalidate token here
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  logout,
};
