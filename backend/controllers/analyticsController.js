import { dataHelpers } from '../utils/mockData.js';
const {
  filterByDateRange,
  groupBy,
  calculatePercentage,
  calculateAverage,
  getHoursDiff,
} = require('../utils/helpers');

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/analytics/dashboard
 * @access  Private (Admin only)
 */
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let issues = dataHelpers.getAllIssues();

    // Filter by date range if provided
    if (startDate || endDate) {
      issues = filterByDateRange(issues, 'reportedDate', startDate, endDate);
    }

    // Calculate statistics
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
    const pendingIssues = issues.filter(i => 
      ['reported', 'assigned', 'in progress'].includes(i.status)
    ).length;
    const closedIssues = issues.filter(i => i.status === 'closed').length;

    // Calculate average resolution time (in hours)
    const resolvedWithTime = issues.filter(i => i.status === 'resolved' && i.updatedAt);
    const resolutionTimes = resolvedWithTime.map(i => 
      getHoursDiff(new Date(i.reportedDate), new Date(i.updatedAt))
    );
    const averageResolutionTime = calculateAverage(resolutionTimes);

    // Group by category
    const categoryGroups = groupBy(issues, 'category');
    const issuesByCategory = Object.entries(categoryGroups).map(([category, items]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
      count: items.length,
      percentage: calculatePercentage(items.length, totalIssues),
    }));

    // Group by hostel
    const hostelGroups = groupBy(issues, 'hostel');
    const issuesByHostel = Object.entries(hostelGroups).map(([hostel, items]) => ({
      hostel,
      count: items.length,
      percentage: calculatePercentage(items.length, totalIssues),
    }));

    // Group by priority
    const priorityGroups = groupBy(issues, 'priority');
    const issuesByPriority = Object.entries(priorityGroups).map(([priority, items]) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
      count: items.length,
      percentage: calculatePercentage(items.length, totalIssues),
    }));

    // Monthly trend (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrend = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = monthNames[date.getMonth()];
      
      const monthIssues = issues.filter(issue => {
        const issueDate = new Date(issue.reportedDate);
        return issueDate.getMonth() === date.getMonth() && 
               issueDate.getFullYear() === date.getFullYear();
      });
      
      monthlyTrend.push({
        month,
        reported: monthIssues.length,
        resolved: monthIssues.filter(i => i.status === 'resolved').length,
      });
    }

    // Resolution time by category
    const resolutionTimeByCategory = issuesByCategory.map(cat => {
      const categoryIssues = issues.filter(i => 
        i.category === cat.category.toLowerCase().replace(' ', '_') && i.status === 'resolved'
      );
      
      const times = categoryIssues.map(i => 
        getHoursDiff(new Date(i.reportedDate), new Date(i.updatedAt))
      );
      
      return {
        category: cat.category,
        avgTime: calculateAverage(times),
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalIssues,
        resolvedIssues,
        pendingIssues,
        closedIssues,
        averageResolutionTime,
        resolutionRate: calculatePercentage(resolvedIssues, totalIssues),
        issuesByCategory,
        issuesByHostel,
        issuesByPriority,
        monthlyTrend,
        resolutionTimeByCategory: resolutionTimeByCategory.filter(r => r.avgTime > 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get trends data
 * @route   GET /api/analytics/trends
 * @access  Private (Admin only)
 */
const getTrends = async (req, res, next) => {
  try {
    const { period = 30 } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const issues = filterByDateRange(
      dataHelpers.getAllIssues(),
      'reportedDate',
      startDate.toISOString(),
      new Date().toISOString()
    );

    // Daily trends
    const dailyTrends = [];
    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayIssues = issues.filter(issue => {
        const issueDate = new Date(issue.reportedDate).toISOString().split('T')[0];
        return issueDate === dateStr;
      });
      
      dailyTrends.push({
        date: dateStr,
        reported: dayIssues.length,
        resolved: dayIssues.filter(i => i.status === 'resolved').length,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        period: parseInt(period),
        dailyTrends,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category analytics
 * @route   GET /api/analytics/categories
 * @access  Private (Admin only)
 */
const getCategoryAnalytics = async (req, res, next) => {
  try {
    const issues = dataHelpers.getAllIssues();
    const categoryGroups = groupBy(issues, 'category');

    const analytics = Object.entries(categoryGroups).map(([category, items]) => {
      const resolved = items.filter(i => i.status === 'resolved');
      const pending = items.filter(i => ['reported', 'assigned', 'in progress'].includes(i.status));
      
      const resolutionTimes = resolved.map(i => 
        getHoursDiff(new Date(i.reportedDate), new Date(i.updatedAt))
      );

      return {
        category: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
        total: items.length,
        resolved: resolved.length,
        pending: pending.length,
        resolutionRate: calculatePercentage(resolved.length, items.length),
        avgResolutionTime: calculateAverage(resolutionTimes),
      };
    });

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get performance metrics
 * @route   GET /api/analytics/performance
 * @access  Private (Admin only)
 */
const getPerformanceMetrics = async (req, res, next) => {
  try {
    const issues = dataHelpers.getAllIssues();

    // Response time (time from reported to assigned)
    const assignedIssues = issues.filter(i => 
      i.status !== 'reported' && i.assignedTo
    );
    
    // Resolution rate by priority
    const priorityGroups = groupBy(issues, 'priority');
    const performanceByPriority = Object.entries(priorityGroups).map(([priority, items]) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
      total: items.length,
      resolved: items.filter(i => i.status === 'resolved').length,
      resolutionRate: calculatePercentage(
        items.filter(i => i.status === 'resolved').length,
        items.length
      ),
    }));

    // Hostel performance
    const hostelGroups = groupBy(issues, 'hostel');
    const performanceByHostel = Object.entries(hostelGroups).map(([hostel, items]) => ({
      hostel,
      total: items.length,
      resolved: items.filter(i => i.status === 'resolved').length,
      resolutionRate: calculatePercentage(
        items.filter(i => i.status === 'resolved').length,
        items.length
      ),
    }));

    res.status(200).json({
      success: true,
      data: {
        performanceByPriority,
        performanceByHostel,
        totalAssigned: assignedIssues.length,
        assignmentRate: calculatePercentage(assignedIssues.length, issues.length),
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getDashboardAnalytics,
  getTrends,
  getCategoryAnalytics,
  getPerformanceMetrics,
};
