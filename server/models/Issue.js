const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
    {
        issueId: {
            type: String,
            unique: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Please add an issue title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: [
                'Furniture',
                'Electricity',
                'Water Supply',
                'Toilet',
                'Sanitation',
                'Roof',
                'Classroom',
                'Playground',
                'Boundary Wall',
                'Computer Lab',
                'Science Lab',
                'Library',
                'Sports',
                'Other',
            ],
            index: true,
        },
        priority: {
            type: String,
            required: [true, 'Please select a priority'],
            enum: ['Critical', 'High', 'Medium', 'Low'],
            index: true,
        },
        location: {
            type: String,
            required: [true, 'Please specify the location in the school'],
        },
        images: {
            type: [String],
            validate: [v => v.length <= 5, 'You can upload up to 5 images only'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Assigned', 'In Progress', 'Completed', 'Verified', 'Rejected'],
            default: 'Pending',
            index: true,
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true,
        },
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        estimatedCompletion: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for getting all comments associated with this issue
issueSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'issue',
    justOne: false,
});

// Auto-generate a readable issueId before saving
issueSchema.pre('save', async function () {
    if (!this.issueId) {
        // Simple auto-increment-like logic: prefix + timestamp + random chars
        const timestamp = Date.now().toString(36).toUpperCase();
        const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
        this.issueId = `ISS-${timestamp}-${randomStr}`;
    }
});

module.exports = mongoose.model('Issue', issueSchema);
