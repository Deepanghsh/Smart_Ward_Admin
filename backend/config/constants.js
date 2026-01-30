/**
 * Application constants
 */

// Issue categories
export const ISSUE_CATEGORIES = [
  'plumbing',
  'electrical',
  'cleanliness',
  'internet',
  'furniture',
  'ac_heating',
  'security',
  'other',
];

// Issue priorities
export const ISSUE_PRIORITIES = ['low', 'medium', 'high', 'emergency'];

// Issue statuses
export const ISSUE_STATUSES = ['reported', 'assigned', 'in progress', 'resolved', 'closed'];

// Announcement priorities
export const ANNOUNCEMENT_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

// Lost & Found types
export const LOST_FOUND_TYPES = ['lost', 'found'];

// Lost & Found statuses
export const LOST_FOUND_STATUSES = ['active', 'claimed'];

// User roles
export const USER_ROLES = ['student', 'admin'];

// Hostels
export const HOSTELS = [
  'Hostel A - Boys',
  'Hostel B - Boys',
  'Hostel C - Girls',
  'Hostel D - Girls',
];

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
