const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Student name is required'],
            trim: true,
        },
        admissionNumber: {
            type: String,
            required: [true, 'Admission number is required'],
            trim: true,
            index: true,
        },
        dob: {
            type: Date,
        },
        studentClass: {
            type: String,
            trim: true,
        },
        section: {
            type: String,
            trim: true,
        },
        rollNumber: {
            type: String,
            trim: true,
        },
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure admission number is unique per school
studentSchema.index({ admissionNumber: 1, schoolId: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
