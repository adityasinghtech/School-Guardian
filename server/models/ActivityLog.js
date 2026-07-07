const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        action: {
            type: String,
            required: true,
            enum: [
                'Issue Created',
                'Issue Updated',
                'Issue Deleted',
                'Staff Assigned',
                'Status Changed',
                'Repair Completed',
                'Issue Verified',
                'Issue Rejected',
                'Login',
                'Profile Updated',
                'Priority Changed'
            ],
            index: true,
        },
        module: {
            type: String,
            required: true,
            enum: ['Auth', 'Issue', 'Repair', 'Admin', 'System'],
        },
        issueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Issue',
            default: null,
            index: true,
        },
        oldValue: {
            type: String,
            default: null,
        },
        newValue: {
            type: String,
            default: null,
        },
        remarks: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
