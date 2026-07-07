const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema(
    {
        issue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Issue',
            required: true,
            index: true,
        },
        assignedStaff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Could be an internal maintenance staff user
            required: true,
            index: true,
        },
        repairStatus: {
            type: String,
            enum: ['Assigned', 'In Progress', 'Completed', 'Verified', 'Rejected'],
            default: 'Assigned',
        },
        remarks: {
            type: String,
            trim: true,
        },
        afterRepairImages: {
            type: [String],
            validate: [v => v.length <= 5, 'Maximum 5 images allowed'],
        },
        completionDate: {
            type: Date,
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);



module.exports = mongoose.model('Repair', repairSchema);
