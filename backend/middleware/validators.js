import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  
  next();
};

/**
 * Auth validation rules
 */
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['student', 'admin'])
    .withMessage('Role must be either student or admin'),
  validate,
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

/**
 * Issue validation rules
 */
const validateCreateIssue = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('priority').isIn(['low', 'medium', 'high', 'emergency']).withMessage('Invalid priority'),
  body('hostel').notEmpty().withMessage('Hostel is required'),
  body('block').notEmpty().withMessage('Block is required'),
  body('room').notEmpty().withMessage('Room is required'),
  validate,
];

const validateUpdateStatus = [
  body('status')
    .isIn(['reported', 'assigned', 'in progress', 'resolved', 'closed'])
    .withMessage('Invalid status'),
  validate,
];

/**
 * Announcement validation rules
 */
const validateCreateAnnouncement = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('priority')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('hostel').notEmpty().withMessage('Hostel is required'),
  validate,
];

/**
 * Lost & Found validation rules
 */
const validateCreateLostFound = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['lost', 'found']).withMessage('Type must be either lost or found'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('hostel').notEmpty().withMessage('Hostel is required'),
  validate,
];

/**
 * ID validation
 */
const validateId = [
  param('id').notEmpty().withMessage('ID is required'),
  validate,
];

export {
  validate,
  validateRegister,
  validateLogin,
  validateCreateIssue,
  validateUpdateStatus,
  validateCreateAnnouncement,
  validateCreateLostFound,
  validateId,
};
