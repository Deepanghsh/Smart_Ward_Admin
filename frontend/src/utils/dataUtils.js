import * as XLSX from '@e965/xlsx';
import { format } from 'date-fns';

/**
 * Export data to Excel
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename without extension
 * @param {string} sheetName - Sheet name in Excel
 */
export const exportToExcel = (data, filename = 'export', sheetName = 'Sheet1') => {
  try {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate filename with timestamp
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const fullFilename = `${filename}_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fullFilename);

    return { success: true, filename: fullFilename };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename without extension
 */
export const exportToCSV = (data, filename = 'export') => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${timestamp}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, filename: `${filename}_${timestamp}.csv` };
  } catch (error) {
    console.error('CSV export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Group data by a specific key
 * @param {Array} data - Array of objects
 * @param {string} key - Key to group by
 * @returns {Object} Grouped data
 */
export const groupBy = (data, key) => {
  return data.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Calculate percentage
 * @param {number} value - Numerator
 * @param {number} total - Denominator
 * @returns {number} Percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get color based on priority
 * @param {string} priority - Priority level
 * @returns {Object} Color scheme
 */
export const getPriorityColor = (priority) => {
  const colors = {
    emergency: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      badge: 'bg-red-500',
    },
    high: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-300',
      badge: 'bg-orange-500',
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      badge: 'bg-yellow-500',
    },
    low: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      badge: 'bg-green-500',
    },
  };
  return colors[priority?.toLowerCase()] || colors.medium;
};

/**
 * Get color based on status
 * @param {string} status - Issue status
 * @returns {Object} Color scheme
 */
export const getStatusColor = (status) => {
  const colors = {
    reported: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      badge: 'bg-blue-500',
    },
    assigned: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      badge: 'bg-purple-500',
    },
    'in progress': {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
      border: 'border-indigo-300',
      badge: 'bg-indigo-500',
    },
    resolved: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      badge: 'bg-green-500',
    },
    closed: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      badge: 'bg-gray-500',
    },
  };
  return colors[status?.toLowerCase()] || colors.reported;
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return '';
  }
};

/**
 * Calculate time difference in human-readable format
 * @param {string|Date} date - Date to compare
 * @returns {string} Time difference
 */
export const getTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date, 'MMM dd, yyyy');
};

/**
 * Calculate average from array of numbers
 * @param {Array} numbers - Array of numbers
 * @returns {number} Average
 */
export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round(sum / numbers.length);
};

/**
 * Filter data by date range
 * @param {Array} data - Array of objects with date field
 * @param {string} dateField - Field name containing date
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Filtered data
 */
export const filterByDateRange = (data, dateField, startDate, endDate) => {
  return data.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

/**
 * Generate date range presets
 * @returns {Object} Date range presets
 */
export const getDateRangePresets = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return {
    today: {
      label: 'Today',
      start: today,
      end: now,
    },
    yesterday: {
      label: 'Yesterday',
      start: new Date(today.getTime() - 86400000),
      end: today,
    },
    thisWeek: {
      label: 'This Week',
      start: new Date(today.getTime() - today.getDay() * 86400000),
      end: now,
    },
    lastWeek: {
      label: 'Last Week',
      start: new Date(today.getTime() - (today.getDay() + 7) * 86400000),
      end: new Date(today.getTime() - today.getDay() * 86400000),
    },
    thisMonth: {
      label: 'This Month',
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: now,
    },
    lastMonth: {
      label: 'Last Month',
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: new Date(now.getFullYear(), now.getMonth(), 0),
    },
    last30Days: {
      label: 'Last 30 Days',
      start: new Date(today.getTime() - 30 * 86400000),
      end: now,
    },
    last90Days: {
      label: 'Last 90 Days',
      start: new Date(today.getTime() - 90 * 86400000),
      end: now,
    },
  };
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Sort array by multiple fields
 * @param {Array} data - Array to sort
 * @param {Array} sortBy - Array of {field, order} objects
 * @returns {Array} Sorted array
 */
export const multiSort = (data, sortBy) => {
  return [...data].sort((a, b) => {
    for (const { field, order = 'asc' } of sortBy) {
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};
