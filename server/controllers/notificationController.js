const { sendSuccess, sendError } = require('../utils/apiResponse');
const NotificationService = require('../services/notificationService');

exports.getNotifications = async (req, res, next) => {
    try {
        const data = await NotificationService.getNotifications(req.user, req.query);
        sendSuccess(res, 200, 'Notifications fetched successfully', data);
    } catch (error) {
        sendError(res, 400, error.message);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const data = await NotificationService.markAsRead(req.params.id, req.user);
        sendSuccess(res, 200, 'Notification marked as read', data);
    } catch (error) {
        if (error.name === 'CastError') return sendError(res, 400, 'Invalid ID format');
        sendError(res, 404, error.message);
    }
};

exports.markAllAsRead = async (req, res, next) => {
    try {
        await NotificationService.markAllAsRead(req.user);
        sendSuccess(res, 200, 'All notifications marked as read');
    } catch (error) {
        sendError(res, 400, error.message);
    }
};
