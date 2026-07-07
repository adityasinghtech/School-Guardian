const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Notification title is required'],
        },
        message: {
            type: String,
            required: [true, 'Notification message is required'],
        },
        type: {
            type: String,
            enum: ['Issue Created', 'Status Updated', 'Assigned', 'Resolved', 'New Comment', 'System'],
            default: 'System',
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        issueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Issue',
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', notificationSchema);
