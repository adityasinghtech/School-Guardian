const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
    {
        schoolName: {
            type: String,
            required: [true, 'School name is required'],
            trim: true,
        },
        schoolCode: {
            type: String,
            required: [true, 'School code is required'],
            unique: true,
            uppercase: true,
            trim: true,
            index: true,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        principalName: {
            type: String,
            required: [true, 'Principal name is required'],
        },
        contactEmail: {
            type: String,
            required: [true, 'Contact email is required'],
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
        },
        contactPhone: {
            type: String,
            required: [true, 'Contact phone is required'],
        },
        logo: {
            type: String,
            default: 'default-school.png',
        },
        board: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            default: 'India',
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Suspended', 'Pending'],
            default: 'Active',
        },
        subscriptionPlan: {
            type: String,
            enum: ['Free', 'Basic', 'Premium', 'Enterprise'],
            default: 'Free',
        },
        subscriptionExpiry: {
            type: Date,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDemo: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for users belonging to this school
schoolSchema.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'schoolId',
    justOne: false,
});

module.exports = mongoose.model('School', schoolSchema);
