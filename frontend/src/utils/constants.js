// Application constants - UI only, no mock data

export const HOSTELS = [
  'Hostel A - Boys',
  'Hostel B - Boys',
  'Hostel C - Girls',
  'Hostel D - Girls',
];

export const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D'];

export const ISSUE_CATEGORIES = [
  { id: 'plumbing', label: 'Plumbing', icon: '🚰', color: '#3b82f6' },
  { id: 'electrical', label: 'Electrical', icon: '⚡', color: '#f59e0b' },
  { id: 'cleanliness', label: 'Cleanliness', icon: '🧹', color: '#10b981' },
  { id: 'internet', label: 'Internet/WiFi', icon: '📡', color: '#8b5cf6' },
  { id: 'furniture', label: 'Furniture', icon: '🪑', color: '#ec4899' },
  { id: 'ac_heating', label: 'AC/Heating', icon: '❄️', color: '#06b6d4' },
  { id: 'security', label: 'Security', icon: '🔒', color: '#ef4444' },
  { id: 'other', label: 'Other', icon: '📋', color: '#6b7280' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
  { value: 'emergency', label: 'Emergency', color: '#dc2626' },
];

export const STATUS_FLOW = [
  { value: 'reported', label: 'Reported', color: '#3b82f6' },
  { value: 'assigned', label: 'Assigned', color: '#8b5cf6' },
  { value: 'in progress', label: 'In Progress', color: '#f59e0b' },
  { value: 'resolved', label: 'Resolved', color: '#10b981' },
  { value: 'closed', label: 'Closed', color: '#6b7280' },
];

export const ANNOUNCEMENT_PRIORITIES = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
  { value: 'urgent', label: 'Urgent', color: '#dc2626' },
];

export const LOST_FOUND_TYPES = [
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
];

export const LOST_FOUND_STATUSES = [
  { value: 'active', label: 'Active', color: '#3b82f6' },
  { value: 'claimed', label: 'Claimed', color: '#10b981' },
];

// Year options for students
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

// Departments
export const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Chemical',
  'Other',
];
