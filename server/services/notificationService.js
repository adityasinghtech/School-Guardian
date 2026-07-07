const Notification = require('../models/Notification');

class NotificationService {
    static async getNotifications(user, query) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const filter = { user: user._id };
        if (query.isRead !== undefined) {
            filter.isRead = query.isRead === 'true';
        }

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.countDocuments({ user: user._id, isRead: false });

        return {
            notifications,
            unreadCount,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    }

    static async markAsRead(notificationId, user) {
        const notif = await Notification.findOneAndUpdate(
            { _id: notificationId, user: user._id },
            { isRead: true },
            { new: true }
        );
        if (!notif) throw new Error('Notification not found');
        return notif;
    }

    static async markAllAsRead(user) {
        await Notification.updateMany(
            { user: user._id, isRead: false },
            { isRead: true }
        );
        return true;
    }
}

module.exports = NotificationService;