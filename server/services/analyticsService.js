const Issue = require('../models/Issue');
const ActivityLog = require('../models/ActivityLog');
const Repair = require('../models/Repair');

class AnalyticsService {
    static async getDashboardStats(user) {
        // Base filter if the user is not an Admin
        const matchFilter = user.role !== 'Admin' ? { reportedBy: user._id } : {};

        const totalIssues = await Issue.countDocuments(matchFilter);
        const pending = await Issue.countDocuments({ ...matchFilter, status: 'Pending' });
        const inProgress = await Issue.countDocuments({ ...matchFilter, status: 'In Progress' });
        const resolved = await Issue.countDocuments({ ...matchFilter, status: { $in: ['Completed', 'Verified'] } });
        const critical = await Issue.countDocuments({ ...matchFilter, priority: 'Critical' });

        // Category-wise Counts
        const categoryDistribution = await Issue.aggregate([
            { $match: matchFilter },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Priority Distribution
        const priorityDistribution = await Issue.aggregate([
            { $match: matchFilter },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // Recent Activity (Top 10)
        // If not Admin, we should filter activity logs related to their issues
        let activityFilter = {};
        if (user.role !== 'Admin') {
            const userIssues = await Issue.find({ reportedBy: user._id }).select('_id');
            activityFilter = { issueId: { $in: userIssues.map(i => i._id) } };
        }

        const recentActivity = await ActivityLog.find(activityFilter)
            .populate('user', 'name role')
            .populate('issueId', 'title')
            .sort({ createdAt: -1 })
            .limit(10);

        // Monthly Trend (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const monthlyTrend = await Issue.aggregate([
            { $match: { ...matchFilter, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Average Resolution Time (Difference between Repair completion and Issue creation)
        let averageResolutionTime = 0; // in hours or days
        if (user.role === 'Admin') {
            const completedRepairs = await Repair.find({ repairStatus: { $in: ['Completed', 'Verified'] } }).populate('issue');
            if (completedRepairs.length > 0) {
                let totalDiff = 0;
                completedRepairs.forEach(repair => {
                    if (repair.issue && repair.completionDate) {
                        const diffTime = Math.abs(repair.completionDate - repair.issue.createdAt);
                        totalDiff += diffTime;
                    }
                });
                averageResolutionTime = totalDiff / completedRepairs.length; // in milliseconds
            }
        }

        return {
            overview: {
                totalIssues,
                pending,
                inProgress,
                resolved,
                critical,
                averageResolutionTimeHours: averageResolutionTime > 0 ? (averageResolutionTime / (1000 * 60 * 60)).toFixed(2) : 0
            },
            categoryDistribution,
            priorityDistribution,
            monthlyTrend,
            recentActivity
        };
    }
}

module.exports = AnalyticsService;
