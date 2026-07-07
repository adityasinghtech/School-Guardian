const Student = require('../models/Student');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { ErrorResponse } = require('../utils/apiResponse');

exports.addStudent = asyncHandler(async (req, res, next) => {
    const { name, admissionNumber, dob, studentClass, section, rollNumber } = req.body;

    // Check if admission number exists for this school
    const existingStudent = await Student.findOne({ admissionNumber, schoolId: req.user.schoolId });
    if (existingStudent) {
        return next(new ErrorResponse('Student with this admission number already exists', 400));
    }

    const student = await Student.create({
        name,
        admissionNumber,
        dob,
        studentClass,
        section,
        rollNumber,
        schoolId: req.user.schoolId
    });

    res.status(201).json({
        success: true,
        data: student
    });
});

exports.getStudents = asyncHandler(async (req, res, next) => {
    const students = await Student.find({ schoolId: req.user.schoolId });
    res.status(200).json({
        success: true,
        count: students.length,
        data: students
    });
});
