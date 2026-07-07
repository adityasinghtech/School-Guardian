const { sendSuccess, sendError } = require('../utils/apiResponse');
const AnalyticsService = require('../services/analyticsService');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const data = await AnalyticsService.getDashboardStats(req.user);
        sendSuccess(res, 200, 'Dashboard analytics fetched successfully', data);
    } catch (error) {
        sendError(res, 400, error.message);
    }
};
